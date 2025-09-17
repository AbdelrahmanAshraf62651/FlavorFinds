let allRecipes = document.querySelector(".recipes");
let loadMoreBtn = document.getElementById("loadMoreBtn");
let currentRecipes = [];
let renderedCount = 0;
const PAGE_SIZE = 8;

let selectedCategory = "all";
let selectedArea = "all";

async function init() {
    showSkeletons();
    currentRecipes = await getRandomMeals(8);
    currentRecipes = addRandomTime(currentRecipes);

    displayRecipes(currentRecipes);
    setupSearch();
    setupCategoryDropdown();
    setupAreaDropdown();
    setupLoadMore();
}

function addRandomTime(recipes) {
    return recipes.map(item => ({ ...item, time: 30 * (Math.floor(Math.random() * 10) + 1) }));
}

function createCard(item, category, area) {
    return `
    <div class="col-6 col-md-4 col-xl-3 mb-4">
        <div class="card h-100 overflow-hidden" data-recipe-id="${item.idMeal}">
            <div class="card-top position-relative">
                <div class="position-absolute btn btn-light rounded-pill m-2">${item.strCategory || category}</div>
                <img src="${item.strMealThumb}" class="img-fluid w-100" loading="lazy" alt="${item.strMeal}">
            </div>
            <div class="card-body d-flex flex-column">
                <h5 class="card-title">${item.strMeal}</h5>
                <p class="card-text text-black-50">${item.strArea || area} cuisine</p>
            </div>
            <div class="card-footer p-0 d-flex flex-column flex-sm-row align-items-center justify-content-between">
                <div class="clock d-flex flex-row align-items-center mb-2 mb-sm-0">
                    <i class="fa-regular fa-clock me-1"></i>
                    <div class="clock-num text-black-50">${item.time} Min</div>
                </div>
                <button class="view-recipe-btn card-img-bottom rounded btn btn-primary" data-id="${item.idMeal}">
                    View Recipe
                </button>
            </div>
        </div>
    </div>
    `;
}

function showSkeletons(count = 4) {
    allRecipes.innerHTML = "";
    for (let i = 0; i < count; i++) {
        allRecipes.innerHTML += `
        <div class="col-6 col-md-4 col-xl-3 mb-4">  
            <div class="card h-100 placeholder-glow">
                <div class="placeholder w-100 h-100" style="height: 100%; min-height: 450px;"></div>
            </div>
        </div>`;
    }
}

function setupRecipeButtons() {
    document.querySelectorAll(".view-recipe-btn").forEach(btn => {
        btn.addEventListener("click", function () {
            const id = this.dataset.id;
            window.location.href = `recipe-viewer.html?id=${id}`;
        });
    });
}

function displayRecipes(recipes, category, area) {
    if (!recipes.length) {
        allRecipes.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-utensils fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>No recipes found</h3>
                <p class="text-black-50">Try adjusting your search or filters</p>
            </div>`;
        loadMoreBtn.classList.add("d-none");
        return;
    }

    const slice = recipes.slice(0, renderedCount || PAGE_SIZE);
    renderedCount = slice.length;

    allRecipes.innerHTML = "";
    slice.forEach(recipe => allRecipes.innerHTML += createCard(recipe, category, area));

    setupRecipeButtons();
    toggleLoadMore(recipes.length);
}

function toggleLoadMore(total) {
    if (renderedCount < total) loadMoreBtn.classList.remove("d-none");
    else loadMoreBtn.classList.add("d-none");
}

function setupSearch() {
    const input = document.getElementById("recipesSearch");
    input.addEventListener("input", async function () {
        const term = this.value.toLowerCase();
        showSkeletons();
        const results = await searchForRecipes(term);
        currentRecipes = addRandomTime(results);

        selectedCategory = "all";
        selectedArea = "all";
        renderedCount = 0;
        displayRecipes(currentRecipes);
    });
}
async function setupCategoryDropdown() {
    const catList = await categoryFilter();
    const catMenu = document.getElementById("categoryMenu");

    catMenu.innerHTML = `
    <div class="dropdown-scrollable" style="max-height: 200px; overflow-y: auto;">
        <a class="dropdown-item" href="#" data-cat="all">All</a>
        ${catList.map(cat => `<a class="dropdown-item" href="#" data-cat="${cat.strCategory}">${cat.strCategory}</a>`).join('')}
    </div>`;

    document.querySelectorAll("#categoryMenu .dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            selectedCategory = this.dataset.cat;
            document.getElementById("categoryDropdown").textContent = `Type: ${this.textContent}`;
            applyFilters();
        });
    });
}

async function setupAreaDropdown() {
    const areaList = await areaFilter();
    const areaMenu = document.getElementById("areaMenu");

    areaMenu.innerHTML = `
    <div class="dropdown-scrollable" style="max-height: 200px; overflow-y: auto;">
        <a class="dropdown-item" href="#" data-area="all">All</a>
        ${areaList.map(area => `<a class="dropdown-item" href="#" data-area="${area.strArea}">${area.strArea}</a>`).join('')}
    </div>`;

    document.querySelectorAll("#areaMenu .dropdown-item").forEach(item => {
        item.addEventListener("click", function (e) {
            e.preventDefault();
            selectedArea = this.dataset.area;
            document.getElementById("areaDropdown").textContent = `Area: ${this.textContent}`;
            applyFilters();
        });
    });
}

async function applyFilters() {
    showSkeletons();
    let recipes = [];

    if (selectedCategory !== "all") {
        recipes = await fetchByCategory(selectedCategory);
    }

    if (selectedArea !== "all") {
        const areaRecipes = await fetchByArea(selectedArea);
        if (selectedCategory !== "all") {
            const ids = new Set(areaRecipes.map(r => r.idMeal));
            recipes = recipes.filter(r => ids.has(r.idMeal));
        } else {
            recipes = areaRecipes;
        }
    }

    if (selectedCategory === "all" && selectedArea === "all") {
        recipes = await getRandomMeals(10);
    }

    currentRecipes = addRandomTime(recipes);
    renderedCount = 0;

    if (selectedCategory === "all" && selectedArea === "all") {
        displayRecipes(currentRecipes);
    } else {
        let passedCat = selectedCategory !== "all" ? selectedCategory : "General";
        let passedArea = selectedArea !== "all" ? selectedArea : "General";
        displayRecipes(currentRecipes, passedCat, passedArea);
    }
}

function setupLoadMore() {
    loadMoreBtn.addEventListener("click", function () {
        const data = currentRecipes;
        const nextCount = Math.min(data.length, renderedCount + PAGE_SIZE);
        const nextSlice = data.slice(0, nextCount);
        renderedCount = nextSlice.length;

        let passedCat = selectedCategory !== "all" ? selectedCategory : "General";
        let passedArea = selectedArea !== "all" ? selectedArea : "General";

        allRecipes.innerHTML = "";
        nextSlice.forEach(recipe => allRecipes.innerHTML += createCard(recipe, passedCat, passedArea));

        setupRecipeButtons();
        toggleLoadMore(data.length);
    });
}

document.addEventListener("DOMContentLoaded", init);
