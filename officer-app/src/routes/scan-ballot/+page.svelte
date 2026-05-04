<script lang="ts">
    import { Button } from 'flowbite-svelte';
    import { onDestroy } from 'svelte';
    import { parse } from 'valibot';

    import { PUBLIC_DEVICE_ID, PUBLIC_API_IP, PUBLIC_API_PORT } from '$env/static/public';
    import { ScanBallotStatusSchema, type ScanBallotStatus, type WebSocketStatus } from '$lib/types';

    let feedDisplay: HTMLVideoElement | null = $state(null);
    let camera: MediaStream | null = $state(null);
    let imageSender: HTMLCanvasElement | null = $state(null);
    let isScanningBallot = $state(false);

    let status: WebSocketStatus = $state('idle');
    let errorMessage: string = $state('');

    let wsBallot: WebSocket | null = $state(null);

    const COMPONENT = 'phone';

    // WebSocket cannot be idle
    $effect(() => { if (status === 'idle') startBallotScan() });

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

    // Open camera once ballot scanner display is up
    async function openCamera() {
        try {
            camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        } catch (e) {
            status = 'error';
            errorMessage = 'Camera failed to open. Please try again.';
            console.error(e);
        }
    }

    // Will be called if values of feedDisplay, status, and camera changes
    // Display video once feedDisplay is mounted
    async function displayFeed() {
        if (feedDisplay === null || (status === 'scanning-ballot' && isScanningBallot)) return;

        await openCamera();
        // If error, camera didn't open, otherwise
        if (status !== 'error') {
            feedDisplay.srcObject = camera;
            feedDisplay.play();
            isScanningBallot = true;
        }
    }

    $effect(() => { displayFeed(); });

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

            <video bind:this={feedDisplay}></video>
            <canvas bind:this={imageSender} class="hidden"></canvas>
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
