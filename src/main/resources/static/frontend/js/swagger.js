const API_URL =
    window.location.hostname === "localhost"
        ? "http://localhost:8080"
        : "https://game-stats-platform-2.onrender.com";
// =========================
// ACTIVE MENU SYSTEM
// =========================

const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {

    link.addEventListener("click", () => {

        menuLinks.forEach(item => {
            item.classList.remove("active");
        });

        link.classList.add("active");

    });

});

// =========================
// SIMPLE CARD ANIMATION
// =========================

const cards = document.querySelectorAll(
    ".about-card, .endpoint-card, .stats-card, .tech-box"
);

cards.forEach((card, index) => {

    card.style.opacity = "0";
    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = "0.5s ease";

        card.style.opacity = "1";
        card.style.transform = "translateY(0)";

    }, index * 120);

});