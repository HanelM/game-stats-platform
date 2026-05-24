

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";

const API_BASE = `${API_URL}/api/auth`;

// ======================
// REGISTER
// ======================

const registerForm =
    document.getElementById("register-form");

if (registerForm) {

    registerForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById("register-username").value;

            const email =
                document.getElementById("register-email").value;

            const password =
                document.getElementById("register-password").value;

            const message =
                document.getElementById("register-message");

            try {

                const response = await fetch(
                    `${API_URL}/register`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            email,
                            password
                        })
                    }
                );

                matches = extractData(data);

                if (response.ok) {

                    message.style.color = "lightgreen";

                    message.innerText =
                        "Registration successful!";

                    // SAVE JWT TOKEN
                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    // REDIRECT
                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1500);

                } else {

                    message.innerText =
                        data.message || "Registration failed";
                }

            } catch (error) {

                message.innerText =
                    "Server error";
            }
        }
    );
}



// ======================
// LOGIN
// ======================

const loginForm =
    document.getElementById("login-form");

if (loginForm) {

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();

            const username =
                document.getElementById("username").value;

            const password =
                document.getElementById("password").value;

            const message =
                document.getElementById("login-message");

            try {

                const response = await fetch(
                    `${API_URL}/login`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type": "application/json"
                        },

                        body: JSON.stringify({
                            username,
                            password
                        })
                    }
                );

                matches = extractData(data);

                if (response.ok) {

                    message.style.color = "lightgreen";

                    message.innerText =
                        "Login successful!";

                    localStorage.setItem("token", data.token);
                    localStorage.setItem("username", username);

                    // SAVE JWT TOKEN
                    localStorage.setItem(
                        "token",
                        data.token
                    );

                    // REDIRECT
                    setTimeout(() => {

                        window.location.href =
                            "index.html";

                    }, 1500);

                } else {

                    message.innerText =
                        data.message || "Invalid credentials";
                }

            } catch (error) {

                message.innerText =
                    "Server error";
            }
        }
    );
}