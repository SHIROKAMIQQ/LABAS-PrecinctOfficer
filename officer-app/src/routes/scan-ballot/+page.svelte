<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { onDestroy } from 'svelte';
    import { parse } from 'valibot';

    import { PUBLIC_DEVICE_ID, PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
    import { ScanBallotStatusSchema, type ScanBallotStatus, type WebSocketStatus } from '$lib/types';

    let status: WebSocketStatus = $state('idle');
    let errorMessage: string = $state('');

    let wsBallot: WebSocket | null = $state(null);

    const COMPONENT = 'phone';

    // If ever there will be multiple WebSockets
    function closeWebSockets() {
        [wsBallot].forEach((ws) => {
            if (ws) ws.close();
        });
    }

    // Connect to server via the ballot WebSocket and set status to mount ballot scanner display
    function startBallotScan() {
        closeWebSockets();

        status = 'connecting';
        errorMessage = '';

        const url = `ws://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/scan-ballot/${PUBLIC_DEVICE_ID}/${COMPONENT}`;
        wsBallot = new WebSocket(url);

        wsBallot.onopen = () => {
            console.log('WebSocket open, waiting for scan...');
            status = 'scanning-ballot';
        };

        wsBallot.onmessage = (event) => {
            // This websocket should only receive errors
            try {
                const data: ScanBallotStatus = parse(ScanBallotStatusSchema, JSON.parse(event.data));

                status = 'error';
                errorMessage = data.payload;
                console.error(data.payload);
            } catch (e) {
                status = 'error';
                errorMessage = 'Malformed response from server';
                console.error(e);
            }
        };

        wsBallot.onerror = (e) => {
            status = 'error';
            errorMessage = 'Connection error';
            console.error('WebSocket error:', e);
        };

        wsBallot.onclose = () => {
            console.log('WebSocket closed');
        };
    }

    function reset() {
        status = 'idle';
        errorMessage = '';
    }

    onDestroy(() => {
        closeWebSockets();
    });
</script>

<div id="container" class="flex h-[80vh] w-full flex-col gap-4 p-6">
    {#if status === 'connecting'}
        <div class="flex h-full flex-col items-center justify-center gap-4">
            <div class="animate-pulse text-lg">Connecting to scanner...</div>
            <p class="text-sm text-gray-500">
                Please wait while we connect to the server via WebSocket.
            </p>
        </div>
    {:else if status === 'scanning-ballot'}
        <div class="flex h-full flex-col items-center justify-center gap-4">
            <p class="text-sm text-gray-500 font-bold">
                Have the voter place their ballot on the camera.
            </p>
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
