console.log("Sending POST request to the server...");

fetch('http://localhost:3000/api/simulate-bb84', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ numPhotons: 1000, enableEve: true, errorCheckPercent: 15 })
})
.then(res => res.json())
.then(data => {
    console.log("Successful response received from API!\n");
    console.log("STATISTICS:");
    console.log(`- Photons sent: ${data.config.numPhotons}`);
    console.log(`- Error rate (Eve): ${data.data.errorRate.toFixed(2)}%`);
    console.log(`- Protocol compromised: ${data.data.isCompromised}`);
    console.log("\nRAW DATA (fragment for frontend):");
    console.log("- Alice's bases (first 10):", data.data.aliceBases.slice(0, 10));
    console.log("- Eve's bits (first 10):", data.data.eveBits.slice(0, 10));
})
.catch(err => console.error("Connection error:", err));