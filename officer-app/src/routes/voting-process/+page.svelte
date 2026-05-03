<script lang="ts">
    import { onDestroy } from 'svelte';
    import { Button } from 'flowbite-svelte';
    import { PrinterOutline, UploadOutline } from 'flowbite-svelte-icons';
    import { is, parse } from 'valibot';

    import { PUBLIC_DEVICE_ID, PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
    import {
        type ScanQRResult,
        type ScanQRMessage,
        type WebSocketStatus,
        ScanQRMessageSchema,
        ScanQRErrorSchema,
        PrintBallotMessageSchema,
    } from '$lib/types';

    let status: WebSocketStatus = $state('idle');
    let errorMessage: string = $state('');

    let wsQR: WebSocket | null = null;
    let resultQR: ScanQRResult | null = $state(null);

    let wsBallot: WebSocket | null = null;

    const PRECINCT = 'UP Diliman';

    function closeWebSockets() {
        [wsQR, wsBallot].forEach((ws) => {
            if (ws) ws.close();
        });
    }

    // After calling, it waits for the QR scanner to connect, then once scanned it waits for the server's response
    function scanQR() {
        closeWebSockets();

        status = 'connecting';
        errorMessage = '';
        resultQR = null;

        const url = `ws://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/display-pic/${PUBLIC_DEVICE_ID}`;
        wsQR = new WebSocket(url);

        wsQR.onopen = () => {
            console.log('WebSocket open, waiting for scan...');
            status = 'scanning-qr';
        };

        wsQR.onmessage = (event) => {
            try {
                const data: ScanQRMessage = parse(ScanQRMessageSchema, JSON.parse(event.data));

                if (is(ScanQRErrorSchema, data)) {
                    status = 'error';
                    errorMessage = data.error;
                    return;
                }

                resultQR = data;
                console.log('demographics:', resultQR.demographics);
                console.log('City:', resultQR.demographics.location1_eng);
                console.log('Province:', resultQR.demographics.location3_eng);

                if (resultQR.voter_status === 'tallied') {
                    status = 'error';
                    errorMessage = 'Voter is already done with the process';
                } else if (resultQR.voter_status === 'printed' && resultQR.precinct !== PRECINCT) {
                    status = 'error';
                    errorMessage = `Voter is submitting ballot in a different precinct. Please redirect them to precinct ${resultQR.precinct}.`;
                } else {
                    status = 'received-photo';
                }
            } catch (e) {
                status = 'error';
                errorMessage = 'Malformed response from server';
                console.error(e);
            } finally {
                closeWebSockets();
            }
        };

        wsQR.onerror = (e) => {
            console.error('WebSocket error:', e);
            status = 'error';
            errorMessage = 'Connection error';
        };

        wsQR.onclose = () => {
            console.log('WebSocket closed');
        };
    }

    async function printBallot() {
        try {
            if (resultQR === null) throw new Error('No scan result');

            const params = new URLSearchParams({
                province: resultQR.demographics.location3_eng,
                city: resultQR.demographics.location1_eng,
                uin: resultQR.uin,
            });

            const url = `http://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/print-ballot?${params}`;

            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const data = parse(PrintBallotMessageSchema, await response.json());
            if (data.status === 'failed') throw new Error('Failed to send ballot to printer');

            console.log('Printed:', data);
            reset();
        } catch (err) {
            console.error('Print failed:', err);
            // show error toast
        }
    }

    function scanBallot() {
        status = 'scanning-ballot';
    }

    function rejectPhotoMatch() {
        status = 'error';
        errorMessage =
            'MISMATCH: The voter does not match the ID photo on file. Do not issue a ballot.';
    }

    function reset() {
        status = 'idle';
        resultQR = null;
        errorMessage = '';
    }

    onDestroy(() => {
        closeWebSockets();
    });
</script>

<div id="container" class="flex h-[80vh] w-full flex-col gap-4 p-6">
    {#if status === 'idle'}
        <div class="flex h-full items-center justify-center">
            <Button color="primary" onclick={scanQR}>Vote!</Button>
        </div>
    {:else if status === 'connecting'}
        <div class="flex h-full flex-col items-center justify-center gap-4">
            <div class="animate-pulse text-lg">Connecting to scanner...</div>
            <p class="text-sm text-gray-500">
                Please wait while we connect to the server via WebSocket.
            </p>
        </div>
    {:else if status === 'scanning-qr'}
        <div class="flex h-full flex-col items-center justify-center gap-4">
            <div class="animate-pulse text-lg">Waiting for scan...</div>
            <p class="text-sm text-gray-500">Have the voter scan their ID at the device.</p>
            <Button color="light" onclick={reset}>Cancel</Button>
        </div>
    {:else if status === 'received-photo' && resultQR !== null && resultQR.voter_status !== 'tallied'}
        <!-- Build photo based on display_pic.py -->
        {@const photoSrc = `data:image/jpeg;base64,${resultQR.photo}`}
        <div class="flex gap-8">
            <img
                src={photoSrc}
                alt="Voter Appearance"
                class="aspect-square h-[75vh] rounded-sm border object-cover"
            />
            <div class="flex w-full flex-col gap-6 p-2 [&>p]:text-xl [&>p>span]:text-xl">
                <p>
                    UIN: <span class="ml-1.5 font-mono tracking-widest text-gray-600"
                        >{resultQR.uin}</span
                    >
                </p>
                <p>
                    PRECINCT: <span class="ml-1.5 font-medium">{PRECINCT}</span>
                </p>
                <p>
                    STATUS:
                    <span class="ml-1.5">
                        {#if resultQR.voter_status === null}
                            <PrinterOutline size="xl" class="mr-1" /> Voter has
                            <span class="text-xl font-medium">not</span> started with the process.
                        {:else}
                            <UploadOutline size="xl" class="mr-1" /> Voter's ballot has been printed,
                            and <span class="text-xl font-medium">ready for scanning</span>.
                        {/if}
                    </span>
                </p>
                <hr />

                <div class="mt-auto mb-auto flex flex-col items-center justify-center gap-6">
                    <p class="text-4xl font-bold">Does the voter match the ID photo?</p>
                    <div class="flex gap-8">
                        {#if resultQR.voter_status === null}
                            <Button
                                color="green"
                                onclick={async () => await printBallot()}
                                class="text-xl">Yes — Print Ballot</Button
                            >
                        {:else}
                            <Button color="green" onclick={scanBallot} class="text-xl"
                                >Yes — Scan Ballot</Button
                            >
                        {/if}
                        <Button color="red" onclick={rejectPhotoMatch} class="text-xl"
                            >No — Mismatch</Button
                        >
                    </div>
                </div>
            </div>
        </div>
    {:else if status === 'scanning-ballot'}
        <div class="flex h-full flex-col items-center justify-center gap-4">
            <div class="animate-pulse text-lg">Waiting for ballot capture...</div>
            <p class="text-sm text-gray-500">
                Have the voter place their ballot on the ballot scanner.
            </p>
            <Button color="light" onclick={reset}>Cancel</Button>
        </div>
    {:else}
        <!-- Then status is error -->
        <div class="flex h-full flex-col items-center justify-center gap-4 text-red-600">
            <h1 class="text-xl font-bold">Error</h1>
            <p>{errorMessage === '' ? 'Unknown error' : errorMessage}</p>
            <Button color="light" onclick={reset}>Try Again</Button>
        </div>
    {/if}
</div>
