/* =========================
   ELEMENTS
========================= */

const matchesContainer =
    document.getElementById("matches-container");

const gameTitle =
    document.getElementById("game-title");

const timeline =
    document.getElementById("activity-timeline");

const timelineTitle =
    document.querySelector(".timeline-title");

const gameFilter =
    document.getElementById("game-filter");

const resultFilter =
    document.getElementById("result-filter");

const sortFilter =
    document.getElementById("sort-filter");

const bestFilter =
    document.getElementById("best-filter");

const filterModal =
    document.getElementById("filterModal");

const openFiltersBtn =
    document.getElementById("openFiltersBtn");

const applyFilters =
    document.getElementById("applyFilters");

const resetFilters =
    document.getElementById("resetFilters");

/* =========================
   GLOBAL MATCHES
========================= */

let allMatches = [];

/* =========================
   CALCULATE STATS
========================= */

function calculateStats(matches) {

    const totalMatches = matches.length;

    const wins = matches.filter(
        m => m.win
    ).length;

    const totalKills = matches.reduce(
        (sum, m) => sum + m.kills,
        0
    );

    const totalScore = matches.reduce(
        (sum, m) => sum + m.score,
        0
    );

    return {

        totalMatches,

        winRate:
            totalMatches
                ? Math.round(
                    (wins / totalMatches) * 100
                )
                : 0,

        totalKills,

        avgScore:
            totalMatches
                ? Math.round(
                    totalScore / totalMatches
                )
                : 0
    };
}

/* =========================
   INIT
========================= */

gameTitle.innerText =
    "📜 Match History";

loadMatches();

/* =========================
   LOAD MATCHES
========================= */

async function loadMatches() {

    const token =
        localStorage.getItem("token");

    try {

        const response = await fetch(
            "http://localhost:8080/api/matches/my",
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        allMatches =
            data.content || [];

        loadGameOptions();

        renderMatches();

    } catch (error) {

        console.log(
            "Error loading matches:",
            error
        );
    }
}

/* =========================
   LOAD GAME OPTIONS
========================= */

function loadGameOptions() {

    const uniqueGames =
        [...new Set(
            allMatches.map(
                m => m.gameName
            )
        )];

    uniqueGames.forEach(game => {

        gameFilter.innerHTML += `
            <option value="${game}">
                ${game}
            </option>
        `;
    });
}

/* =========================
   OPEN FILTERS
========================= */

openFiltersBtn.addEventListener(
    "click",
    () => {

        filterModal.classList.remove(
            "hidden"
        );
    }
);

/* =========================
   APPLY FILTERS
========================= */

applyFilters.addEventListener(
    "click",
    () => {

        renderMatches();

        filterModal.classList.add(
            "hidden"
        );
    }
);

/* =========================
   RESET FILTERS
========================= */

resetFilters.addEventListener(
    "click",
    () => {

        gameFilter.value = "all";

        resultFilter.value = "all";

        sortFilter.value = "newest";

        bestFilter.value = "all";

        renderMatches();

        filterModal.classList.add(
            "hidden"
        );
    }
);

/* =========================
   CLOSE MODAL
========================= */

filterModal.addEventListener(
    "click",
    (e) => {

        if (
            e.target === filterModal
        ) {

            filterModal.classList.add(
                "hidden"
            );
        }
    }
);

/* =========================
   RENDER MATCHES
========================= */

function renderMatches() {

    let matches = [...allMatches];

    /* =========================
       GAME FILTER
    ========================= */

    const selectedGame =
        gameFilter.value;

    if (
        selectedGame !== "all"
    ) {

        matches = matches.filter(
            m =>
                m.gameName === selectedGame
        );
    }

    /* =========================
       RESULT FILTER
    ========================= */

    const result =
        resultFilter.value;

    if (result === "wins") {

        matches = matches.filter(
            m => m.win
        );
    }

    if (result === "losses") {

        matches = matches.filter(
            m => !m.win
        );
    }

    /* =========================
       SORTING + TITLE
    ========================= */

    if (
        bestFilter.value === "best"
    ) {

        timelineTitle.innerText =
            "🏆 Best Matches";

        matches.sort(
            (a, b) =>
                b.score - a.score
        );
    }

    else {

        if (
            sortFilter.value === "newest"
        ) {

            timelineTitle.innerText =
                "📜 Recent Activity";

            matches.sort(
                (a, b) =>
                    new Date(b.playedAt)
                    - new Date(a.playedAt)
            );
        }

        if (
            sortFilter.value === "oldest"
        ) {

            timelineTitle.innerText =
                "📜 Oldest Activity";

            matches.sort(
                (a, b) =>
                    new Date(a.playedAt)
                    - new Date(b.playedAt)
            );
        }
    }

    /* =========================
       EMPTY
    ========================= */

    if (
        matches.length === 0
    ) {

        timeline.innerHTML = `
            <p class="no-results">
                No matches found.
            </p>
        `;

        matchesContainer.innerHTML = "";

        return;
    }

    /* =========================
       STATS
    ========================= */

    const stats =
        calculateStats(matches);

    document.getElementById(
        "total-matches"
    ).innerText =
        stats.totalMatches;

    document.getElementById(
        "win-rate"
    ).innerText =
        stats.winRate + "%";

    document.getElementById(
        "total-kills"
    ).innerText =
        stats.totalKills;

    document.getElementById(
        "avg-score"
    ).innerText =
        stats.avgScore;

    /* =========================
       CLEAR
    ========================= */

    timeline.innerHTML = "";

    matchesContainer.innerHTML = "";

    /* =========================
       ALL MATCHES
    ========================= */

    matches.forEach((match, index) => {

        let topBadge = "";

        if (
            bestFilter.value === "best"
        ) {

            if (index === 0) {

                topBadge =
                    `<div class="best-badge gold">
                        🥇 BEST MATCH
                    </div>`;
            }

            else if (index === 1) {

                topBadge =
                    `<div class="best-badge silver">
                        🥈 SECOND BEST
                    </div>`;
            }

            else if (index === 2) {

                topBadge =
                    `<div class="best-badge bronze">
                        🥉 THIRD BEST
                    </div>`;
            }
        }

        timeline.innerHTML += `

        <div class="timeline-item">

            ${topBadge}

            <div class="match-overview">

                <div class="match-radar">

                    <div class="radar-center">

                        <div class="radar-rank">
                            ${match.win ? "A+" : "B"}
                        </div>

                        <div class="radar-rating">
                            Rating ${Math.round(match.score / 100)}
                        </div>

                    </div>

                </div>

                <div class="match-main">

                    <div class="match-header">

                        <div class="match-game">

                            <h3>
                                ${match.gameName}
                            </h3>

                            <div class="match-subtitle">
                                Competitive Match
                            </div>

                        </div>

                        <div class="match-result ${match.win ? "win" : "loss"}">

                            ${match.win ? "Victory" : "Defeat"}

                        </div>

                    </div>

                    <div class="top-performance">

                        <div class="performance-box">

                            <div class="performance-label">
                                Kills
                            </div>

                            <div class="performance-value green">
                                ${match.kills}
                            </div>

                        </div>

                        <div class="performance-box">

                            <div class="performance-label">
                                Deaths
                            </div>

                            <div class="performance-value red">
                                ${match.deaths}
                            </div>

                        </div>

                        <div class="performance-box">

                            <div class="performance-label">
                                Score
                            </div>

                            <div class="performance-value gold">
                                ${match.score}
                            </div>

                        </div>

                        <div class="performance-box">

                            <div class="performance-label">
                                K/D Ratio
                            </div>

                            <div class="performance-value">

                                ${match.deaths > 0
                                    ? (match.kills / match.deaths).toFixed(2)
                                    : match.kills.toFixed(2)}

                            </div>

                        </div>

                    </div>

                    <div class="match-stats-grid">

                        <div class="match-stat-box">

                            <div class="match-stat-label">
                                Accuracy
                            </div>

                            <div class="match-stat-value">
                                ${Math.floor(Math.random() * 40) + 60}%
                            </div>

                        </div>

                        <div class="match-stat-box">

                            <div class="match-stat-label">
                                Headshots
                            </div>

                            <div class="match-stat-value">
                                ${Math.floor(match.kills / 2)}
                            </div>

                        </div>

                        <div class="match-stat-box">

                            <div class="match-stat-label">
                                MVP
                            </div>

                            <div class="match-stat-value">
                                ${match.score >= 3000 ? "YES" : "NO"}
                            </div>

                        </div>

                        <div class="match-stat-box">

                            <div class="match-stat-label">
                                Win Rate
                            </div>

                            <div class="match-stat-value">
                                ${match.win ? "100%" : "0%"}
                            </div>

                        </div>

                    </div>

                    <div class="match-extra-info">

                        <div class="match-date">

                            ${new Date(
                                match.playedAt
                            ).toLocaleString()}

                        </div>

                        <div class="match-mode">
                            Ranked
                        </div>

                    </div>

                </div>

            </div>

        </div>
        `;
    });
}