let allRecipes = document.querySelector(".recipes");
let loadMoreBtn = document.getElementById('loadMoreBtn');
let currentRecipes = [];
let filteredWorkingSet = [];
let renderedCount = 0;
const PAGE_SIZE = 8;

fetch("./db/recipes.json")
    .then(res => res.json())
    .then(recipes => {
        currentRecipes = recipes;
        applyStateAndRender();
        setupSearch();
        setupCategoryDropdown();
        setupSortDropdown();
        setupLoadMore();
    })
    .catch(() => {
        allRecipes.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-triangle-exclamation fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>Failed to load recipes</h3>
            </div>`;
    });

function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5) stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function createCard(item) {
    return `
    <div class="col-12 col-sm-6 col-lg-3">
        <div class="card h-100 overflow-hidden" data-recipe-id="${item.id}">
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
                <button class="view-recipe-btn card-img-bottom rounded btn btn-primary" data-id="${item.id}">View Recipe</button>
            </div>
        </div>
    </div>
    `;
}

function setupRecipeButtons() {
    document.querySelectorAll('.view-recipe-btn').forEach(btn => {
        btn.addEventListener('click', function () {
            const id = this.dataset.id;
            window.location.href = `recipe-viewer.html?id=${id}`;
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

function displayRecipes(recipes) {
    if (!recipes.length) {
        allRecipes.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fa-solid fa-utensils fa-2xl mb-3" style="color: var(--primary-color)"></i>
                <h3>No recipes found</h3>
                <p class="text-black-50">Try adjusting your search or filters</p>
            </div>`;
        loadMoreBtn.classList.add('d-none');
        return;
    }

    const slice = recipes.slice(0, renderedCount || PAGE_SIZE);
    renderedCount = slice.length;

    allRecipes.innerHTML = '';
    slice.forEach(recipe => allRecipes.innerHTML += createCard(recipe));

    setupRecipeButtons();
    toggleLoadMore(recipes.length);
}

function toggleLoadMore(total) {
    if (renderedCount < total) loadMoreBtn.classList.remove('d-none');
    else loadMoreBtn.classList.add('d-none');
}

function setupSearch() {
    const input = document.getElementById('recipesSearch');
    input.addEventListener('input', function () {
        const term = this.value.toLowerCase();
        filteredWorkingSet = currentRecipes.filter(r =>
            r.title.toLowerCase().includes(term) ||
            r.description.toLowerCase().includes(term) ||
            r.category.toLowerCase().includes(term)
        );
        applySortFromDropdown();
        renderedCount = 0;
        displayRecipes(filteredWorkingSet);
    });
}

function setupCategoryDropdown() {
    const menuItems = document.querySelectorAll('#categoryMenu .dropdown-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            const selected = this.dataset.cat;
            document.getElementById('categoryDropdown').textContent = `Filter: ${this.textContent}`;

            const searchVal = document.getElementById('recipesSearch').value.toLowerCase();
            filteredWorkingSet = currentRecipes.filter(r =>
                (!searchVal || r.title.toLowerCase().includes(searchVal) ||
                    r.description.toLowerCase().includes(searchVal) ||
                    r.category.toLowerCase().includes(searchVal))
            );

            if (selected !== 'all') {
                filteredWorkingSet = filteredWorkingSet.filter(r => r.category === selected);
            }

            renderedCount = 0;
            applySortFromDropdown();
            displayRecipes(filteredWorkingSet);
        });
    });
}

function setupSortDropdown() {
    const menuItems = document.querySelectorAll('#sortMenu .dropdown-item');
    menuItems.forEach(item => {
        item.addEventListener('click', function (e) {
            e.preventDefault();
            document.getElementById('sortDropdown').textContent = `Sort: ${this.textContent}`;
            applySortFromDropdown();
            renderedCount = 0;
            displayRecipes(filteredWorkingSet.length ? filteredWorkingSet : currentRecipes);
        });
    });
}

function applySortFromDropdown() {
    const sort = document.getElementById('sortDropdown').textContent.replace('Sort: ', '').toLowerCase();
    let list = filteredWorkingSet.length ? filteredWorkingSet : currentRecipes;

    switch (sort) {
        case 'popular':
            list.sort((a, b) => b.rate - a.rate);
            break;
        case 'alphabetical':
            list.sort((a, b) => a.title.localeCompare(b.title));
            break;
        case 'quickest prep':
            list.sort((a, b) => convertTimeToMinutes(a.prepTime) - convertTimeToMinutes(b.prepTime));
            break;
    }

    filteredWorkingSet = list;
}

function setupLoadMore() {
    loadMoreBtn.addEventListener('click', function () {
        const data = filteredWorkingSet.length ? filteredWorkingSet : currentRecipes;
        const nextCount = Math.min(data.length, renderedCount + PAGE_SIZE);
        const nextSlice = data.slice(0, nextCount);
        renderedCount = nextSlice.length;

        allRecipes.innerHTML = '';
        nextSlice.forEach(recipe => allRecipes.innerHTML += createCard(recipe));
        setupRecipeButtons();
        toggleLoadMore(data.length);
    });
}

function applyStateAndRender() {
    filteredWorkingSet = [...currentRecipes];
    renderedCount = 0;
    displayRecipes(filteredWorkingSet);
}
