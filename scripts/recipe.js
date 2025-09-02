let container = document.querySelector(".page");
let originalContent = null;

function addRecipe(recipe) {
    if (!originalContent) {
        originalContent = container.innerHTML;
    }

    container.innerHTML = `
        <div class="mt-5 container">
            <header class="recipe-header mb-4 pb-3">
                <h1 class="fw-bold">${recipe.title}</h1>
                <div class="d-flex align-items-center text-black-50">
                    <div class="me-3"><i class="fa-regular fa-clock me-1" style="color: var(--primary-color)"></i> ${recipe.prepTime}</div>
                    <div class="star-system">${renderStars(recipe.rate)} (${recipe.rate.toFixed(1)})</div>
                </div>
            </header>

            <div class="row g-4">
                <section class="col-12 col-lg-7">
                    <div class="recipe-hero mb-3">
                        <img src="${recipe.image}" alt="${recipe.title}">
                    </div>
                    <h4 class="mt-4 mb-3">Instructions</h4>
                    <ol class="list-unstyled">
                        ${recipe.instructions ? recipe.instructions.map((step, i) => `
                            <li class="mb-3"><span class="step-number">${i + 1}</span>${step}</li>
                        `).join("") : ''}
                    </ol>
                </section>

                <aside class="col-12 col-lg-5">
                    <div class="meta-badges mb-3">
                        <span class="badge rounded-pill">${recipe.category}</span>
                    </div>
                    <h4 class="mb-3">Ingredients</h4>
                    <ul class="list-group ingredients mb-4">
                        ${recipe.ingredients ? recipe.ingredients.map(ing => `<li class="list-group-item">${ing}</li>`).join("") : ''}
                    </ul>
                    <div class="recipe-actions d-flex gap-2">
                        <button onclick="restoreRecipes()" class="btn btn-outline-secondary">Back</button>
                        <button class="btn primary-btn">Save to Favorites</button>
                    </div>
                </aside>
            </div>

            <footer class="d-flex justify-content-between mt-5 pt-4 pb-4">
                <div class="copyright text-black-50">&copy; 2025 FlavorFinds. All rights reserved.</div>
                <div class="icons d-flex align-items-center">
                    <a href=""><i class="fa-brands fa-facebook-f mx-2 fa-lg"></i></a>
                    <a href=""><i class="fa-brands fa-twitter mx-2 fa-lg"></i></a>
                    <a href=""><i class="fa-brands fa-linkedin ms-2 fa-lg"></i></a>
                </div>
            </footer>
        </div>`;

    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function restoreRecipes() {
    if (originalContent) {
        container.innerHTML = originalContent;
        setupRecipeButtons();
    }
}