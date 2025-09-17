const trending = document.querySelector(".trending-items");
const chef = document.querySelector(".chef-items");
const searchInput = document.querySelector(".search-wrapper input");

let trendingItems = [];
let chefItems = [];

function renderSkeletons(container, count) {
    container.innerHTML = "";
    for (let i = 0; i < count; i++) {
        container.innerHTML += `
        <div class="col-12 col-sm-6 col-lg-4 col-xl-3 mb-4">
            <div class="card h-100 placeholder-glow">
                <div class="placeholder w-100 h-100" style="height: 100%; min-height: 450px;"></div>
            </div>
        </div>`;
    }
}

async function loadRecipesByIds(ids) {
    const recipes = [];
    for (let id of ids) {
        try {
            const recipe = await getRecipeInfo(id);
            recipes.push(recipe);
        } catch {
            console.warn(`Failed to load recipe ID: ${id}`);
        }
    }
    return recipes;
}

async function displayRecipes() {
    renderSkeletons(trending, 4);
    renderSkeletons(chef, 4);

    const trendingRecipes = await loadRecipesByIds(trendingItems);
    const chefRecipes = await loadRecipesByIds(chefItems);

    trending.innerHTML = trendingRecipes.length
        ? trendingRecipes.map(createCard).join("")
        : getEmptyMessageHTML("No trending recipes");

    chef.innerHTML = chefRecipes.length
        ? chefRecipes.map(createCard).join("")
        : getEmptyMessageHTML("No chef recipes");

    setupRecipeButtons();
}

function init() {
    trendingItems = ["52772", "52844", "52977", "52853"];
    chefItems = ["52874", "52951", "52768", "52813"];
    displayRecipes();
}

function createCard({ idMeal, strMeal, strMealThumb, strCategory, strArea }) {
    return `
    <div class="col-12 col-sm-6 col-lg-4 col-xl-3">
      <div class="card h-100 overflow-hidden">
        <div class="card-top position-relative">
          <div class="position-absolute btn btn-light rounded-pill">${strCategory || "General"}</div>
          <img src="${strMealThumb}" class="img-fluid w-100" loading="lazy" alt="${strMeal}">
        </div>
        <div class="card-body d-flex flex-column">
          <h5 class="card-title">${strMeal}</h5>
          <p class="card-text text-black-50">${strArea || "International"} cuisine</p>
        </div>
        <div class="card-footer p-0">
          <button class="view-recipe-btn card-img-bottom rounded btn btn-primary" data-id="${idMeal}">View Recipe</button>
        </div>
      </div>
    </div>`;
}

function setupRecipeButtons() {
    document.querySelectorAll(".view-recipe-btn").forEach(btn =>
        btn.addEventListener("click", () => {
            window.location.href = `recipe-viewer.html?id=${btn.dataset.id}`;
        })
    );
}

function getEmptyMessageHTML(message) {
    return `
    <div class="col-12 text-center py-5">
      <i class="fa-solid fa-triangle-exclamation fa-2xl mb-3" style="color: var(--primary-color)"></i>
      <h3>${message}</h3>
    </div>`;
}

document.addEventListener("DOMContentLoaded", init);