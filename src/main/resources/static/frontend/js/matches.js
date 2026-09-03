/* =========================================================
   MATCH HISTORY
   Manual + API/Online matches are stored together
   in game_matches and displayed together here.
========================================================= */


/* =========================
   ELEMENTS
========================= */

const gameTitle =
    document.getElementById(
        "game-title"
    );

const timeline =
    document.getElementById(
        "activity-timeline"
    );

const timelineTitle =
    document.querySelector(
        ".timeline-title"
    );

const gameFilter =
    document.getElementById(
        "game-filter"
    );

const resultFilter =
    document.getElementById(
        "result-filter"
    );

const sortFilter =
    document.getElementById(
        "sort-filter"
    );

const bestFilter =
    document.getElementById(
        "best-filter"
    );

const filterModal =
    document.getElementById(
        "filterModal"
    );

const openFiltersBtn =
    document.getElementById(
        "openFiltersBtn"
    );

const applyFilters =
    document.getElementById(
        "applyFilters"
    );

const resetFilters =
    document.getElementById(
        "resetFilters"
    );


/* =========================
   API
========================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   GLOBAL MATCHES
========================= */

let allMatches = [];


/* =========================================================
   HELPER FUNCTIONS
========================================================= */


/*
 * Converts a value to a safe number.
 */

function safeNumber(value) {

    const number =
        Number(value);

    return Number.isFinite(number)
        ? number
        : 0;
}


/*
 * Safely calculates K/D.
 */

function calculateKD(
    kills,
    deaths
) {

    const safeKills =
        safeNumber(kills);

    const safeDeaths =
        safeNumber(deaths);


    if (safeDeaths > 0) {

        return (
            safeKills /
            safeDeaths
        ).toFixed(2);

    }


    return safeKills.toFixed(2);
}


/*
 * Gets the match source.
 *
 * API / api = ONLINE
 * MANUAL / manual = MANUAL
 *
 * This is intentionally normalized so
 * capitalization or spaces cannot break it.
 */

function getMatchSource(match) {

    const source =
        String(
            match?.source || ""
        )
            .trim()
            .toUpperCase();


    if (source === "API") {

        return "ONLINE";
    }


    return "MANUAL";
}


/*
 * Determines whether a match came
 * from an online connected account.
 */

function isOnlineMatch(match) {

    return getMatchSource(match) === "ONLINE";
}


/*
 * Safely formats date.
 */

function formatMatchDate(
    playedAt
) {

    if (!playedAt) {

        return "Unknown date";
    }


    const date =
        new Date(playedAt);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "Unknown date";
    }


    return date.toLocaleString();
}


/*
 * Calculates a display rating.
 */

function calculateRating(
    score,
    kills,
    win
) {

    const safeScore =
        safeNumber(score);

    const safeKills =
        safeNumber(kills);


    /*
     * If score exists, use score.
     */

    if (safeScore > 0) {

        return Math.round(
            safeScore / 100
        );
    }


    /*
     * Some online games may not
     * provide a score.
     */

    if (safeKills > 0) {

        return Math.min(
            100,
            safeKills * 5 +
            (win ? 20 : 0)
        );
    }


    return 0;
}


/* =========================================================
   CALCULATE STATS
========================================================= */

function calculateStats(
    matches
) {

    const totalMatches =
        matches.length;


    const wins =
        matches.filter(
            match =>
                match.win === true
        ).length;


    const totalKills =
        matches.reduce(
            (sum, match) =>
                sum +
                safeNumber(
                    match.kills
                ),
            0
        );


    const totalScore =
        matches.reduce(
            (sum, match) =>
                sum +
                safeNumber(
                    match.score
                ),
            0
        );


    return {

        totalMatches,

        winRate:
            totalMatches > 0
                ? Math.round(
                    (
                        wins /
                        totalMatches
                    ) * 100
                )
                : 0,

        totalKills,

        avgScore:
            totalMatches > 0
                ? Math.round(
                    totalScore /
                    totalMatches
                )
                : 0

    };
}


/* =========================================================
   INIT
========================================================= */

if (gameTitle) {

    gameTitle.innerText =
        "📜 Match History";
}


loadMatches();


/* =========================================================
   LOAD MATCHES
========================================================= */

async function loadMatches() {

    const token =
        localStorage.getItem(
            "token"
        );


    if (!token) {

        console.error(
            "No authentication token found."
        );


        if (timeline) {

            timeline.innerHTML = `

                <p class="no-results">

                    Please log in to view your matches.

                </p>

            `;
        }

        return;
    }


    try {

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
                `Failed to load matches (${response.status})`
            );
        }


        const data =
            await response.json();


        if (Array.isArray(data)) {

            allMatches =
                data;

        } else {

            allMatches =
                data.content || [];

        }


        console.log(
            "========================================"
        );

        console.log(
            "MATCH HISTORY DATA"
        );

        console.log(
            "Total matches:",
            allMatches.length
        );


        console.log(
            "API matches:",
            allMatches.filter(
                match =>
                    getMatchSource(match) ===
                    "ONLINE"
            ).length
        );


        console.log(
            "Manual matches:",
            allMatches.filter(
                match =>
                    getMatchSource(match) ===
                    "MANUAL"
            ).length
        );


        console.log(
            "Full match data:",
            allMatches
        );


        /*
         * Print every source individually.
         *
         * This is useful for debugging.
         */

        allMatches.forEach(
            (match, index) => {

                console.log(
                    `Match ${index + 1}:`,
                    {
                        game:
                            match.gameName,

                        source:
                            match.source,

                        connectedAccount:
                            match.connectedAccount,

                        detectedSource:
                            getMatchSource(match)
                    }
                );

            }
        );


        console.log(
            "========================================"
        );


        loadGameOptions();

        renderMatches();


    } catch (error) {

        console.error(
            "Error loading matches:",
            error
        );


        if (timeline) {

            timeline.innerHTML = `

                <p class="no-results">

                    Failed to load matches.

                </p>

            `;
        }
    }
}


/* =========================================================
   LOAD GAME OPTIONS
========================================================= */

function loadGameOptions() {

    if (!gameFilter) {

        return;
    }


    const uniqueGames = [
        ...new Set(
            allMatches
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


    gameFilter.innerHTML = `

        <option value="all">
            All Games
        </option>

    `;


    uniqueGames.forEach(game => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            game;


        option.textContent =
            game;


        gameFilter.appendChild(
            option
        );

    });
}


/* =========================================================
   OPEN FILTERS
========================================================= */

if (openFiltersBtn) {

    openFiltersBtn.addEventListener(
        "click",
        () => {

            if (filterModal) {

                filterModal.classList.remove(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   APPLY FILTERS
========================================================= */

if (applyFilters) {

    applyFilters.addEventListener(
        "click",
        () => {

            renderMatches();


            if (filterModal) {

                filterModal.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   RESET FILTERS
========================================================= */

if (resetFilters) {

    resetFilters.addEventListener(
        "click",
        () => {

            if (gameFilter) {

                gameFilter.value =
                    "all";

            }


            if (resultFilter) {

                resultFilter.value =
                    "all";

            }


            if (sortFilter) {

                sortFilter.value =
                    "newest";

            }


            if (bestFilter) {

                bestFilter.value =
                    "all";

            }


            renderMatches();


            if (filterModal) {

                filterModal.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   CLOSE MODAL
========================================================= */

if (filterModal) {

    filterModal.addEventListener(
        "click",
        event => {

            if (
                event.target ===
                filterModal
            ) {

                filterModal.classList.add(
                    "hidden"
                );

            }

        }
    );

}


/* =========================================================
   RENDER MATCHES
========================================================= */

function renderMatches() {

    let matches =
        [...allMatches];


    /* =====================================================
       GAME FILTER
    ===================================================== */

    const selectedGame =
        gameFilter
            ? gameFilter.value
            : "all";


    if (
        selectedGame !== "all"
    ) {

        matches =
            matches.filter(
                match =>
                    match.gameName ===
                    selectedGame
            );
    }


    /* =====================================================
       RESULT FILTER
    ===================================================== */

    const result =
        resultFilter
            ? resultFilter.value
            : "all";


    if (
        result === "wins"
    ) {

        matches =
            matches.filter(
                match =>
                    match.win === true
            );
    }


    if (
        result === "losses"
    ) {

        matches =
            matches.filter(
                match =>
                    match.win !== true
            );
    }


    /* =====================================================
       BEST MATCH FILTER
    ===================================================== */

    const bestMode =
        bestFilter
            ? bestFilter.value
            : "all";


    if (
        bestMode === "best"
    ) {

        if (timelineTitle) {

            timelineTitle.innerText =
                "🏆 Best Matches";

        }


        matches.sort(
            (a, b) =>
                safeNumber(
                    b.score
                ) -
                safeNumber(
                    a.score
                )
        );

    } else {

        const sortMode =
            sortFilter
                ? sortFilter.value
                : "newest";


        if (
            sortMode ===
            "newest"
        ) {

            if (timelineTitle) {

                timelineTitle.innerText =
                    "📜 Recent Activity";

            }


            matches.sort(
                (a, b) =>
                    new Date(
                        b.playedAt || 0
                    ) -
                    new Date(
                        a.playedAt || 0
                    )
            );

        }


        if (
            sortMode ===
            "oldest"
        ) {

            if (timelineTitle) {

                timelineTitle.innerText =
                    "📜 Oldest Activity";

            }


            matches.sort(
                (a, b) =>
                    new Date(
                        a.playedAt || 0
                    ) -
                    new Date(
                        b.playedAt || 0
                    )
            );

        }

    }


    /* =====================================================
       EMPTY
    ===================================================== */

    if (
        matches.length === 0
    ) {

        if (timeline) {

            timeline.innerHTML = `

                <p class="no-results">

                    No matches found.

                </p>

            `;
        }


        updateStats([]);


        return;
    }


    /* =====================================================
       STATS
    ===================================================== */

    updateStats(
        matches
    );


    /* =====================================================
       CLEAR OLD CONTENT
    ===================================================== */

    if (timeline) {

        timeline.innerHTML =
            "";

    }


    /* =====================================================
       RENDER EVERY MATCH
    ===================================================== */

    matches.forEach(
        (match, index) => {

            renderMatch(
                match,
                index,
                matches
            );

        }
    );
}


/* =========================================================
   UPDATE STATISTICS
========================================================= */

function updateStats(
    matches
) {

    const stats =
        calculateStats(
            matches
        );


    const totalMatchesElement =
        document.getElementById(
            "total-matches"
        );


    const winRateElement =
        document.getElementById(
            "win-rate"
        );


    const totalKillsElement =
        document.getElementById(
            "total-kills"
        );


    const avgScoreElement =
        document.getElementById(
            "avg-score"
        );


    if (
        totalMatchesElement
    ) {

        totalMatchesElement.innerText =
            stats.totalMatches;

    }


    if (
        winRateElement
    ) {

        winRateElement.innerText =
            stats.winRate + "%";

    }


    if (
        totalKillsElement
    ) {

        totalKillsElement.innerText =
            stats.totalKills;

    }


    if (
        avgScoreElement
    ) {

        avgScoreElement.innerText =
            stats.avgScore;

    }
}


/* =========================================================
   RENDER SINGLE MATCH
========================================================= */

function renderMatch(
    match,
    index,
    visibleMatches
) {

    const kills =
        safeNumber(
            match.kills
        );


    const deaths =
        safeNumber(
            match.deaths
        );


    const score =
        safeNumber(
            match.score
        );


    const kd =
        calculateKD(
            kills,
            deaths
        );


    const rating =
        calculateRating(
            score,
            kills,
            match.win
        );


    /*
     * Determine source.
     */

    const source =
        getMatchSource(
            match
        );


    const isOnline =
        source === "ONLINE";


    /*
     * Connected account.
     */

    const connectedAccount =
        match.connectedAccount
            ? String(
                match.connectedAccount
            )
            : "";


    /* =====================================================
       BEST MATCH BADGE
    ===================================================== */

    let topBadge = "";


    if (
        bestFilter &&
        bestFilter.value ===
            "best"
    ) {

        if (
            index === 0
        ) {

            topBadge = `

                <div class="best-badge gold">

                    🥇 BEST MATCH

                </div>

            `;

        } else if (
            index === 1
        ) {

            topBadge = `

                <div class="best-badge silver">

                    🥈 SECOND BEST

                </div>

            `;

        } else if (
            index === 2
        ) {

            topBadge = `

                <div class="best-badge bronze">

                    🥉 THIRD BEST

                </div>

            `;

        }

    }


    /* =====================================================
       SOURCE BADGE
    ===================================================== */

    const sourceBadge = `

        <span class="match-source-badge ${
            isOnline
                ? "online"
                : "manual"
        }">

            ${
                isOnline
                    ? "🌐 ONLINE"
                    : "✍️ MANUAL"
            }

        </span>

    `;


    /*
     * Show connected account only
     * for online matches.
     */

    const accountBadge =
        isOnline &&
        connectedAccount
            ? `

                <span class="connected-account">

                    🎮 ${escapeHtml(
                        connectedAccount
                    )}

                </span>

              `
            : "";


    /* =====================================================
       EXTRA GAME-SPECIFIC VALUES
    ===================================================== */

    const assists =
        safeNumber(
            match.assists
        );


    const headshots =
        safeNumber(
            match.headshots
        );


    const damage =
        safeNumber(
            match.damage
        );


    const combatScore =
        safeNumber(
            match.combatScore
        );


    const cs =
        safeNumber(
            match.cs
        );


    const gold =
        safeNumber(
            match.gold
        );


    let secondaryLabel =
        "Assists";

    let secondaryValue =
        assists;


    if (
        match.gameName ===
        "PUBG"
    ) {

        secondaryLabel =
            "Damage";

        secondaryValue =
            damage;

    } else if (
        match.gameName ===
        "CS2"
    ) {

        secondaryLabel =
            "Headshots";

        secondaryValue =
            headshots;

    } else if (
        match.gameName ===
        "Valorant"
    ) {

        secondaryLabel =
            "Combat Score";

        secondaryValue =
            combatScore;

    } else if (
        match.gameName ===
        "League of Legends"
    ) {

        secondaryLabel =
            "CS";

        secondaryValue =
            cs;

    }


    /* =====================================================
       MVP
    ===================================================== */

    const isMVP =
        score >= 3000 ||
        kills >= 20 ||
        (
            match.win === true &&
            kills >= 10
        );


    /* =====================================================
       MATCH HTML
    ===================================================== */

    const matchHTML = `

        <div class="timeline-item">

            ${topBadge}


            <div class="match-overview">


                <!-- RADAR -->

                <div class="match-radar">

                    <div class="radar-center">

                        <div class="radar-rank">

                            ${
                                match.win === true
                                    ? "A+"
                                    : "B"
                            }

                        </div>


                        <div class="radar-rating">

                            Rating ${rating}

                        </div>

                    </div>

                </div>


                <!-- MAIN MATCH -->

                <div class="match-main">


                    <!-- HEADER -->

                    <div class="match-header">


                        <div class="match-game">

                            <h3>

                                ${
                                    escapeHtml(
                                        match.gameName ||
                                        "Unknown Game"
                                    )
                                }

                            </h3>


                            <div class="match-subtitle">

                                Competitive Match

                                ${sourceBadge}

                                ${accountBadge}

                            </div>

                        </div>


                        <div class="match-result ${
                            match.win === true
                                ? "win"
                                : "loss"
                        }">

                            ${
                                match.win === true
                                    ? "Victory"
                                    : "Defeat"
                            }

                        </div>

                    </div>


                    <!-- PERFORMANCE -->

                    <div class="top-performance">


                        <div class="performance-box">

                            <div class="performance-label">

                                Kills

                            </div>


                            <div class="performance-value green">

                                ${kills}

                            </div>

                        </div>


                        <div class="performance-box">

                            <div class="performance-label">

                                Deaths

                            </div>


                            <div class="performance-value red">

                                ${deaths}

                            </div>

                        </div>


                        <div class="performance-box">

                            <div class="performance-label">

                                Score

                            </div>


                            <div class="performance-value gold">

                                ${score}

                            </div>

                        </div>


                        <div class="performance-box">

                            <div class="performance-label">

                                K/D Ratio

                            </div>


                            <div class="performance-value">

                                ${kd}

                            </div>

                        </div>


                    </div>


                    <!-- GAME STATS -->

                    <div class="match-stats-grid">


                        <div class="match-stat-box">

                            <div class="match-stat-label">

                                ${secondaryLabel}

                            </div>


                            <div class="match-stat-value">

                                ${secondaryValue}

                            </div>

                        </div>


                        <div class="match-stat-box">

                            <div class="match-stat-label">

                                Headshots

                            </div>


                            <div class="match-stat-value">

                                ${headshots}

                            </div>

                        </div>


                        <div class="match-stat-box">

                            <div class="match-stat-label">

                                MVP

                            </div>


                            <div class="match-stat-value">

                                ${
                                    isMVP
                                        ? "YES"
                                        : "NO"
                                }

                            </div>

                        </div>


                        <div class="match-stat-box">

                            <div class="match-stat-label">

                                Result

                            </div>


                            <div class="match-stat-value">

                                ${
                                    match.win === true
                                        ? "WIN"
                                        : "LOSS"
                                }

                            </div>

                        </div>


                    </div>


                    <!-- EXTRA INFO -->

                    <div class="match-extra-info">


                        <div class="match-date">

                            ${formatMatchDate(
                                match.playedAt
                            )}

                        </div>


                        <div class="match-mode">

                            ${
                                isOnline
                                    ? "Online"
                                    : "Ranked"
                            }

                        </div>

                    </div>

                </div>

            </div>

        </div>

    `;


    /*
     * Add ONLY to timeline.
     *
     * This prevents duplicate cards.
     */

    if (timeline) {

        timeline.innerHTML +=
            matchHTML;

    }
}


/* =========================================================
   HTML ESCAPE
========================================================= */

function escapeHtml(
    value
) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );
}