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