function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (rate >= i)
            stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5)
            stars += `<i class="fa-solid fa-star-half-alt"></i>`;
        else
            stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function loadFavorites() {
    const container = document.getElementById("favoritesContainer");
    let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
    container.innerHTML = "";

    if (favs.length === 0) {
        container.innerHTML = `<p class="text-center text-muted">No favorites yet. Start adding some recipes!</p>`;
        return;
    }

    favs.forEach((recipe, index) => {
        const card = document.createElement("div");
        card.className = "col-12 col-md-6 col-lg-4";
        card.innerHTML = `
          <div class="card h-100">
            <div class="card-top position-relative">
              <img src="${recipe.image}" class="img-fluid w-100" loading="lazy" alt="${recipe.title}">
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title">${recipe.title}</h5>
              <p class="card-text text-black-50">${recipe.description}</p>
              <div class="star-system d-flex flex-row g-1 mt-auto">
                ${renderStars(recipe.rate)}
                <div class="rate ps-2 text-black-50">(${recipe.rate})</div>
              </div>
            </div>
            <div class="card-footer p-0 d-flex flex-column align-items-center justify-content-between">
              <button class="view-recipe-btn card-img-bottom rounded btn btn-primary mb-2" data-recipe='${JSON.stringify(recipe)}'>View Recipe</button>
              <button class="card-img-bottom rounded btn btn-outline-secondary" onclick="removeFavorite(${index})">
                Remove from Favorites
              </button>
            </div>
          </div>
        `;
        container.appendChild(card);
    });

    setupRecipeButtons();
}

function setupRecipeButtons() {
    document.querySelectorAll('.view-recipe-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            const recipe = JSON.parse(this.dataset.recipe);
            window.location.href = `/FlavorFinds/recipe-viewer.html?id=${recipe.id}`;
        });
    });
}

function removeFavorite(index) {
    let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
    favs.splice(index, 1);
    localStorage.setItem("favItems", JSON.stringify(favs));
    loadFavorites();
}

document.addEventListener("DOMContentLoaded", loadFavorites);