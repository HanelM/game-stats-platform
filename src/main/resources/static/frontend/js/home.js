const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";

const trendingContainer = document.getElementById("trending-games");

function renderTrendingGames() {

    const trendingGames = GAMES.slice(0, 4);

    trendingGames.forEach(game => {

        trendingContainer.innerHTML += `

        <div class="game-card">

            <img src="${game.img}" alt="${game.name}">

            <h2>${game.name}</h2>

            <p>${game.genre}</p>

            <p>⭐ ${game.rating}</p>

        </div>

        `;

    });

}
const homeToken =
    localStorage.getItem("token");

if(homeToken){{

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


renderTrendingGames();
