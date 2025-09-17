function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (rate >= i)
            stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5)
            stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else
            stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function renderFavoritesSkeleton(container, count = 4) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const skeleton = document.createElement("div");
        skeleton.className = "col-12 col-sm-6 col-lg-4 col-xl-3 mb-4";
        skeleton.innerHTML = `
            <div class="card h-100 placeholder-glow">
                <div class="w-100 h-100 bg-secondary placeholder" style="min-height: 450px;"></div>
            </div>
        `;
        container.appendChild(skeleton);
    }
}

function loadFavorites() {
    const container = document.getElementById("favoritesContainer");
    renderFavoritesSkeleton(container, 4);

    let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
    container.innerHTML = "";

    if (favs.length === 0) {
        container.innerHTML = `<div class="col-12 text-center text-muted">No favorites yet. Start adding some recipes!</div>`;
        if (window.updateFavBadge) window.updateFavBadge();
        return;
    }

    favs.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.className = "col-12 col-sm-6 col-lg-4 col-xl-3 mb-3";
        card.innerHTML = `
            <div class="card h-100 overflow-hidden">
            <div class="card-top position-relative">
                <img src="${recipe.strMealThumb}" class="img-fluid w-100" loading="lazy" alt="${recipe.strMeal}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${recipe.strMeal}</h5>
                <p class="card-text text-black-50">${recipe.strInstructions ? recipe.strInstructions.slice(0, 100) + "..." : "Delicious recipe from TheMealDB"}</p>
            </div>
            <div class="card-footer p-0 d-flex flex-column align-items-center justify-content-between">
                <button class="view-recipe-btn card-img-bottom rounded btn btn-primary mb-2" data-id="${recipe.idMeal}">View Recipe</button>
                <button class="card-img-bottom rounded btn btn-outline-secondary" onclick="removeFavorite(${index})">
                Remove from Favorites
                </button>
            </div>
            </div>`;
        container.appendChild(card);
    });

    setupRecipeButtons();
    if (window.updateFavBadge) window.updateFavBadge();

}

function setupRecipeButtons() {
    document.querySelectorAll(".view-recipe-btn").forEach((btn) => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            window.location.href = `recipe-viewer.html?id=${id}`;
        });
    });
}

function removeFavorite(index) {
    let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
    favs.splice(index, 1);
    localStorage.setItem("favItems", JSON.stringify(favs));
    loadFavorites();
}

document.addEventListener('DOMContentLoaded', function () {
    const pageContainer = document.querySelector('.container.page');
    if (!pageContainer) return;
    const header = pageContainer.querySelector('h2');
    if (header && !document.getElementById('clearAllFavs')) {
        const wrap = document.createElement('div');
        wrap.className = 'd-flex align-items-center gap-2';
        const clearBtn = document.createElement('button');
        clearBtn.id = 'clearAllFavs';
        clearBtn.className = 'btn btn-outline-danger btn-sm';
        clearBtn.textContent = 'Clear All';
        if (JSON.parse(localStorage.getItem("favItems") || "[]").length) {
            wrap.appendChild(clearBtn);
            header.after(wrap);
        }

        clearBtn.addEventListener('click', function () {
            localStorage.removeItem('favItems');
            loadFavorites();
            wrap.remove();
        });
    }
});

document.addEventListener("DOMContentLoaded", loadFavorites);