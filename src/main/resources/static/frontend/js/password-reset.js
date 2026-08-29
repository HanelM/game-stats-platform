const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";

const AUTH_API =
    `${API_URL}/api/auth`;


// ==========================================
// FORGOT PASSWORD
// ==========================================

async function requestPasswordReset() {

    const usernameInput =
        document.getElementById("forgot-password-username");

    const message =
        document.getElementById("forgot-password-message");

    const username =
        usernameInput.value.trim();


    if (!username) {

        message.style.color = "red";
        message.innerText =
            "Please enter your username.";

        return;
    }


    try {

        message.style.color = "";
        message.innerText =
            "Sending verification code...";


        const response =
            await fetch(
                `${AUTH_API}/forgot-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username: username
                    })
                }
            );


        const text =
            await response.text();


        console.log(
            "HTTP status:",
            response.status
        );

        console.log(
            "Server response:",
            text
        );


        let data = {};

        try {

            data =
                text ? JSON.parse(text) : {};

        } catch {

            data = {
                message: text
            };
        }


        if (response.ok) {

            message.style.color =
                "lightgreen";

            message.innerText =
                data.message ||
                "A verification code has been sent.";

            sessionStorage.setItem(
                "resetUsername",
                username
            );


            setTimeout(() => {

                window.location.href =
                    "reset-password.html";

            }, 1500);


        } else {

            message.style.color =
                "red";

            message.innerText =
                data.message ||
                `Server returned ${response.status}.`;
        }


    } catch (error) {

        console.error(
            "Password reset request failed:",
            error
        );

        message.style.color =
            "red";

        message.innerText =
            "Unable to connect to the server.";
    }
}


// ==========================================
// VERIFY RESET CODE
// ==========================================

async function verifyResetCode() {

    const codeInput =
        document.getElementById(
            "verification-code"
        );

    const message =
        document.getElementById(
            "verify-code-message"
        );

    const code =
        codeInput.value.trim();


    // ------------------------------------------
    // Validate code
    // ------------------------------------------

    if (!code) {

        message.style.color = "red";

        message.innerText =
            "Please enter the verification code.";

        return;
    }


    if (!/^\d{6}$/.test(code)) {

        message.style.color = "red";

        message.innerText =
            "Verification code must contain exactly 6 digits.";

        return;
    }


    try {

        message.style.color = "";

        message.innerText =
            "Verifying code...";


        /*
         * We use the verification endpoint here.
         *
         * The backend will check whether the code
         * exists, is unused and has not expired.
         */
        const response =
            await fetch(
                `${AUTH_API}/verify-reset-code`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        username:
                            sessionStorage.getItem(
                                "resetUsername"
                            ),

                        code: code
                    })
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            message.style.color =
                "lightgreen";

            message.innerText =
                "Verification code is correct.";


            /*
             * Save the verified code temporarily.
             *
             * The reset-password request will use it.
             */
            sessionStorage.setItem(
                "resetCode",
                code
            );


            /*
             * Hide the verification section.
             */
            codeInput.style.display =
                "none";

            document.querySelector(
                'button[onclick="verifyResetCode()"]'
            ).style.display =
                "none";


            /*
             * Show new password section.
             */
            document.getElementById(
                "new-password-section"
            ).style.display =
                "block";


        } else {

            message.style.color =
                "red";

            message.innerText =
                data.message ||
                "Invalid or expired verification code.";
        }


    } catch (error) {

        console.error(
            "Verification failed:",
            error
        );

        message.style.color =
            "red";

        message.innerText =
            "Unable to connect to the server.";
    }
}


// ==========================================
// RESET PASSWORD
// ==========================================

async function resetPassword() {

    const message =
        document.getElementById(
            "reset-password-message"
        );

    const newPassword =
        document.getElementById(
            "new-password"
        ).value;

    const confirmPassword =
        document.getElementById(
            "confirm-password"
        ).value;

    const code =
        sessionStorage.getItem(
            "resetCode"
        );


    // ------------------------------------------
    // Validate verification code
    // ------------------------------------------

    if (!code) {

        message.style.color = "red";

        message.innerText =
            "Please verify your verification code first.";

        return;
    }


    // ------------------------------------------
    // Validate new password
    // ------------------------------------------

    if (!newPassword) {

        message.style.color = "red";

        message.innerText =
            "Please enter a new password.";

        return;
    }


    if (newPassword.length < 8) {

        message.style.color = "red";

        message.innerText =
            "Password must contain at least 8 characters.";

        return;
    }


    if (newPassword !== confirmPassword) {

        message.style.color = "red";

        message.innerText =
            "Passwords do not match.";

        return;
    }


    try {

        message.style.color = "";

        message.innerText =
            "Changing password...";


        const response =
            await fetch(
                `${AUTH_API}/reset-password`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        code: code,

                        newPassword:
                            newPassword

                    })
                }
            );


        const data =
            await response.json();


        if (response.ok) {

            message.style.color =
                "lightgreen";

            message.innerText =
                "Password changed successfully! Redirecting to login...";


            /*
             * Remove password-reset information.
             */
            sessionStorage.removeItem(
                "resetUsername"
            );

            sessionStorage.removeItem(
                "resetCode"
            );


            /*
             * Remove any old login information.
             */
            localStorage.removeItem(
                "token"
            );

            localStorage.removeItem(
                "username"
            );


            setTimeout(() => {

                window.location.href =
                    "login.html";

            }, 2000);


        } else {

            message.style.color =
                "red";

            message.innerText =
                data.message ||
                "Unable to change password.";
        }


    } catch (error) {

        console.error(
            "Password reset failed:",
            error
        );

        message.style.color =
            "red";

        message.innerText =
            "Unable to connect to the server.";
    }
}