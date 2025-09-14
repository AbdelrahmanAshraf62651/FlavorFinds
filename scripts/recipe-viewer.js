let currentRecipe = null;

function renderStars(rate) {
    let stars = "";
    for (let i = 1; i <= 5; i++) {
        if (rate >= i) stars += `<i class="fa-solid fa-star"></i>`;
        else if (rate >= i - 0.5) stars += `<i class="fa-solid fa-star-half-alt"></i>`;
        else stars += `<i class="fa-regular fa-star"></i>`;
    }
    return stars;
}

function loadRecipe() {
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get("id");

    if (recipeId) {
        fetch("./db/recipes.json")
            .then((res) => res.json())
            .then((recipes) => {
                const recipe = recipes.find((r) => r.id == recipeId);
                recipe ? displayRecipe(recipe) : showError("Recipe not found");
            })
            .catch(() => showError("Error loading recipe"));
    } else {
        const storedRecipe = localStorage.getItem("currentRecipe");
        if (storedRecipe) {
            const recipe = JSON.parse(storedRecipe);
            displayRecipe(recipe);
            localStorage.removeItem("currentRecipe");
        } else {
            showError("No recipe data available");
        }
    }
}

function displayRecipe(recipe) {
    currentRecipe = recipe;
    document.title = `${recipe.title} - FlavorFinds`;

    const container = document.getElementById("recipe-container");

    container.innerHTML = `
    <header class="recipe-header mb-4 pb-3">
      <h1 class="fw-bold">${recipe.title}</h1>
      <div class="d-flex align-items-center text-black-50">
        <div class="me-3"><i class="fa-regular fa-clock me-1" style="color: var(--primary-color)"></i> ${recipe.prepTime}</div>
        <div class="star-system">${renderStars(recipe.rate)} (${recipe.rate})</div>
      </div>
    </header>

    <div class="row g-4">
      <section class="col-12 col-lg-7">
        <div class="recipe-hero mb-3">
          <img src="${recipe.image}" alt="${recipe.title}">
        </div>
        <h4 class="mt-4 mb-3">Instructions</h4>
        <ol class="list-unstyled">
          ${recipe.instructions?.length
            ? recipe.instructions.map((s, i) => `<li class="mb-3"><span class="step-number">${i + 1}</span> ${s}</li>`).join("")
            : `<li>No instructions available</li>`}
        </ol>
      </section>

      <aside class="col-12 col-lg-5">
        <div class="meta-badges mb-3">
          <span class="badge rounded-pill">${recipe.category}</span>
        </div>
        <h4 class="mb-3">Ingredients</h4>
        <ul class="list-group ingredients mb-4">
          ${recipe.ingredients?.length
            ? recipe.ingredients.map((ing) => `<li class="list-group-item">${ing}</li>`).join("")
            : `<li class="list-group-item">No ingredients listed</li>`}
        </ul>
        <div class="recipe-actions d-flex gap-2">
          <button onclick="goBack()" class="btn btn-outline-secondary">Back</button>
          <button class="btn primary-btn" id="add-to-favorite-btn">Add to Favorite</button>
        </div>
      </aside>
    </div>
  `;

    document.getElementById("add-to-favorite-btn").onclick = () => handleFavClick(recipe);
}

function showModal(message, type = "success") {
    const msg = document.getElementById("popupMessage");
    const btn = document.getElementById("popupBtn");

    msg.textContent = message;

    if (type === "success") {
        btn.style.backgroundColor = "green";
    } else {
        btn.style.backgroundColor = "red";
    }

    const modal = new bootstrap.Modal(document.getElementById("popupModal"));
    modal.show();
}

function handleFavClick(item) {
    let favs = JSON.parse(localStorage.getItem("favItems") || "[]");
    const exists = favs.find(fav => fav.title === item.title);

    if (exists) {
        showModal("Already in favorites", "danger");
        return;
    }

    favs.push(item);
    localStorage.setItem("favItems", JSON.stringify(favs));
    showModal("Recipe saved successfully!", "success");
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
