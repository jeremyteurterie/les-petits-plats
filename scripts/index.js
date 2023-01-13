(async function () {
  // Define the display of ingredients in the cards
  function ingredientsDisplay(elements) {
    var result = "";
    for (var i = 0; i < elements.length; i++) {
      var element = elements[i];
      result +=
        "<strong>" +
        element.ingredient +
        "</strong> : " +
        (element.quantity || "") +
        " " +
        (element.unit || "") +
        "</br>";
    }
    return result;
  }

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

  // Create and display the cards
  function cardsDisplay(array) {
    array.forEach(function (item) {
      var div = document.createElement("div");
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

      var mappedIng = [];
      for (var i = 0; i < item.ingredients.length; i++) {
        mappedIng.push(item.ingredients[i].ingredient.toLowerCase());
      }
      lists.ingredients = [...lists.ingredients, ...mappedIng];

      var mappedUs = [];
      for (var j = 0; j < item.ustensils.length; j++) {
        mappedUs.push(item.ustensils[j].toLowerCase());
      }
      lists.ustensils.push(...mappedUs);

      lists.appareils.push(item.appliance.toLowerCase());
    });
  }

  cardsDisplay(recipes);
})();
