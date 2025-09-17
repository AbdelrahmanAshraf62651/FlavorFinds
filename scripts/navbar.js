window.addEventListener("DOMContentLoaded", () => {
    if (window.location.hash === "#searchFocus") {
        let searchInput = document.getElementById("recipesSearch");
        if (searchInput) {
            // Small delay so DOM + styles fully loaded
            setTimeout(() => {
                searchInput.focus();
                searchInput.scrollIntoView({ behavior: "smooth", block: "center" });

                // On mobile, trigger input event to encourage keyboard popup
                let evt = new Event("touchstart", { bubbles: true });
                searchInput.dispatchEvent(evt);
            }, 300);
        }
    }
});