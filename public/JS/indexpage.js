 // Tax Toggle Script
    let tax_toggle = document.getElementById("flexSwitchCheckDefault");
    let tax_info = document.getElementsByClassName("tax-info");
    let priceAfterTax = document.getElementsByClassName("price-after-tax");
    // let body = document.body("body");

    tax_toggle.addEventListener("click", () => {
        for (let info of tax_info) {
            info.style.display = info.style.display !== "inline" ? "inline" : "none";
        }
        for (let price of priceAfterTax) {
            price.style.display = price.style.display !== "inline" ? "inline" : "none";
        }
    });

    // Filter logic
    const filterListings = (selectedCategory) => {
        const allCards = document.getElementsByClassName("listing-card");
        for (let card of allCards) {
            const category = card.getAttribute("data-category")?.toLowerCase();
            card.parentElement.style.display = (category === selectedCategory.toLowerCase()) ? "block" : "none";
        }
        highlightActiveFilter(selectedCategory);
    };

    // Optional: Highlight selected filter
    function highlightActiveFilter(category) {
        document.querySelectorAll(".filter").forEach(f => f.classList.remove("active"));
        const activeBtn = document.getElementById(category);
        if (activeBtn) activeBtn.classList.add("active");
    }

    // Attach filter click listeners
    // const categories = ["trending", "rooms", "iconic-cities", "mountains", "castles", "pools", "camping", "farms", "arctic", "domes", "boat"];

    // categories.forEach(category => {
    //     const btn = document.getElementById(category);
    //     if (btn) {
    //         btn.addEventListener("click", () => {
    //             const url = new URL(window.location);
    //             url.searchParams.set("category", category);
    //             window.history.pushState({}, "", url);
    //             filterListings(category);

    //         });
    //     }
    // });


    // On page load, apply filter from URL
    window.addEventListener("DOMContentLoaded", () => {
        const urlParams = new URLSearchParams(window.location.search);
        const categoryFromUrl = urlParams.get("category");
        if (categoryFromUrl) {
            filterListings(categoryFromUrl);
        }
    });

    
document.querySelectorAll('.filter').forEach(filter => {
        filter.addEventListener('click', function () {
            const iconValue = this.querySelector('p').innerText; // e.g., "Rooms"
            window.location.href = `/listings/particular?iconValue=${iconValue}`;
        });
    });