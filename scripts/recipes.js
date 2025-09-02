let allRecipes = document.querySelector(".recipes");
let currentRecipes = [];

fetch("../db/recipes.json")
    .then(res => res.json())
    .then(recipes => {
        currentRecipes = recipes;
        displayRecipes(currentRecipes);
        setupRecipeButtons();
        setupFilterButtons();
    })

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

function createCard(item) {
    return `
    <div class="col-12 col-md-6 col-lg-4">
        <div class="card h-100" data-recipe-id="${item.id}">
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
            <div class="card-footer p-0 d-flex flex-row align-items-center justify-content-between">
                <div class="clock d-flex flex-row align-items-center">
                    <i class="fa-regular fa-clock me-1"></i>
                    <div class="clock-num text-black-50">${item.prepTime}</div>
                </div>
                <button class="view-recipe-btn card-img-bottom rounded btn btn-primary" data-recipe='${JSON.stringify(item)}'>View Recipe</button>
            </div>
        </div>
    </div>
    `;
}

function setupRecipeButtons() {
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const recipe = JSON.parse(this.dataset.recipe);
            addRecipe(recipe);
        });
    });
}

function setupFilterButtons() {
    document.querySelectorAll('.search-filter button').forEach(btn => {
        btn.addEventListener('click', function () {
            // Remove active class from all buttons
            document.querySelectorAll('.search-filter button').forEach(b =>
                b.classList.remove('primary-btn', 'grey-btn'));

            // Add active class to clicked button
            this.classList.add('primary-btn');
            this.classList.remove('grey-btn');

            const filter = this.textContent.toLowerCase();
            sortRecipes(filter);
        });
    });
}

function convertTimeToMinutes(timeStr) {
    const hrMatch = timeStr.match(/(\d+)\s*hr/);
    const minMatch = timeStr.match(/(\d+)\s*min/);

    let totalMinutes = 0;
    if (hrMatch) totalMinutes += parseInt(hrMatch[1]) * 60;
    if (minMatch) totalMinutes += parseInt(minMatch[1]);

    return totalMinutes;
}

function sortRecipes(filter) {
    let sortedRecipes = [...currentRecipes];

    switch (filter) {
        case 'popular':
            sortedRecipes.sort((a, b) => b.rate - a.rate);
            break;
        case 'alphabetical':
            sortedRecipes.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'quickest prep':
            sortedRecipes.sort((a, b) => {
                const timeA = convertTimeToMinutes(a.prepTime);
                const timeB = convertTimeToMinutes(b.prepTime);
                return timeA - timeB;
            });
            break;
    }

    displayRecipes(sortedRecipes);
    setupRecipeButtons();
}

function displayRecipes(recipes) {
    if (recipes.length === 0) {
        allRecipes.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-utensils fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>No recipes found</h3>
                <p class="text-black-50">Try adjusting your search or filters</p>
            </div>`;
        return;
    }

    allRecipes.innerHTML = '';
    recipes.forEach(recipe => {
        allRecipes.innerHTML += createCard(recipe);
    });
}

