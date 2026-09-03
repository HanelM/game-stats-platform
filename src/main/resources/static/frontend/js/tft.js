
/* =========================================================
   TEAMFIGHT TACTICS
   Riot API connection
========================================================= */

let tftConnectBtn;

const TFT_API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    tftConnectBtn =
        document.getElementById("tftConnectBtn");

    if (!tftConnectBtn) {

        console.error(
            "TFT: tftConnectBtn not found."
        );

        return;
    }


    console.log(
        "TFT: button initialized."
    );


    tftConnectBtn.addEventListener(
        "click",
        handleTftConnection
    );


    loadTftConnection();
});


/* =========================================================
   LOAD CONNECTION
========================================================= */

async function loadTftConnection() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        setTftDisconnected();

        return;
    }


    try {

        const response =
            await fetch(
                `${TFT_API_URL}/api/games/connected`,
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

                setTftDisconnected();

                return;
            }


            throw new Error(
                `Connected games request failed: ${response.status}`
            );
        }


        const accounts =
            await response.json();


        console.log(
            "TFT CONNECTED ACCOUNTS:",
            accounts
        );


        const tftAccount =
            accounts.find(
                account =>
                    account.game &&
                    account.game.toLowerCase() ===
                        "tft" &&
                    account.connected === true
            );


        if (!tftAccount) {

            setTftDisconnected();

            return;
        }


        document.getElementById(
            "tftConnectionStatus"
        ).innerText =
            "Already Connected";


        tftConnectBtn.innerText =
            "Disconnect";


        await loadTftStats(
            tftAccount.accountName
        );

    }
    catch (error) {

        console.error(
            "TFT CONNECTION ERROR:",
            error
        );

        setTftDisconnected();
    }
}


/* =========================================================
   CONNECT / DISCONNECT
========================================================= */

async function handleTftConnection() {

    const token =
        localStorage.getItem("token");


    if (!token) {

        alert(
            "Please login before connecting your TFT account."
        );

        return;
    }


    try {

        /* -------------------------------------------------
           CHECK CURRENT CONNECTION
        ------------------------------------------------- */

        const connectedResponse =
            await fetch(
                `${TFT_API_URL}/api/games/connected`,
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


        const tftAccount =
            accounts.find(
                account =>
                    account.game &&
                    account.game.toLowerCase() ===
                        "tft" &&
                    account.connected === true
            );


        /* =================================================
           DISCONNECT
        ================================================= */

        if (tftAccount) {

            tftConnectBtn.disabled =
                true;


            tftConnectBtn.innerText =
                "Disconnecting...";


            const response =
                await fetch(
                    `${TFT_API_URL}/api/games/tft/disconnect`,
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
                    `TFT disconnect failed: ${response.status}`
                );
            }


            setTftDisconnected();

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


        tftConnectBtn.disabled =
            true;


        tftConnectBtn.innerText =
            "Connecting...";


        console.log(
            "Connecting TFT:",
            cleanRiotId
        );


        /* -------------------------------------------------
           BACKEND CONNECT
        ------------------------------------------------- */

        const connectResponse =
            await fetch(
                `${TFT_API_URL}/api/games/tft/connect`,
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
                "TFT CONNECT RESPONSE:",
                connectResponse.status,
                errorText
            );


            throw new Error(
                errorText ||
                `TFT connection failed: ${connectResponse.status}`
            );
        }


        const connectData =
            await connectResponse.json();


        console.log(
            "TFT CONNECT RESPONSE:",
            connectData
        );


        /* -------------------------------------------------
           LOAD REAL STATISTICS
        ------------------------------------------------- */

        await loadTftStats(
            cleanRiotId
        );


        document.getElementById(
            "tftConnectionStatus"
        ).innerText =
            "Already Connected";


        tftConnectBtn.innerText =
            "Disconnect";


        alert(
            `TFT connected successfully.\nImported matches: ${
                connectData.importedMatches ?? 0
            }`
        );

    }
    catch (error) {

        console.error(
            "TFT ERROR:",
            error
        );


        alert(
            error.message ||
            "TFT connection failed."
        );


        setTftDisconnected();

    }
    finally {

        if (tftConnectBtn) {

            tftConnectBtn.disabled =
                false;
        }
    }
}


/* =========================================================
   LOAD TFT STATISTICS
========================================================= */

async function loadTftStats(
    playerName
) {

    const token =
        localStorage.getItem("token");


    if (!token) {

        setTftDisconnected();

        return;
    }


    try {

        const response =
            await fetch(
                `${TFT_API_URL}/api/games/tft/player/${encodeURIComponent(playerName)}`,
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
                "TFT STATS RESPONSE:",
                response.status,
                errorText
            );


            throw new Error(
                `TFT statistics request failed: ${response.status}`
            );
        }


        const data =
            await response.json();


        console.log(
            "TFT DATA:",
            data
        );


        loadTftData(data);

    }
    catch (error) {

        console.error(
            "TFT STATS ERROR:",
            error
        );


        alert(
            error.message ||
            "Could not load TFT statistics."
        );
    }
}


/* =========================================================
   DISPLAY TFT DATA
========================================================= */

function loadTftData(data) {

    const emptyState =
        document.getElementById(
            "tftEmptyState"
        );


    const statsContainer =
        document.getElementById(
            "tftStatsContainer"
        );


    if (emptyState) {

        emptyState.classList.add(
            "hidden"
        );
    }


    if (statsContainer) {

        statsContainer.classList.remove(
            "hidden"
        );
    }


    const matches =
        document.getElementById(
            "tftMatches"
        );


    const firstPlaces =
        document.getElementById(
            "tftFirstPlaces"
        );


    const averagePlacement =
        document.getElementById(
            "tftAveragePlacement"
        );


    const topFour =
        document.getElementById(
            "tftTopFour"
        );


    const topFourRate =
        document.getElementById(
            "tftTopFourRate"
        );


    const winRate =
        document.getElementById(
            "tftWinRate"
        );


    const losses =
        document.getElementById(
            "tftLosses"
        );


    const playerName =
        document.getElementById(
            "tftPlayerName"
        );


    if (matches) {

        matches.innerText =
            data.matches ?? 0;
    }


    if (firstPlaces) {

        firstPlaces.innerText =
            data.firstPlaces ?? 0;
    }


    if (averagePlacement) {

        averagePlacement.innerText =
            Number(
                data.averagePlacement ?? 0
            ).toFixed(2);
    }


    if (topFour) {

        topFour.innerText =
            data.topFour ?? 0;
    }


    if (topFourRate) {

        topFourRate.innerText =
            `${Number(
                data.topFourRate ?? 0
            ).toFixed(0)}%`;
    }


    if (winRate) {

        winRate.innerText =
            `${Number(
                data.winRate ?? 0
            ).toFixed(0)}%`;
    }


    if (losses) {

        losses.innerText =
            data.losses ?? 0;
    }


    if (playerName) {

        playerName.innerText =
            data.playerName ?? "Unknown";
    }
}


/* =========================================================
   DISCONNECTED
========================================================= */

function setTftDisconnected() {

    const status =
        document.getElementById(
            "tftConnectionStatus"
        );


    if (status) {

        status.innerText =
            "Not Connected";
    }


    if (tftConnectBtn) {

        tftConnectBtn.innerText =
            "Connect Account";

        tftConnectBtn.disabled =
            false;
    }


    const statsContainer =
        document.getElementById(
            "tftStatsContainer"
        );


    const emptyState =
        document.getElementById(
            "tftEmptyState"
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

