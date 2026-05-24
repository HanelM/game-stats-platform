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
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";
/* =========================
   LOAD GAMES
========================= */

async function loadGames() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            '${API_URL}/api/matches/my',
            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        const matches =
            data.content || [];

        /* UNIQUE GAMES */

        const uniqueGames =
            [...new Set(
                matches.map(
                    match => match.gameName
                )
            )];

        /* CLEAR OLD OPTIONS */

        gameSelect.innerHTML = `

            <option value="" hidden selected>
                Choose game to see leaderboard
            </option>

        `;

        /* ADD GAMES */

        uniqueGames.forEach(game => {

            gameSelect.innerHTML += `

                <option value="${game}">
                    ${game}
                </option>

            `;
        });

        /* BEST GAMES */

        renderBestGames(matches);

    } catch(error){

        console.log(error);
    }
}

/* =========================
   BEST GAMES
========================= */
function renderBestGames(matches){

    bestGamesContainer.innerHTML = "";

    if(matches.length === 0){

        bestGamesContainer.innerHTML = `

            <div class="mini-stat-card">

                No matches found

            </div>

        `;

        return;
    }

    /* =========================
       GLOBAL STATS
    ========================= */

    let totalKills = 0;

    let totalDeaths = 0;

    let totalWins = 0;

    let highestKills = 0;

    let highestScore = 0;

    matches.forEach(match => {

        totalKills += match.kills;

        totalDeaths += match.deaths;

        if(match.win){

            totalWins++;
        }

        if(match.kills > highestKills){

            highestKills = match.kills;
        }

        if(match.score > highestScore){

            highestScore = match.score;
        }
    });

    const winRate =
        (
            (totalWins / matches.length) * 100
        ).toFixed(1);

    const kdRatio =
        totalDeaths > 0
            ? (totalKills / totalDeaths)
                .toFixed(2)
            : totalKills;



    /* =========================
       TOP 3 MATCHES
    ========================= */

    const bestMatches =
        [...matches]
        .sort((a,b) => b.score - a.score)
        .slice(0,3);

    bestMatches.forEach((match,index) => {

        const kd =
            match.deaths > 0
                ? (match.kills / match.deaths)
                    .toFixed(2)
                : match.kills;

        bestGamesContainer.innerHTML += `

            <div class="mini-stat-card top-card-${index + 1}">

                <div class="match-header">

                    <span class="match-rank">

                        ${
                            index === 0
                                ? "🥇"
                            : index === 1
                                ? "🥈"
                            : "🥉"
                        }

                    </span>

                    <span class="match-game">

                        ${match.gameName}

                    </span>

                </div>

                <div class="match-score">

                    ${match.score}

                </div>

                <div class="mini-stats">

                    <div class="mini-box">

                        <span>Kills</span>

                        <strong>
                            ${match.kills}
                        </strong>

                    </div>

                    <div class="mini-box">

                        <span>KD</span>

                        <strong>
                            ${kd}
                        </strong>

                    </div>

                    <div class="mini-box">

                        <span>Result</span>

                        <strong>
                            ${
                                match.win
                                    ? "WIN"
                                    : "LOSS"
                            }
                        </strong>

                    </div>

                </div>

            </div>

        `;
    });
}
/* =========================
   LEADERBOARD
========================= */

async function loadLeaderboard() {

    const selectedGame =
        gameSelect.value;

    /* NO GAME SELECTED */

    if(!selectedGame){

        leaderboardBody.innerHTML = "";


        return;
    }


    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            '${API_URL}/api/leaderboard?gameName=${selectedGame}`,
            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        let players =
            await response.json();

        /* SEARCH */

        players = players.filter(player =>
            player.username
                .toLowerCase()
                .includes(
                    playerSearch.value.toLowerCase()
                )
        );

        /* SORT */

        if(sortSelect.value === "wins"){

            players.sort(
                (a,b) => b.wins - a.wins
            );

        } else {

            players.sort(
                (a,b) => b.kills - a.kills
            );
        }

        leaderboardBody.innerHTML = "";

        /* EMPTY */

        if(players.length === 0){

            leaderboardBody.innerHTML = `

                <div class="leaderboard-row">

                    <div class="stat">
                        No players found.
                    </div>

                </div>

            `;

            return;
        }

        /* RENDER */

        players.forEach((player,index) => {

            leaderboardBody.innerHTML += `

            <div class="leaderboard-row
                ${
                    index === 0
                        ? "top-1"
                    : index === 1
                        ? "top-2"
                    : index === 2
                        ? "top-3"
                    : ""
                }
            ">

                <div class="rank">

                    ${
                        index === 0
                            ? "🥇"
                        : index === 1
                            ? "🥈"
                        : index === 2
                            ? "🥉"
                        : "#" + (index + 1)
                    }

                </div>

                <div class="player">

                    <div class="player-avatar">

                        ${player.username
                            .charAt(0)
                            .toUpperCase()}

                    </div>

                    ${player.username}

                </div>

                <div class="stat">
                    ${player.wins}
                </div>

                <div class="stat">
                    ${player.kills}
                </div>

            </div>

            `;
        });

    } catch(error){

        console.log(error);

        leaderboardBody.innerHTML = `

            <div class="leaderboard-row">

                <div class="stat">
                    Failed to load leaderboard.
                </div>

            </div>

        `;
    }
}

/* =========================
   EVENTS
========================= */

gameSelect.addEventListener("change", loadLeaderboard);

playerSearch.addEventListener("input", () => {
    if (gameSelect.value) loadLeaderboard();
});

sortSelect.addEventListener("change", () => {
    if (gameSelect.value) loadLeaderboard();
});
/* =========================
   START
========================= */

loadGames();