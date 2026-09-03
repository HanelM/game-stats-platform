const lolConnectBtn =
    document.getElementById(
        "lolConnectBtn"
    );

const LOL_API_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   LOAD SAVED LOL ACCOUNT
========================= */

window.addEventListener("load", () => {

    const savedStats =
        JSON.parse(
            localStorage.getItem(
                "lolStats"
            )
        );

    if (savedStats) {

        loadLolData(savedStats);

        document.getElementById(
            "lolConnectionStatus"
        ).innerText =
            "Already Connected";

        lolConnectBtn.innerText =
            "Disconnect";
    }

});


/* =========================
   CONNECT / DISCONNECT
========================= */

lolConnectBtn.addEventListener(
    "click",
    async () => {

        const savedStats =
            JSON.parse(
                localStorage.getItem(
                    "lolStats"
                )
            );


        /* =========================
           DISCONNECT
        ========================= */

        if (savedStats) {

            localStorage.removeItem(
                "lolStats"
            );

            document.getElementById(
                "lolConnectionStatus"
            ).innerText =
                "Not Connected";

            document.getElementById(
                "lolStatsContainer"
            ).classList.add(
                "hidden"
            );

            document.getElementById(
                "lolEmptyState"
            ).classList.remove(
                "hidden"
            );

            lolConnectBtn.innerText =
                "Connect Account";

            return;
        }


        /* =========================
           CHECK LOGIN
        ========================= */

        const token =
            localStorage.getItem(
                "token"
            );

        if (!token) {

            alert(
                "Please login before connecting your League of Legends account."
            );

            return;
        }


        /* =========================
           CONNECT
        ========================= */

        const riotId =
            prompt(
                "Enter Riot ID (GameName#TagLine)"
            );


        if (!riotId) {
            return;
        }


        const cleanRiotId =
            riotId.trim();


        if (!cleanRiotId) {
            return;
        }


        if (!cleanRiotId.includes("#")) {

            alert(
                "Please enter Riot ID like: PlayerName#EUW"
            );

            return;
        }


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


        try {

            const response =
                await fetch(

                    `${LOL_API_URL}/api/games/leagueoflegends/player/${encodeURIComponent(cleanRiotId)}`,

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
                    "LOL RESPONSE:",
                    response.status,
                    errorText
                );

                throw new Error(
                    `LoL request failed: ${response.status} - ${errorText}`
                );
            }


            const data =
                await response.json();


            localStorage.setItem(
                "lolStats",
                JSON.stringify(data)
            );


            loadLolData(data);


            document.getElementById(
                "lolConnectionStatus"
            ).innerText =
                "Already Connected";


            lolConnectBtn.innerText =
                "Disconnect";


        } catch (error) {

              console.error(
                  "LOL ERROR:",
                  error
              );

              alert(
                  error.message ||
                  "League of Legends request failed."
              );
          }

    }
);


/* =========================
   LOAD LOL DATA
========================= */

function loadLolData(data) {

    document.getElementById(
        "lolEmptyState"
    ).classList.add(
        "hidden"
    );


    document.getElementById(
        "lolStatsContainer"
    ).classList.remove(
        "hidden"
    );


    document.getElementById(
        "lolKills"
    ).innerText =
        data.kills ?? 0;


    document.getElementById(
        "lolWins"
    ).innerText =
        data.wins ?? 0;


    document.getElementById(
        "lolKd"
    ).innerText =
        data.kd ?? 0;


    document.getElementById(
        "lolMatches"
    ).innerText =
        data.matches ?? 0;


    document.getElementById(
        "lolRank"
    ).innerText =
        data.rank ?? "Unknown";


    document.getElementById(
        "lolPlayerName"
    ).innerText =
        data.playerName ?? "Unknown";
}