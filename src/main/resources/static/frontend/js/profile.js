const token =
    localStorage.getItem("token");

async function loadProfile() {

    try {

        const response = await fetch(
            "http://localhost:8080/api/users/profile",
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
            "http://localhost:8080/api/matches/stats",
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