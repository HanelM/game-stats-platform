const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const username = params.get("username");

/* =========================
   PROTECTION
========================= */

if (!token || !username) {
    window.location.href = "admin.html";
}

/* =========================
   NAV BUTTONS
========================= */

function openDashboard() {
    window.location.href = `dashboard.html?username=${username}`;
}

function openAnalytics() {
    window.location.href = `analytics.html?username=${username}`;
}

/* =========================
   LOAD USER (FIXED + PAGINATION SAFE)
========================= */

async function loadUser() {

    document.getElementById("username").innerText = "Loading...";
    document.getElementById("email").innerText = "Loading...";

    try {

        /* =========================
           LOAD ALL USERS (PAGINATION FIX)
        ========================= */

        let currentPage = 0;
        let totalPages = 1;
        let users = [];

        while (currentPage < totalPages) {

            const response = await fetch(
                `http://localhost:8080/api/admin/users?page=${currentPage}&size=50`,
                {
                    headers: {
                        Authorization: "Bearer " + token
                    }
                }
            );

            const data = await response.json();

            users = [...users, ...(data.content || [])];

            totalPages = data.totalPages || 1;
            currentPage++;
        }

        /* =========================
           FIND USER (SAFE MATCH)
        ========================= */

        const user = users.find(
            u =>
                (u.username || "").trim().toLowerCase() ===
                (username || "").trim().toLowerCase()
        );

        if (!user) {
            document.getElementById("username").innerText = "User not found";
            document.getElementById("email").innerText = "";
            return;
        }

       /* =========================
          USER INFO
       ========================= */

       document.getElementById("username").innerText =
           user.username || "-";

       /* EMAIL */
       document.getElementById("email").innerText =
           user.email || "-";

       /* REGISTERED */
       const registeredEl =
           document.getElementById("registered");

       if (registeredEl) {

           if (user.createdAt) {

               const date =
                   new Date(user.createdAt);

               if (!isNaN(date.getTime())) {

                   registeredEl.innerText =
                       "Registered: " +
                       date.toLocaleString();

               } else {

                   registeredEl.innerText =
                       "Registered: Not available";
               }

           } else {

               registeredEl.innerText =
                   "Registered: Not available";
           }
       }

       /* ROLE */
       document.getElementById("role").innerText =
           user.role || "-";



        /* =========================
           ANALYTICS
        ========================= */

        const analyticsResponse = await fetch(
            `http://localhost:8080/api/matches/analytics/user/${username}`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const analytics = await analyticsResponse.json();

        document.getElementById("totalMatches").innerText =
            analytics.totalMatches ?? 0;

        document.getElementById("wins").innerText =
            analytics.wins ?? 0;

        document.getElementById("kdRatio").innerText =
            Number(analytics.kdRatio || 0).toFixed(2);

        document.getElementById("totalKills").innerText =
            analytics.totalKills ?? 0;

        document.getElementById("winRate").innerText =
            (analytics.winRate ?? 0) + "%";

    } catch (error) {
        console.log("Load user error:", error);
    }
}

/* =========================
   DELETE USER
========================= */

function deleteUser() {

    document
        .getElementById("deleteModal")
        .style.display = "flex";
}

function closeDeleteModal() {

    document
        .getElementById("deleteModal")
        .style.display = "none";
}

async function confirmDeleteUser() {

    try {

        /* =========================
           LOAD ALL USERS
        ========================= */

        const response = await fetch(
            `http://localhost:8080/api/admin/users?page=0&size=100`,
            {
                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        const data = await response.json();

        const users =
            data.content || data;

        /* =========================
           FIND USER
        ========================= */

        const user = users.find(
            u =>
                (u.username || "").trim().toLowerCase() ===
                (username || "").trim().toLowerCase()
        );

        if (!user) {

            alert("User not found");

            return;
        }

        /* =========================
           DELETE USER
        ========================= */

        const deleteResponse = await fetch(
            `http://localhost:8080/api/admin/users/${user.id}`,
            {
                method: "DELETE",

                headers: {
                    Authorization: "Bearer " + token
                }
            }
        );

        /* =========================
           SUCCESS
        ========================= */

        if (deleteResponse.ok) {

            window.location.href =
                "admin.html";

        } else {

            alert("Failed to delete user");
        }

    } catch (error) {

        console.log(
            "Delete error:",
            error
        );

        alert("Server error");
    }
}

/* =========================
   START
========================= */

loadUser();