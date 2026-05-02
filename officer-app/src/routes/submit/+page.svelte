<script lang="ts">
    import { onDestroy } from "svelte";
    import { Button } from "flowbite-svelte";
    import {
        PUBLIC_DEVICE_ID,
        PUBLIC_API_IP,
        PUBLIC_API_PORT,
    } from "$env/static/public";
    import formal_picture from "$lib/assets/formal_picture.jpg";
    import type { ScanResult, ScanMessage } from "$lib/types";
    import CheckIcon from "$lib/components/checkIcon.svelte";
    import CrossIcon from "$lib/components/crossIcon.svelte";

    // Hardcoded precinct location
    const PRECINCT = "UP Diliman";

    type Status =
        | "idle"
        | "connecting"
        | "waiting"
        | "received template"
        | "capturing"
        | "received ballot"
        | "error"
        | "mismatch";

    let status: Status = $state("idle");
    let result: ScanResult | null = $state(null);
    let errorMessage: string = $state("");
    let ws: WebSocket | null = null;

    // const DUMMY_DATA = {
    //     uin: "1234567890",
    //     demographics: {
    //         location1_eng: "Angeles City",
    //         location3_eng: "Pampanga",
    //     },
    //     registered_voter: true,
    //     precinct: "Up Diliman",
    //     voted: false,
    //     photo: formal_picture,
    // };

    // Build photo based on display_pic.py
    const photoSrc = $derived(
        result!.photo ? `data:image/jpeg;base64,${result!.photo}` : "",
    );

    // After calling, it waits for the QR scanner to connect, then once scanned it waits for the server's response
    function startScan() {
        if (ws) ws.close();

        status = "connecting";
        errorMessage = "";
        result = null;

        const url = `ws://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/display-pic/${PUBLIC_DEVICE_ID}`;
        ws = new WebSocket(url);

        ws.onopen = () => {
            console.log("WebSocket open, waiting for scan...");
            status = "waiting";
        };

        ws.onmessage = (event) => {
            try {
                const data: ScanMessage = JSON.parse(event.data);

                if ("error" in data) {
                    status = "error";
                    errorMessage = data.error;
                    return;
                }

                result = data;

                if (result.registered_voter === false) {
                    status = "error";
                    errorMessage = "Not a registered voter.";
                } else if (result.voted === true) {
                    status = "error";
                    errorMessage = "Voter has already voted.";
                } else if (result.precinct !== PRECINCT) {
                    status = "error";
                    errorMessage =
                        "Ballot Submission precinct is different from where voter claimed their ballot." +
                        result.precinct;
                } else {
                    status = "received template";
                }
                ws?.close();
            } catch (e) {
                status = "error";
                errorMessage = "Malformed response from server";
                console.error(e);
            }
        };

        ws.onerror = (e) => {
            console.error("WebSocket error:", e);
            status = "error";
            errorMessage = "Connection error";
        };

        ws.onclose = () => {
            console.log("WebSocket closed");
        };
    }

    async function confirmMatch() {
        const params = new URLSearchParams({
            uin: result!.uin,
        });

        const url = `http://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/get-ballot-template?${params}`;

        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);

            const coordinates = await response.json();
            console.log("coordinates:", coordinates);
            status = "capturing";

            // TODO: call some api to trigger the ballot capture

            // TODO: once ballot is captured, use both the coordinates and the captured ballot as
            // parameters of the function made by dale & lian
        } catch (err) {
            console.error("Print failed:", err);
            // show error toast
        }
    }

    function rejectMatch() {
        status = "mismatch";
    }

    function reset() {
        status = "idle";
        result = null;
        errorMessage = "";
    }

    onDestroy(() => {
        ws?.close();
    });
</script>

<div id="container" class="flex flex-col w-full h-[80vh] p-6 gap-4">
    {#if status === "idle"}
        <div class="flex items-center justify-center h-full">
            <Button color="primary" onclick={startScan}>Submit Ballot</Button>
        </div>
    {:else if status === "connecting"}
        <div class="flex flex-col items-center justify-center h-full gap-4">
            <div class="animate-pulse text-lg">Connecting to scanner...</div>
            <p class="text-sm text-gray-500">
                Please wait while we connect to the QR scanner via WebSocket.
            </p>
        </div>
    {:else if status === "waiting"}
        <div class="flex flex-col items-center justify-center h-full gap-4">
            <div class="animate-pulse text-lg">Waiting for scan...</div>
            <p class="text-sm text-gray-500">
                Have the voter scan their ID at the device.
            </p>
            <Button color="light" onclick={reset}>Cancel</Button>
        </div>
    {:else if status === "received template" && result}
        <div class="flex gap-8">
            <img
                src={photoSrc}
                alt="Voter ID photo"
                class="aspect-square h-[75vh] object-cover rounded-sm border"
            />
            <div class="flex flex-col gap-6 p-2 w-full">
                <p class="text-gray-600 text-xl font-mono tracking-widest">
                    UIN: {result.uin}
                </p>
                <p class="text-xl font-medium">
                    PRECINCT: {result.precinct}
                </p>
                <hr />
                <div class="flex justify-center gap-12 text-xl w-full">
                    <div class="flex gap-2">
                        {#if result.registered_voter}
                            <CheckIcon />
                        {:else}
                            <CrossIcon />
                        {/if}
                        Registered
                    </div>
                    <div class="flex gap-2">
                        {#if !result.voted}
                            <CheckIcon />
                        {:else}
                            <CrossIcon />
                        {/if}
                        No ballot submission yet
                    </div>
                </div>

                <div
                    class="flex flex-col mt-auto mb-auto items-center justify-center gap-6"
                >
                    <p class="text-4xl font-bold">
                        Does the voter match the ID photo?
                    </p>
                    <div class="flex gap-8">
                        <Button
                            color="green"
                            onclick={confirmMatch}
                            class="text-xl">Yes — Scan Ballot</Button
                        >
                        <Button
                            color="red"
                            onclick={rejectMatch}
                            class="text-xl">No — Mismatch</Button
                        >
                    </div>
                </div>
            </div>
        </div>
    {:else if status === "capturing"}
        <div class="flex flex-col items-center justify-center h-full gap-4">
            <div class="animate-pulse text-lg">
                Waiting for ballot capture...
            </div>
            <p class="text-sm text-gray-500">
                Have the voter place their ballot on the ballot scanner.
            </p>
            <Button color="light" onclick={reset}>Cancel</Button>
        </div>
    {:else if status === "mismatch"}
        <div
            class="flex flex-col items-center justify-center h-full gap-4 text-red-600"
        >
            <h1 class="text-2xl font-bold">⚠ Invalid ID: Mismatch</h1>
            <p>
                The voter does not match the ID photo on file. Do not issue a
                ballot.
            </p>
            <Button color="light" onclick={reset}>Reset</Button>
        </div>
    {:else if status === "error"}
        <div
            class="flex flex-col items-center justify-center h-full gap-4 text-red-600"
        >
            <h1 class="text-xl font-bold">Error</h1>
            <p>{errorMessage}</p>
            <Button color="light" onclick={reset}>Try Again</Button>
        </div>
    {/if}
</div>
