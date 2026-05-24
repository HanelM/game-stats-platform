const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";

const token =
    localStorage.getItem("token");

async function loadProfile() {

    try {

        const response = await fetch(
            `${API_URL}/api/users/profile`,
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        if (!response.ok) {

            throw new Error(
                "Failed to load profile"
            );
        }

        const user =
            await response.json();

        document.getElementById(
            "profile-username"
        ).innerText =
            user.username;

        document.getElementById(
            "profile-email"
        ).innerText =
            user.email;

        document.getElementById(
            "profile-avatar"
        ).innerText =
            user.username
                .charAt(0)
                .toUpperCase();

        loadStats();

    } catch(error) {

        console.log(error);
    }
}

async function loadStats() {

    try {

        const response = await fetch(
            `${API_URL}/api/matches/stats`,
            {
                headers: {
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const stats =
            await response.json();

        document.getElementById(
            "totalMatches"
        ).innerText =
            stats.totalMatches;

        document.getElementById(
            "totalWins"
        ).innerText =
            stats.totalWins;

        document.getElementById(
            "winRate"
        ).innerText =
            stats.winRate + "%";

    } catch(error) {

        console.log(error);
    }
}

loadProfile();