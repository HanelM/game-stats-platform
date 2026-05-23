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

let selectedDeleteId = null;

/* =========================
   LOAD USERS
========================= */

async function loadUsers(){

    try{

        const response =
            await fetch(
                "http://localhost:8080/api/admin/users",
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

        allUsers = users;

        /* SHOW 4 USERS */

        renderTopPlayers();

    }catch(error){

        console.log(
            "Load users error:",
            error
        );
    }
}

/* =========================
   RENDER USERS
========================= */

function renderUsers(users){

    const usersContainer =
        document.getElementById(
            "usersContainer"
        );

    usersContainer.innerHTML = "";

    if(users.length === 0){

        usersContainer.innerHTML = `

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

        usersContainer.innerHTML += `

            <div
                class="user-card"
                onclick="openUserProfile('${user.username}')"
            >

                <div class="user-left">

                    <div class="avatar">
                        <i class="fa-solid fa-user"></i>
                    </div>

                    <div class="user-info">

                        <h3>
                            ${user.username}
                        </h3>

                        <p class="email">
                            ${user.email}
                        </p>

                        <span class="user-role">
                            ${user.role}
                        </span>

                    </div>

                </div>

                <button
                    class="delete-btn"
                    onclick="event.stopPropagation(); openDeleteModal('${user.id}')"
                >

                    Delete User

                </button>

            </div>

        `;
    });
}

/* =========================
   MOST ACTIVE PLAYERS
========================= */

function renderTopPlayers(){

    const sectionTitle =
        document.getElementById(
            "sectionTitle"
        );

    sectionTitle.innerText =
        "New Registered Users";

    const topPlayers =
        [...allUsers]
            .reverse()
            .slice(0,4);

    renderUsers(topPlayers);
}

/* =========================
   OPEN PROFILE
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
                `http://localhost:8080/api/admin/users/search?username=${value}&page=0&size=20`,
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

        const sectionTitle =
            document.getElementById(
                "sectionTitle"
            );

        if(value === ""){

            sectionTitle.innerText =
                "Most Active Players";

            renderTopPlayers();

        }else{

            sectionTitle.innerText =
                "All Users";

            searchUsers(value);
        }
    }
);

/* =========================
   DELETE MODAL
========================= */

function openDeleteModal(id){

    selectedDeleteId = id;

    document.getElementById(
        "deleteModal"
    ).style.display = "flex";
}

function closeDeleteModal(){

    document.getElementById(
        "deleteModal"
    ).style.display = "none";
}

/* =========================
   CONFIRM DELETE
========================= */

document.getElementById(
    "confirmDeleteBtn"
).addEventListener(
    "click",
    async () => {

        if(!selectedDeleteId){
            return;
        }

        try{

            await fetch(
                `http://localhost:8080/api/admin/users/${selectedDeleteId}`,
                {
                    method:"DELETE",

                    headers:{
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

            closeDeleteModal();

            loadUsers();

        }catch(error){

            console.log(
                "Delete error:",
                error
            );
        }
    }
);

/* =========================
   START
========================= */

loadUsers();