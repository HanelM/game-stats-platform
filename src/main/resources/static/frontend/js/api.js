

const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform.onrender.com";

const API_BASE = `${API_URL}/api`;

export async function apiGet(url) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_BASE + url, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });

    return response.json();
}

export async function apiPost(url, body) {
    const token = localStorage.getItem("token");

    const response = await fetch(API_BASE + url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + token
        },
        body: JSON.stringify(body)
    });

    return response;
}
