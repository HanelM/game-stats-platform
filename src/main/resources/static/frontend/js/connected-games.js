const pubgConnectBtn = document.getElementById("connectBtn");

const API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================================================
   INITIAL LOAD
========================================================= */

window.addEventListener("DOMContentLoaded", async () => {

    await loadPubgConnection();

});


/* =========================================================
   LOAD PUBG CONNECTION FROM BACKEND
========================================================= */

async function loadPubgConnection() {

    const token = localStorage.getItem("token");

    if (!token) {
        setPubgDisconnected();
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/games/connected`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                }
            }
        );

        if (!response.ok) {

            if (response.status === 401) {
                setPubgDisconnected();
                return;
            }

            throw new Error(
                `Connected games request failed: ${response.status}`
            );
        }

        const accounts = await response.json();

        const pubgAccount = accounts.find(
            account =>
                account.game &&
                account.game.toLowerCase() === "pubg" &&
                account.connected === true
        );

        if (!pubgAccount) {

            setPubgDisconnected();
            return;
        }

        document.getElementById("connectionStatus").innerText =
            "Already Connected";

        pubgConnectBtn.innerText = "Disconnect";

        await loadPubgStats(pubgAccount.accountName);

    } catch (error) {

        console.error("PUBG CONNECTION ERROR:", error);

        setPubgDisconnected();
    }
}


/* =========================================================
   CONNECT / DISCONNECT BUTTON
========================================================= */

pubgConnectBtn.addEventListener("click", async () => {

    const token = localStorage.getItem("token");

    if (!token) {

        alert("Please login before connecting your PUBG account.");

        return;
    }


    /* =====================================================
       CHECK CURRENT BACKEND CONNECTION
    ===================================================== */

    try {

        const connectedResponse = await fetch(
            `${API_URL}/api/games/connected`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                }
            }
        );

        if (!connectedResponse.ok) {

            throw new Error(
                `Unable to check connected games: ${connectedResponse.status}`
            );
        }

        const accounts = await connectedResponse.json();

        const pubgAccount = accounts.find(
            account =>
                account.game &&
                account.game.toLowerCase() === "pubg" &&
                account.connected === true
        );


        /* =================================================
           DISCONNECT
        ================================================= */

        if (pubgAccount) {

            pubgConnectBtn.disabled = true;
            pubgConnectBtn.innerText = "Disconnecting...";

            const response = await fetch(
                `${API_URL}/api/games/pubg/disconnect`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                }
            );

            if (!response.ok) {

                const errorText = await response.text();

                console.error(
                    "PUBG DISCONNECT RESPONSE:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `PUBG disconnect failed: ${response.status}`
                );
            }

            setPubgDisconnected();

            pubgConnectBtn.disabled = false;

            return;
        }


        /* =================================================
           CONNECT
        ================================================= */

        const playerName = prompt(
            "Enter PUBG Steam username"
        );

        if (!playerName) {
            return;
        }

        const cleanPlayerName = playerName.trim();

        if (!cleanPlayerName) {
            alert("Please enter a PUBG username.");
            return;
        }


        pubgConnectBtn.disabled = true;
        pubgConnectBtn.innerText = "Connecting...";


        const connectResponse = await fetch(
            `${API_URL}/api/games/pubg/connect`,
            {
                method: "POST",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    playerName: cleanPlayerName
                })
            }
        );


        if (!connectResponse.ok) {

            const errorText = await connectResponse.text();

            console.error(
                "PUBG CONNECT RESPONSE:",
                connectResponse.status,
                errorText
            );

            throw new Error(
                errorText ||
                `PUBG connection failed: ${connectResponse.status}`
            );
        }


        const connectData = await connectResponse.json();

        console.log(
            "PUBG CONNECT RESPONSE:",
            connectData
        );


        /* =================================================
           LOAD REAL PUBG STATISTICS
        ================================================= */

        await loadPubgStats(cleanPlayerName);


        document.getElementById("connectionStatus").innerText =
            "Already Connected";

        pubgConnectBtn.innerText = "Disconnect";

        alert(
            `PUBG connected successfully.\nImported matches: ${
                connectData.importedMatches ?? 0
            }`
        );


    } catch (error) {

        console.error("PUBG ERROR:", error);

        alert(
            error.message ||
            "PUBG connection failed."
        );

        pubgConnectBtn.innerText = "Connect Account";

    } finally {

        pubgConnectBtn.disabled = false;
    }

});


/* =========================================================
   LOAD PUBG STATISTICS
========================================================= */

async function loadPubgStats(playerName) {

    const token = localStorage.getItem("token");

    if (!token) {
        setPubgDisconnected();
        return;
    }

    try {

        const response = await fetch(
            `${API_URL}/api/games/pubg/player/${encodeURIComponent(playerName)}`,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + token,
                    "Accept": "application/json"
                }
            }
        );


        if (!response.ok) {

            const errorText = await response.text();

            console.error(
                "PUBG STATS RESPONSE:",
                response.status,
                errorText
            );

            throw new Error(
                `PUBG statistics request failed: ${response.status}`
            );
        }


        const data = await response.json();

        console.log(
            "PUBG DATA:",
            data
        );


        loadPubgData(data);


    } catch (error) {

        console.error(
            "PUBG STATS ERROR:",
            error
        );

        alert(
            error.message ||
            "Could not load PUBG statistics."
        );
    }
}


/* =========================================================
   DISPLAY PUBG DATA
========================================================= */

function loadPubgData(data) {

    document
        .getElementById("emptyState")
        .classList.add("hidden");

    document
        .getElementById("statsContainer")
        .classList.remove("hidden");


    document.getElementById("kills").innerText =
        data.kills ?? 0;

    document.getElementById("wins").innerText =
        data.wins ?? 0;

    document.getElementById("kd").innerText =
        data.kd ?? 0;

    document.getElementById("matches").innerText =
        data.matches ?? 0;

    document.getElementById("damage").innerText =
        data.averageDamage ?? 0;

    document.getElementById("survival").innerText =
        data.averageSurvivalTime ?? 0;

    document.getElementById("rank").innerText =
        data.rank ?? "Unknown";
}


/* =========================================================
   SET PUBG DISCONNECTED
========================================================= */

function setPubgDisconnected() {

    document.getElementById("connectionStatus").innerText =
        "Not Connected";

    pubgConnectBtn.innerText =
        "Connect Account";

    document
        .getElementById("statsContainer")
        .classList.add("hidden");

    document
        .getElementById("emptyState")
        .classList.remove("hidden");
}