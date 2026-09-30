const searchInput =
    document.getElementById("searchInput");

const cards =
    document.querySelectorAll(".card");

const noResults =
    document.getElementById("noResults");



searchInput.addEventListener(
    "input",
    function () {

        const query =
            this.value
                .trim()
                .toLowerCase();


        let visibleCards = 0;



        cards.forEach(
            function (card) {

                const text =
                    card.dataset.search
                        .toLowerCase();


                if (text.includes(query)) {

                    card.style.display = "flex";

                    visibleCards++;

                } else {

                    card.style.display = "none";

                }

            }
        );



        if (visibleCards === 0) {

            noResults.style.display = "block";

        } else {

            noResults.style.display = "none";

        }

    }
);