/* =========================================================
   LEADERBOARD
   Manual + API/Online matches are treated together.
========================================================= */


/* =========================
   DOM ELEMENTS
========================= */

const sortSelect =
    document.getElementById(
        "sort-select"
    );

const playerSearch =
    document.getElementById(
        "player-search"
    );

const leaderboardBody =
    document.getElementById(
        "leaderboard-container"
    );

const gameSelect =
    document.getElementById(
        "game-select"
    );

const bestGamesContainer =
    document.getElementById(
        "best-games"
    );


/* =========================
   API
========================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================================================
   LOAD GAMES
========================================================= */

async function loadGames() {

    const token =
        localStorage.getItem("token");


    try {

        /*
         * IMPORTANT:
         *
         * /my is paginated and normally returns
         * only 5 matches.
         *
         * /all returns ALL matches belonging
         * to the authenticated user.
         *
         * Therefore both manual and API matches
         * are included here.
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
                "Failed to load user matches"
            );
        }


        const data =
            await response.json();


        /*
         * /all should return an array.
         *
         * The fallback to data.content is kept
         * in case the backend is temporarily
         * returning a Page object.
         */

        const matches =
            Array.isArray(data)
                ? data
                : (data.content || []);


        console.log(
            "Leaderboard matches loaded:",
            matches.length
        );


        console.log(
            "Leaderboard match data:",
            matches
        );


        /* =========================
           UNIQUE GAMES
        ========================= */

        const uniqueGames = [
            ...new Set(
                matches
                    .map(
                        match =>
                            match.gameName
                    )
                    .filter(
                        game =>
                            game &&
                            game.trim() !== ""
                    )
            )
        ];


        /* =========================
           CLEAR OLD OPTIONS
        ========================= */

        gameSelect.innerHTML = `

            <option
                value=""
                hidden
                selected
            >
                Choose game to see leaderboard
            </option>

        `;


        /* =========================
           ADD GAMES
        ========================= */

        uniqueGames.forEach(game => {

            const option =
                document.createElement(
                    "option"
                );


            option.value = game;

            option.textContent = game;


            gameSelect.appendChild(
                option
            );

        });


        /* =========================
           BEST GAMES
        ========================= */

        renderBestGames(matches);


    } catch (error) {

        console.error(
            "Error loading leaderboard games:",
            error
        );


        /*
         * Clear selector if loading failed.
         */

        gameSelect.innerHTML = `

            <option
                value=""
                hidden
                selected
            >
                Unable to load games
            </option>

        `;


        renderBestGames([]);

    }
}


/* =========================================================
   BEST GAMES
========================================================= */

function renderBestGames(matches) {

    bestGamesContainer.innerHTML = "";


    /* =========================
       NO MATCHES
    ========================= */

    if (!matches || matches.length === 0) {

        bestGamesContainer.innerHTML = `

            <div class="mini-stat-card">

                No matches found

            </div>

        `;

        return;
    }


    /* =====================================================
       GLOBAL STATS
    ===================================================== */

    let totalKills = 0;

    let totalDeaths = 0;

    let totalWins = 0;

    let highestKills = 0;

    let highestScore = 0;


    matches.forEach(match => {

        const kills =
            Number(
                match.kills || 0
            );

        const deaths =
            Number(
                match.deaths || 0
            );

        const score =
            Number(
                match.score || 0
            );


        totalKills += kills;

        totalDeaths += deaths;


        if (match.win === true) {

            totalWins++;

        }


        if (kills > highestKills) {

            highestKills =
                kills;

        }


        if (score > highestScore) {

            highestScore =
                score;

        }

    });


    /* =========================
       WIN RATE
    ========================= */

    const winRate =
        matches.length > 0
            ? (
                (totalWins / matches.length)
                * 100
            ).toFixed(1)
            : "0.0";


    /* =========================
       KD RATIO
    ========================= */

    const kdRatio =
        totalDeaths > 0
            ? (
                totalKills /
                totalDeaths
            ).toFixed(2)
            : totalKills.toFixed(2);


    /* =====================================================
       TOP 3 MATCHES
    ===================================================== */

    const bestMatches =
        [...matches]
            .sort(
                (a, b) => {

                    const scoreA =
                        Number(
                            a.score || 0
                        );

                    const scoreB =
                        Number(
                            b.score || 0
                        );


                    return scoreB - scoreA;
                }
            )
            .slice(0, 3);


    /* =====================================================
       RENDER TOP 3
    ===================================================== */

    bestMatches.forEach(
        (match, index) => {

            const kills =
                Number(
                    match.kills || 0
                );

            const deaths =
                Number(
                    match.deaths || 0
                );

            const score =
                Number(
                    match.score || 0
                );


            const kd =
                deaths > 0
                    ? (
                        kills /
                        deaths
                    ).toFixed(2)
                    : kills.toFixed(2);


            /*
             * Show whether the match came
             * from the API or was entered manually.
             */

            const source =
                match.source === "API"
                    ? "ONLINE"
                    : "MANUAL";


            const medal =
                index === 0
                    ? "🥇"
                    : index === 1
                        ? "🥈"
                        : "🥉";


            bestGamesContainer.innerHTML += `

                <div class="mini-stat-card top-card-${index + 1}">

                    <div class="match-header">

                        <span class="match-rank">

                            ${medal}

                        </span>


                        <span class="match-game">

                            ${match.gameName || "Unknown Game"}

                        </span>

                    </div>


                    <div class="match-score">

                        ${score}

                    </div>


                    <div class="mini-stats">

                        <div class="mini-box">

                            <span>
                                Kills
                            </span>

                            <strong>

                                ${kills}

                            </strong>

                        </div>


                        <div class="mini-box">

                            <span>
                                KD
                            </span>

                            <strong>

                                ${kd}

                            </strong>

                        </div>


                        <div class="mini-box">

                            <span>
                                Result
                            </span>

                            <strong>

                                ${
                                    match.win === true
                                        ? "WIN"
                                        : "LOSS"
                                }

                            </strong>

                        </div>

                    </div>


                    <div class="match-source">

                        ${source}

                    </div>

                </div>

            `;
        }
    );
}


/* =========================================================
   LOAD LEADERBOARD
========================================================= */

async function loadLeaderboard() {

    const selectedGame =
        gameSelect.value;


    /* =========================
       NO GAME SELECTED
    ========================= */

    if (!selectedGame) {

        leaderboardBody.innerHTML = "";

        return;
    }


    const token =
        localStorage.getItem("token");


    try {

        /*
         * encodeURIComponent is important because
         * "League of Legends" contains spaces.
         */

        const encodedGame =
            encodeURIComponent(
                selectedGame
            );


        const response =
            await fetch(
                `${API_URL}/api/leaderboard?gameName=${encodedGame}`,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load leaderboard"
            );
        }


        let players =
            await response.json();


        /*
         * Make sure we received an array.
         */

        if (!Array.isArray(players)) {

            players = [];

        }


        /* =================================================
           SEARCH
        ================================================= */

        const searchValue =
            (
                playerSearch.value || ""
            )
                .trim()
                .toLowerCase();


        if (searchValue) {

            players =
                players.filter(
                    player => {

                        const username =
                            String(
                                player.username || ""
                            )
                                .toLowerCase();


                        return username.includes(
                            searchValue
                        );

                    }
                );
        }


        /* =================================================
           NORMALIZE NUMBERS
        ================================================= */

        players =
            players.map(player => ({

                ...player,

                wins:
                    Number(
                        player.wins || 0
                    ),

                kills:
                    Number(
                        player.kills || 0
                    )

            }));


        /* =================================================
           SORT
        ================================================= */

        if (
            sortSelect.value === "wins"
        ) {

            players.sort(
                (a, b) =>
                    b.wins - a.wins
            );

        } else {

            players.sort(
                (a, b) =>
                    b.kills - a.kills
            );

        }


        /* =================================================
           CLEAR OLD LEADERBOARD
        ================================================= */

        leaderboardBody.innerHTML = "";


        /* =================================================
           EMPTY
        ================================================= */

        if (players.length === 0) {

            leaderboardBody.innerHTML = `

                <div class="leaderboard-row">

                    <div class="stat">

                        No players found.

                    </div>

                </div>

            `;

            return;
        }


        /* =================================================
           RENDER
        ================================================= */

        players.forEach(
            (player, index) => {

                const username =
                    player.username ||
                    "Unknown";


                const firstLetter =
                    username
                        .charAt(0)
                        .toUpperCase();


                const rankClass =
                    index === 0
                        ? "top-1"
                        : index === 1
                            ? "top-2"
                            : index === 2
                                ? "top-3"
                                : "";


                const rank =
                    index === 0
                        ? "🥇"
                        : index === 1
                            ? "🥈"
                            : index === 2
                                ? "🥉"
                                : "#" +
                                  (index + 1);


                leaderboardBody.innerHTML += `

                    <div class="leaderboard-row ${rankClass}">


                        <div class="rank">

                            ${rank}

                        </div>


                        <div class="player">

                            <div class="player-avatar">

                                ${firstLetter}

                            </div>


                            ${username}

                        </div>


                        <div class="stat">

                            ${player.wins}

                        </div>


                        <div class="stat">

                            ${player.kills}

                        </div>


                    </div>

                `;
            }
        );


    } catch (error) {

        console.error(
            "Leaderboard error:",
            error
        );


        leaderboardBody.innerHTML = `

            <div class="leaderboard-row">

                <div class="stat">

                    Failed to load leaderboard.

                </div>

            </div>

        `;
    }
}


/* =========================================================
   EVENTS
========================================================= */

if (gameSelect) {

    gameSelect.addEventListener(
        "change",
        loadLeaderboard
    );

}


if (playerSearch) {

    playerSearch.addEventListener(
        "input",
        () => {

            if (gameSelect.value) {

                loadLeaderboard();

            }

        }
    );

}


if (sortSelect) {

    sortSelect.addEventListener(
        "change",
        () => {

            if (gameSelect.value) {

                loadLeaderboard();

            }

        }
    );

}


/* =========================================================
   START
========================================================= */

loadGames();