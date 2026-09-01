
const tftConnectBtn =
    document.getElementById("tftConnectBtn");

const token =
    localStorage.getItem("token");


const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   LOAD SAVED TFT ACCOUNT
========================= */

window.addEventListener("load", () => {

    const savedStats =
        JSON.parse(
            localStorage.getItem("tftStats")
        );

    if (savedStats) {

        loadTftData(savedStats);

        document.getElementById(
            "tftConnectionStatus"
        ).innerText =
            "Already Connected";

        tftConnectBtn.innerText =
            "Disconnect";
    }

});


/* =========================
   CONNECT / DISCONNECT
========================= */

tftConnectBtn.addEventListener(
    "click",
    async () => {

        const savedStats =
            JSON.parse(
                localStorage.getItem("tftStats")
            );


        /* =========================
           DISCONNECT
        ========================= */

        if (savedStats) {

            localStorage.removeItem(
                "tftStats"
            );

            document.getElementById(
                "tftConnectionStatus"
            ).innerText =
                "Not Connected";

            document.getElementById(
                "tftStatsContainer"
            ).classList.add(
                "hidden"
            );

            document.getElementById(
                "tftEmptyState"
            ).classList.remove(
                "hidden"
            );

            tftConnectBtn.innerText =
                "Connect Account";

            return;
        }


        /* =========================
           CONNECT
        ========================= */

        const playerName =
            prompt(
                "Enter TFT player name"
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
                    `${API_URL}/api/games/tft/player/${encodeURIComponent(cleanPlayerName)}`,
                    {
                        method: "GET",

                        headers: {
                            "Authorization":
                                "Bearer " + token,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    "TFT player not found"
                );
            }


            const data =
                await response.json();


            localStorage.setItem(
                "tftStats",
                JSON.stringify(data)
            );


            loadTftData(data);


            document.getElementById(
                "tftConnectionStatus"
            ).innerText =
                "Already Connected";


            tftConnectBtn.innerText =
                "Disconnect";


        } catch (error) {

            console.error(error);

            alert(
                "TFT player not found"
            );

        }

    }
);


/* =========================
   LOAD TFT DATA
========================= */

function loadTftData(data) {

    document.getElementById(
        "tftEmptyState"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "tftStatsContainer"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "tftMatches"
    ).innerText =
        data.matches ?? 0;


    document.getElementById(
        "tftFirstPlaces"
    ).innerText =
        data.firstPlaces ?? 0;


    document.getElementById(
        "tftAveragePlacement"
    ).innerText =
        Number(
            data.averagePlacement ?? 0
        ).toFixed(2);


    document.getElementById(
        "tftTopFour"
    ).innerText =
        data.topFour ?? 0;


    document.getElementById(
        "tftTopFourRate"
    ).innerText =
        `${Number(
            data.topFourRate ?? 0
        ).toFixed(0)}%`;


    document.getElementById(
        "tftWinRate"
    ).innerText =
        `${Number(
            data.winRate ?? 0
        ).toFixed(0)}%`;


    document.getElementById(
        "tftLosses"
    ).innerText =
        data.losses ?? 0;


    document.getElementById(
        "tftPlayerName"
    ).innerText =
        data.playerName ?? "Unknown";

}

