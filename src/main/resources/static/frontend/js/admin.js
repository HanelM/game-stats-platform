
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";

const token =
    localStorage.getItem("token");

/* =========================
   ADMIN PROTECTION
========================= */

if(token){

    const payload =
        JSON.parse(
            atob(
                token.split(".")[1]
            )
        );

    if(payload.role !== "ADMIN"){

        window.location.href =
            "index.html";
    }

}else{

    window.location.href =
        "index.html";
}

/* =========================
   GLOBAL USERS
========================= */

let allUsers = [];

/* =========================
   LOAD USERS
========================= */

async function loadUsers(){

    try{

        const response =
            await fetch(
                `${API_URL}/api/admin/users`,
                {
                    headers:{
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        const users =
            data.content || data;

        const totalUsers =
            data.totalElements || users.length;

        allUsers = users;

        updateStats(users, totalUsers);

        /* =========================
           RECENTLY LOGGED ACCOUNTS
           LAST 4 USERS
        ========================= */

        const recentUsers =
            [...users]
                .reverse()
                .slice(0,4);

        renderUsers(recentUsers);

    }catch(error){

        console.log(
            "Load users error:",
            error
        );
    }
}

/* =========================
   UPDATE STATS
========================= */

function updateStats(users, totalUsers){

    document.getElementById(
        "totalUsers"
    ).innerText =
        totalUsers;

    const adminCount =
        users.filter(
            user =>
                user.role === "ADMIN"
        ).length;

    document.getElementById(
        "adminCount"
    ).innerText =
        adminCount;
}

/* =========================
   RENDER USERS
========================= */

function renderUsers(users){

    const usersGrid =
        document.getElementById(
            "usersGrid"
        );

    usersGrid.innerHTML = "";

    if(users.length === 0){

        usersGrid.innerHTML = `

            <div class="empty-users">

                <i class="fa-solid fa-user-slash"></i>

                <h2>
                    No users found
                </h2>

            </div>

        `;

        return;
    }

    users.forEach(user => {

        usersGrid.innerHTML += `

            <div
                class="user-card"
                onclick="openUserProfile('${user.username}')"
            >

                <div class="user-top">

                    <div>

                        <h3>
                            ${user.username}
                        </h3>

                        <p class="email">
                            ${user.email}
                        </p>

                    </div>

                </div>

                <div class="user-role">

                    ${user.role}

                </div>

                <button
                    class="delete-btn"
                    onclick="event.stopPropagation(); openUserProfile('${user.username}')"
                >

                    View Profile

                </button>

            </div>

        `;
    });
}

/* =========================
   OPEN USER PROFILE
========================= */

function openUserProfile(username){

    window.location.href =
        `user-profile.html?username=${username}`;
}
/* =========================
   SEARCH USERS
========================= */

async function searchUsers(value){

    try{

        const response =
            await fetch(
                `${API_URL}/api/admin/users/search?username=${value}&page=0&size=20`,
                {
                    headers:{
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

        const data =
            await response.json();

        const users =
            data.content || [];

        renderUsers(users);

    }catch(error){

        console.log(
            "Search error:",
            error
        );
    }
}

/* =========================
   SEARCH INPUT
========================= */

document.getElementById(
    "searchInput"
).addEventListener(
    "input",
    (e) => {

        const value =
            e.target.value.trim();

        const usersTitle =
            document.getElementById(
                "usersTitle"
            );

        if(value === ""){

            usersTitle.innerText =
                "Recently Logged Accounts";

            const recentUsers =
                [...allUsers]
                    .reverse()
                    .slice(0,4);

            renderUsers(recentUsers);

        }else{

            usersTitle.innerText =
                "Find User By Username Or Email";

            searchUsers(value);
        }
    }
);

/* =========================
   START
========================= */

loadUsers();