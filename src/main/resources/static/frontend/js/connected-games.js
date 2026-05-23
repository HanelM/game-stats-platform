const connectBtn =
    document.getElementById(
        "connectBtn"
    );

const token =
    localStorage.getItem(
        "token"
    );

/* =========================
   LOAD SAVED PUBG ACCOUNT
========================= */

window.onload = () => {

    const savedStats =
        JSON.parse(
            localStorage.getItem(
                "pubgStats"
            )
        );

    if(savedStats){

        loadPubgData(savedStats);

        document.getElementById(
            "connectionStatus"
        ).innerText =
            "Already Connected";

        connectBtn.innerText =
            "Disconnect";
    }
};

/* =========================
   CONNECT / DISCONNECT
========================= */

connectBtn.addEventListener(
    "click",
    async () => {

        const savedStats =
            JSON.parse(
                localStorage.getItem(
                    "pubgStats"
                )
            );

        /* =========================
           DISCONNECT
        ========================= */

        if(savedStats){

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

            connectBtn.innerText =
                "Connect Account";

            return;
        }

        /* =========================
           CONNECT
        ========================= */

        const playerName =
            prompt(
                "Enter PUBG Steam username"
            );

        if(!playerName){

            return;
        }

        try{

            const response =
                await fetch(

                    `http://localhost:8080/api/games/pubg/player/${playerName}`,

                    {
                        headers:{

                            "Authorization":
                                "Bearer " + token,

                            "Content-Type":
                                "application/json"
                        }
                    }
                );

            if(!response.ok){

                throw new Error(
                    "Player not found"
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

            connectBtn.innerText =
                "Disconnect";

        }catch(error){

            console.log(error);

            alert(
                "PUBG player not found"
            );
        }
    }
);

/* =========================
   LOAD PUBG DATA
========================= */

function loadPubgData(data){

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
        data.kills;

    document.getElementById(
        "wins"
    ).innerText =
        data.wins;

    document.getElementById(
        "kd"
    ).innerText =
        data.kd;

    document.getElementById(
        "matches"
    ).innerText =
        data.matches;

    document.getElementById(
        "damage"
    ).innerText =
        data.averageDamage;

    document.getElementById(
        "survival"
    ).innerText =
        data.averageSurvivalTime;

    document.getElementById(
        "rank"
    ).innerText =
        data.rank;
}