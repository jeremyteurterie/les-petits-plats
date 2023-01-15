const recipesCards = document.querySelector(".recipes-cards");
const input = document.querySelector(".search-input");
const ingredientInput = document.querySelector(".ingredients-input");
const appareilInput = document.querySelector(".appareils-input");
const ustensileInput = document.querySelector(".ustensiles-input");
const ingredientUl = document.querySelector(".ul-ingredient");
const appareilUl = document.querySelector(".ul-appareil");
const ustensileUl = document.querySelector(".ul-ustensile");
const lists = {
  ingredients: [],
  ustensils: [],
  appareils: [],
};
const filters = {
  input: "",
  tags: [],
};

let latch = false;

(async function () {
  // Define the display of ingredients in the cards
  function ingredientsDisplay(elements) {
    var result = "";
    elements.forEach(function (element) {
      result +=
        "<strong>" +
        element.ingredient +
        "</strong> : " +
        (element.quantity || "") +
        " " +
        (element.unit || "") +
        "</br>";
    });
    return result;
  }

  // Create and display the cards
  function cardsDisplay(array) {
    array.forEach((item) => {
      let div = document.createElement("div");
      div.innerHTML =
        '<div class="card">' +
        '<div class="card-header">' +
        "</div>" +
        '<div class="card-content">' +
        '<h3 class="card-title">' +
        item.name +
        "</h3>" +
        '<div class="flex-time">' +
        '<i class="fa-regular fa-clock"></i>' +
        '<p class="card-time">' +
        item.time +
        " min</p>" +
        "</div>" +
        "</div>" +
        '<div class="card-reveal">' +
        '<p class="card-ingredients">' +
        ingredientsDisplay(item.ingredients) +
        "</p>" +
        '<p class="card-description">' +
        item.description +
        "</p>" +
        "</div>" +
        "</div>";
      recipesCards.appendChild(div);

      let mappedIng = item.ingredients.map((ing) =>
        ing.ingredient.toLowerCase()
      );
      lists.ingredients = [...lists.ingredients, ...mappedIng];

      let mappedUs = item.ustensils.map((ustensil) => ustensil.toLowerCase());
      lists.ustensils.push(...mappedUs);

      lists.appareils.push(item.appliance.toLowerCase());
    });
  }

  const displayList = (elems, typeIndex) => {
    let color, ul;
    switch (typeIndex) {
      case 0: // ingredient
        ul = ingredientUl;
        color = "blue";
        break;
      case 1: // appareils
        ul = appareilUl;
        color = "green";
        break;
      case 2: // ustensiles
        ul = ustensileUl;
        color = "orange";
        break;
    }

    elems = [...new Set(elems)];
    elems.sort();
    elems.forEach((item) => {
      const newLi = document.createElement("li");
      newLi.textContent = item;
      ul.appendChild(newLi);
      newLi.addEventListener(
        "click",
        function () {
          const lowerCaseIng = item.toLowerCase();
          addTag(lowerCaseIng, color);
        },
        { once: true }
      );
    });
  };

  cardsDisplay(recipes);
  displayList(lists.ingredients, 0);
  displayList(lists.appareils, 1);
  displayList(lists.ustensils, 2);

  // Crée et ajoute les tags
  function addTag(value, color) {
    filters.tags.push(value);
    const tags = document.getElementById("span-tag");
    const span = document.createElement("span");
    span.id = "tag";
    span.className = `fa-regular fa-circle-xmark bg-${color}`;
    span.innerHTML = value;
    tags.appendChild(span);
    span.onclick = function () {
      filters.tags.forEach((val, index) => {
        if (val === value) {
          filters.tags.splice(index, 1);
          span.parentNode.removeChild(span);
          filterTagInput(filters.input);
          filterVue();
        }
      });
    };
    filterVue();
  }

  // Filtre les recettes dans la searchbar et les tags
  function filterVue() {
    recipesCards.innerHTML = "";
    const filterRecipe = (recipe, filter) => {
      let ing = "";
      recipe.ingredients.forEach((ingredient) => {
        ing += `${ingredient.ingredient} ${ingredient.quantity || ""} ${
          ingredient.unit || ""
        }`;
      });
      return (
        recipe.name.toLowerCase().includes(filter) +
        ing.toLowerCase().includes(filter) +
        recipe.description.toLowerCase().includes(filter) +
        recipe.appliance.toLowerCase().includes(filter) +
        recipe.ustensils.join(" ").toLowerCase().includes(filter)
      );
    };

    const filtered = recipes.filter((item) => {
      let searchFilter = filterRecipe(item, filters.input);
      let tagsFilter = filters.tags.map((tag) => {
        return filterRecipe(item, tag);
      });
      let res = searchFilter;
      tagsFilter.forEach((tag) => {
        res = res && tag;
      });
      return res;
    });
    cardsDisplay(filtered);
  }

  // Affiche un message d'erreur si la valeur entrée dans la searchbar ne correspond à une aucuns éléments dans les cards
  input.addEventListener("input", function (e) {
    filters.input = e.target.value.toLowerCase();
    if (this.value.length >= 3) {
      latch = false;
      filterVue();
      filterTagInput(e.target.value.toLowerCase());

      const notFound = document.getElementById("not-found-div");
      if (recipesCards.innerHTML === "") {
        notFound.style.display = "block";
      } else {
        notFound.style.display = "none";
      }
    } else if (this.value.length <= 3 && !latch) {
      latch = true;
      recipesCards.innerHTML = "";
      ingredientUl.innerHTML = "";
      appareilUl.innerHTML = "";
      ustensileUl.innerHTML = "";
      cardsDisplay(recipes);
      displayList(lists.ingredients, 0);
      displayList(lists.appareils, 1);
      displayList(lists.ustensils, 2);
    }
  });

  const toggleList = (list, angleDown, angleUp) => {
    if (list.style.display === "none") {
      list.style.display = "grid";
      angleDown.style.display = "none";
      angleUp.style.display = "block";
    } else {
      list.style.display = "none";
      angleDown.style.display = "block";
      angleUp.style.display = "none";
    }
  };

  ingredientInput.addEventListener("click", function () {
    toggleList(
      document.querySelector(".list-ingredient"),
      document.querySelector(".angle-down-ing"),
      document.querySelector(".angle-up-ing")
    );
  });

  appareilInput.addEventListener("click", function () {
    toggleList(
      document.querySelector(".list-appareil"),
      document.querySelector(".angle-down-app"),
      document.querySelector(".angle-up-app")
    );
  });

  ustensileInput.addEventListener("click", function () {
    toggleList(
      document.querySelector(".list-ustensile"),
      document.querySelector(".angle-down-us"),
      document.querySelector(".angle-up-us")
    );
  });

  const filterTagInput = (searchValue) => {
    if (searchValue.length > 2) {
      latch = false;
      ingredientUl.innerHTML = "";
      appareilUl.innerHTML = "";
      ustensileUl.innerHTML = "";

      const filteredIng = lists.ingredients.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      );
      displayList(filteredIng, 0);

      const filteredApp = lists.appareils.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      );
      displayList(filteredApp, 1);

      const filteredUs = lists.ustensils.filter((item) =>
        item.toLowerCase().includes(searchValue.toLowerCase())
      );
      displayList(filteredUs, 2);
    } else if (searchValue.length < 3) {
      ingredientUl.innerHTML = "";
      appareilUl.innerHTML = "";
      ustensileUl.innerHTML = "";

      displayList(lists.ingredients, 0);
      displayList(lists.appareils, 1);
      displayList(lists.ustensils, 2);
    }
    filterVue();
  };

  const filterTagList = (searchValue, typeIndex) => {
    let ul, list;
    if (typeIndex === 0) {
      ul = ingredientUl;
      list = lists.ingredients;
    } else if (typeIndex === 1) {
      ul = appareilUl;
      list = lists.appareils;
    } else if (typeIndex === 2) {
      ul = ustensileUl;
      list = lists.ustensils;
    }

    filterTagInput(searchValue);
  };

  // Filtre les ingrédients dans la searchbar du tag
  ingredientInput.addEventListener("input", function () {
    filterTagList(this.value.toLowerCase());
  });

  // Filtre les appareils dans la searchbar du tag
  appareilInput.addEventListener("input", function () {
    filterTagList(this.value.toLowerCase());
  });

  // Filtre les ustensils dans la searchbar du tag
  ustensileInput.addEventListener("input", function () {
    filterTagList(this.value.toLowerCase());
  });
})();
