const lolConnectBtn =
    document.getElementById(
        "lolConnectBtn"
    );

const token =
    localStorage.getItem(
        "token"
    );

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


window.onload = () => {

    const savedStats =
        JSON.parse(
            localStorage.getItem(
                "lolStats"
            )
        );

    if(savedStats){

        loadLolData(savedStats);

        document.getElementById(
            "lolConnectionStatus"
        ).innerText =
            "Already Connected";

        lolConnectBtn.innerText =
            "Disconnect";
    }
};


lolConnectBtn.addEventListener(
    "click",
    async () => {

        const savedStats =
            JSON.parse(
                localStorage.getItem(
                    "lolStats"
                )
            );


        if(savedStats){

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


        const playerName =
            prompt(
                "Enter Riot ID (GameName#TagLine)"
            );

        if(!playerName){

            return;
        }


        const parts =
            playerName.split("#");


        if(parts.length !== 2){

            alert(
                "Please enter Riot ID like: PlayerName#EUW"
            );

            return;
        }


        const gameName =
            parts[0];

        const tagLine =
            parts[1];


        try{

            const response =
                await fetch(

                    `${API_URL}/api/games/leagueoflegends/player/${encodeURIComponent(gameName)}?tagLine=${encodeURIComponent(tagLine)}`,

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
                    "League of Legends player not found"
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


        }catch(error){

            console.log(error);

            alert(
                "League of Legends player not found"
            );
        }

    }
);


function loadLolData(data){

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