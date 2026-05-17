
window.onload = () => {

    // =========================
    // TOAST
    // =========================

    function showToast(text, success){

        const old =
            document.getElementById(
                "custom-toast"
            );

        if(old)
            old.remove();

        const toast =
            document.createElement("div");

        toast.id = "custom-toast";

        toast.innerText = text;

        toast.style.position = "fixed";
        toast.style.top = "24px";
        toast.style.right = "24px";
        toast.style.padding = "14px 22px";
        toast.style.borderRadius = "14px";
        toast.style.fontWeight = "700";
        toast.style.fontSize = "14px";
        toast.style.color = "white";
        toast.style.zIndex = "999999";
        toast.style.boxShadow =
            "0 0 30px rgba(0,0,0,0.35)";
        toast.style.backdropFilter =
            "blur(10px)";

        toast.style.background = success
            ? "rgba(34,197,94,0.95)"
            : "rgba(239,68,68,0.95)";

        document.body.appendChild(toast);

        setTimeout(() => {

            toast.remove();

        }, 3000);
    }



    // =========================
    // SWAGGER UI
    // =========================

    window.ui = SwaggerUIBundle({

        url: "/v3/api-docs",

        dom_id: "#swagger-ui",

        deepLinking: true,

        displayRequestDuration: true,

        docExpansion: "none",

        defaultModelsExpandDepth: 2,

        defaultModelExpandDepth: 2,

        tryItOutEnabled: true,

        persistAuthorization: false,

        tagsSorter: "alpha",

        operationsSorter: "method",

        requestInterceptor: (request) => {

            const token =
                localStorage.getItem(
                    "jwt_token"
                );

            if(token){

                request.headers["Authorization"] =
                    "Bearer " + token;
            }

            return request;
        },

        responseInterceptor: async (response) => {

            try {

                if(
                    response.url.includes("/api/auth/login") &&
                    response.status === 200
                ){

                    const body =
                        JSON.parse(response.text);

                    if(body.token){

                        localStorage.setItem(
                            "jwt_token",
                            body.token
                        );

                        const profileResponse =
                            await fetch(
                                "/api/users/profile",
                                {
                                    headers:{
                                        "Authorization":
                                            "Bearer " + body.token
                                    }
                                }
                            );

                        if(profileResponse.ok){

                            let username =
                                await profileResponse.text();

                            username =
                                username.replace(
                                    "Welcome ",
                                    ""
                                );

                            document.getElementById(
                                "logged-user"
                            ).innerText =
                                "👤 " + username;

                            showToast(
                                "Logged in as " + username,
                                true
                            );
                        }
                    }

                }

            } catch(e){}

            return response;
        },

        // =========================
        // ONLY ONE OPEN
        // =========================

        onComplete: () => {

            setTimeout(() => {

                document
                    .querySelectorAll(
                        ".opblock-summary"
                    )
                    .forEach(summary => {

                    summary.addEventListener(
                        "click",
                        () => {

                        setTimeout(() => {

                            const current =
                                summary.closest(
                                    ".opblock"
                                );

                            document
                                .querySelectorAll(
                                    ".opblock"
                                )
                                .forEach(block => {

                                if(
                                    block !== current
                                ){

                                    block.classList.remove(
                                        "is-open"
                                    );
                                }
                            });

                        }, 50);
                    });
                });

            }, 1000);

            // =========================
            // RELOAD BUTTON FIX
            // =========================

            setTimeout(() => {

                const reloadBtn =
                    document.querySelector(
                        ".download-url-button"
                    );

                if(
                    reloadBtn &&
                    !reloadBtn.dataset.fixed
                ){

                    reloadBtn.dataset.fixed =
                        "true";

                    reloadBtn.addEventListener(
                        "click",
                        () => {

                        const token =
                            localStorage.getItem(
                                "jwt_token"
                            );

                        setTimeout(() => {

                            location.reload();

                        }, 300);
                    });
                }

            }, 1000);
        }
    });

    // =========================
    // LOAD USER
    // =========================

    const savedToken =
        localStorage.getItem(
            "jwt_token"
        );

    if(savedToken){

        fetch("/api/users/profile",{

            headers:{
                "Authorization":
                    "Bearer " + savedToken
            }

        })
        .then(r => r.text())
        .then(username => {

            username =
                username.replace(
                    "Welcome ",
                    ""
                );

            document.getElementById(
                "logged-user"
            ).innerText =
                "👤 " + username;

            const topAuthorizeBtn =
                document.querySelector(
                    ".authorize"
                );

            if(topAuthorizeBtn){

                topAuthorizeBtn.innerText =
                    "Logout";
            }

        })
        .catch(() => {});
    }

    // =========================
    // AUTHORIZE BUTTON FIX
    // =========================

    setInterval(() => {

        const authBtn =
            document.querySelector(
                ".authorize"
            );

        if(
            authBtn &&
            !authBtn.dataset.fixed
        ){

            authBtn.dataset.fixed = "true";

            authBtn.addEventListener(
                "click",
                () => {

                    // LOGOUT

                    if(
                        authBtn.innerText
                            .trim()
                            .toLowerCase() === "logout"
                    ){

                        localStorage.removeItem(
                            "jwt_token"
                        );

                        showToast(
                            "Logged out successfully",
                            true
                        );

                        location.reload();

                        return;
                    }

                    // LOGIN

                    setTimeout(() => {

                        const input =
                            document.querySelector(
                                '.dialog-ux input[type="text"]'
                            );

                        const modalAuthBtn =
                            document.querySelector(
                                ".auth-btn-wrapper .btn.modal-btn.auth"
                            );

                        if(
                            !input ||
                            !modalAuthBtn
                        ){
                            return;
                        }

                        modalAuthBtn.onclick =
                            async (e) => {

                            e.preventDefault();

                            let token =
                                input.value.trim();

                            token =
                                token.replace(
                                    "Bearer ",
                                    ""
                                );

                            if(!token){

                                showToast(
                                    "Please enter token",
                                    false
                                );

                                return;
                            }

                            try {

                                const response =
                                    await fetch(
                                        "/api/users/profile",
                                        {
                                            headers:{
                                                "Authorization":
                                                    "Bearer " + token
                                            }
                                        }
                                    );

                                if(!response.ok){

                                    input.value = "";

                                    input.focus();

                                    showToast(
                                        "Wrong or expired token",
                                        false
                                    );

                                    return;
                                }

                                let username =
                                    await response.text();

                                username =
                                    username.replace(
                                        "Welcome ",
                                        ""
                                    );

                                localStorage.setItem(
                                    "jwt_token",
                                    token
                                );

                                document.getElementById(
                                    "logged-user"
                                ).innerText =
                                    "👤 " + username;

                                showToast(
                                    "Logged in as " + username,
                                    true
                                );

                                authBtn.innerText =
                                    "Logout";

                                const closeBtn =
                                    document.querySelector(
                                        ".close-modal"
                                    );

                                if(closeBtn){
                                    closeBtn.click();
                                }

                            }
                            catch(e){

                                input.value = "";

                                input.focus();

                                showToast(
                                    "Wrong or expired token",
                                    false
                                );
                            }
                        };

                    }, 300);

                }
            );
        }

    }, 1000);

    // =========================
    // COPY TOKEN BUTTON
    // =========================

    setInterval(() => {

        document
            .querySelectorAll(".responses-wrapper")
            .forEach(wrapper => {

            if(
                !wrapper.innerText.includes(
                    '"token"'
                )
            ){
                return;
            }

            const downloadBtn =
                wrapper.querySelector(
                    ".download-contents"
                );

            if(!downloadBtn)
                return;

            if(
                downloadBtn.parentElement.querySelector(
                    ".custom-copy-token-btn"
                )
            ){
                return;
            }

            const copyBtn =
                document.createElement("button");

            copyBtn.className =
                "custom-copy-token-btn";

            copyBtn.innerText =
                "Copy Token";

            copyBtn.onclick = () => {

                const codeBlock =
                    wrapper.querySelector(
                        ".highlight-code pre"
                    );

                if(!codeBlock)
                    return;

                const text =
                    codeBlock.innerText;

                const match =
                    text.match(
                        /"token"\s*:\s*"([^"]+)"/
                    );

                if(!match)
                    return;

                const token =
                    match[1];

                navigator.clipboard.writeText(
                    token
                );

                copyBtn.innerText =
                    "Copied ✓";

                setTimeout(() => {

                    copyBtn.innerText =
                        "Copy Token";

                }, 1500);
            };

            downloadBtn.parentElement.insertBefore(
                copyBtn,
                downloadBtn
            );

        });

    }, 1000);

// =========================
// NAVIGATION PANEL FIX
// =========================

setInterval(() => {

    document
        .querySelectorAll(".nav-item")
        .forEach(item => {

        if(item.dataset.fixed){
            return;
        }

        item.dataset.fixed = "true";

        item.addEventListener(
            "click",
            function(){

            // =====================
            // SCHEMAS
            // =====================

            if(
                this.id === "schemas-nav"
            ){

                const models =
                    document.querySelector(
                        ".models"
                    );

                if(models){

                    models.scrollIntoView({

                        behavior:"smooth",
                        block:"start"
                    });

                    models.style.boxShadow =
                        "0 0 40px rgba(34,197,94,0.35)";

                    setTimeout(() => {

                        models.style.boxShadow = "";

                    }, 2000);
                }

                return;
            }

            // =====================
            // CUSTOM TAG MATCHING
            // =====================

            let tagName =
                this.dataset.tag
                    .toLowerCase();

            // FIX YOUR CUSTOM NAMES

            if(
                tagName.includes(
                    "authentication"
                )
            ){
                tagName = "authentication";
            }

            else if(
                tagName.includes(
                    "leaderboard"
                )
            ){
                tagName = "leaderboard";
            }

            else if(
                tagName.includes(
                    "match"
                )
            ){
                tagName = "match";
            }

            else if(
                tagName.includes(
                    "user"
                )
            ){
                tagName = "user";
            }

            else if(
                tagName.includes(
                    "admin"
                )
            ){
                tagName = "admin";
            }

            else if(
                tagName.includes(
                    "test"
                )
            ){
                tagName = "test";
            }

            // =====================
            // FIND SWAGGER TAG
            // =====================

            const tags =
                document.querySelectorAll(
                    ".opblock-tag"
                );

            let found = false;

            tags.forEach(tag => {

                const tagText =
                    tag.innerText
                        .trim()
                        .toLowerCase();

                if(
                    tagText.includes(tagName)
                ){

                    found = true;

                    tag.scrollIntoView({

                        behavior:"smooth",
                        block:"start"
                    });

                    tag.style.boxShadow =
                        "0 0 40px rgba(34,197,94,0.35)";

                    setTimeout(() => {

                        tag.style.boxShadow = "";

                    }, 2000);
                }
            });

            // =====================
            // NOT FOUND
            // =====================

            if(!found){

                showToast(
                    "Section not found",
                    false
                );
            }
        });
    });

}, 1000);

// =========================
// SEARCH SUGGESTIONS
// =========================

const searchInput =
    document.getElementById(
        "search-box"
    );

const suggestionsBox =
    document.getElementById(
        "search-suggestions"
    );

// =========================
// SEARCH DATA
// =========================

const suggestions = [

    // =========================
    // AUTHENTICATION
    // =========================

    {
        label:"Authentication",
        search:"authentication"
    },

    {
        label:"Login user",
        search:"authentication"
    },

    {
        label:"Register user",
        search:"authentication"
    },

    // =========================
    // USER MANAGEMENT
    // =========================

    {
        label:"Get user profile",
        search:"user"
    },

    {
        label:"User leaderboard",
        search:"user"
    },

    // =========================
    // ADMIN
    // =========================

    {
        label:"Admin dashboard",
        search:"admin"
    },

    {
        label:"Get all users",
        search:"admin"
    },

    {
        label:"Delete user",
        search:"admin"
    },

    {
        label:"Search users",
        search:"admin"
    },

    // =========================
    // MATCH MANAGEMENT
    // =========================

    {
        label:"Match management",
        search:"match"
    },

    {
        label:"Create match",
        search:"match"
    },

    {
        label:"Get player matches",
        search:"match"
    },

    {
        label:"Get player statistics",
        search:"match"
    },

    {
        label:"Search player matches",
        search:"match"
    },

    {
        label:"Filter matches",
        search:"match"
    },

    {
        label:"Get matches between dates",
        search:"match"
    },

    {
        label:"Get player analytics",
        search:"match"
    },

    // =========================
    // LEADERBOARD
    // =========================

    {
        label:"Leaderboard",
        search:"leaderboard"
    },

    {
        label:"Get leaderboard",
        search:"leaderboard"
    },

    // =========================
    // TESTING
    // =========================

    {
        label:"Testing",
        search:"test"
    },

    {
        label:"Test hello",
        search:"test"
    },

    // =========================
    // MODELS
    // =========================

    {
        label:"Schemas",
        search:"schemas"
    },

    {
        label:"Models",
        search:"models"
    }
];

// =========================
// SHOW SUGGESTIONS
// =========================

searchInput.addEventListener(
    "focus",
    () => {

    renderSuggestions(
        suggestions
    );
});

// =========================
// ENTER SEARCH
// =========================

searchInput.addEventListener(
    "keydown",
    (e) => {

    if(e.key !== "Enter"){
        return;
    }

    const value =
        searchInput.value
            .trim()
            .toLowerCase();

    if(!value){
        return;
    }

    let found = false;

    document
        .querySelectorAll(".opblock")
        .forEach(block => {

        const text =
            block.innerText
                .toLowerCase();

        if(text.includes(value)){

            found = true;

            block.scrollIntoView({

                behavior:"smooth",
                block:"center"
            });

            block.style.boxShadow =
                "0 0 40px rgba(34,197,94,0.45)";

            setTimeout(() => {

                block.style.boxShadow = "";

            }, 2500);
        }
    });

    if(!found){

        showToast(
            "Nothing found",
            false
        );
    }
});
// =========================
// FILTER WHILE TYPING
// =========================

searchInput.addEventListener(
    "input",
    () => {

    const value =
        searchInput.value
            .toLowerCase();

    const filtered =
        suggestions.filter(item =>

        item.label
            .toLowerCase()
            .includes(value)
    );

    renderSuggestions(filtered);
});

// =========================
// RENDER FUNCTION
// =========================

function renderSuggestions(list){

    suggestionsBox.innerHTML = "";

    if(list.length === 0){

        suggestionsBox.style.display =
            "none";

        return;
    }

    list.forEach(item => {

        const div =
            document.createElement("div");

        div.className =
            "search-suggestion";

        div.innerText =
            item.label;

        // =====================
        // CLICK
        // =====================

        div.onclick = async () => {

    searchInput.value = item.label;

    suggestionsBox.style.display =
        "none";

    let found = false;

    // =========================
    // OPEN ALL CLOSED TAGS
    // =========================

    const closedTags =
        document.querySelectorAll(
            '.opblock-tag[aria-expanded="false"]'
        );

    closedTags.forEach(tag => {
        tag.click();
    });

    // WAIT FOR SWAGGER TO FINISH
    await new Promise(resolve =>
        setTimeout(resolve, 1500)
    );

    // =========================
    // MODELS
    // =========================

    if(
        item.search === "schemas" ||
        item.search === "models"
    ){

        const models =
            document.querySelector(
                ".models"
            );

        if(models){

            found = true;

            models.scrollIntoView({

                behavior:"smooth",
                block:"start"
            });

            models.style.boxShadow =
                "0 0 40px rgba(34,197,94,0.45)";

            setTimeout(() => {

                models.style.boxShadow = "";

            }, 2500);

            return;
        }
    }

    // =========================
    // FIND TAGS
    // =========================

    document
        .querySelectorAll(".opblock-tag")
        .forEach(tag => {

        const tagText =
            tag.innerText
                .toLowerCase();

        if(
            tagText.includes(
                item.search.toLowerCase()
            )
        ){

            found = true;

            tag.scrollIntoView({

                behavior:"smooth",
                block:"start"
            });

            tag.style.boxShadow =
                "0 0 40px rgba(34,197,94,0.45)";

            setTimeout(() => {

                tag.style.boxShadow = "";

            }, 2500);
        }
    });

    // =========================
    // FIND ENDPOINTS
    // =========================

    document
        .querySelectorAll(".opblock")
        .forEach(block => {

        const text =
            block.innerText
                .toLowerCase();

        if(
            text.includes(
                item.search.toLowerCase()
            )
        ){

            found = true;

            block.scrollIntoView({

                behavior:"smooth",
                block:"center"
            });

            block.style.boxShadow =
                "0 0 40px rgba(34,197,94,0.45)";

            setTimeout(() => {

                block.style.boxShadow = "";

            }, 2500);
        }
    });

    // =========================
    // NOT FOUND
    // =========================

    if(!found){

        showToast(
            "Nothing found",
            false
        );
    }
};

        suggestionsBox.appendChild(div);
    });

    suggestionsBox.style.display = "grid";
}

// =========================
// HIDE SUGGESTIONS
// =========================

document.addEventListener(
    "click",
    (e) => {

    if(
        !e.target.closest(
            ".search-wrapper"
        )
    ){

        suggestionsBox.style.display =
            "none";
    }
});


window.addEventListener("load", () => {

    function setTodayDateInputs() {

        const today =
            new Date().toISOString().split("T")[0];

        const fromInput =
            document.querySelector('input[name="from"]');

        const toInput =
            document.querySelector('input[name="to"]');

        if (!fromInput || !toInput) {
            return;
        }

        // ✅ set TODAY automatically
        fromInput.value = today;
        toInput.value = today;

        // optional UX improvement
        fromInput.placeholder = "Select date";
        toInput.placeholder = "Select date";

        // ✅ open calendar on click
        const openCalendar = (el) => {
            if (el.showPicker) {
                el.showPicker(); // modern browsers
            } else {
                el.focus();
            }
        };

        fromInput.addEventListener("click", () => openCalendar(fromInput));
        toInput.addEventListener("click", () => openCalendar(toInput));
    }

    // Swagger loads dynamically → wait a bit
    setTimeout(setTodayDateInputs, 1500);

});


};