let currentRecipe = null;

function renderStars(rate = 4) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5) stars += `<i class="fa-solid fa-star-half-stroke"></i>`;
        else stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

async function loadRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (recipeId) {
        try {
            const recipe = await getRecipeInfo(recipeId);
            if (recipe) {
                displayRecipe(recipe);
            } else {
                showError("Recipe not found");
            }
        } catch {
            showError("Error loading recipe");
        }
    } else {
        showError("No recipe ID provided");
    }
}

function extractIngredients(recipe) {
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
            ingredients.push(`${measure || ""} ${ingredient}`.trim());
        }
    }
    return ingredients;
}

function displayRecipe(recipe) {
    currentRecipe = recipe;
    document.title = `${recipe.strMeal} - FlavorFinds`;

    const ingredients = extractIngredients(recipe);
    const container = document.getElementById("recipe-container");

    container.innerHTML = `
    <header class="recipe-header mb-4 pb-3">
      <h1 class="fw-bold">${recipe.strMeal}</h1>
    </header>

    <div class="row g-4">
      <section class="col-12 col-lg-7">
        <div class="recipe-hero mb-3">
          <img src="${recipe.strMealThumb}" alt="${recipe.strMeal}">
        </div>
        <h4 class="mt-4 mb-3">Instructions</h4>
        <ol class="list-unstyled">
          ${recipe.strInstructions
            ? recipe.strInstructions
                .split(/[\r\n]+/)
                .filter((s) => s.trim())
                .map((s, i) => `<li class="mb-3"><span class="step-number">${i + 1}</span> ${s}</li>`)
                .join("")
            : `<li>No instructions available</li>`}
        </ol>
        ${recipe.strYoutube ? `
        <div class="mt-4">
          <h4 class="mb-3">Video Tutorial</h4>
          <div class="ratio ratio-16x9">
            <iframe src="https://www.youtube.com/embed/${recipe.strYoutube.split("v=")[1]}" 
                    title="YouTube video" allowfullscreen></iframe>
          </div>
        </div>` : ""}
      </section>

      <aside class="col-12 col-lg-5">
        <div class="meta-badges mb-3">
          <span class="badge rounded-pill">${recipe.strCategory || "Uncategorized"}</span>
          <span class="badge rounded-pill">${recipe.strArea || "Unknown"}</span>
        </div>
        <h4 class="mb-3">Ingredients</h4>
        <ul class="list-group ingredients mb-4">
          ${ingredients.length
            ? ingredients.map((ing) => `<li class="list-group-item">${ing}</li>`).join("")
            : `<li class="list-group-item">No ingredients listed</li>`}
        </ul>
        <div class="recipe-actions d-flex gap-2 flex-column-reverse flex-sm-row">
          <button onclick="goBack()" class="btn btn-outline-secondary">Back</button>
          <button class="btn primary-btn" id="add-to-favorite-btn">Add to Favorite</button>
          <button class="btn btn-outline-danger d-none" id="remove-favorite-btn">Remove Favorite</button>
        </div>
      </aside>
    </div>
  `;

    setupFavoriteButtons(recipe);
}

function setupFavoriteButtons(recipe) {
    const addBtn = document.getElementById("add-to-favorite-btn");
    const removeBtn = document.getElementById("remove-favorite-btn");

    function updateFavButtons() {
        const favs = JSON.parse(localStorage.getItem("favItems") || "[]");
        const exists = favs.find((f) => String(f.idMeal) === String(recipe.idMeal));
        if (exists) {
            addBtn.classList.add("d-none");
            removeBtn.classList.remove("d-none");
        } else {
            addBtn.classList.remove("d-none");
            removeBtn.classList.add("d-none");
        }
    }

    updateFavButtons();

    addBtn.onclick = () => {
        let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
        const exists = favs.find((f) => String(f.idMeal) === String(recipe.idMeal));
        if (!exists) {
            favs.push(recipe);
            localStorage.setItem("favItems", JSON.stringify(favs));
            showModal("Recipe saved successfully!", "success");
            if (window.updateFavBadge) window.updateFavBadge();
            updateFavButtons();
        } else {
            showModal("Already in favorites", "danger");
        }
    };

    removeBtn.onclick = () => {
        let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
        favs = favs.filter((f) => String(f.idMeal) !== String(recipe.idMeal));
        localStorage.setItem("favItems", JSON.stringify(favs));
        showModal("Removed from favorites", "fail");
        if (window.updateFavBadge) window.updateFavBadge();
        updateFavButtons();
    };
}

function showModal(message, type = "success") {
    const msg = document.getElementById("popupMessage");
    const btn = document.getElementById("popupBtn");
    msg.textContent = message;
    btn.style.backgroundColor = type === "success" ? "#371f1f" : "red";
    const modal = new bootstrap.Modal(document.getElementById("popupModal"));
    modal.show();
}

function showError(message) {
    document.getElementById("recipe-container").innerHTML = `
    <h1 class="text-danger">Error</h1>
    <p>${message}</p>
  `;
}

function goBack() {
    if (document.referrer && document.referrer !== window.location.href) {
        window.history.back();
    } else {
        window.location.href = "recipes.html";
    }
}

document.addEventListener("DOMContentLoaded", loadRecipe);