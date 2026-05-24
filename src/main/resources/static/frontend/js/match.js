/* =========================
   ELEMENTS
========================= */

const gameInput =
    document.getElementById("game-name");

const dynamicFields =
    document.getElementById("dynamic-fields");

const message =
    document.getElementById("match-message");
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";
/* =========================
   GAME CONFIGS
========================= */

const gameConfigs = {

    "PUBG": [

        {
            id: "placement",
            label: "Placement",
            type: "number",
            placeholder: "2",
            min: 1,
            max: 100
        },

        {
            id: "score",
            label: "Score",
            type: "number",
            placeholder: "1200",
            min: 0,
            max: 10000
        },

        {
            id: "kills",
            label: "Kills",
            type: "number",
            placeholder: "15",
            min: 0,
            max: 100
        },

        {
            id: "deaths",
            label: "Deaths",
            type: "number",
            placeholder: "1",
            min: 0,
            max: 3
        },

        {
            id: "damage",
            label: "Damage",
            type: "number",
            placeholder: "2500",
            min: 0,
            max: 50000
        },

        {
            id: "survivalTime",
            label: "Survival Time",
            type: "text",
            placeholder: "28m"
        }
    ],

    "CS2": [

        {
            id: "score",
            label: "Score",
            type: "number",
            placeholder: "3200",
            min: 0,
            max: 10000
        },

        {
            id: "kills",
            label: "Kills",
            type: "number",
            placeholder: "25",
            min: 0,
            max: 100
        },

        {
            id: "deaths",
            label: "Deaths",
            type: "number",
            placeholder: "10",
            min: 0,
            max: 50
        },

        {
            id: "assists",
            label: "Assists",
            type: "number",
            placeholder: "8",
            min: 0,
            max: 50
        },

        {
            id: "headshots",
            label: "Headshots",
            type: "number",
            placeholder: "14",
            min: 0,
            max: 100
        }
    ],

    "Valorant": [

        {
            id: "combatScore",
            label: "Combat Score",
            type: "number",
            placeholder: "450",
            min: 0,
            max: 1000
        },

        {
            id: "kills",
            label: "Kills",
            type: "number",
            placeholder: "30",
            min: 0,
            max: 100
        },

        {
            id: "deaths",
            label: "Deaths",
            type: "number",
            placeholder: "12",
            min: 0,
            max: 50
        },

        {
            id: "assists",
            label: "Assists",
            type: "number",
            placeholder: "5",
            min: 0,
            max: 50
        },

        {
            id: "headshots",
            label: "Headshots",
            type: "number",
            placeholder: "18",
            min: 0,
            max: 100
        }
    ],

    "League of Legends": [

        {
            id: "kills",
            label: "Kills",
            type: "number",
            placeholder: "12",
            min: 0,
            max: 100
        },

        {
            id: "deaths",
            label: "Deaths",
            type: "number",
            placeholder: "4",
            min: 0,
            max: 30
        },

        {
            id: "assists",
            label: "Assists",
            type: "number",
            placeholder: "15",
            min: 0,
            max: 100
        },

        {
            id: "cs",
            label: "Creep Score",
            type: "number",
            placeholder: "220",
            min: 0,
            max: 1000
        },

        {
            id: "gold",
            label: "Gold Earned",
            type: "number",
            placeholder: "18000",
            min: 0,
            max: 100000
        }
    ]
};

/* =========================
   LOAD GAME FIELDS
========================= */

function loadGameFields() {

    dynamicFields.innerHTML = "";

    const selectedGame =
        gameInput.value;

    if (!selectedGame) {

        dynamicFields.innerHTML = `

            <p class="choose-game-text">

                Select a game to load match fields

            </p>
        `;

        return;
    }

    const fields =
        gameConfigs[selectedGame];

    fields.forEach(field => {

        dynamicFields.innerHTML += `

            <div class="input-group">

                <label>
                    ${field.label}
                </label>

                <input
                    type="${field.type}"
                    id="${field.id}"
                    placeholder="${field.placeholder}"
                >

            </div>
        `;
    });
}

/* =========================
   GAME CHANGE
========================= */

gameInput.addEventListener(
    "change",
    loadGameFields
);

/* =========================
   SHOW ERROR
========================= */

function showError(text) {

    message.innerText =
        text;

    message.style.color =
        "#ff4d4d";
}

/* =========================
   SHOW SUCCESS
========================= */

function showSuccess(text) {

    message.innerText =
        text;

    message.style.color =
        "#00ff88";
}

/* =========================
   SAVE MATCH
========================= */

async function saveMatch() {

    const token =
        localStorage.getItem("token");

    const selectedGame =
        gameInput.value;

    const result =
        document.getElementById("result").value;

    if (!selectedGame) {

        showError(
            "Please select a game"
        );

        return;
    }

    const config =
        gameConfigs[selectedGame];

    let matchData = {

        gameName: selectedGame,

        win: result === "WIN"
    };

    /* =========================
       VALIDATE FIELDS
    ========================= */

    for (const field of config) {

        const element =
            document.getElementById(field.id);

        if (!element) continue;

        let value =
            element.value;

        if (
            value === "" ||
            value === null
        ) {

            showError(
                `${field.label} is required`
            );

            return;
        }

        /* NUMBER VALIDATION */

        if (field.type === "number") {

            value = Number(value);

            if (isNaN(value)) {

                showError(
                    `${field.label} must be a number`
                );

                return;
            }

            if (value < field.min) {

                showError(
                    `${field.label} cannot be lower than ${field.min}`
                );

                return;
            }

            if (value > field.max) {

                showError(
                    `${field.label} cannot be higher than ${field.max}`
                );

                return;
            }
        }

        matchData[field.id] = value;
    }

    /* =========================
       PUBG LOGIC
    ========================= */

    if (selectedGame === "PUBG") {

        const placement =
            Number(matchData.placement);

        const deaths =
            Number(matchData.deaths);

        /* WIN = PLACE 1 */

        if (
            result === "WIN" &&
            placement !== 1
        ) {

            showError(
                "If you won, placement must be 1"
            );

            return;
        }

        /* LOSS CANNOT BE PLACE 1 */

        if (
            result === "LOSS" &&
            placement === 1
        ) {

            showError(
                "You cannot be 1st place with LOSS"
            );

            return;
        }

        /* WIN CANNOT HAVE 3 DEATHS */

        if (
            result === "WIN" &&
            deaths >= 3
        ) {

            showError(
                "You cannot win PUBG with 3 deaths"
            );

            return;
        }
    }

    /* =========================
       CS2 LOGIC
    ========================= */

    if (selectedGame === "CS2") {

        if (
            matchData.headshots >
            matchData.kills
        ) {

            showError(
                "Headshots cannot be higher than kills"
            );

            return;
        }
    }

    /* =========================
       VALORANT LOGIC
    ========================= */

    if (selectedGame === "Valorant") {

        if (
            matchData.headshots >
            matchData.kills
        ) {

            showError(
                "Headshots cannot be higher than kills"
            );

            return;
        }

        if (
            matchData.combatScore > 1000
        ) {

            showError(
                "Combat score is unrealistically high"
            );

            return;
        }
    }

    /* =========================
       LOL LOGIC
    ========================= */

    if (
        selectedGame ===
        "League of Legends"
    ) {

        if (
            matchData.cs > 600
        ) {

            showError(
                "Creep score is unrealistically high"
            );

            return;
        }

        if (
            matchData.gold > 50000
        ) {

            showError(
                "Gold earned is unrealistically high"
            );

            return;
        }
    }

    /* =========================
       SAVE REQUEST
    ========================= */

    try {

        const response = await fetch(
            `${API_URL}/api/matches`,
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token
                },

                body: JSON.stringify(matchData)
            }
        );

        if (response.ok) {

            showSuccess(
                "Match added successfully"
            );

            setTimeout(() => {

                window.location.href =
                    "matches.html";

            }, 1200);
        }

        else {

            showError(
                "Failed to save match"
            );
        }

    } catch (error) {

        console.log(error);

        showError(
            "Server error"
        );
    }
}

/* =========================
   INITIAL LOAD
========================= */

const savedGame =
    localStorage.getItem("selectedGame");

if (savedGame) {

    gameInput.value =
        savedGame;

    loadGameFields();

    localStorage.removeItem(
        "selectedGame"
    );
}

else {

    loadGameFields();
}