
/* =========================================================
   LEAGUE OF LEGENDS
   Riot API connection
========================================================= */

let lolConnectBtn;

const LOL_API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    lolConnectBtn =
        document.getElementById("lolConnectBtn");

    if (!lolConnectBtn) {
        console.error("LOL: lolConnectBtn not found.");
        return;
    }

    console.log("LOL: button initialized.");

    lolConnectBtn.addEventListener(
        "click",
        handleLolConnection
    );

    loadLolConnection();
});


/* =========================================================
   LOAD CONNECTION
========================================================= */

async function loadLolConnection() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        setLolDisconnected();

        return;
    }

    try {

        const response =
            await fetch(
                `${LOL_API_URL}/api/games/connected`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            if (response.status === 401) {

                setLolDisconnected();

                return;
            }

            throw new Error(
                `Connected games request failed: ${response.status}`
            );
        }


        const accounts =
            await response.json();


        console.log(
            "LOL CONNECTED ACCOUNTS:",
            accounts
        );


        const lolAccount =
            accounts.find(
                account =>
                    account.game &&
                    account.game.toLowerCase() ===
                        "leagueoflegends" &&
                    account.connected === true
            );


        if (!lolAccount) {

            setLolDisconnected();

            return;
        }


        document.getElementById(
            "lolConnectionStatus"
        ).innerText =
            "Already Connected";


        lolConnectBtn.innerText =
            "Disconnect";


        await loadLolStats(
            lolAccount.accountName
        );

    }
    catch (error) {

        console.error(
            "LOL CONNECTION ERROR:",
            error
        );

        setLolDisconnected();
    }
}


/* =========================================================
   CONNECT / DISCONNECT
========================================================= */

async function handleLolConnection() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login before connecting your League of Legends account."
        );

        return;
    }


    try {

        /* -------------------------------------------------
           CHECK CURRENT CONNECTION
        ------------------------------------------------- */

        const connectedResponse =
            await fetch(
                `${LOL_API_URL}/api/games/connected`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!connectedResponse.ok) {

            throw new Error(
                `Unable to check connected games: ${connectedResponse.status}`
            );
        }


        const accounts =
            await connectedResponse.json();


        const lolAccount =
            accounts.find(
                account =>
                    account.game &&
                    account.game.toLowerCase() ===
                        "leagueoflegends" &&
                    account.connected === true
            );


        /* =================================================
           DISCONNECT
        ================================================= */

        if (lolAccount) {

            lolConnectBtn.disabled = true;

            lolConnectBtn.innerText =
                "Disconnecting...";


            const response =
                await fetch(
                    `${LOL_API_URL}/api/games/leagueoflegends/disconnect`,
                    {
                        method: "DELETE",
                        headers: {
                            "Authorization":
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {

                const errorText =
                    await response.text();

                throw new Error(
                    errorText ||
                    `League of Legends disconnect failed: ${response.status}`
                );
            }


            setLolDisconnected();

            return;
        }


        /* =================================================
           CONNECT
        ================================================= */

        const riotId =
            prompt(
                "Enter Riot ID (GameName#TagLine)"
            );


        if (!riotId) {
            return;
        }


        const cleanRiotId =
            riotId.trim();


        const parts =
            cleanRiotId.split("#");


        if (
            parts.length !== 2 ||
            !parts[0].trim() ||
            !parts[1].trim()
        ) {

            alert(
                "Please enter Riot ID like: PlayerName#EUW"
            );

            return;
        }


        lolConnectBtn.disabled = true;

        lolConnectBtn.innerText =
            "Connecting...";


        console.log(
            "Connecting League of Legends:",
            cleanRiotId
        );


        /* -------------------------------------------------
           BACKEND CONNECT
        ------------------------------------------------- */

        const connectResponse =
            await fetch(
                `${LOL_API_URL}/api/games/leagueoflegends/connect`,
                {
                    method: "POST",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Content-Type":
                            "application/json",
                        "Accept":
                            "application/json"
                    },
                    body: JSON.stringify({
                        playerName:
                            cleanRiotId
                    })
                }
            );


        if (!connectResponse.ok) {

            const errorText =
                await connectResponse.text();

            console.error(
                "LOL CONNECT RESPONSE:",
                connectResponse.status,
                errorText
            );

            throw new Error(
                errorText ||
                `League of Legends connection failed: ${connectResponse.status}`
            );
        }


        const connectData =
            await connectResponse.json();


        console.log(
            "LOL CONNECT RESPONSE:",
            connectData
        );


        /* -------------------------------------------------
           LOAD STATISTICS
        ------------------------------------------------- */

        await loadLolStats(
            cleanRiotId
        );


        document.getElementById(
            "lolConnectionStatus"
        ).innerText =
            "Already Connected";


        lolConnectBtn.innerText =
            "Disconnect";


        alert(
            `League of Legends connected successfully.\nImported matches: ${
                connectData.importedMatches ?? 0
            }`
        );

    }
    catch (error) {

        console.error(
            "LOL ERROR:",
            error
        );


        alert(
            error.message ||
            "League of Legends connection failed."
        );


        setLolDisconnected();

    }
    finally {

        if (lolConnectBtn) {

            lolConnectBtn.disabled =
                false;
        }
    }
}


/* =========================================================
   LOAD LOL STATISTICS
========================================================= */

async function loadLolStats(
    playerName
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        setLolDisconnected();

        return;
    }


    try {

        const response =
            await fetch(
                `${LOL_API_URL}/api/games/leagueoflegends/player/${encodeURIComponent(playerName)}`,
                {
                    method: "GET",
                    headers: {
                        "Authorization":
                            "Bearer " + token,
                        "Accept":
                            "application/json"
                    }
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "LOL STATS RESPONSE:",
                response.status,
                errorText
            );

            throw new Error(
                `League of Legends statistics request failed: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "LOL DATA:",
            data
        );


        loadLolData(data);

    }
    catch (error) {

        console.error(
            "LOL STATS ERROR:",
            error
        );

        alert(
            error.message ||
            "Could not load League of Legends statistics."
        );
    }
}


/* =========================================================
   DISPLAY LOL DATA
========================================================= */

function loadLolData(data) {

    const emptyState =
        document.getElementById(
            "lolEmptyState"
        );

    const statsContainer =
        document.getElementById(
            "lolStatsContainer"
        );


    if (emptyState) {
        emptyState.classList.add("hidden");
    }


    if (statsContainer) {
        statsContainer.classList.remove("hidden");
    }


    const kills =
        document.getElementById("lolKills");

    const wins =
        document.getElementById("lolWins");

    const kd =
        document.getElementById("lolKd");

    const matches =
        document.getElementById("lolMatches");

    const rank =
        document.getElementById("lolRank");

    const playerName =
        document.getElementById("lolPlayerName");


    if (kills)
        kills.innerText =
            data.kills ?? 0;


    if (wins)
        wins.innerText =
            data.wins ?? 0;


    if (kd)
        kd.innerText =
            data.kd ?? 0;


    if (matches)
        matches.innerText =
            data.matches ?? 0;


    if (rank)
        rank.innerText =
            data.rank ?? "Unknown";


    if (playerName)
        playerName.innerText =
            data.playerName ?? "Unknown";
}


/* =========================================================
   DISCONNECTED
========================================================= */

function setLolDisconnected() {

    const status =
        document.getElementById(
            "lolConnectionStatus"
        );


    if (status) {

        status.innerText =
            "Not Connected";
    }


    if (lolConnectBtn) {

        lolConnectBtn.innerText =
            "Connect Account";

        lolConnectBtn.disabled =
            false;
    }


    const statsContainer =
        document.getElementById(
            "lolStatsContainer"
        );


    const emptyState =
        document.getElementById(
            "lolEmptyState"
        );


    if (statsContainer) {

        statsContainer.classList.add(
            "hidden"
        );
    }


    if (emptyState) {

        emptyState.classList.remove(
            "hidden"
        );
    }
}

