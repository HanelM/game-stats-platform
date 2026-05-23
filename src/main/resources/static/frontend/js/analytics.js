const params =
    new URLSearchParams(
        window.location.search
    );

const selectedUsername =
    params.get("username");

const token =
    localStorage.getItem("token");

const analyticsGameSelect =
    document.getElementById("analyticsGameSelect");

let matches = [];
let analyticsChart = null;

/* =========================
   LOAD ANALYTICS
========================= */

async function loadAnalytics(){

    try{

        const analyticsUrl = selectedUsername
            ? `http://localhost:8080/api/matches/analytics/user/${selectedUsername}`
            : `http://localhost:8080/api/matches/analytics`;

        const matchesUrl = selectedUsername
            ? `http://localhost:8080/api/matches/user/${selectedUsername}`
            : `http://localhost:8080/api/matches/my`;

        /* =========================
           LOAD ANALYTICS DATA
        ========================= */

        const analyticsResponse =
            await fetch(analyticsUrl, {
                headers:{
                    Authorization: "Bearer " + token
                }
            });

        const analyticsData =
            await analyticsResponse.json();

        /* =========================
           LOAD MATCHES
        ========================= */

        const matchesResponse =
            await fetch(matchesUrl, {
                headers:{
                    Authorization: "Bearer " + token
                }
            });

        const matchesData =
            await matchesResponse.json();

        matches = Array.isArray(matchesData)
            ? matchesData
            : (matchesData.content || []);

        loadGames();
        renderAnalytics();

    }catch(error){

        console.log("Analytics error:", error);
    }
}

/* =========================
   LOAD GAMES
========================= */

function loadGames(){

    const uniqueGames =
        [...new Set(matches.map(m => m.gameName))];

    analyticsGameSelect.innerHTML =
        `<option value="all">All Games</option>`;

    uniqueGames.forEach(game => {

        analyticsGameSelect.innerHTML += `
            <option value="${game}">
                ${game}
            </option>
        `;
    });
}

/* =========================
   RENDER ANALYTICS
========================= */

function renderAnalytics(){

    const selectedGame =
        analyticsGameSelect.value;

    let filteredMatches = matches;

    if(selectedGame !== "all"){

        filteredMatches =
            matches.filter(m => m.gameName === selectedGame);
    }

    let totalKills = 0;
    let totalDeaths = 0;
    let totalWins = 0;
    let totalScore = 0;

    let bestKillMatch = 0;
    let highestKD = 0;

    filteredMatches.forEach(match => {

        totalKills += match.kills || 0;
        totalDeaths += match.deaths || 0;
        totalScore += match.score || 0;

        if(match.win) totalWins++;

        if(match.kills > bestKillMatch)
            bestKillMatch = match.kills;

        const kd =
            match.deaths > 0
                ? match.kills / match.deaths
                : match.kills;

        if(kd > highestKD)
            highestKD = kd;
    });

    const totalMatches = filteredMatches.length;

    const totalLosses = totalMatches - totalWins;

    const winRate =
        totalMatches > 0
            ? ((totalWins / totalMatches) * 100).toFixed(1)
            : 0;

    const averageKD =
        totalDeaths > 0
            ? (totalKills / totalDeaths).toFixed(2)
            : totalKills;

    const averageScore =
        totalMatches > 0
            ? Math.round(totalScore / totalMatches)
            : 0;

    /* =========================
       UI UPDATE
    ========================= */

    document.getElementById("bestKillMatch").innerText = bestKillMatch;
    document.getElementById("totalWins").innerText = totalWins;
    document.getElementById("highestKD").innerText = highestKD.toFixed(2);
    document.getElementById("totalLosses").innerText = totalLosses;

    document.getElementById("totalMatches").innerText = totalMatches;
    document.getElementById("totalKills").innerText = totalKills;
    document.getElementById("totalDeaths").innerText = totalDeaths;
    document.getElementById("winRate").innerText = winRate + "%";
    document.getElementById("averageKD").innerText = averageKD;
    document.getElementById("averageScore").innerText = averageScore;

    /* =========================
       CHART DATA
    ========================= */

    const labels =
        filteredMatches.map((_, i) => "Match " + (i + 1));

    const killsData =
        filteredMatches.map(m => m.kills);

    const kdData =
        filteredMatches.map(m =>
            m.deaths > 0 ? m.kills / m.deaths : m.kills
        );

    const scoreData =
        filteredMatches.map(m => m.score);

    const winRateData =
        filteredMatches.map(m => m.win ? 100 : 0);

    const lossRateData =
        filteredMatches.map(m => m.win ? 0 : 100);

    if(analyticsChart)
        analyticsChart.destroy();

    analyticsChart =
        new Chart(
            document.getElementById("analyticsChart"),
            {
                type:"line",
                data:{
                    labels,
                    datasets:[
                        {
                            label:"Kills",
                            data:killsData,
                            borderColor:"#00ff88",
                            backgroundColor:"#00ff8820",
                            borderWidth:3,
                            tension:0.4,
                            fill:true
                        },
                        {
                            label:"Win Rate",
                            data:winRateData,
                            borderColor:"#ffd000",
                            backgroundColor:"#ffd00020",
                            borderWidth:3,
                            tension:0.4,
                            fill:false
                        },
                        {
                            label:"Loss Rate",
                            data:lossRateData,
                            borderColor:"#ff3b3b",
                            backgroundColor:"#ff3b3b20",
                            borderWidth:3,
                            tension:0.4,
                            fill:false
                        },
                        {
                            label:"KD Ratio",
                            data:kdData,
                            borderColor:"#00bfff",
                            backgroundColor:"#00bfff20",
                            borderWidth:3,
                            tension:0.4,
                            fill:false
                        },
                        {
                            label:"Score",
                            data:scoreData,
                            borderColor:"#ffe066",
                            backgroundColor:"#ffe06620",
                            borderWidth:3,
                            tension:0.4,
                            fill:false
                        }
                    ]
                },
                options:{
                    responsive:true,
                    maintainAspectRatio:false,
                    interaction:{
                        mode:"index",
                        intersect:false
                    },
                    plugins:{
                        legend:{
                            labels:{
                                color:"white"
                            }
                        }
                    },
                    scales:{
                        x:{
                            ticks:{ color:"#cbd5e1" }
                        },
                        y:{
                            beginAtZero:true,
                            ticks:{ color:"#cbd5e1" }
                        }
                    }
                }
            }
        );
        renderComparison();

        renderInsights(
            averageKD,
            winRate,
            totalKills
        );
}
/* =========================
   GAME COMPARISON
========================= */

function renderComparison(){

    const comparisonGrid =
        document.getElementById(
            "comparisonGrid"
        );

    comparisonGrid.innerHTML = "";

    const games = [

        ...new Set(
            matches.map(
                m => m.gameName
            )
        )
    ];

    games.forEach(game => {

        const gameMatches =
            matches.filter(
                m => m.gameName === game
            );

        let kills = 0;
        let wins = 0;
        let totalScore = 0;

        gameMatches.forEach(m => {

            kills += m.kills;

            totalScore += m.score;

            if(m.win){

                wins++;
            }
        });

        const averageScore =
            gameMatches.length > 0

                ? Math.round(
                    totalScore /
                    gameMatches.length
                )

                : 0;

        comparisonGrid.innerHTML += `

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
                    Avg Score:
                    ${averageScore}
                </p>

            </div>

        `;
    });
}

/* =========================
   AI INSIGHTS
========================= */

function renderInsights(
    kd,
    winRate,
    kills
){

    const insightsGrid =
        document.getElementById(
            "insightsGrid"
        );

    insightsGrid.innerHTML = "";

    let insights = [];

    if(kd >= 2){

        insights.push({

            title:"Excellent KD Ratio",

            text:
                "Your KD ratio is significantly above average and indicates strong mechanical consistency."
        });
    }

    if(winRate >= 60){

        insights.push({

            title:"Strong Win Rate",

            text:
                "You consistently secure victories and maintain high match impact."
        });
    }

    if(kills >= 100){

        insights.push({

            title:"Aggressive Playstyle",

            text:
                "Your gameplay shows high combat activity and offensive positioning."
        });
    }

    if(insights.length === 0){

        insights.push({

            title:"Keep Grinding",

            text:
                "Play more matches to unlock advanced analytics and deeper AI insights."
        });
    }

    insights.forEach(insight => {

        insightsGrid.innerHTML += `

            <div class="insight-card">

                <h3>
                    ${insight.title}
                </h3>

                <p>
                    ${insight.text}
                </p>

            </div>

        `;
    });
}
/* =========================
   EVENTS
========================= */

analyticsGameSelect.addEventListener(
    "change",
    renderAnalytics
);

/* =========================
   START
========================= */

loadAnalytics();