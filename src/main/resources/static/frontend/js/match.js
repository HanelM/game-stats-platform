/* =========================================================
MANUAL MATCH ENTRY
Supports all games in the platform.
========================================================= */

/* =========================
ELEMENTS
========================= */

const gameInput =
document.getElementById("game-name");

const dynamicFields =
document.getElementById("dynamic-fields");

const message =
document.getElementById("match-message");

/* =========================
API
========================= */

const API_URL =
window.location.hostname === "localhost"
? "http://localhost:8080"
: "https://game-stats-platform.onrender.com";

/* =========================================================
GAME CONFIGS
========================================================= */

const gameConfigs = {


/* =====================================================
   PUBG
===================================================== */

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


/* =====================================================
   VALORANT
===================================================== */

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


/* =====================================================
   ELDEN RING
===================================================== */

"Elden Ring": [

    {
        id: "score",
        label: "Score",
        type: "number",
        placeholder: "850",
        min: 0,
        max: 10000
    },

    {
        id: "kills",
        label: "Enemies Defeated",
        type: "number",
        placeholder: "35",
        min: 0,
        max: 1000
    },

    {
        id: "deaths",
        label: "Deaths",
        type: "number",
        placeholder: "4",
        min: 0,
        max: 100
    },

    {
        id: "damage",
        label: "Damage",
        type: "number",
        placeholder: "12500",
        min: 0,
        max: 100000
    }

],


/* =====================================================
   CS2
===================================================== */

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


/* =====================================================
   LEAGUE OF LEGENDS
===================================================== */

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

],


/* =====================================================
   FORTNITE
===================================================== */

"Fortnite": [

    {
        id: "placement",
        label: "Placement",
        type: "number",
        placeholder: "3",
        min: 1,
        max: 100
    },

    {
        id: "score",
        label: "Score",
        type: "number",
        placeholder: "1500",
        min: 0,
        max: 10000
    },

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
        placeholder: "1",
        min: 0,
        max: 10
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
        placeholder: "22m"
    }

],


/* =====================================================
   TEAMFIGHT TACTICS
===================================================== */

"Teamfight Tactics": [

    {
        id: "placement",
        label: "Placement",
        type: "number",
        placeholder: "1",
        min: 1,
        max: 8
    },

    {
        id: "score",
        label: "Score",
        type: "number",
        placeholder: "7",
        min: 0,
        max: 8
    }

]


};

/* =========================================================
LOAD GAME FIELDS
========================================================= */

function loadGameFields() {


dynamicFields.innerHTML = "";

const selectedGame =
    gameInput.value;


/* =========================
   NO GAME
========================= */

if (!selectedGame) {

    dynamicFields.innerHTML = `

        <p class="choose-game-text">

            Select a game to load match fields

        </p>

    `;

    return;
}


/* =========================
   GET CONFIG
========================= */

const fields =
    gameConfigs[selectedGame];


if (!fields) {

    dynamicFields.innerHTML = `

        <p class="choose-game-text">

            This game does not support manual match entry.

        </p>

    `;

    return;
}


/* =========================
   CREATE INPUTS
========================= */

fields.forEach(field => {

    dynamicFields.innerHTML += `

        <div class="input-group">

            <label for="${field.id}">
                ${field.label}
            </label>

            <input
                type="${field.type}"
                id="${field.id}"
                placeholder="${field.placeholder}"
                ${
                    field.type === "number"
                        ? `min="${field.min}" max="${field.max}"`
                        : ""
                }
            >

        </div>

    `;

});


}

/* =========================================================
GAME CHANGE
========================================================= */

if (gameInput) {


gameInput.addEventListener(
    "change",
    loadGameFields
);


}

/* =========================================================
SHOW ERROR
========================================================= */

function showError(text) {


if (!message) {
    return;
}

message.innerText = text;
message.style.color = "#ff4d4d";


}

/* =========================================================
SHOW SUCCESS
========================================================= */

function showSuccess(text) {


if (!message) {
    return;
}

message.innerText = text;
message.style.color = "#00ff88";


}

/* =========================================================
SAVE MATCH
========================================================= */

async function saveMatch() {


const token =
    localStorage.getItem("token");


if (!token) {

    showError(
        "You must be logged in to add a match."
    );

    return;
}


const selectedGame =
    gameInput.value;


const resultElement =
    document.getElementById("result");


if (!resultElement) {

    showError(
        "Result field not found."
    );

    return;
}


const result =
    resultElement.value;


if (!selectedGame) {

    showError(
        "Please select a game."
    );

    return;
}


const config =
    gameConfigs[selectedGame];


if (!config) {

    showError(
        "This game does not support manual match entry."
    );

    return;
}


if (
    result !== "WIN" &&
    result !== "LOSS"
) {

    showError(
        "Please select WIN or LOSS."
    );

    return;
}


/* =====================================================
   BASE MATCH DATA
===================================================== */

let matchData = {

    gameName: selectedGame,

    win: result === "WIN"

};


/* =====================================================
   VALIDATE DYNAMIC FIELDS
===================================================== */

for (const field of config) {

    const element =
        document.getElementById(field.id);


    if (!element) {

        showError(
            `${field.label} field is missing.`
        );

        return;
    }


    let value =
        element.value.trim();


    if (value === "") {

        showError(
            `${field.label} is required.`
        );

        return;
    }


    if (field.type === "number") {

        value =
            Number(value);


        if (!Number.isFinite(value)) {

            showError(
                `${field.label} must be a number.`
            );

            return;
        }


        if (value < field.min) {

            showError(
                `${field.label} cannot be lower than ${field.min}.`
            );

            return;
        }


        if (value > field.max) {

            showError(
                `${field.label} cannot be higher than ${field.max}.`
            );

            return;
        }


        if (!Number.isInteger(value)) {

            showError(
                `${field.label} must be a whole number.`
            );

            return;
        }

    }


    if (field.type === "text") {

        value =
            value.trim();


        if (!value) {

            showError(
                `${field.label} is required.`
            );

            return;
        }

    }


    matchData[field.id] =
        value;

}


/* =====================================================
   PUBG VALIDATION
===================================================== */

if (selectedGame === "PUBG") {

    const placement =
        Number(matchData.placement);

    const deaths =
        Number(matchData.deaths);


    if (
        result === "WIN" &&
        placement !== 1
    ) {

        showError(
            "If you won, placement must be 1."
        );

        return;
    }


    if (
        result === "LOSS" &&
        placement === 1
    ) {

        showError(
            "You cannot be 1st place with LOSS."
        );

        return;
    }


    if (
        result === "WIN" &&
        deaths >= 3
    ) {

        showError(
            "You cannot win PUBG with 3 deaths."
        );

        return;
    }

}


/* =====================================================
   FORTNITE VALIDATION
===================================================== */

if (selectedGame === "Fortnite") {

    const placement =
        Number(matchData.placement);


    if (
        result === "WIN" &&
        placement !== 1
    ) {

        showError(
            "If you won Fortnite, placement must be 1."
        );

        return;
    }


    if (
        result === "LOSS" &&
        placement === 1
    ) {

        showError(
            "You cannot be 1st place with LOSS."
        );

        return;
    }

}


/* =====================================================
   TFT VALIDATION
===================================================== */

if (selectedGame === "Teamfight Tactics") {

    const placement =
        Number(matchData.placement);


    if (
        result === "WIN" &&
        placement !== 1
    ) {

        showError(
            "If you won TFT, placement must be 1."
        );

        return;
    }


    if (
        result === "LOSS" &&
        placement === 1
    ) {

        showError(
            "You cannot be 1st place with LOSS."
        );

        return;
    }


    const expectedScore =
        Math.max(
            0,
            8 - placement
        );


    if (
        Number(matchData.score) !==
        expectedScore
    ) {

        showError(
            `For ${placement}${getOrdinalSuffix(placement)} place, TFT score should be ${expectedScore}.`
        );

        return;
    }

}


/* =====================================================
   CS2 VALIDATION
===================================================== */

if (selectedGame === "CS2") {

    const kills =
        Number(matchData.kills || 0);

    const headshots =
        Number(matchData.headshots || 0);


    if (headshots > kills) {

        showError(
            "Headshots cannot be higher than kills."
        );

        return;
    }

}


/* =====================================================
   VALORANT VALIDATION
===================================================== */

if (selectedGame === "Valorant") {

    const kills =
        Number(matchData.kills || 0);

    const headshots =
        Number(matchData.headshots || 0);

    const combatScore =
        Number(matchData.combatScore || 0);


    if (headshots > kills) {

        showError(
            "Headshots cannot be higher than kills."
        );

        return;
    }


    if (combatScore > 1000) {

        showError(
            "Combat score is unrealistically high."
        );

        return;
    }

}


/* =====================================================
   LEAGUE OF LEGENDS VALIDATION
===================================================== */

if (
    selectedGame ===
    "League of Legends"
) {

    const cs =
        Number(matchData.cs || 0);

    const gold =
        Number(matchData.gold || 0);


    if (cs > 600) {

        showError(
            "Creep score is unrealistically high."
        );

        return;
    }


    if (gold > 50000) {

        showError(
            "Gold earned is unrealistically high."
        );

        return;
    }

}


/* =====================================================
   ELDEN RING VALIDATION
===================================================== */

if (selectedGame === "Elden Ring") {

    const deaths =
        Number(matchData.deaths || 0);

    const kills =
        Number(matchData.kills || 0);


    if (
        kills === 0 &&
        deaths === 0
    ) {

        showError(
            "Enter at least one enemy defeated or death."
        );

        return;
    }

}


/* =====================================================
   REMOVE OLD MESSAGE
===================================================== */

if (message) {

    message.innerText = "";

}


/* =====================================================
   DISABLE BUTTON
===================================================== */

const saveButton =
    document.getElementById(
        "save-match-btn"
    );


if (saveButton) {

    saveButton.disabled = true;

    saveButton.dataset.originalText =
        saveButton.innerText;

    saveButton.innerText =
        "Saving...";

}


/* =====================================================
   SEND TO BACKEND
===================================================== */

try {

    console.log(
        "Saving manual match:",
        matchData
    );


    const response =
        await fetch(
            `${API_URL}/api/matches`,
            {
                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json",

                    "Authorization":
                        "Bearer " + token

                },

                body:
                    JSON.stringify(
                        matchData
                    )

            }
        );


    /* =================================================
       SUCCESS
    ================================================= */

    if (response.ok) {

        showSuccess(
            "Match added successfully."
        );


        setTimeout(
            () => {

                window.location.href =
                    "matches.html";

            },
            1200
        );


        return;
    }


    /* =================================================
       BACKEND ERROR
    ================================================= */

    let errorMessage =
        "Failed to save match.";


    try {

        const errorData =
            await response.json();


        if (errorData.message) {

            errorMessage =
                errorData.message;

        } else if (errorData.error) {

            errorMessage =
                errorData.error;

        }

    } catch (jsonError) {

        console.error(
            "Could not parse backend error:",
            jsonError
        );

    }


    showError(
        errorMessage
    );


} catch (error) {

    console.error(
        "Save match error:",
        error
    );


    showError(
        "Server error. Please try again."
    );

} finally {

    /* =========================
       ENABLE BUTTON
    ========================= */

    if (saveButton) {

        saveButton.disabled = false;

        saveButton.innerText =
            saveButton.dataset.originalText ||
            "Save Match";

    }

}


}

/* =========================================================
ORDINAL SUFFIX
========================================================= */

function getOrdinalSuffix(number) {


if (
    number >= 11 &&
    number <= 13
) {

    return "th";

}


switch (number % 10) {

    case 1:
        return "st";

    case 2:
        return "nd";

    case 3:
        return "rd";

    default:
        return "th";

}


}

/* =========================================================
INITIAL LOAD
========================================================= */

const savedGame =
localStorage.getItem(
"selectedGame"
);

if (
savedGame &&
gameConfigs[savedGame]
) {


gameInput.value =
    savedGame;


loadGameFields();


localStorage.removeItem(
    "selectedGame"
);


} else {


loadGameFields();


}
