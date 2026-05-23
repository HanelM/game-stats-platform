window.addEventListener("scroll", () => {

    const cards = document.querySelectorAll(
        ".development-card"
    );

    cards.forEach(card => {

        const cardTop = card.getBoundingClientRect().top;

        if(cardTop < window.innerHeight - 100){

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        }

    });

});

window.onload = () => {

    const cards = document.querySelectorAll(
        ".development-card"
    );

    cards.forEach(card => {

        card.style.opacity = "0";
        card.style.transform = "translateY(30px)";
        card.style.transition = "0.6s";

    });

    setTimeout(() => {

        cards.forEach(card => {

            card.style.opacity = "1";
            card.style.transform = "translateY(0px)";

        });

    },300);

};