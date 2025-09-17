window.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash === "#searchFocus") {
        let searchInput = document.getElementById("recipesSearch");
        if (searchInput) {
            searchInput.focus();
        }
    }
});