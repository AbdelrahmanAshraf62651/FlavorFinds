const BASE_URL = "https://www.themealdb.com/api/json/v1/1";

async function getRandomMeals(num) {
    try {
        const meals = [];
        const seen = new Set();

        while (meals.length < num) {
            const res = await fetch(`${BASE_URL}/random.php`);

            const data = await res.json();
            const meal = data.meals[0];

            if (!seen.has(meal.idMeal)) {
                seen.add(meal.idMeal);
                meals.push(meal);
            }
        }
        return meals;
    } catch (e) {
        console.error("Error fetching meals:", e);
        return [];
    }
}

async function getRecipes(query = "", num = 20) {
    try {
        const meals = [];
        const seen = new Set();

        const res = await fetch(`${BASE_URL}/search.php?s=${query}`);
        const data = await res.json();

        if (!data.meals) return [];

        for (let meal of data.meals) {
            if (!seen.has(meal.idMeal) && meals.length < num) {
                seen.add(meal.idMeal);
                meals.push(meal);
            }
        }

        return meals;
    } catch (e) {
        console.error("Error fetching meals:", e);
        return [];
    }
}

async function searchForRecipes(query) {
    try {
        const res = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
        const data = await res.json();
        return data.meals || [];
    } catch (e) {
        console.error("Error fetching meals:", e);
        return [];
    }
}

async function getRecipeInfo(id) {
    try {
        const res = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
        const data = await res.json();
        return data.meals[0] || {};
    } catch (e) {
        console.error("Error fetching meal info:", e);
        return [];
    }
}

async function filterByCategory(category) {
    try {
        const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
        const data = await res.json();
        return data.meals || [];
    } catch (e) {
        console.error("Error filtering meals by category:", e);
        return [];
    }
}

async function filterByArea(area) {
    try {
        const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
        const data = await res.json();
        return data.meals || [];
    } catch (e) {
        console.error("Error filtering meals by area:", e);
        return [];
    }
}

async function areaFilter() {
    try {
        const res = await fetch(`${BASE_URL}/list.php?a=list`);
        const data = await res.json();
        return data.meals || [];
    } catch (e) {
        console.error("Error fetching area list:", e);
        return [];
    }
}

async function categoryFilter() {
    try {
        const res = await fetch(`${BASE_URL}/list.php?c=list`);
        const data = await res.json();
        return data.meals || [];
    } catch (e) {
        console.error("Error fetching category list:", e);
        return [];
    }
}

async function fetchByCategory(category) {
    if (category === "all") return getRandomMeals(20);
    const res = await fetch(`${BASE_URL}/filter.php?c=${category}`);
    const data = await res.json();
    return data.meals || [];
}

async function fetchByArea(area) {
    if (area === "all") return getRandomMeals(20);
    const res = await fetch(`${BASE_URL}/filter.php?a=${area}`);
    const data = await res.json();
    return data.meals || [];
}

// async function print() {
//     const x = await getRecipes();
//     console.log(x);
// }

// print()