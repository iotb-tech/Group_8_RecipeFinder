const menuToggle = document.querySelector("#menu-toggle");
const menuIconOpen = document.querySelector("#menu-icon-open");
const menuIconClose = document.querySelector("#menu-icon-close");
const mobileMenu = document.querySelector("#mobile-menu");

const recipeInput = document.querySelector("#recipeInput");
const searchBtn = document.querySelector("#searchBtn");
const status = document.querySelector("#status");
const favoritesContainer = document.querySelector("#favoritesContainer");
const resultNum = document.querySelector('#result') 
const recipesContainer = document.querySelector("#recipesContainer");
const recipeContent = document.querySelector("recipeContent");
const instruction = document.querySelector("#instruction");

if (menuToggle && menuIconOpen && menuIconClose && mobileMenu) {
  menuToggle.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden");
    menuIconOpen.classList.toggle("hidden");
    menuIconClose.classList.toggle("hidden");
  });
}

//Variable Declaration
let recipes = [];
let timeOut;
let currentPage = 1;
let title = "";

// Get recipe from LocalStorage
let favorites = [];
const savedRecipes = localStorage.getItem("favorites");

if (savedRecipes) {
  favorites = JSON.parse(savedRecipes);
  renderFavorites(favorites);
}

// Request To Api
async function getRecipes(name) {
  status.textContent = "Loading...";
  title = name
  const url = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(name)}`;
  try {
    const req = await fetch(url);
    let response = await req.json();

    status.textContent = "";

    recipes = response.meals;
    renderRecipes(response.meals);

    return response;
  } catch (error) {
    recipesContainer.innerHTML = `<p>Error: Can't get recipe.${error}</p>`;
    status.textContent = "";
    console.error(error);
  }
}

// Recipes Instruction
async function recipeInstr(id) {
  const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
  try {
    const req = await fetch(url);
    const response = await req.json();
    const recipe = response.meals[0];
    const ingredient = Object.keys(recipe).filter((item) =>
      item.includes("Ingredient"),
    );
    const measure = Object.keys(recipe).filter((item) =>
      item.includes("Measure"),
    );
    instruction.classList.remove("hidden");
    showInstruction(recipe, ingredient, measure);
  } catch (error) {
    console.log(error);
  }
}

// Show Instruction
function showInstruction(recipe, ingredient, measure) {
  const instr = document.createElement("div");
  instr.classList.add("flex", "flex-col", "gap-4");

  const instrImg = document.createElement("img");
  instrImg.setAttribute("src", recipe.strMealThumb);
  instrImg.setAttribute("alt", recipe.strMeal);
  instrImg.classList.add("w-full", "rounded-md", "object-cover");

  const recipeTitle = document.createElement("h3");
  recipeTitle.classList.add("text-2xl", "font-bold", "mb-2");
  recipeTitle.textContent = recipe.strMeal;

  const recipetags = document.createElement("p");
  recipetags.textContent = `${recipe.strCategory}, ${recipe.strArea}, ${recipe.strCountry}`;
  recipetags.classList.add("rounded-lg", "bg-gray-300", "text-sm", "mb-2");

  const IngreHead = document.createElement("h4");
  IngreHead.textContent = "Ingredient";
  IngreHead.classList.add("text-xl");
  const showIngre = document.createElement("ul");
  const showMeasure = document.createElement("ul");

  showIngre.classList.add("list-disc", "px-5");
  showMeasure.classList.add("list-disc", "px-5");
  instruction.appendChild(btnContainer);
  instruction.appendChild(instr);
  instr.appendChild(instrImg);
  instr.appendChild(recipeTitle);
  instr.appendChild(recipetags);
  instr.appendChild(IngreHead);
  instr.appendChild(showIngre);
  instr.appendChild(showMeasure);
  ingredient.forEach((item, index) => {
    if (recipe[item] === null || recipe[item] === "") {
      return;
    } else {
      const list = document.createElement("li");
      list.textContent = recipe[item] + " " + recipe[measure[index]];
      showIngre.appendChild(list);
    }
  });
  const step = document.createElement("p");
  step.textContent = recipe.strInstructions;
  step.classList.add("text-sm", "mt-2", "text-medium", "tracking-normal");
  instr.appendChild(step);
  const originalUrl = recipe.strYoutube;
  const urlObject = new URL(originalUrl);
  const videoId = urlObject.searchParams.get('v');
  const divVideo  = document.createElement('div');
  divVideo.setAttribute('id', "video")
  divVideo.classList.add('flex', 'item-center', 'justify-center', 'mt-4')
  const frame = document.createElement('iframe');
  frame.setAttribute("src", `https://www.youtube.com/embed/${videoId}`);
  frame.setAttribute('width', '560');
  frame.setAttribute('height', '315');
  frame.setAttribute('allow', "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" );
  frame.setAttribute('frameborder', '0');
  frame.setAttribute('referrerpolicy', "strict-origin-when-cross-origin")
  instruction.appendChild(divVideo);
  divVideo.appendChild(frame)

}

// Render Recipes
function renderRecipes(recipesInfo) {
  resultNum.textContent = `${recipesInfo.length} ${title} recipes found`;
  recipesInfo.forEach((recipeInfo) => {
    const recipeImg =
      recipeInfo.strMealThumb === "N/A"
        ? "https://placehold.co/300x250?text=No+Image"
        : recipeInfo.strMealThumb;

    const divHtml = document.createElement("div");
    divHtml.classList.add(
      "bg-[#E8E1D4]",
      "rounded-xl",
      "shadow-md",
      "p-4",
      "cursor-pointer",
      "hover:shadow-xl",
      "overflow-hidden",
      "hover:-translate-y-1.5",
      "transition",
      "duration-300",
      "flex",
      "flex-col",
      "h-full",
    );

    const imgClick = document.createElement("div");
    //imgClick.addEventListener('click', listener)
    const recipeImgTag = document.createElement("img");
    recipeImgTag.setAttribute("src", recipeImg);
    recipeImgTag.setAttribute("alt", recipeInfo.strMeal);
    recipeImgTag.classList.add(
      "w-full",
      "h-40",
      "object-cover",
      "rounded-xl",
      "mb-4",
    );
    const recipeTitle = document.createElement("h3");
    recipeTitle.classList.add("text-lg", "font-bold", "mb-2");
    recipeTitle.textContent = recipeInfo.strMeal;
    const category = document.createElement("p");
    const identifier = document.createElement("p");
    identifier.setAttribute("id", "IdMeal");
    identifier.classList.add("hidden");
    identifier.textContent = recipeInfo.idMeal;
    category.textContent = recipeInfo.strCategory;

    const btnContainer = document.createElement("div");
    btnContainer.classList.add("flex", "gap-2", "mt-2");
    const btn1 = document.createElement("button");
    const btn2 = document.createElement("button");
    btn1.classList.add(
      "bg-[#F3E4C9]",
      "rounded-full",
      "item-center",
      "px-4",
      "py-2",
      "hover:border-[#FFF]",
      "hover:bg-[#6B5429]",
      "transition",
    );
    btn2.classList.add(
      "bg-[#CEBB97]",
      "rounded-full",
      "item-center",
      "px-4",
      "py-2",
      "hover:border-amber-700",
      "hover:bg-white",
      "transition",
      "get-details",
    );
    btn1.textContent = `Add to Favorite`;
    btn1.onclick = function () {
      addFavorite(recipeInfo);
    };
    btn2.textContent = `Instruction`;
    btn2.setAttribute("id", recipeInfo.idMeal);
    btn2.onclick = function () {
      recipeInstr(btn2.id);
    };

    recipesContainer.appendChild(divHtml);
    divHtml.appendChild(imgClick);
    imgClick.appendChild(recipeImgTag);
    imgClick.appendChild(recipeTitle);
    imgClick.appendChild(identifier);
    imgClick.appendChild(category);
    divHtml.appendChild(btnContainer);
    btnContainer.appendChild(btn1);
    btnContainer.appendChild(btn2);
  });
}

const btn = document.querySelectorAll(".get-details");
btn.forEach((btn) => {
  console.log(btn.id);
});

// Add Favourite to localStorage
function addFavorite(item) {
  const exist = favorites.some((id) => id.idMeal === item.idMeal);
  if (exist) {
    alert(`${item.strMeal} is alreadly in favorites!`);
    return;
  } else {
    favorites.push(item);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    renderFavorites(favorites);
  }
}


//Remove Recipes from favorite
function removeFavorite(id){
  favorites = favorites.filter(recipe => recipe.idMeal !== id);
  localStorage.setItem('favorites', JSON.stringify(favorites))
  renderFavorites(favorites)
}
// Render Favorite
function renderFavorites(recipe) {
  favoritesContainer.textContent = "";
  recipe.forEach((item) => {
    const favoriteContainer = document.createElement("div");
    favoriteContainer.classList.add(
      "bg-[#E8E1D4]",
      "rounded-xl",
      "shadow-md",
      "p-4",
      "hover:shadow-xl",
      "overflow-hidden",
      "hover:-translate-y-1.5",
      "transition",
      "duration-300",
      "flex",
      "flex-col",
      "h-full",
    );
    const favoriteImg = document.createElement("img");
    favoriteImg.setAttribute("src", item.strMealThumb);
    favoriteImg.setAttribute("alt", item.strMeal);
    favoriteImg.classList.add("w-full", "h-35", "object-cover", "rounded-xl");
    const openBtn = document.createElement("button");
    openBtn.classList.add("flex-1", "cursor-pointer","mt-2");
    openBtn.onclick = function () {
      recipeInstr(item.idMeal);
      instruction.textContent = "";
    };
    const favoriteTitle = document.createElement("h3");
    favoriteTitle.classList.add(
      "text-lg",
      "font-bold",
      "mb-2",
      "hover:bg-[#A37F3E]",
      "hover:text-white",
      "hover:rounded-xl",
      "active:rounded-xl",
      "active:scale-95",
      "active:bg-[#6B5429]",
    );
    favoriteTitle.textContent = item.strMeal;
    const removeBtn = document.createElement("button");
    removeBtn.textContent = "Remove";
    removeBtn.classList.add(
      "px-3",
      "py-1",
      "bg-[#6B5429]",
      "hover:bg-[#EDE2CF]",
      "hover:border",
      "rounded-2xl",'item-end','active:bg-red'
    );
    removeBtn.onclick = function(){
      removeFavorite(item.idMeal)
    }

    favoritesContainer.appendChild(favoriteContainer);
    favoriteContainer.appendChild(favoriteImg);
    favoriteContainer.appendChild(openBtn)
    openBtn.appendChild(favoriteTitle);
    favoriteContainer.appendChild(removeBtn);
    //favoriteContainer.appendChild(node) */
  });
}

searchBtn.addEventListener("click", (e) => {
  e.preventDefault();
  const recipe = recipeInput.value.trim();
  getRecipes(recipe);
});

recipeInput.addEventListener("input", () => {
  clearTimeout(timeOut);
  timeOut = setTimeout(() => {
    const recipe = recipeInput.value.trim();
    if (recipe !== "") {
      getRecipes(recipe);
    }
  }, 500);
});

recipeInput.addEventListener("keydown", (e) => {
  if (e === "Enter") {
    e.preventDefault();
    const recipe = recipeInput.value.trim();
    getRecipes(recipe);
  }
});

const btnContainer = document.createElement('div')
btnContainer.classList.add('flex', 'justify-end')

const closeInstr = document.createElement("button");
closeInstr.textContent = "close";
closeInstr.classList.add("mb-5", "mx-1", "text-xl", 'bg-[#CEBB97]', "py-1", "px-3", 'rounded-full');
closeInstr.onclick = function () {
  instruction.classList.add("hidden");
  const video = document.querySelector('#video');
  video.textContent = '';
};
btnContainer.appendChild(closeInstr)