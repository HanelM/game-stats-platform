/* =========================
   URL / USER
========================= */

const params =
    new URLSearchParams(
        window.location.search
    );

const selectedUsername =
    params.get("username");

const token =
    localStorage.getItem("token");


/* =========================
   ELEMENTS
========================= */

const analyticsGameSelect =
    document.getElementById(
        "analyticsGameSelect"
    );


/* =========================
   API
========================= */

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================
   GLOBAL VARIABLES
========================= */

let matches = [];

let analyticsChart = null;


/* =========================
   LOAD ANALYTICS
========================= */

async function loadAnalytics() {

    try {

        /* =========================
           ANALYTICS URL
        ========================= */

        const analyticsUrl =
            selectedUsername
                ? `${API_URL}/api/matches/analytics/user/${encodeURIComponent(selectedUsername)}`
                : `${API_URL}/api/matches/analytics`;


        /* =========================
           MATCHES URL

           OWN PROFILE:
           /all = ALL manual + API matches

           OTHER PROFILE:
           /user/{username}
        ========================= */

        const matchesUrl =
            selectedUsername
                ? `${API_URL}/api/matches/user/${encodeURIComponent(selectedUsername)}`
                : `${API_URL}/api/matches/all`;


        /* =========================
           LOAD ANALYTICS DATA
        ========================= */

        const analyticsResponse =
            await fetch(
                analyticsUrl,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!analyticsResponse.ok) {

            throw new Error(
                "Failed to load analytics data"
            );
        }


        const analyticsData =
            await analyticsResponse.json();


        console.log(
            "Analytics data:",
            analyticsData
        );


        /* =========================
           LOAD ALL MATCHES
        ========================= */

        const matchesResponse =
            await fetch(
                matchesUrl,
                {
                    headers: {
                        "Authorization":
                            "Bearer " + token
                    }
                }
            );


        if (!matchesResponse.ok) {

            throw new Error(
                "Failed to load matches"
            );
        }


        const matchesData =
            await matchesResponse.json();


        /* =========================
           HANDLE RESPONSE
        ========================= */

        if (Array.isArray(matchesData)) {

            matches =
                matchesData;

        } else {

            matches =
                matchesData.content || [];
        }


        /* =========================
           SAFETY
        ========================= */

        if (!Array.isArray(matches)) {

            matches = [];
        }


        console.log(
            "Loaded matches:",
            matches.length
        );


        /* =========================
           SHOW SOURCE INFORMATION
        ========================= */

        console.log(
            "Manual matches:",
            matches.filter(
                m => m.source === "MANUAL"
            ).length
        );

        console.log(
            "API matches:",
            matches.filter(
                m => m.source === "API"
            ).length
        );


        /* =========================
           LOAD GAME SELECTOR
        ========================= */

        loadGames();


        /* =========================
           RENDER
        ========================= */

        renderAnalytics();

    }
    catch (error) {

        console.error(
            "Analytics error:",
            error
        );
    }
}


/* =========================
   LOAD GAMES
========================= */

function loadGames() {

    const uniqueGames =
        [
            ...new Set(
                matches
                    .map(
                        m => m.gameName
                    )
                    .filter(
                        game => game
                    )
            )
        ];


    /* =========================
       CLEAR SELECT
    ========================= */

    analyticsGameSelect.innerHTML =
        `
            <option value="all">
                All Games
            </option>
        `;


    /* =========================
       ADD GAMES
    ========================= */

    uniqueGames.forEach(
        game => {

            analyticsGameSelect.innerHTML +=
                `
                    <option value="${game}">
                        ${game}
                    </option>
                `;
        }
    );
}


/* =========================
   RENDER ANALYTICS
========================= */

function renderAnalytics() {

    /* =========================
       SELECTED GAME
    ========================= */

    const selectedGame =
        analyticsGameSelect.value;


    /* =========================
       FILTER MATCHES
    ========================= */

    let filteredMatches =
        [...matches];


    if (
        selectedGame &&
        selectedGame !== "all"
    ) {

        filteredMatches =
            filteredMatches.filter(
                match =>
                    match.gameName ===
                    selectedGame
            );
    }


    /* =========================
       VARIABLES
    ========================= */

    let totalKills = 0;

    let totalDeaths = 0;

    let totalWins = 0;

    let totalScore = 0;

    let bestKillMatch = 0;

    let highestKD = 0;


    /* =========================
       CALCULATE STATS
    ========================= */

    filteredMatches.forEach(
        match => {

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


            totalKills +=
                kills;

            totalDeaths +=
                deaths;

            totalScore +=
                score;


            if (
                match.win === true
            ) {

                totalWins++;
            }


            if (
                kills >
                bestKillMatch
            ) {

                bestKillMatch =
                    kills;
            }


            const kd =
                deaths > 0
                    ? kills / deaths
                    : kills;


            if (
                kd >
                highestKD
            ) {

                highestKD =
                    kd;
            }
        }
    );


    /* =========================
       TOTAL MATCHES
    ========================= */

    const totalMatches =
        filteredMatches.length;


    /* =========================
       LOSSES
    ========================= */

    const totalLosses =
        totalMatches -
        totalWins;


    /* =========================
       WIN RATE
    ========================= */

    const winRate =
        totalMatches > 0
            ? (
                (totalWins /
                    totalMatches) *
                100
            ).toFixed(1)
            : "0.0";


    /* =========================
       AVERAGE KD
    ========================= */

    const averageKD =
        totalDeaths > 0
            ? (
                totalKills /
                totalDeaths
            ).toFixed(2)
            : totalKills.toFixed(2);


    /* =========================
       AVERAGE SCORE
    ========================= */

    const averageScore =
        totalMatches > 0
            ? Math.round(
                totalScore /
                totalMatches
            )
            : 0;


    /* =========================
       UI UPDATE
    ========================= */

    const bestKillElement =
        document.getElementById(
            "bestKillMatch"
        );

    const totalWinsElement =
        document.getElementById(
            "totalWins"
        );

    const highestKDElement =
        document.getElementById(
            "highestKD"
        );

    const totalLossesElement =
        document.getElementById(
            "totalLosses"
        );

    const totalMatchesElement =
        document.getElementById(
            "totalMatches"
        );

    const totalKillsElement =
        document.getElementById(
            "totalKills"
        );

    const totalDeathsElement =
        document.getElementById(
            "totalDeaths"
        );

    const winRateElement =
        document.getElementById(
            "winRate"
        );

    const averageKDElement =
        document.getElementById(
            "averageKD"
        );

    const averageScoreElement =
        document.getElementById(
            "averageScore"
        );


    if (bestKillElement)
        bestKillElement.innerText =
            bestKillMatch;


    if (totalWinsElement)
        totalWinsElement.innerText =
            totalWins;


    if (highestKDElement)
        highestKDElement.innerText =
            highestKD.toFixed(2);


    if (totalLossesElement)
        totalLossesElement.innerText =
            totalLosses;


    if (totalMatchesElement)
        totalMatchesElement.innerText =
            totalMatches;


    if (totalKillsElement)
        totalKillsElement.innerText =
            totalKills;


    if (totalDeathsElement)
        totalDeathsElement.innerText =
            totalDeaths;


    if (winRateElement)
        winRateElement.innerText =
            winRate + "%";


    if (averageKDElement)
        averageKDElement.innerText =
            averageKD;


    if (averageScoreElement)
        averageScoreElement.innerText =
            averageScore;


    /* =========================
       CHART DATA
    ========================= */

    const labels =
        filteredMatches.map(
            (_, index) =>
                "Match " +
                (index + 1)
        );


    const killsData =
        filteredMatches.map(
            match =>
                Number(
                    match.kills || 0
                )
        );


    const kdData =
        filteredMatches.map(
            match => {

                const kills =
                    Number(
                        match.kills || 0
                    );

                const deaths =
                    Number(
                        match.deaths || 0
                    );

                return deaths > 0
                    ? Number(
                        (
                            kills /
                            deaths
                        ).toFixed(2)
                    )
                    : kills;
            }
        );


    const scoreData =
        filteredMatches.map(
            match =>
                Number(
                    match.score || 0
                )
        );


    const winRateData =
        filteredMatches.map(
            match =>
                match.win
                    ? 100
                    : 0
        );


    const lossRateData =
        filteredMatches.map(
            match =>
                match.win
                    ? 0
                    : 100
        );


    /* =========================
       DESTROY OLD CHART
    ========================= */

    if (analyticsChart) {

        analyticsChart.destroy();

        analyticsChart = null;
    }


    /* =========================
       CREATE CHART
    ========================= */

    const chartElement =
        document.getElementById(
            "analyticsChart"
        );


    if (
        !chartElement
    ) {

        console.error(
            "analyticsChart element not found"
        );

        return;
    }


    analyticsChart =
        new Chart(
            chartElement,
            {

                type: "line",

                data: {

                    labels: labels,

                    datasets: [

                        {
                            label:
                                "Kills",

                            data:
                                killsData,

                            borderColor:
                                "#00ff88",

                            backgroundColor:
                                "#00ff8820",

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                true
                        },


                        {
                            label:
                                "Win Rate",

                            data:
                                winRateData,

                            borderColor:
                                "#ffd000",

                            backgroundColor:
                                "#ffd00020",

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                false
                        },


                        {
                            label:
                                "Loss Rate",

                            data:
                                lossRateData,

                            borderColor:
                                "#ff3b3b",

                            backgroundColor:
                                "#ff3b3b20",

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                false
                        },


                        {
                            label:
                                "KD Ratio",

                            data:
                                kdData,

                            borderColor:
                                "#00bfff",

                            backgroundColor:
                                "#00bfff20",

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                false
                        },


                        {
                            label:
                                "Score",

                            data:
                                scoreData,

                            borderColor:
                                "#ffe066",

                            backgroundColor:
                                "#ffe06620",

                            borderWidth:
                                3,

                            tension:
                                0.4,

                            fill:
                                false
                        }

                    ]
                },


                options: {

                    responsive:
                        true,

                    maintainAspectRatio:
                        false,

                    interaction: {

                        mode:
                            "index",

                        intersect:
                            false
                    },


                    plugins: {

                        legend: {

                            labels: {

                                color:
                                    "white"
                            }
                        }
                    },


                    scales: {

                        x: {

                            ticks: {

                                color:
                                    "#cbd5e1"
                            }
                        },


                        y: {

                            beginAtZero:
                                true,

                            ticks: {

                                color:
                                    "#cbd5e1"
                            }
                        }
                    }
                }
            }
        );


    /* =========================
       GAME COMPARISON
    ========================= */

    renderComparison();


    /* =========================
       AI INSIGHTS
    ========================= */

    renderInsights(
        Number(averageKD),
        Number(winRate),
        totalKills
    );
}


/* =========================
   GAME COMPARISON
========================= */

function renderComparison() {

    const comparisonGrid =
        document.getElementById(
            "comparisonGrid"
        );


    if (
        !comparisonGrid
    ) {

        return;
    }


    comparisonGrid.innerHTML =
        "";


    /* =========================
       UNIQUE GAMES
    ========================= */

    const games =
        [
            ...new Set(
                matches
                    .map(
                        m => m.gameName
                    )
                    .filter(
                        game => game
                    )
            )
        ];


    /* =========================
       NO GAMES
    ========================= */

    if (
        games.length === 0
    ) {

        comparisonGrid.innerHTML =
            `
                <div class="game-card">

                    <h3>
                        No Games
                    </h3>

                    <p>
                        No matches available.
                    </p>

                </div>
            `;

        return;
    }


    /* =========================
       GAME CARDS
    ========================= */

    games.forEach(
        game => {

            const gameMatches =
                matches.filter(
                    match =>
                        match.gameName ===
                        game
                );


            let kills = 0;

            let wins = 0;

            let totalScore = 0;


            gameMatches.forEach(
                match => {

                    kills +=
                        Number(
                            match.kills || 0
                        );

                    totalScore +=
                        Number(
                            match.score || 0
                        );


                    if (
                        match.win === true
                    ) {

                        wins++;
                    }
                }
            );


            const averageScore =
                gameMatches.length > 0
                    ? Math.round(
                        totalScore /
                        gameMatches.length
                    )
                    : 0;


            const winRate =
                gameMatches.length > 0
                    ? (
                        (wins /
                            gameMatches.length) *
                        100
                    ).toFixed(1)
                    : "0.0";


            comparisonGrid.innerHTML +=
                `

                    <div class="game-card">

                        <h3>
                            ${game}
                        </h3>

                        <p>
                            Matches:
                            ${gameMatches.length}
                        </p>

                        <p>
                            Kills:
                            ${kills}
                        </p>

                        <p>
                            Wins:
                            ${wins}
                        </p>

                        <p>
                            Win Rate:
                            ${winRate}%
                        </p>

                        <p>
                            Avg Score:
                            ${averageScore}
                        </p>

                    </div>

                `;
        }
    );
}


/* =========================
   AI INSIGHTS
========================= */

function renderInsights(
    kd,
    winRate,
    kills
) {

    const insightsGrid =
        document.getElementById(
            "insightsGrid"
        );


    if (
        !insightsGrid
    ) {

        return;
    }


    insightsGrid.innerHTML =
        "";


    let insights = [];


    /* =========================
       EXCELLENT KD
    ========================= */

    if (
        kd >= 2
    ) {

        insights.push({

            title:
                "Excellent KD Ratio",

            text:
                "Your KD ratio is significantly above average and indicates strong mechanical consistency."
        });
    }


    /* =========================
       STRONG WIN RATE
    ========================= */

    if (
        winRate >= 60
    ) {

        insights.push({

            title:
                "Strong Win Rate",

            text:
                "You consistently secure victories and maintain high match impact."
        });
    }


    /* =========================
       AGGRESSIVE PLAYSTYLE
    ========================= */

    if (
        kills >= 100
    ) {

        insights.push({

            title:
                "Aggressive Playstyle",

            text:
                "Your gameplay shows high combat activity and offensive positioning."
        });
    }


    /* =========================
       API MATCHES
    ========================= */

    const apiMatches =
        matches.filter(
            match =>
                match.source ===
                "API"
        ).length;


    if (
        apiMatches > 0
    ) {

        insights.push({

            title:
                "Connected Games",

            text:
                `${apiMatches} online API matches are included in your analytics.`
        });
    }


    /* =========================
       NO INSIGHTS
    ========================= */

    if (
        insights.length === 0
    ) {

        insights.push({

            title:
                "Keep Grinding",

            text:
                "Play more matches to unlock advanced analytics and deeper AI insights."
        });
    }


    /* =========================
       RENDER
    ========================= */

    insights.forEach(
        insight => {

            insightsGrid.innerHTML +=
                `

                    <div class="insight-card">

                        <h3>
                            ${insight.title}
                        </h3>

                        <p>
                            ${insight.text}
                        </p>

                    </div>

                `;
        }
    );
}


/* =========================
   GAME SELECT EVENT
========================= */

analyticsGameSelect.addEventListener(
    "change",
    renderAnalytics
);


/* =========================
   START
========================= */

loadAnalytics();