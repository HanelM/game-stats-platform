/* =========================================================
   DASHBOARD
   Uses ONLY backend game_matches data.
   Manual + API/online matches are handled together.
========================================================= */

/* =========================
   PROFILE / AUTH
========================= */

const params = new URLSearchParams(
    window.location.search
);

const selectedUsername = params.get("username");

const viewingOwnProfile = !selectedUsername;

const token = localStorage.getItem("token");


/* =========================
   API
========================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   DOM ELEMENTS
========================= */

const chartGameSelect =
    document.getElementById("chartGameSelect");


/* =========================
   DATA
========================= */

let matches = [];

let mainChart = null;
let kdChart = null;
let winRateChart = null;
let scoreChart = null;


/* =========================================================
   LOAD DASHBOARD
========================================================= */

async function loadDashboard() {

    let url;

    /*
     * Own profile:
     * Use /all so we get ALL matches, not only the
     * first 5 records from /my.
     *
     * Other profile:
     * Use /user/{username}.
     */

    if (selectedUsername) {

        url =
            `${API_URL}/api/matches/user/${encodeURIComponent(selectedUsername)}`;

    } else {

        url =
            `${API_URL}/api/matches/all`;
    }


    try {

        const response = await fetch(
            url,
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );


        if (!response.ok) {

            throw new Error(
                "Failed to load dashboard matches"
            );
        }


        const data = await response.json();


        /*
         * /all and /user/{username} return
         * a normal array.
         */

        if (Array.isArray(data)) {

            matches = data;

        } else {

            /*
             * Safety fallback in case an endpoint
             * returns a paginated object.
             */

            matches = data.content || [];
        }


        console.log(
            "Dashboard matches loaded:",
            matches.length
        );


        console.log(
            "Dashboard data:",
            matches
        );


        loadGameFilter();

        renderDashboard();


    } catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

    }
}


/* =========================================================
   GAME FILTER
========================================================= */

function loadGameFilter() {

    if (!chartGameSelect) {
        return;
    }


    /*
     * Get unique game names from ALL matches.
     */

    const uniqueGames = [
        ...new Set(
            matches
                .map(match => match.gameName)
                .filter(game => game)
        )
    ];


    /*
     * Clear old options.
     */

    chartGameSelect.innerHTML =
        `<option value="all">All Games</option>`;


    /*
     * Add games.
     */

    uniqueGames.forEach(game => {

        const option =
            document.createElement("option");

        option.value = game;

        option.textContent = game;

        chartGameSelect.appendChild(option);

    });
}


/* =========================================================
   RENDER DASHBOARD
========================================================= */

function renderDashboard() {

    if (!Array.isArray(matches)) {
        matches = [];
    }


    /*
     * Selected game.
     */

    const selectedGame =
        chartGameSelect
            ? chartGameSelect.value
            : "all";


    /*
     * Filter matches.
     */

    let filteredMatches = matches;


    if (selectedGame !== "all") {

        filteredMatches =
            matches.filter(
                match =>
                    match.gameName === selectedGame
            );
    }


    /* =====================================================
       CALCULATE STATISTICS
    ===================================================== */

    let totalKills = 0;

    let totalDeaths = 0;

    let totalScore = 0;

    let totalWins = 0;

    let totalMatches =
        filteredMatches.length;


    filteredMatches.forEach(match => {

        const kills =
            Number(match.kills || 0);

        const deaths =
            Number(match.deaths || 0);

        const score =
            Number(match.score || 0);


        totalKills += kills;

        totalDeaths += deaths;

        totalScore += score;


        if (match.win === true) {

            totalWins++;
        }

    });


    /* =====================================================
       WIN RATE
    ===================================================== */

    const winRate =
        totalMatches > 0
            ? (
                (totalWins / totalMatches) * 100
            ).toFixed(1)
            : "0.0";


    /* =====================================================
       KD RATIO
    ===================================================== */

    const kdRatio =
        totalDeaths > 0
            ? (
                totalKills / totalDeaths
            ).toFixed(2)
            : totalKills.toFixed
                ? totalKills.toFixed(2)
                : totalKills;


    /* =====================================================
       AVERAGE SCORE
    ===================================================== */

    const avgScore =
        totalMatches > 0
            ? Math.round(
                totalScore / totalMatches
            )
            : 0;


    /* =====================================================
       UPDATE MAIN STATS
    ===================================================== */

    const totalKillsElement =
        document.getElementById(
            "totalKills"
        );

    const winRateElement =
        document.getElementById(
            "winRate"
        );

    const kdRatioElement =
        document.getElementById(
            "kdRatio"
        );

    const avgScoreElement =
        document.getElementById(
            "avgScore"
        );


    if (totalKillsElement) {

        totalKillsElement.innerText =
            totalKills;
    }


    if (winRateElement) {

        winRateElement.innerText =
            winRate + "%";
    }


    if (kdRatioElement) {

        kdRatioElement.innerText =
            kdRatio;
    }


    if (avgScoreElement) {

        avgScoreElement.innerText =
            avgScore;
    }


    /* =====================================================
       LEVEL SYSTEM
    ===================================================== */

    const playerLevel =
        document.getElementById(
            "playerLevel"
        );

    const xpFill =
        document.getElementById(
            "xpFill"
        );

    const xpText =
        document.getElementById(
            "xpText"
        );

    const levelGameText =
        document.getElementById(
            "levelGameText"
        );


    /*
     * XP is calculated from ALL matches
     * currently selected.
     */

    const totalXP =
        (totalKills * 15) +
        (totalWins * 100) +
        (totalMatches * 25);


    const level =
        Math.floor(
            totalXP / 1000
        ) + 1;


    const currentXP =
        totalXP % 1000;


    const xpPercent =
        (currentXP / 1000) * 100;


    if (playerLevel) {

        playerLevel.innerText =
            level;
    }


    if (xpFill) {

        xpFill.style.width =
            xpPercent + "%";
    }


    if (xpText) {

        xpText.innerText =
            currentXP +
            " / 1000 XP";
    }


    if (levelGameText) {

        if (selectedGame === "all") {

            levelGameText.innerText =
                "All Games";

        } else {

            levelGameText.innerText =
                selectedGame;
        }
    }


    /* =====================================================
       ACHIEVEMENTS
    ===================================================== */

    const achievementList =
        document.getElementById(
            "achievementList"
        );


    if (achievementList) {

        achievementList.innerHTML = "";

        const achievements = [];


        /* Kill Master */

        if (totalKills >= 40) {

            achievements.push({

                icon: "🔥",

                title: "Kill Master",

                desc: "40+ kills"
            });
        }


        /* Champion */

        if (totalWins >= 3) {

            achievements.push({

                icon: "🏆",

                title: "Champion",

                desc: "3+ wins"
            });
        }


        /* High KD */

        if (parseFloat(kdRatio) >= 2) {

            achievements.push({

                icon: "⚡",

                title: "High KD",

                desc: "KD above 2.0"
            });
        }


        /* No achievements */

        if (achievements.length === 0) {

            achievements.push({

                icon: "❌",

                title: "No Achievements",

                desc: "Play more matches"
            });
        }


        /* Render achievements */

        achievements.forEach(achievement => {

            achievementList.innerHTML += `

                <div class="achievement">

                    <div>

                        <h4>
                            ${achievement.icon}
                            ${achievement.title}
                        </h4>

                        <p>
                            ${achievement.desc}
                        </p>

                    </div>

                </div>

            `;
        });
    }


    /* =====================================================
       RECENT ACTIVITY
    ===================================================== */

    const recentActivity =
        document.getElementById(
            "recentActivity"
        );


    if (recentActivity) {

        recentActivity.innerHTML = "";


        /*
         * Sort newest first.
         *
         * Do NOT use reverse() here because the
         * backend may already return newest first.
         */

        const recentMatches =
            [...filteredMatches]
                .sort(
                    (a, b) => {

                        const dateA =
                            new Date(
                                a.playedAt || 0
                            );

                        const dateB =
                            new Date(
                                b.playedAt || 0
                            );

                        return dateB - dateA;
                    }
                )
                .slice(0, 5);


        if (recentMatches.length === 0) {

            recentActivity.innerHTML = `

                <div class="activity-item">

                    <div class="activity-left">

                        <div class="activity-icon">
                            🎮
                        </div>

                        <div class="activity-info">

                            <strong>
                                No Matches
                            </strong>

                            <span>
                                Play a match to see activity
                            </span>

                        </div>

                    </div>

                </div>

            `;

        } else {


            recentMatches.forEach(match => {

                const score =
                    Number(
                        match.score || 0
                    );


                /*
                 * Online/API vs Manual badge.
                 */

                const source =
                    match.source === "API"
                        ? "ONLINE"
                        : "MANUAL";


                recentActivity.innerHTML += `

                    <div class="activity-item">

                        <div class="activity-left">

                            <div class="activity-icon">

                                ${
                                    match.win === true
                                        ? "🏆"
                                        : "🎯"
                                }

                            </div>


                            <div class="activity-info">

                                <strong>

                                    ${
                                        match.gameName ||
                                        "Unknown Game"
                                    }

                                </strong>


                                <span>

                                    ${
                                        match.win === true
                                            ? "Victory"
                                            : "Defeat"
                                    }

                                    ·

                                    ${source}

                                </span>

                            </div>

                        </div>


                        <div class="activity-score">

                            ${score}

                        </div>

                    </div>

                `;
            });
        }
    }


    /* =====================================================
       CHART DATA
    ===================================================== */

    /*
     * Charts are based directly on the same
     * filtered matches.
     */

    const labels =
        filteredMatches.map(
            (_, index) =>
                "Match " + (index + 1)
        );


    const killsData =
        filteredMatches.map(
            match =>
                Number(
                    match.kills || 0
                )
        );


    const scoreData =
        filteredMatches.map(
            match =>
                Number(
                    match.score || 0
                )
        );


    const kdData =
        filteredMatches.map(match => {

            const kills =
                Number(
                    match.kills || 0
                );

            const deaths =
                Number(
                    match.deaths || 0
                );


            if (deaths > 0) {

                return Number(
                    (
                        kills / deaths
                    ).toFixed(2)
                );

            }


            return kills;
        });


    const winRateData =
        filteredMatches.map(
            match =>
                match.win === true
                    ? 100
                    : 0
        );


    /* =====================================================
       DESTROY OLD CHARTS
    ===================================================== */

    if (mainChart) {

        mainChart.destroy();

        mainChart = null;
    }


    if (kdChart) {

        kdChart.destroy();

        kdChart = null;
    }


    if (winRateChart) {

        winRateChart.destroy();

        winRateChart = null;
    }


    if (scoreChart) {

        scoreChart.destroy();

        scoreChart = null;
    }


    /* =====================================================
       CREATE CHARTS
    ===================================================== */

    if (
        document.getElementById(
            "mainChart"
        )
    ) {

        mainChart =
            createChart(
                "mainChart",
                "bar",
                labels,
                killsData,
                "Kills",
                "#00ff88"
            );
    }


    if (
        document.getElementById(
            "kdChart"
        )
    ) {

        kdChart =
            createChart(
                "kdChart",
                "line",
                labels,
                kdData,
                "KD Ratio",
                "#00ff88"
            );
    }


    if (
        document.getElementById(
            "winRateChart"
        )
    ) {

        winRateChart =
            createChart(
                "winRateChart",
                "line",
                labels,
                winRateData,
                "Win Rate",
                "#00bfff"
            );
    }


    if (
        document.getElementById(
            "scoreChart"
        )
    ) {

        scoreChart =
            createChart(
                "scoreChart",
                "line",
                labels,
                scoreData,
                "Score",
                "#ffd000"
            );
    }
}


/* =========================================================
   CHART FACTORY
========================================================= */

function createChart(
    id,
    type,
    labels,
    data,
    label,
    color
) {

    const canvas =
        document.getElementById(id);


    if (!canvas) {

        return null;
    }


    return new Chart(

        canvas,

        {

            type: type,


            data: {

                labels: labels,


                datasets: [

                    {

                        label: label,

                        data: data,

                        borderColor: color,

                        backgroundColor:
                            color + "33",

                        borderWidth: 3,

                        tension: 0.4,

                        fill: true

                    }

                ]

            },


            options: {

                responsive: true,

                maintainAspectRatio: false,


                plugins: {

                    legend: {

                        labels: {

                            color: "white"

                        }

                    }

                },


                scales: {

                    x: {

                        ticks: {

                            color: "white"

                        }

                    },


                    y: {

                        beginAtZero: true,


                        ticks: {

                            color: "white"

                        }

                    }

                }

            }

        }

    );
}


/* =========================================================
   FILTER EVENT
========================================================= */

if (chartGameSelect) {

    chartGameSelect.addEventListener(
        "change",
        renderDashboard
    );
}


/* =========================================================
   START
========================================================= */

loadDashboard();