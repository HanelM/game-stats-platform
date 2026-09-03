
const gamesContainer =
    document.getElementById("games-container");

const playedContainer =
    document.getElementById("played-games-container");

const searchInput =
    document.getElementById("search-input");

const genreFilter =
    document.getElementById("genre-filter");

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";

let playedGameNames = [];


/* =========================================================
   LOAD ALL PLAYED GAMES
   ========================================================= */

async function loadPlayedGames() {

    const token =
        localStorage.getItem("token");

    if (!token) {

        playedContainer.innerHTML = `
            <p class="no-results">
                Please log in to see your played games.
            </p>
        `;

        renderDiscoverGames(GAMES);

        return;
    }

    try {

        /*
         * IMPORTANT:
         * /all returns ALL matches.
         *
         * /my is paginated and may return only
         * the first 5/10 matches.
         */
        const response = await fetch(
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
                "Failed to load matches: " +
                response.status
            );
        }

        const matches =
            await response.json();


        /*
         * Make sure we always have an array.
         */
        if (!Array.isArray(matches)) {

            throw new Error(
                "Invalid matches response"
            );
        }


        playedContainer.innerHTML = "";


        /* =====================================================
           FIND UNIQUE PLAYED GAMES
           ===================================================== */

        playedGameNames = [];

        matches
            .sort(
                (a, b) =>
                    new Date(b.playedAt || 0) -
                    new Date(a.playedAt || 0)
            )
            .forEach(match => {

                if (!match.gameName) {
                    return;
                }

                /*
                 * Prevent duplicate games.
                 */
                if (
                    !playedGameNames.includes(
                        match.gameName
                    )
                ) {

                    playedGameNames.push(
                        match.gameName
                    );
                }
            });


        /* =====================================================
           RENDER MY PLAYED GAMES
           ===================================================== */

        playedGameNames.forEach(gameName => {

            const game =
                findGame(gameName);

            /*
             * If the backend contains a game that isn't
             * present in games-data.js, don't crash the page.
             */
            if (!game) {
                return;
            }

            renderPlayedGame(game);
        });


        /*
         * No played games.
         */
        if (playedGameNames.length === 0) {

            playedContainer.innerHTML = `
                <p
                    id="played-no-results"
                    class="no-results"
                >
                    You haven't played any games yet.
                </p>
            `;
        }


        /* =====================================================
           DISCOVER NEW GAMES
           ===================================================== */

        const newGames =
            GAMES.filter(game =>
                !playedGameNames.some(
                    playedName =>
                        normalizeGameName(playedName) ===
                        normalizeGameName(game.name)
                )
            );

        renderDiscoverGames(newGames);


        /*
         * Apply current filters after loading.
         */
        filterGames();

    }
    catch (error) {

        console.error(
            "Error loading played games:",
            error
        );

        playedContainer.innerHTML = `
            <p class="no-results">
                Unable to load played games.
            </p>
        `;

        renderDiscoverGames(GAMES);
    }
}


/* =========================================================
   NORMALIZE GAME NAME
   ========================================================= */

function normalizeGameName(name) {

    return String(name || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}


/* =========================================================
   FIND GAME
   ========================================================= */

function findGame(gameName) {

    const normalized =
        normalizeGameName(gameName);

    return GAMES.find(
        game =>
            normalizeGameName(game.name) ===
            normalized
    );
}


/* =========================================================
   RENDER PLAYED GAME
   ========================================================= */

function renderPlayedGame(game) {

    playedContainer.innerHTML += `

        <div
            class="game-card"
            data-game-name="${game.name}"
            data-game-genre="${game.genre}"
        >

            <img
                src="${game.img}"
                alt="${game.name}"
            >

            <h2>${game.name}</h2>

            <p>
                🎮 Genre: ${game.genre}
            </p>

            <p>
                👥 Players: ${game.players}
            </p>

            <p>
                ⭐ Rating: ${game.rating}
            </p>

            <div class="game-buttons">

                <button
                    onclick="viewMatches('${escapeGameName(game.name)}')"
                >
                    View Matches
                </button>

                <button
                    onclick="openMatchPage('${escapeGameName(game.name)}')"
                >
                    Add Match
                </button>

            </div>

        </div>

    `;
}


/* =========================================================
   RENDER DISCOVER GAMES
   ========================================================= */

function renderDiscoverGames(games) {

    gamesContainer.innerHTML = "";

    games.forEach(game => {

        gamesContainer.innerHTML += `

            <div
                class="game-card"
                data-game-name="${game.name}"
                data-game-genre="${game.genre}"
            >

                <img
                    src="${game.img}"
                    alt="${game.name}"
                >

                <h2>${game.name}</h2>

                <p>
                    🎮 Genre: ${game.genre}
                </p>

                <p>
                    👥 Players: ${game.players}
                </p>

                <p>
                    ⭐ Rating: ${game.rating}
                </p>

                <div class="game-buttons">

                    <button
                        onclick="openMatchPage('${escapeGameName(game.name)}')"
                    >
                        Add Match
                    </button>

                </div>

            </div>

        `;
    });
}


/* =========================================================
   ESCAPE GAME NAME
   ========================================================= */

function escapeGameName(name) {

    return String(name)
        .replace(/\\/g, "\\\\")
        .replace(/'/g, "\\'");
}


/* =========================================================
   FILTER GAMES
   ========================================================= */

function filterGames() {

    const search =
        searchInput.value
            .trim()
            .toLowerCase();

    const genre =
        genreFilter.value;


    /* =====================================================
       PLAYED GAMES
       ===================================================== */

    const playedCards =
        document.querySelectorAll(
            "#played-games-container .game-card"
        );

    let visiblePlayedGames = 0;

    playedCards.forEach(card => {

        const gameName =
            card.dataset.gameName
                .toLowerCase();

        const gameGenre =
            card.dataset.gameGenre;

        const matchesSearch =
            gameName.includes(search);

        const matchesGenre =
            genre === "all" ||
            gameGenre === genre;

        if (
            matchesSearch &&
            matchesGenre
        ) {

            card.style.display = "";

            visiblePlayedGames++;

        } else {

            card.style.display = "none";
        }
    });


    /* =====================================================
       PLAYED NO RESULTS MESSAGE
       ===================================================== */

    let playedNoResults =
        document.getElementById(
            "played-no-results"
        );

    if (
        playedCards.length > 0 &&
        visiblePlayedGames === 0
    ) {

        if (!playedNoResults) {

            playedNoResults =
                document.createElement("p");

            playedNoResults.id =
                "played-no-results";

            playedNoResults.className =
                "no-results";

            playedContainer.appendChild(
                playedNoResults
            );
        }

        playedNoResults.innerText =
            "No played games found.";

    }
    else if (playedNoResults) {

        playedNoResults.remove();
    }


    /* =====================================================
       DISCOVER GAMES
       ===================================================== */

    const discoverCards =
        document.querySelectorAll(
            "#games-container .game-card"
        );

    let visibleDiscoverGames = 0;

    discoverCards.forEach(card => {

        const gameName =
            card.dataset.gameName
                .toLowerCase();

        const gameGenre =
            card.dataset.gameGenre;

        const matchesSearch =
            gameName.includes(search);

        const matchesGenre =
            genre === "all" ||
            gameGenre === genre;

        if (
            matchesSearch &&
            matchesGenre
        ) {

            card.style.display = "";

            visibleDiscoverGames++;

        } else {

            card.style.display = "none";
        }
    });


    /* =====================================================
       DISCOVER NO RESULTS
       ===================================================== */

    let discoverNoResults =
        document.getElementById(
            "discover-no-results"
        );

    if (
        discoverCards.length > 0 &&
        visibleDiscoverGames === 0
    ) {

        if (!discoverNoResults) {

            discoverNoResults =
                document.createElement("p");

            discoverNoResults.id =
                "discover-no-results";

            discoverNoResults.className =
                "no-results";

            gamesContainer.appendChild(
                discoverNoResults
            );
        }

        discoverNoResults.innerText =
            "No new games found.";

    }
    else if (discoverNoResults) {

        discoverNoResults.remove();
    }
}


/* =========================================================
   SEARCH EVENTS
   ========================================================= */

searchInput.addEventListener(
    "input",
    filterGames
);

genreFilter.addEventListener(
    "change",
    filterGames
);


/* =========================================================
   VIEW MATCHES
   ========================================================= */

function viewMatches(gameName) {

    localStorage.setItem(
        "selectedGame",
        gameName
    );

    window.location.href =
        "matches.html";
}


/* =========================================================
   OPEN MATCH PAGE
   ========================================================= */

function openMatchPage(gameName) {

    localStorage.setItem(
        "selectedGame",
        gameName
    );

    window.location.href =
        "match.html";
}


/* =========================================================
   ADMIN BUTTON
   ========================================================= */

const homeToken =
    localStorage.getItem("token");

if (homeToken) {

    try {

        const payload =
            JSON.parse(
                atob(
                    homeToken.split(".")[1]
                )
            );

        if (
            payload.role === "ADMIN"
        ) {

            const adminContainer =
                document.getElementById(
                    "adminButtonContainer"
                );

            if (adminContainer) {

                adminContainer.innerHTML = `

                    <a
                        href="admin.html"
                        class="admin-btn"
                    >
                        Admin Panel
                    </a>

                `;
            }
        }

    }
    catch (error) {

        console.error(
            "Invalid JWT:",
            error
        );
    }
}


/* =========================================================
   INITIAL LOAD
   ========================================================= */

loadPlayedGames();

