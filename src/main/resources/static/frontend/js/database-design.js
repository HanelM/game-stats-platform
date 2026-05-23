// =========================
// DATABASE VISUAL EFFECT
// =========================

const boxes = document.querySelectorAll(".db-box");

boxes.forEach((box, index) => {

    box.style.opacity = "0";
    box.style.transform = "translateY(20px)";

    setTimeout(() => {

        box.style.transition = "0.5s ease";

        box.style.opacity = "1";
        box.style.transform = "translateY(0)";

    }, index * 200);

});

// =========================
// CARD HOVER EFFECT
// =========================

const cards = document.querySelectorAll(
    ".collection-card, .feature-large, .flow-box"
);

cards.forEach(card => {

    card.addEventListener("mouseenter", () => {

        card.style.boxShadow =
            "0 0 24px rgba(0,255,136,0.10)";

    });

    card.addEventListener("mouseleave", () => {

        card.style.boxShadow = "none";

    });

});