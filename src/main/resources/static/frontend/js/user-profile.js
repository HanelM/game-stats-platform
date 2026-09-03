/* =========================================================
   ADMIN USER PROFILE
   =========================================================
   Statistics are calculated directly from the user's
   complete match history.

   This includes:
   - MANUAL matches
   - API / ONLINE matches
   - PUBG
   - League of Legends
   - TFT
   - Any other game

   We DO NOT use:
   /api/matches/analytics/user/{username}

   because that endpoint can contain older statistics logic.
========================================================= */


const token =
    localStorage.getItem("token");


const params =
    new URLSearchParams(
        window.location.search
    );


const username =
    params.get("username");


const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";


/* =========================================================
   PROTECTION
========================================================= */

if (!token || !username) {

    window.location.href =
        "admin.html";
}


/* =========================================================
   NAV BUTTONS
========================================================= */

function openDashboard() {

    window.location.href =
        `dashboard.html?username=${encodeURIComponent(username)}`;
}


function openAnalytics() {

    window.location.href =
        `analytics.html?username=${encodeURIComponent(username)}`;
}


/* =========================================================
   LOAD USER
========================================================= */

async function loadUser() {

    const usernameElement =
        document.getElementById("username");


    const emailElement =
        document.getElementById("email");


    if (usernameElement) {

        usernameElement.innerText =
            "Loading...";
    }


    if (emailElement) {

        emailElement.innerText =
            "Loading...";
    }


    try {

        /* =================================================
           LOAD ALL USERS
        ================================================= */

        let currentPage = 0;

        let totalPages = 1;

        let users = [];


        while (currentPage < totalPages) {

            const response =
                await fetch(
                    `${API_URL}/api/admin/users?page=${currentPage}&size=50`,
                    {
                        headers: {
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );


            if (!response.ok) {

                throw new Error(
                    `Failed to load users (${response.status})`
                );
            }


            const data =
                await response.json();


            users = [
                ...users,
                ...(data.content || [])
            ];


            totalPages =
                data.totalPages || 1;


            currentPage++;
        }


        /* =================================================
           FIND USER
        ================================================= */

        const user =
            users.find(
                u =>
                    (u.username || "")
                        .trim()
                        .toLowerCase() ===
                    (username || "")
                        .trim()
                        .toLowerCase()
            );


        if (!user) {

            if (usernameElement) {

                usernameElement.innerText =
                    "User not found";
            }


            if (emailElement) {

                emailElement.innerText =
                    "";
            }


            return;
        }


        /* =================================================
           USER INFORMATION
        ================================================= */

        if (usernameElement) {

            usernameElement.innerText =
                user.username || "-";
        }


        if (emailElement) {

            emailElement.innerText =
                user.email || "-";
        }


        /* =================================================
           REGISTERED
        ================================================= */

        const registeredElement =
            document.getElementById(
                "registered"
            );


        if (registeredElement) {

            if (user.createdAt) {

                const date =
                    new Date(
                        user.createdAt
                    );


                if (
                    !Number.isNaN(
                        date.getTime()
                    )
                ) {

                    registeredElement.innerText =
                        "Registered: " +
                        date.toLocaleString();

                } else {

                    registeredElement.innerText =
                        "Registered: Not available";
                }

            } else {

                registeredElement.innerText =
                    "Registered: Not available";
            }
        }


        /* =================================================
           ROLE
        ================================================= */

        const roleElement =
            document.getElementById(
                "role"
            );


        if (roleElement) {

            roleElement.innerText =
                user.role || "USER";
        }


        /* =================================================
           LOAD REAL USER MATCHES
        ================================================= */

        await loadUserStatistics(
            user.username
        );


    }
    catch (error) {

        console.error(
            "Load user error:",
            error
        );
    }
}


/* =========================================================
   LOAD USER STATISTICS
========================================================= */

async function loadUserStatistics(
    targetUsername
) {

    try {

        /*
         * IMPORTANT:
         *
         * We use /api/matches/user/{username}
         *
         * instead of:
         *
         * /api/matches/analytics/user/{username}
         *
         * This gives us the actual stored matches.
         */

        const encodedUsername =
            encodeURIComponent(
                targetUsername
            );


        const response =
            await fetch(
                `${API_URL}/api/matches/user/${encodedUsername}`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                `Failed to load user matches (${response.status})`
            );
        }


        const data =
            await response.json();


        /*
         * Depending on the backend response,
         * it can be either:
         *
         * [
         *   match,
         *   match
         * ]
         *
         * or:
         *
         * {
         *   content: [...]
         * }
         */

        const matches =
            Array.isArray(data)
                ? data
                : Array.isArray(data.content)
                    ? data.content
                    : [];


        console.log(
            "========================================"
        );


        console.log(
            "ADMIN USER PROFILE"
        );


        console.log(
            "User:",
            targetUsername
        );


        console.log(
            "Total matches loaded:",
            matches.length
        );


        console.log(
            "Matches:",
            matches
        );


        /* =================================================
           TOTAL MATCHES
        ================================================= */

        const totalMatches =
            matches.length;


        /* =================================================
           WINS
        ================================================= */

        const wins =
            matches.filter(
                match =>
                    match.win === true
            ).length;


        /* =================================================
           LOSSES
        ================================================= */

        const losses =
            totalMatches -
            wins;


        /* =================================================
           TOTAL KILLS
        ================================================= */

        const totalKills =
            matches.reduce(
                (total, match) => {

                    return (
                        total +
                        Number(
                            match.kills || 0
                        )
                    );

                },
                0
            );


        /* =================================================
           TOTAL DEATHS
        ================================================= */

        const totalDeaths =
            matches.reduce(
                (total, match) => {

                    return (
                        total +
                        Number(
                            match.deaths || 0
                        )
                    );

                },
                0
            );



        /* =================================================
           KD RATIO
        ================================================= */

        const kdRatio =
            totalDeaths > 0
                ? totalKills / totalDeaths
                : 0;




        /* =================================================
           WIN RATE
        ================================================= */

        const winRate =
            totalMatches > 0
                ? (
                    wins /
                    totalMatches *
                    100
                )
                : 0;


        /* =================================================
           UPDATE TOTAL MATCHES
        ================================================= */

        const totalMatchesElement =
            document.getElementById(
                "totalMatches"
            );


        if (totalMatchesElement) {

            totalMatchesElement.innerText =
                totalMatches;
        }


        /* =================================================
           UPDATE WINS
        ================================================= */

        const winsElement =
            document.getElementById(
                "wins"
            );


        if (winsElement) {

            winsElement.innerText =
                wins;
        }


        /* =================================================
           UPDATE KD
        ================================================= */

        const kdElement =
            document.getElementById(
                "kdRatio"
            );


        if (kdElement) {

            kdElement.innerText =
                kdRatio.toFixed(2);
        }


        /* =================================================
           UPDATE KILLS
        ================================================= */

        const killsElement =
            document.getElementById(
                "totalKills"
            );


        if (killsElement) {

            killsElement.innerText =
                totalKills;
        }


        /* =================================================
           UPDATE WIN RATE
        ================================================= */

        const winRateElement =
            document.getElementById(
                "winRate"
            );


        if (winRateElement) {

            winRateElement.innerText =
                Math.round(winRate) + "%";
        }


        /* =================================================
           DEBUG
        ================================================= */

        const onlineMatches =
            matches.filter(
                match =>
                    String(
                        match.source || ""
                    )
                        .trim()
                        .toUpperCase() ===
                    "API"
            );


        const manualMatches =
            matches.filter(
                match =>
                    String(
                        match.source || ""
                    )
                        .trim()
                        .toUpperCase() !==
                    "API"
            );


        const gameCounts = {};


        matches.forEach(
            match => {

                const game =
                    match.gameName;


                if (!game) {

                    return;
                }


                gameCounts[game] =
                    (
                        gameCounts[game] || 0
                    ) + 1;
            }
        );


        console.log(
            "Online/API matches:",
            onlineMatches.length
        );


        console.log(
            "Manual matches:",
            manualMatches.length
        );


        console.log(
            "Total matches:",
            totalMatches
        );


        console.log(
            "Wins:",
            wins
        );


        console.log(
            "Losses:",
            losses
        );


        console.log(
            "Total kills:",
            totalKills
        );


        console.log(
            "Total deaths:",
            totalDeaths
        );


        console.log(
            "KD ratio:",
            kdRatio.toFixed(2)
        );


        console.log(
            "Win rate:",
            Math.round(winRate) + "%"
        );


        console.log(
            "Games:",
            gameCounts
        );


        console.log(
            "========================================"
        );

    }
    catch (error) {

        console.error(
            "User statistics error:",
            error
        );
    }
}


/* =========================================================
   DELETE USER
========================================================= */

function deleteUser() {

    const modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.style.display =
            "flex";
    }
}


function closeDeleteModal() {

    const modal =
        document.getElementById(
            "deleteModal"
        );


    if (modal) {

        modal.style.display =
            "none";
    }
}


/* =========================================================
   CONFIRM DELETE
========================================================= */

async function confirmDeleteUser() {

    try {

        const response =
            await fetch(
                `${API_URL}/api/admin/users?page=0&size=100`,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load users"
            );
        }


        const data =
            await response.json();


        const users =
            data.content || data;


        const user =
            users.find(
                u =>
                    (u.username || "")
                        .trim()
                        .toLowerCase() ===
                    (username || "")
                        .trim()
                        .toLowerCase()
            );


        if (!user) {

            alert(
                "User not found"
            );

            return;
        }


        const deleteResponse =
            await fetch(
                `${API_URL}/api/admin/users/${user.id}`,
                {
                    method: "DELETE",

                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );


        if (deleteResponse.ok) {

            window.location.href =
                "admin.html";

        } else {

            alert(
                "Failed to delete user"
            );
        }

    }
    catch (error) {

        console.error(
            "Delete error:",
            error
        );


        alert(
            "Server error"
        );
    }
}


/* =========================================================
   START
========================================================= */

loadUser();