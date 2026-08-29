
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";

const API_BASE =
    `${API_URL}/api/auth`;
/* =========================
   PAGE LOAD
========================= */

window.onload = function(){

    checkAuth();
};

/* =========================
   CHECK LOGIN
========================= */

function checkAuth(){

    const username =
        localStorage.getItem("username");

    if(username){

        // HIDE LOGIN
        document.getElementById(
            "auth-section"
        ).style.display = "none";

        // SHOW PROFILE
        document.getElementById(
            "profile-section"
        ).style.display = "flex";

        // SET USERNAME
        document.getElementById(
            "profile-username"
        ).innerText = username;

        document.getElementById(
            "profile-avatar"
        ).innerText =
            username.charAt(0)
                .toUpperCase();

        loadProfileStats();
    }
    else{

        // SHOW LOGIN
        document.getElementById(
            "auth-section"
        ).style.display = "flex";

        // HIDE PROFILE
        document.getElementById(
            "profile-section"
        ).style.display = "none";
    }
}

/* =========================
   SWITCH FORMS
========================= */

function showRegister() {

    document.getElementById(
        "login-form"
    ).style.display = "none";

    document.getElementById(
        "register-form"
    ).style.display = "block";

    document.getElementById(
        "form-title"
    ).innerText = "Register";
}

function showLogin() {

    document.getElementById(
        "register-form"
    ).style.display = "none";

    document.getElementById(
        "login-form"
    ).style.display = "block";

    document.getElementById(
        "form-title"
    ).innerText = "Login";
}

/* =========================
   LOGIN
========================= */

async function login() {

    const username =
        document.getElementById(
            "login-username"
        );

    const password =
        document.getElementById(
            "login-password"
        );

    let errorBox =
        document.getElementById(
            "login-error"
        );

    // CREATE ERROR DIV IF NOT EXISTS
    if (!errorBox) {

        errorBox = document.createElement("p");

        errorBox.id = "login-error";

        errorBox.style.color = "red";

        document.getElementById(
            "login-form"
        ).appendChild(errorBox);
    }

    errorBox.innerText = "";

    /* EMPTY FIELDS */

    if(username.value.trim() === ""){

        errorBox.innerText =
            "Username is mandatory";

        username.classList.add("error");

        return;
    }

    if(password.value.trim() === ""){

        errorBox.innerText =
            "Password is mandatory";

        password.classList.add("error");

        return;
    }

    /* SHORT USERNAME */

    if(username.value.length < 3){

        errorBox.innerText =
            "Username must be at least 3 characters";

        username.classList.add("error");

        return;
    }

    /* SHORT PASSWORD */

    if(password.value.length < 4){

        errorBox.innerText =
            "Password must be at least 4 characters";

        password.classList.add("error");

        return;
    }

    const data = {
        username: username.value,
        password: password.value
    };

    try {

        const response = await fetch(
            API_BASE + "/login",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify(data)
            }
        );

        let result = {};

        try {

            result = await response.json();

        } catch (e) {}

        if (response.ok) {

            localStorage.setItem(
                "token",
                result.token
            );

            localStorage.setItem(
                "username",
                username.value
            );

            location.reload();

        } else {

            if(result.message){

                errorBox.innerText =
                    result.message;
            }
            else{

                errorBox.innerText =
                    "Wrong username or password";
            }
        }

    } catch (error) {

        errorBox.innerText =
            "Server error";
    }
}

/* =========================
   REGISTER
========================= */

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async function (e) {

            e.preventDefault();

            const username =
                document.getElementById(
                    "register-username"
                );

            const email =
                document.getElementById(
                    "register-email"
                );

            const password =
                document.getElementById(
                    "register-password"
                );

            const message =
                document.getElementById(
                    "register-message"
                );

            message.innerText = "";
            message.style.color = "";


            /* =========================
               CLIENT-SIDE VALIDATION
            ========================= */

            if (username.value.trim() === "") {

                message.innerText =
                    "Username is required.";

                username.focus();

                return;
            }

            if (email.value.trim() === "") {

                message.innerText =
                    "Email is required.";

                email.focus();

                return;
            }

            if (password.value === "") {

                message.innerText =
                    "Password is required.";

                password.focus();

                return;
            }

            if (username.value.trim().length < 3) {

                message.innerText =
                    "Username must be at least 3 characters.";

                username.focus();

                return;
            }

            if (password.value.length < 4) {

                message.innerText =
                    "Password must be at least 4 characters.";

                password.focus();

                return;
            }


            const data = {

                username:
                    username.value.trim(),

                email:
                    email.value.trim(),

                password:
                    password.value
            };


            try {

                const response =
                    await fetch(
                        API_BASE + "/register",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify(data)
                        }
                    );


                let result = {};

                try {

                    result =
                        await response.json();

                } catch (e) {

                    console.error(
                        "Could not parse server response.",
                        e
                    );
                }


                if (response.ok) {

                    message.style.color =
                        "lightgreen";

                    message.innerText =
                        "Registration successful!";


                    if (result.token) {

                        localStorage.setItem(
                            "token",
                            result.token
                        );

                    }

                    localStorage.setItem(
                        "username",
                        username.value.trim()
                    );


                    setTimeout(
                        function () {

                            window.location.href =
                                "index.html";

                        },
                        1000
                    );


                } else {

                    message.style.color =
                        "red";

                    message.innerText =
                        result.message ||
                        result.error ||
                        "Registration failed.";
                }


            } catch (error) {

                console.error(
                    "Registration error:",
                    error
                );

                message.style.color =
                    "red";

                message.innerText =
                    "Unable to connect to the server.";
            }

        }
    );
}

/* =========================
   LOGOUT
========================= */

function logout() {

    localStorage.removeItem("token");

    localStorage.removeItem("username");

    location.reload();
}

/* =========================
   PROFILE STATS
========================= */

async function loadProfileStats(){

    const token =
        localStorage.getItem("token");

    if(!token){
        return;
    }

    /* =========================
       USER PROFILE
    ========================= */

    try{

        const profileResponse = await fetch(
            `${API_URL}/api/users/profile`,
            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const profile =
            await profileResponse.json();

        const emailElement =
            document.getElementById(
                "profile-email"
            );

        const createdElement =
            document.getElementById(
                "profile-created"
            );

        if(emailElement){

            emailElement.innerText =
                profile.email || "-";
        }

        if(createdElement){

            createdElement.innerText =
                profile.createdAt
                    ? profile.createdAt.substring(0,10)
                    : "-";
        }

    }catch(error){

        console.log(error);
    }

    /* =========================
       MATCH STATISTICS
    ========================= */

    try{

        const response = await fetch(
            `${API_URL}/api/matches/my`,
            {
                headers:{
                    "Authorization":
                        "Bearer " + token
                }
            }
        );

        const data =
            await response.json();

        const matches =
            data.content || [];

        const totalMatches =
            matches.length;

        const wins =
            matches.filter(
                m => m.win
            ).length;

        const losses =
            totalMatches - wins;

        const totalKills =
            matches.reduce(
                (sum,m) =>
                    sum + (m.kills || 0),
                0
            );

        const winRate =
            totalMatches > 0
                ? Math.round(
                    (wins / totalMatches)
                    * 100
                )
                : 0;

        /* =========================
           XP + LEVEL
        ========================= */

        const totalXP =

            (matches.length * 25) +

            (wins * 100) +

            (totalKills * 15);

        const level =
            Math.floor(totalXP / 1000) + 1;

        const currentXP =
            totalXP % 1000;

        const xpPercent =
            (currentXP / 1000) * 100;

        const levelElement =
            document.getElementById(
                "profile-level"
            );

        const xpTextElement =
            document.getElementById(
                "xp-text"
            );

        const xpFillElement =
            document.getElementById(
                "xp-fill"
            );

        if(levelElement){

            levelElement.innerText =
                level;
        }

        if(xpTextElement){

            xpTextElement.innerText =
                currentXP + " / 1000 XP";
        }

        if(xpFillElement){

            xpFillElement.style.width =
                xpPercent + "%";
        }

        /* =========================
           FAVORITE GAME
        ========================= */

        const games = {};

        matches.forEach(match => {

            if(!games[match.gameName]){

                games[match.gameName] = 0;
            }

            games[match.gameName]++;
        });

        let favoriteGame = "-";

        let highest = 0;

        Object.entries(games)
            .forEach(([game,count]) => {

                if(count > highest){

                    highest = count;

                    favoriteGame = game;
                }
            });

        /* =========================
           SET PROFILE STATS
        ========================= */

        document.getElementById(
            "profile-matches"
        ).innerText = totalMatches;

        document.getElementById(
            "profile-wins"
        ).innerText = wins;

        document.getElementById(
            "profile-losses"
        ).innerText = losses;

        document.getElementById(
            "profile-winrate"
        ).innerText =
            winRate + "%";

        document.getElementById(
            "profile-kills"
        ).innerText =
            totalKills;

        document.getElementById(
            "favorite-game"
        ).innerText =
            favoriteGame;



    }catch(error){

        console.log(error);
    }
}
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