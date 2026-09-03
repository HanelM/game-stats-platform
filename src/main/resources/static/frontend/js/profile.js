/* =========================================================
   PROFILE
   =========================================================
   IMPORTANT:
   Profile statistics are calculated from /api/matches/all.

   This means:
   - MANUAL matches are included
   - API / ONLINE matches are included
   - PUBG is NOT treated separately
   - League of Legends is included
   - TFT is included
   - Every game is included

   This must match Match History.
========================================================= */


const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


const token = localStorage.getItem("token");


/* =========================================================
   LOAD PROFILE
========================================================= */

async function loadProfile() {

    if (!token) {

        console.error("No authentication token found.");

        return;
    }


    try {

        const response =
            await fetch(
                `${API_URL}/api/users/profile`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load profile (${response.status})`
            );
        }


        const user =
            await response.json();


        console.log("PROFILE USER:");
        console.log(user);


        /* USERNAME */

        const username =
            user.username || "Username";


        const usernameElement =
            document.getElementById(
                "profile-username"
            );


        if (usernameElement) {

            usernameElement.innerText =
                username;
        }


        /* EMAIL */

        const email =
            user.email || "No email";


        const emailElement =
            document.getElementById(
                "profile-email"
            );


        if (emailElement) {

            emailElement.innerText =
                email;
        }


        const emailInfoElement =
            document.getElementById(
                "profile-email-info"
            );


        if (emailInfoElement) {

            emailInfoElement.innerText =
                email;
        }


        /* AVATAR */

        const avatarElement =
            document.getElementById(
                "profile-avatar"
            );


        if (avatarElement) {

            avatarElement.innerText =
                username
                    .charAt(0)
                    .toUpperCase();
        }


        /* MEMBER SINCE */

        const memberSinceElement =
            document.getElementById(
                "member-since"
            );


        if (
            memberSinceElement &&
            user.createdAt
        ) {

            const date =
                new Date(
                    user.createdAt
                );


            memberSinceElement.innerText =
                date.toLocaleDateString();
        }


        /* LOAD ALL STATISTICS */

        await loadStatistics();

    }
    catch (error) {

        console.error(
            "Profile loading error:",
            error
        );
    }
}


/* =========================================================
   LOAD ALL STATISTICS
========================================================= */

async function loadStatistics() {

    if (!token) {

        return;
    }


    try {

        /*
         * VERY IMPORTANT:
         *
         * Do NOT use:
         *
         * /api/matches/stats
         *
         * We want the complete list of matches.
         */

        const response =
            await fetch(
                `${API_URL}/api/matches/all`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load all matches (${response.status})`
            );
        }


        const data =
            await response.json();


        /*
         * /all returns a List<GameMatchResponse>.
         */

        const matches =
            Array.isArray(data)
                ? data
                : Array.isArray(data.content)
                    ? data.content
                    : [];


        console.log(
            "========================================"
        );

        console.log(
            "PROFILE - ALL MATCHES"
        );

        console.log(
            "API URL:",
            `${API_URL}/api/matches/all`
        );

        console.log(
            "TOTAL MATCHES:",
            matches.length
        );

        console.log(
            "MATCHES:",
            matches
        );


        /* =================================================
           TOTAL MATCHES
        ================================================= */

        const totalMatches =
            matches.length;


        /* =================================================
           WINS
        ================================================= */

        const totalWins =
            matches.filter(
                match =>
                    match.win === true
            ).length;


        /* =================================================
           LOSSES
        ================================================= */

        const totalLosses =
            totalMatches -
            totalWins;


        /* =================================================
           WIN RATE
        ================================================= */

        const winRate =
            totalMatches > 0
                ? (
                    totalWins /
                    totalMatches *
                    100
                ).toFixed(0)
                : 0;


        /* =================================================
           TOTAL KILLS
        ================================================= */

        const totalKills =
            matches.reduce(
                (total, match) =>
                    total +
                    Number(match.kills || 0),
                0
            );


        /* =================================================
           FAVORITE GAME

           Favorite game = game with the most matches.
        ================================================= */

        const gameCounts = {};


        matches.forEach(match => {

            const game =
                match.gameName;


            if (!game) {

                return;
            }


            if (!gameCounts[game]) {

                gameCounts[game] = 0;
            }


            gameCounts[game]++;
        });


        let favoriteGame = "-";


        let highestCount = 0;


        Object.entries(
            gameCounts
        ).forEach(
            ([game, count]) => {

                if (count > highestCount) {

                    highestCount =
                        count;

                    favoriteGame =
                        game;
                }

            }
        );


        /* =================================================
           UPDATE UI
        ================================================= */

        const totalMatchesElement =
            document.getElementById(
                "totalMatches"
            );


        if (totalMatchesElement) {

            totalMatchesElement.innerText =
                totalMatches;
        }


        const totalWinsElement =
            document.getElementById(
                "totalWins"
            );


        if (totalWinsElement) {

            totalWinsElement.innerText =
                totalWins;
        }


        const totalLossesElement =
            document.getElementById(
                "totalLosses"
            );


        if (totalLossesElement) {

            totalLossesElement.innerText =
                totalLosses;
        }


        const winRateElement =
            document.getElementById(
                "winRate"
            );


        if (winRateElement) {

            winRateElement.innerText =
                winRate + "%";
        }


        const totalKillsElement =
            document.getElementById(
                "totalKills"
            );


        if (totalKillsElement) {

            totalKillsElement.innerText =
                totalKills;
        }


        const favoriteGameElement =
            document.getElementById(
                "favoriteGame"
            );


        if (favoriteGameElement) {

            favoriteGameElement.innerText =
                favoriteGame;
        }


        /* =================================================
           DEBUG INFORMATION
        ================================================= */

        const onlineMatches =
            matches.filter(
                match =>
                    String(
                        match.source || ""
                    )
                        .trim()
                        .toUpperCase() ===
                    "API"
            );


        const manualMatches =
            matches.filter(
                match =>
                    String(
                        match.source || ""
                    )
                        .trim()
                        .toUpperCase() !==
                    "API"
            );


        console.log(
            "ONLINE/API MATCHES:",
            onlineMatches.length
        );


        console.log(
            "MANUAL MATCHES:",
            manualMatches.length
        );


        console.log(
            "TOTAL WINS:",
            totalWins
        );


        console.log(
            "TOTAL LOSSES:",
            totalLosses
        );


        console.log(
            "TOTAL KILLS:",
            totalKills
        );


        console.log(
            "WIN RATE:",
            winRate + "%"
        );


        console.log(
            "GAME COUNTS:",
            gameCounts
        );


        console.log(
            "FAVORITE GAME:",
            favoriteGame
        );


        console.log(
            "========================================"
        );

    }
    catch (error) {

        console.error(
            "Profile statistics error:",
            error
        );
    }
}


/* =========================================================
   START
========================================================= */

loadProfile();