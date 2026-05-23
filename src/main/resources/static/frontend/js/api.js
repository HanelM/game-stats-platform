
const API_BASE = "http://localhost:8080/api";

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
