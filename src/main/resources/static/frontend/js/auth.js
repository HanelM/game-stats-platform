const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";

const AUTH_API = `${API_URL}/api/auth`;


// ==========================================
// REGISTER
// ==========================================

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById(
                    "register-username"
                ).value.trim();

            const email =
                document.getElementById(
                    "register-email"
                ).value.trim();

            const password =
                document.getElementById(
                    "register-password"
                ).value;

            const message =
                document.getElementById(
                    "register-message"
                );


            try {

                const response =
                    await fetch(
                        `${API_BASE}/register`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username,
                                email,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    message.style.color =
                        "lightgreen";

                    message.innerText =
                        "Registration successful!";


                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    localStorage.setItem(
                        "username",
                        username
                    );


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1500);

                } else {

                    message.style.color =
                        "red";

                    message.innerText =
                        data.message ||
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
                    "Server error.";
            }
        }
    );
}


// ==========================================
// LOGIN
// ==========================================

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const username =
                document.getElementById(
                    "login-username"
                ).value.trim();

            const password =
                document.getElementById(
                    "login-password"
                ).value;

            const message =
                document.getElementById(
                    "login-error"
                );


            try {

                message.innerText =
                    "Logging in...";


                const response =
                    await fetch(
                        `${API_BASE}/login`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                username,
                                password
                            })
                        }
                    );


                const data =
                    await response.json();


                if (response.ok) {

                    message.style.color =
                        "lightgreen";

                    message.innerText =
                        "Login successful!";


                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    localStorage.setItem(
                        "username",
                        username
                    );


                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1000);

                } else {

                    message.style.color =
                        "red";

                    message.innerText =
                        data.message ||
                        "Invalid credentials.";
                }

            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );

                message.style.color =
                    "red";

                message.innerText =
                    "Server error.";
            }
        }
    );
}