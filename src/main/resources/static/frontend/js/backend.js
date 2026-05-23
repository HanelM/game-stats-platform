// =========================
// ACTIVE MENU EFFECT
// =========================

const menuLinks = document.querySelectorAll(".menu a");

menuLinks.forEach(link => {

    link.addEventListener("mouseenter", () => {

        link.style.transform = "translateX(4px)";

    });

    link.addEventListener("mouseleave", () => {

        link.style.transform = "translateX(0px)";

    });

});

// =========================
// SIMPLE SCROLL ANIMATION
// =========================

const cards = document.querySelectorAll(
    ".backend-card, .stats-card, .system-box, .feature-item"
);

window.addEventListener("scroll", () => {

    cards.forEach(card => {

        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < window.innerHeight - 50){

            card.style.opacity = "1";

            card.style.transform = "translateY(0px)";
        }

    });

});

// =========================
// INITIAL STATE
// =========================

cards.forEach(card => {

    card.style.opacity = "0";

    card.style.transform = "translateY(20px)";

    card.style.transition = "0.5s";

});