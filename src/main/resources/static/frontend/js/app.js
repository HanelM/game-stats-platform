const token =
    localStorage.getItem("token");

const username =
    localStorage.getItem("username");

const userInfo =
    document.getElementById("user-info");

const logoutBtn =
    document.getElementById("logout-btn");
const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";
/* =========================
   USER INFO
========================= */

if (
    token &&
    username &&
    userInfo
) {

    userInfo.innerText =
        "👤 " + username;
}

if(logoutBtn){

    logoutBtn.style.display =
        "inline-block";
}

/* =========================
   GET ROLE FROM JWT TOKEN
========================= */

if(token){

    const payload =
        JSON.parse(
            atob(
                token.split(".")[1]
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

/* =========================
   LOGOUT
========================= */

if(logoutBtn){

    logoutBtn.addEventListener(
        "click",
        () => {

            localStorage.removeItem("token");

            localStorage.removeItem("username");

            window.location.href =
                "index.html";
        }
    );
}