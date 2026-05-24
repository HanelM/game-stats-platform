
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
   ELEMENTS
========================= */

const usersGrid =
    document.getElementById(
        "usersGrid"
    );

const searchInput =
    document.getElementById(
        "searchInput"
    );

const filterModal =
    document.getElementById(
        "filterModal"
    );

const openFilterBtn =
    document.getElementById(
        "openFilterBtn"
    );

const closeFilterBtn =
    document.getElementById(
        "closeFilterBtn"
    );

const applyFiltersBtn =
    document.getElementById(
        "applyFiltersBtn"
    );

const cancelFiltersBtn =
    document.getElementById(
        "cancelFiltersBtn"
    );

const registerFilter =
    document.getElementById(
        "registerFilter"
    );

const kdFilter =
    document.getElementById(
        "kdFilter"
    );

const scoreFilter =
    document.getElementById(
        "scoreFilter"
    );

const winrateFilter =
    document.getElementById(
        "winrateFilter"
    );

const killsFilter =
    document.getElementById(
        "killsFilter"
    );

const gameFilter =
    document.getElementById(
        "gameFilter"
    );

/* =========================
   GLOBAL USERS
========================= */

let allUsers = [];

/* =========================
   FILTER MODAL
========================= */

openFilterBtn.addEventListener(
    "click",
    () => {

        filterModal.classList.add(
            "active"
        );
    }
);

closeFilterBtn.addEventListener(
    "click",
    () => {

        filterModal.classList.remove(
            "active"
        );
    }
);

cancelFiltersBtn.addEventListener(
    "click",
    () => {

        filterModal.classList.remove(
            "active"
        );
    }
);

/* CLICK OUTSIDE CLOSE */

filterModal.addEventListener(
    "click",
    (e) => {

        if(e.target === filterModal){

            filterModal.classList.remove(
                "active"
            );
        }
    }
);

/* =========================
   APPLY FILTERS
========================= */

applyFiltersBtn.addEventListener(
    "click",
    () => {

        const value =
            searchInput.value.trim();

        if(value === ""){

            applySorting(allUsers);

        }else{

            searchUsers(value);
        }

        filterModal.classList.remove(
            "active"
        );
    }
);

/* =========================
   LOAD ALL USERS
========================= */

async function loadUsers(){

    try{

        let currentPage = 0;

        let totalPages = 1;

        let users = [];

        while(currentPage < totalPages){

            const response =
                await fetch(
                    '${API_URL}/api/admin/users?page=${currentPage}&size=50`,
                    {
                        headers:{
                            Authorization:
                                "Bearer " + token
                        }
                    }
                );

            if(!response.ok){

                console.log(
                    "Failed loading users"
                );

                return;
            }

            const data =
                await response.json();

            const currentUsers =
                data.content || [];

            users = [
                ...users,
                ...currentUsers
            ];

            totalPages =
                data.totalPages || 1;

            currentPage++;
        }

        const usersWithStats =
            await Promise.all(

                users.map(async user => {

                    try{

                        const statsResponse =
                            await fetch(
                                '${API_URL}/api/matches/analytics/user/${user.username}`,
                                {
                                    headers:{
                                        Authorization:
                                            "Bearer " + token
                                    }
                                }
                            );

                        if(!statsResponse.ok){

                            return {
                                ...user,
                                kdRatio:0,
                                avgScore:0,
                                winRate:0,
                                kills:0,
                                totalMatches:0,
                                favoriteGame:"Unknown"
                            };
                        }

                        const stats =
                            await statsResponse.json();


                        return {

                            ...user,

                            kdRatio:
                                stats.kdRatio || 0,


                            winRate:
                                stats.winRate || 0,

                            kills:
                                stats.totalKills || 0,

                            totalMatches:
                                stats.totalMatches || 0,

                            favoriteGame:
                                stats.favoriteGame || "Unknown"
                        };

                    }catch{

                        return {
                            ...user,
                            kdRatio:0,
                            avgScore:0,
                            winRate:0,
                            kills:0,
                            totalMatches:0,
                            favoriteGame:"Unknown"
                        };
                    }
                })
            );

        allUsers =
            usersWithStats;

        loadGames();

        applySorting(allUsers);

    }catch(error){

        console.log(
            "Load users error:",
            error
        );
    }
}

/* =========================
   LOAD GAMES
========================= */

function loadGames(){

    gameFilter.innerHTML = `

        <option value="all">
            All Games
        </option>

    `;

    const uniqueGames = [

        ...new Set(

            allUsers
                .map(user => user.favoriteGame)
                .filter(game =>
                    game &&
                    game !== "Unknown" &&
                    game.trim() !== ""
                )

        )

    ];

    uniqueGames.sort();

    uniqueGames.forEach(game => {

        gameFilter.innerHTML += `

            <option value="${game}">
                ${game}
            </option>

        `;
    });
}

/* =========================
   SEARCH USERS
========================= */

function searchUsers(value){

    const filtered =
        allUsers.filter(user =>

            user.username
                .toLowerCase()
                .includes(
                    value.toLowerCase()
                )

            ||

            user.email
                .toLowerCase()
                .includes(
                    value.toLowerCase()
                )
        );

    applySorting(filtered);
}

/* =========================
   APPLY SORTING
========================= */

function applySorting(users){

    let filteredUsers =
        [...users];

    /* =========================
       GAME FILTER
    ========================= */

    if(
        gameFilter &&
        gameFilter.value !== "all"
    ){

        filteredUsers =
            filteredUsers.filter(
                user =>
                    user.favoriteGame ===
                    gameFilter.value
            );
    }

    /* =========================
       REGISTER FILTER
    ========================= */

    if(
        registerFilter &&
        registerFilter.value === "newestRegistered"
    ){

        filteredUsers.sort(
            (a,b) => {

                const dateA =
                    a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0;

                const dateB =
                    b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0;

                return dateB - dateA;
            }
        );
    }

    else if(
        registerFilter &&
        registerFilter.value === "oldestRegistered"
    ){

        filteredUsers.sort(
            (a,b) => {

                const dateA =
                    a.createdAt
                        ? new Date(a.createdAt).getTime()
                        : 0;

                const dateB =
                    b.createdAt
                        ? new Date(b.createdAt).getTime()
                        : 0;

                return dateA - dateB;
            }
        );
    }

    /* =========================
       KD FILTER
    ========================= */

    else if(
        kdFilter &&
        kdFilter.value === "highestKD"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(b.kdRatio || 0)
                -
                Number(a.kdRatio || 0)
        );
    }

    else if(
        kdFilter &&
        kdFilter.value === "lowestKD"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(a.kdRatio || 0)
                -
                Number(b.kdRatio || 0)
        );
    }

    /* =========================
       MATCHES FILTER
    ========================= */

    else if(
        scoreFilter &&
        scoreFilter.value === "highestNumberMatches"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(b.totalMatches || 0)
                -
                Number(a.totalMatches || 0)
        );
    }

    else if(
        scoreFilter &&
        scoreFilter.value === "lowestNumberMatches"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(a.totalMatches || 0)
                -
                Number(b.totalMatches || 0)
        );
    }

    /* =========================
       WINRATE FILTER
    ========================= */

    else if(
        winrateFilter &&
        winrateFilter.value === "highestWinrate"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(b.winRate || 0)
                -
                Number(a.winRate || 0)
        );
    }

    else if(
        winrateFilter &&
        winrateFilter.value === "lowestWinrate"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(a.winRate || 0)
                -
                Number(b.winRate || 0)
        );
    }

    /* =========================
       KILLS FILTER
    ========================= */

    else if(
        killsFilter &&
        killsFilter.value === "highestKills"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(b.kills || 0)
                -
                Number(a.kills || 0)
        );
    }

    else if(
        killsFilter &&
        killsFilter.value === "lowestKills"
    ){

        filteredUsers.sort(
            (a,b) =>
                Number(a.kills || 0)
                -
                Number(b.kills || 0)
        );
    }

    renderUsers(filteredUsers);
}
/* =========================
   RENDER USERS
========================= */

function renderUsers(users){

    usersGrid.innerHTML = "";

    if(users.length === 0){

        usersGrid.innerHTML = `

            <div class="empty-users">

                <i class="fa-solid fa-user-slash"></i>

                <h2>No users found</h2>

            </div>

        `;

        return;
    }

    users.forEach(user => {

        usersGrid.innerHTML += `

            <div class="user-card"
                 onclick="openUserProfile('${user.username}')">

                <div class="user-top">

                    <div class="avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="user-info">

                        <h3>
                            ${user.username}
                        </h3>

                        <p>
                            ${user.email}
                        </p>

                        <span class="role">
                            ${user.role}
                        </span>

                    </div>

                </div>

                <div class="stats-grid">

                    <div class="mini-stat">
                        <span>KD</span>
                        <strong>${user.kdRatio.toFixed(2)}</strong>
                    </div>

                    <div class="mini-stat">
                        <span>Matches</span>
                        <strong>${user.totalMatches || 0}</strong>
                    </div>

                    <div class="mini-stat">
                        <span>Win%</span>
                        <strong>${user.winRate}%</strong>
                    </div>

                    <div class="mini-stat">
                        <span>Kills</span>
                        <strong>${user.kills}</strong>
                    </div>

                </div>

                <button class="view-btn"
                        onclick="event.stopPropagation(); openUserProfile('${user.username}')">

                    View Profile

                </button>

            </div>

        `;
    });
}

/* =========================
   OPEN PROFILE
========================= */

function openUserProfile(username){

    window.location.href =
        `user-profile.html?username=${username}`;
}

/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    (e) => {

        const value =
            e.target.value.trim();

        if(value === ""){

            applySorting(allUsers);

        }else{

            searchUsers(value);
        }
    }
);

/* =========================
   START
========================= */

loadUsers();