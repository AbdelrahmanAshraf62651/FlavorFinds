let trending = document.querySelector('.trending-items');
let chef = document.querySelector('.chef-items');
let searchInput = document.querySelector('.search-wrapper input');
let allRecipes = [];

fetch('./db/recipes.json')
    .then((res) => res.json())
    .then((recipes) => {
        allRecipes = recipes;
        displayFilteredRecipes(recipes);
        setupRecipeButtons();
    })
    .catch(() => {
        trending.innerHTML = chef.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-triangle-exclamation fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>Failed to load recipes</h3>
            </div>`;
    });

searchInput.addEventListener('input', (e) => {
    const searchTerm = e.target.value.toLowerCase();
    const filteredRecipes = allRecipes.filter(recipe =>
        recipe.title.toLowerCase().includes(searchTerm) ||
        recipe.description.toLowerCase().includes(searchTerm) ||
        recipe.category.toLowerCase().includes(searchTerm)
    );
    displayFilteredRecipes(filteredRecipes);
    setupRecipeButtons();
});

function displayFilteredRecipes(recipes) {
    const hasResults = recipes.some(recipe => recipe.trending || recipe.chef);

    if (!hasResults) {
        trending.innerHTML = chef.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-search fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>No matching recipes</h3>
                <p class="text-black-50">Try searching with different keywords</p>
            </div>`;
        return;
    }

    trending.innerHTML = '';
    chef.innerHTML = '';

    recipes.forEach((recipe) => {
        if (recipe.trending) trending.innerHTML += createCard(recipe);
        if (recipe.chef) chef.innerHTML += createCard(recipe);
    });
}

function renderStars(rate) {
    let stars = '';
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5)
            stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function createCard(item) {
    return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100 overflow-hidden">
        <div class="card-top position-relative">
          <div class="position-absolute btn btn-light rounded-pill">${item.category}</div>
          <img src="${item.image}" class="img-fluid w-100" loading="lazy" alt="${item.title}">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${item.title}</h5>
          <p class="card-text text-black-50">${item.description}</p>
          <div class="star-system d-flex flex-row g-1 mt-auto">
            ${renderStars(item.rate)}
            <div class="rate ps-2 text-black-50">(${item.rate.toFixed(1)})</div>
          </div>
        </div>
        <div class="card-footer p-0">
            <button class="view-recipe-btn card-img-bottom rounded btn btn-primary" data-id="${item.id}">View Recipe</button>
        </div>
      </div>
    </div>
  `;
}

function setupRecipeButtons() {
    document.querySelectorAll('.view-recipe-btn').forEach((btn) => {
        btn.addEventListener('click', function () {
            const id = this.dataset.id;
            window.location.href = `recipe-viewer.html?id=${id}`;
        });
    });
}
