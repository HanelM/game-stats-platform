const gamesContainer =
    document.getElementById("games-container");

const playedContainer =
    document.getElementById(
        "played-games-container"
    );

const searchInput =
    document.getElementById("search-input");

const genreFilter =
    document.getElementById("genre-filter");

let playedGameNames = [];

/* =========================
   LOAD PLAYED GAMES
========================= */

async function loadPlayedGames(){

    const token =
        localStorage.getItem("token");

    if(!token){
        return;
    }

    try{

        const response = await fetch(
            "http://localhost:8080/api/matches/my",
            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        playedContainer.innerHTML = "";

        /* UNIQUE GAME NAMES */

        playedGameNames = [];

        data.content
            .sort(
                (a, b) =>
                    new Date(b.playedAt) -
                    new Date(a.playedAt)
            )
            .forEach(match => {

                if(
                    !playedGameNames.includes(
                        match.gameName
                    )
                ){
                    playedGameNames.push(
                        match.gameName
                    );
                }
            });

        /* SHOW PLAYED GAMES */

        playedGameNames.forEach(name => {

            const game =
                GAMES.find(
                    g => g.name === name
                );

            if(!game){
                return;
            }

            playedContainer.innerHTML += `

            <div class="game-card">

                <img src="${game.img}">

                <h2>${game.name}</h2>

                <p>🎮 Genre: ${game.genre}</p>

                <p>👥 Players: ${game.players}</p>

                <p>⭐ Rating: ${game.rating}</p>

                <div class="game-buttons">

                    <button onclick="viewMatches('${game.name}')">
                        View Matches
                    </button>

                    <button onclick="openMatchPage('${game.name}')">
                        Add Match
                    </button>

                </div>

            </div>

            `;
        });

        /* DISCOVER NEW GAMES */

        const newGames =
            GAMES.filter(game =>
                !playedGameNames.includes(
                    game.name
                )
            );

        renderDiscoverGames(newGames);

    }catch(error){

        console.log(error);
    }
}

/* =========================
   DISCOVER GAMES
========================= */

function renderDiscoverGames(games){

    gamesContainer.innerHTML = "";

    games.forEach(game => {

        gamesContainer.innerHTML += `

        <div class="game-card">

            <img src="${game.img}">

            <h2>${game.name}</h2>

            <p>🎮 Genre: ${game.genre}</p>

            <p>👥 Players: ${game.players}</p>

            <p>⭐ Rating: ${game.rating}</p>

            <div class="game-buttons">

                <button onclick="openMatchPage('${game.name}')">
                    Add Match
                </button>

            </div>

        </div>

        `;
    });
}

/* =========================
   SEARCH
========================= */

function filterGames(){

    const search =
        searchInput.value.toLowerCase();

    const genre =
        genreFilter.value;

    /* REMOVE OLD MESSAGES */

    const oldPlayedMessage =
        document.getElementById(
            "played-no-results"
        );

    if(oldPlayedMessage){
        oldPlayedMessage.remove();
    }

    const oldDiscoverMessage =
        document.getElementById(
            "discover-no-results"
        );

    if(oldDiscoverMessage){
        oldDiscoverMessage.remove();
    }

    /* =========================
       FILTER DISCOVER GAMES
    ========================= */

    const discoverGames =
        GAMES.filter(game => {

            const gameName =
                (game.name || "")
                .toLowerCase();

            const gameGenre =
                game.genre || "";

            const matchesSearch =
                gameName.includes(search);

            const matchesGenre =
                genre === "all" ||
                gameGenre === genre;

            const notPlayed =
                !playedGameNames.includes(
                    game.name
                );

            return matchesSearch &&
                   matchesGenre &&
                   notPlayed;
        });

    renderDiscoverGames(discoverGames);

    /* DISCOVER NO RESULTS */

    if(discoverGames.length === 0){

        gamesContainer.innerHTML = `

            <p
                id="discover-no-results"
                class="no-results"
            >
                No new games found.
            </p>

        `;
    }

    /* =========================
       FILTER PLAYED GAMES
    ========================= */

    const playedCards =
        document.querySelectorAll(
            "#played-games-container .game-card"
        );

    let visiblePlayedGames = 0;

    playedCards.forEach(card => {

        const title =
            card.querySelector("h2")
                .innerText
                .toLowerCase();

        const genreText =
            card.querySelectorAll("p")[0]
                .innerText
                .toLowerCase();

        const matchesSearch =
            title.includes(search);

        const matchesGenre =
            genre === "all" ||
            genreText.includes(
                genre.toLowerCase()
            );

        if(matchesSearch && matchesGenre){

            card.style.display = "block";

            visiblePlayedGames++;
        }
        else{

            card.style.display = "none";
        }
    });

    /* PLAYED NO RESULTS */

    let noResults =
        document.getElementById(
            "played-no-results"
        );

    if(visiblePlayedGames === 0){

        if(!noResults){

            noResults =
                document.createElement("p");

            noResults.id =
                "played-no-results";

            noResults.className =
                "no-results";

            noResults.innerText =
                "No played games found.";

            playedContainer.appendChild(
                noResults
            );
        }
    }
    else{

        if(noResults){
            noResults.remove();
        }
    }
}

searchInput.addEventListener(
    "input",
    filterGames
);

genreFilter.addEventListener(
    "change",
    filterGames
);

/* =========================
   BUTTONS
========================= */

function addMatch(gameName){

    localStorage.setItem(
        "selectedGame",
        gameName
    );

    window.location.href =
        "match.html";
}

function viewMatches(gameName){

    localStorage.setItem(
        "selectedGame",
        gameName
    );

    window.location.href =
        "matches.html";
}
/* =========================
   OPEN MATCH PAGE
========================= */

function openMatchPage(gameName) {

    localStorage.setItem(
        "selectedGame",
        gameName
    );

    window.location.href =
        "match.html";
}


/* =========================
   LOAD
========================= */

loadPlayedGames();
const homeToken = localStorage.getItem("token");

if(homeToken){

    const payload =
        JSON.parse(
            atob(
                homeToken.split(".")[1]
            )
        );

    if(payload.role === "ADMIN"){

        document.getElementById(
            "adminButtonContainer"
        ).innerHTML = `

            <a
                href="admin.html"
                class="admin-btn"
            >
                Admin Panel
            </a>

        `;
    }
}