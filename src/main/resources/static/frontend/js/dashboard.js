const params =
    new URLSearchParams(
        window.location.search
    );

const selectedUsername =
    params.get("username");

const viewingOwnProfile =
    !selectedUsername;

const token =
    localStorage.getItem("token");

const chartGameSelect =
    document.getElementById(
        "chartGameSelect"
    );

const pubgStats =
    JSON.parse(
        localStorage.getItem(
            "pubgStats"
        )
    );


const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


let matches = [];

let mainChart = null;
let kdChart = null;
let winRateChart = null;
let scoreChart = null;

/* =========================
   LOAD DASHBOARD
========================= */

async function loadDashboard(){

    let url;

    if(selectedUsername){

        url =
            `${API_URL}/api/matches/user/${selectedUsername}`;

    } else {

        url =
            `${API_URL}/api/matches/my`;
    }

    try{

        const response =
            await fetch(url, {
                headers:{
                    Authorization:
                        "Bearer " + token
                }
            });

        const data =
            await response.json();

        matches =
            Array.isArray(data)
                ? data
                : (data.content || []);

        loadGameFilter();
        renderDashboard();

    }catch(error){

        console.log(
            "Dashboard error:",
            error
        );
    }
}

/* =========================
   GAME FILTER
========================= */

function loadGameFilter(){

    const uniqueGames = [
        ...new Set(
            matches.map(
                m => m.gameName
            )
        )
    ];

    if(pubgStats){

        uniqueGames.push("PUBG");
    }

    chartGameSelect.innerHTML =
        `<option value="all">All Games</option>`;

    [...new Set(uniqueGames)]
        .forEach(game => {

            chartGameSelect.innerHTML += `

                <option value="${game}">
                    ${game}
                </option>

            `;
        });
}

/* =========================
   RENDER DASHBOARD
========================= */

function renderDashboard(){

    const selectedGame =
        chartGameSelect.value;

    let filteredMatches =
        matches;

    if(selectedGame !== "all"){

        filteredMatches =
            matches.filter(
                m =>
                    m.gameName === selectedGame
            );
    }

    /* =========================
       PUBG MODE
    ========================= */

    const usingPubgData =
        viewingOwnProfile &&
        pubgStats &&
        selectedGame === "PUBG";

    let totalKills = 0;
    let totalDeaths = 0;
    let totalWins = 0;
    let totalScore = 0;
    let totalMatches = 0;

    /* =========================
       PUBG CONNECTED DATA
    ========================= */

    if(usingPubgData){

        totalKills =
            pubgStats.kills || 0;

        totalDeaths =
            pubgStats.deaths || 0;

        totalWins =
            pubgStats.wins || 0;

        totalMatches =
            pubgStats.matches || 0;

        totalScore =
            pubgStats.damage || 0;

    }

    /* =========================
       NORMAL USER MATCHES
    ========================= */

    else{

        filteredMatches.forEach(match => {

            totalKills +=
                match.kills || 0;

            totalDeaths +=
                match.deaths || 0;

            totalScore +=
                match.score || 0;

            if(match.win){

                totalWins++;
            }
        });

        totalMatches =
            filteredMatches.length;
    }

    /* =========================
       STATS
    ========================= */

    const winRate =
        totalMatches > 0
            ? (
                (totalWins / totalMatches) * 100
              ).toFixed(1)
            : "0.0";

    const kdRatio =
        totalDeaths > 0
            ? (
                totalKills / totalDeaths
              ).toFixed(2)
            : totalKills;

    const avgScore =
        totalMatches > 0
            ? Math.round(
                totalScore / totalMatches
              )
            : 0;

    document.getElementById(
        "totalKills"
    ).innerText = totalKills;

    document.getElementById(
        "winRate"
    ).innerText = winRate + "%";

    document.getElementById(
        "kdRatio"
    ).innerText = kdRatio;

    document.getElementById(
        "avgScore"
    ).innerText = avgScore;

    /* =========================
       LEVEL SYSTEM
    ========================= */

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

    playerLevel.innerText =
        level;

    xpFill.style.width =
        xpPercent + "%";

    xpText.innerText =
        currentXP + " / 1000 XP";

    levelGameText.innerText =
        usingPubgData
            ? "PUBG Connected"
            : "Manual Matches";

    /* =========================
       ACHIEVEMENTS
    ========================= */

    const achievementList =
        document.getElementById(
            "achievementList"
        );

    achievementList.innerHTML = "";

    const achievements = [];

    if(totalKills >= 40){

        achievements.push({

            icon:"🔥",

            title:"Kill Master",

            desc:"40+ kills"
        });
    }

    if(totalWins >= 3){

        achievements.push({

            icon:"🏆",

            title:"Champion",

            desc:"3+ wins"
        });
    }

    if(parseFloat(kdRatio) >= 2){

        achievements.push({

            icon:"⚡",

            title:"High KD",

            desc:"KD above 2.0"
        });
    }

    if(achievements.length === 0){

        achievements.push({

            icon:"❌",

            title:"No Achievements",

            desc:"Play more matches"
        });
    }

    achievements.forEach(a => {

        achievementList.innerHTML += `
            <div class="achievement">

                <div>

                    <h4>
                        ${a.icon} ${a.title}
                    </h4>

                    <p>
                        ${a.desc}
                    </p>

                </div>

            </div>
        `;
    });

    /* =========================
       RECENT ACTIVITY
    ========================= */

    const recentActivity =
        document.getElementById(
            "recentActivity"
        );

    recentActivity.innerHTML = "";

    if(!usingPubgData){

        [...filteredMatches]
            .reverse()
            .slice(0,5)
            .forEach(match => {

                recentActivity.innerHTML += `
                    <div class="activity-item">

                        <div class="activity-left">

                            <div class="activity-icon">
                                ${match.win ? "🏆" : "🎯"}
                            </div>

                            <div class="activity-info">

                                <strong>
                                    ${match.gameName}
                                </strong>

                                <span>
                                    ${match.win
                                        ? "Victory"
                                        : "Defeat"}
                                </span>

                            </div>

                        </div>

                        <div class="activity-score">
                            ${match.score || 0}
                        </div>

                    </div>
                `;
            });

    }else{

        recentActivity.innerHTML = `
            <div class="activity-item">

                <div class="activity-left">

                    <div class="activity-icon">
                        🎮
                    </div>

                    <div class="activity-info">

                        <strong>
                            PUBG Connected
                        </strong>

                        <span>
                            Live PUBG stats loaded
                        </span>

                    </div>

                </div>

            </div>
        `;
    }

    /* =========================
       CHARTS
    ========================= */

    const labels =
        usingPubgData
            ? ["PUBG"]
            : filteredMatches.map(
                (_, i) =>
                    "Match " + (i + 1)
              );

    const killsData =
        usingPubgData
            ? [totalKills]
            : filteredMatches.map(
                m => m.kills || 0
              );

    const scoreData =
        usingPubgData
            ? [totalScore]
            : filteredMatches.map(
                m => m.score || 0
              );

    const kdData =
        usingPubgData
            ? [kdRatio]
            : filteredMatches.map(m =>

                m.deaths > 0

                    ? (
                        m.kills / m.deaths
                      ).toFixed(2)

                    : m.kills
            );

    const winRateData =
        usingPubgData
            ? [winRate]
            : filteredMatches.map(
                m => m.win ? 100 : 0
              );

    if(mainChart) mainChart.destroy();
    if(kdChart) kdChart.destroy();
    if(winRateChart) winRateChart.destroy();
    if(scoreChart) scoreChart.destroy();

    mainChart =
        createChart(
            "mainChart",
            "bar",
            labels,
            killsData,
            "Kills",
            "#00ff88"
        );

    kdChart =
        createChart(
            "kdChart",
            "line",
            labels,
            kdData,
            "KD Ratio",
            "#00ff88"
        );

    winRateChart =
        createChart(
            "winRateChart",
            "line",
            labels,
            winRateData,
            "Win Rate",
            "#00bfff"
        );

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

/* =========================
   CHART FACTORY
========================= */

function createChart(
    id,
    type,
    labels,
    data,
    label,
    color
){

    return new Chart(

        document.getElementById(id),

        {
            type:type,

            data:{
                labels:labels,

                datasets:[{

                    label:label,

                    data:data,

                    borderColor:color,

                    backgroundColor:
                        color + "33",

                    borderWidth:3,

                    tension:0.4,

                    fill:true
                }]
            },

            options:{

                responsive:true,

                maintainAspectRatio:false,

                plugins:{
                    legend:{
                        labels:{
                            color:"white"
                        }
                    }
                },

                scales:{
                    x:{
                        ticks:{
                            color:"white"
                        }
                    },

                    y:{
                        beginAtZero:true,

                        ticks:{
                            color:"white"
                        }
                    }
                }
            }
        }
    );
}

/* =========================
   FILTER EVENT
========================= */

chartGameSelect.addEventListener(
    "change",
    renderDashboard
);

/* =========================
   START
========================= */

loadDashboard();