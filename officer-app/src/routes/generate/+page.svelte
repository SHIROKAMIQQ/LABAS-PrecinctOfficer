<script lang="ts">
import { onDestroy } from "svelte";
  import { Button } from "flowbite-svelte";
  import { PUBLIC_DEVICE_ID, PUBLIC_API_IP, PUBLIC_API_PORT } from "$env/static/public";
  import type { ScanResult, ScanMessage } from "$lib/types";

  type Status = "idle" | "connecting" | "waiting" | "received" | "error" | "mismatch";

  let status: Status = $state("idle");
  let result: ScanResult | null = $state(null);
  let errorMessage: string = $state("");
  let ws: WebSocket | null = null;

  // Build photo based on display_pic.py
  const photoSrc = $derived(result?.photo ? `data:image/jpeg;base64,${result.photo}` : "");

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
        console.log('demographics:', result.demographics);
        console.log("City:", result.demographics.location1_eng);
        console.log("Province:", result.demographics.location3_eng);

        if (result.registered_voter === false) {
          status = "error";
          errorMessage = "Not a registered voter.";
        } else if (result.voted === true) {
          status = "error";
          errorMessage = "Voter has already voted.";
        } else if (result.precinct !== null) {
          status = "error";
          errorMessage = "Ballot already generated for this voter in precinct " + result.precinct;
        } else {
            status = "received";
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
        province: result.demographics.location3_eng,
        city: result.demographics.location1_eng,
        uin: result.uin
    });
    
    const url = `http://${PUBLIC_API_IP}:${PUBLIC_API_PORT}/print-ballot?${params}`;

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const data = await response.json();
        console.log('Printed:', data);
        reset();
    } catch (err) {
        console.error('Print failed:', err);
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

<div id="container" class="flex flex-col border w-[600px] min-h-[400px] p-6 gap-4">
    {#if status === "idle"}
    <div class="flex items-center justify-center h-full">
      <Button color="primary" onclick={startScan}>
        Generate and Print Ballot
      </Button>
    </div>

  {:else if status === "connecting"}
    <div class="flex flex-col items-center justify-center h-full gap-4">
      <div class="animate-pulse text-lg">Connecting to scanner...</div>
      <p class="text-sm text-gray-500">Please wait while we connect to the QR scanner via WebSocket.</p>
    </div>

  {:else if status === "waiting"}
    <div class="flex flex-col items-center justify-center h-full gap-4">
      <div class="animate-pulse text-lg">Waiting for scan...</div>
      <p class="text-sm text-gray-500">Have the voter scan their ID at the device.</p>
      <Button color="light" onclick={reset}>Cancel</Button>
    </div>

  {:else if status === "received" && result}
    <div class="flex flex-row gap-4">
      <img
        src={photoSrc}
        alt="Voter ID photo"
        class="w-64 h-64 object-cover rounded-sm border"
      />
      <div class="flex flex-col gap-2 p-2">
        <p>UIN: {result.uin}</p>
        <p>Precinct: {result.precinct}</p>
        <p>Registered: {result.registered_voter ? "Yes" : "No"}</p>
        <p>Has Voted: {result.voted ? "Yes" : "No"}</p>
      </div>
    </div>
    <div class="flex items-center justify-center gap-4 mt-4">
      <p class="text-lg">Does the voter match the ID photo?</p>
      <Button color="green" onclick={confirmMatch}>Yes — Generate Ballot</Button>
      <Button color="red" onclick={rejectMatch}>No — Mismatch</Button>
    </div>

  {:else if status === "mismatch"}
    <div class="flex flex-col items-center justify-center h-full gap-4 text-red-600">
      <h1 class="text-2xl font-bold">⚠ Invalid ID: Mismatch</h1>
      <p>The voter does not match the ID photo on file. Do not issue a ballot.</p>
      <Button color="light" onclick={reset}>Reset</Button>
    </div>

  {:else if status === "error"}
    <div class="flex flex-col items-center justify-center h-full gap-4 text-red-600">
      <h1 class="text-xl font-bold">Error</h1>
      <p>{errorMessage}</p>
      <Button color="light" onclick={reset}>Try Again</Button>
    </div>
  {/if}
</div>