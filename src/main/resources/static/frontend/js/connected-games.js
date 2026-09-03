const pubgConnectBtn =
    document.getElementById("connectBtn");

const PUBG_API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   LOAD SAVED PUBG ACCOUNT
========================= */

window.addEventListener("load", () => {

    const savedStats =
        JSON.parse(
            localStorage.getItem("pubgStats")
        );

    if (savedStats) {

        loadPubgData(savedStats);

        document.getElementById(
            "connectionStatus"
        ).innerText = "Already Connected";

        pubgConnectBtn.innerText =
            "Disconnect";
    }

});


/* =========================
   CONNECT / DISCONNECT
========================= */

pubgConnectBtn.addEventListener(
    "click",
    async () => {

        const savedStats =
            JSON.parse(
                localStorage.getItem("pubgStats")
            );


        /* =========================
           DISCONNECT
        ========================= */

        if (savedStats) {

            localStorage.removeItem(
                "pubgStats"
            );

            document.getElementById(
                "connectionStatus"
            ).innerText =
                "Not Connected";

            document.getElementById(
                "statsContainer"
            ).classList.add(
                "hidden"
            );

            document.getElementById(
                "emptyState"
            ).classList.remove(
                "hidden"
            );

            pubgConnectBtn.innerText =
                "Connect Account";

            return;
        }


        /* =========================
           CHECK LOGIN
        ========================= */

        const token =
            localStorage.getItem("token");

        if (!token) {

            alert(
                "Please login before connecting your PUBG account."
            );

            return;
        }


        /* =========================
           CONNECT
        ========================= */

        const playerName =
            prompt(
                "Enter PUBG Steam username"
            );

        if (!playerName) {
            return;
        }

        const cleanPlayerName =
            playerName.trim();

        if (!cleanPlayerName) {
            return;
        }


        try {

            const response =
                await fetch(

                    `${PUBG_API_URL}/api/games/pubg/player/${encodeURIComponent(cleanPlayerName)}`,

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

                throw new Error(
                    `PUBG request failed: ${response.status}`
                );
            }


            const data =
                await response.json();


            localStorage.setItem(
                "pubgStats",
                JSON.stringify(data)
            );


            loadPubgData(data);


            document.getElementById(
                "connectionStatus"
            ).innerText =
                "Already Connected";


            pubgConnectBtn.innerText =
                "Disconnect";


        } catch (error) {

            console.error(
                "PUBG ERROR:",
                error
            );

            alert(
                "PUBG player not found."
            );
        }
    }
);


/* =========================
   LOAD PUBG DATA
========================= */

function loadPubgData(data) {

    document.getElementById(
        "emptyState"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "statsContainer"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "kills"
    ).innerText =
        data.kills ?? 0;


    document.getElementById(
        "wins"
    ).innerText =
        data.wins ?? 0;


    document.getElementById(
        "kd"
    ).innerText =
        data.kd ?? 0;


    document.getElementById(
        "matches"
    ).innerText =
        data.matches ?? 0;


    document.getElementById(
        "damage"
    ).innerText =
        data.averageDamage ?? 0;


    document.getElementById(
        "survival"
    ).innerText =
        data.averageSurvivalTime ?? 0;


    document.getElementById(
        "rank"
    ).innerText =
        data.rank ?? "Unknown";
}