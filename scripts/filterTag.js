(async function () {
  // Create and add tags
  function addTag(value, color) {
    filters.tags.push(value);
    let span = document.createElement("span");
    let tags = document.getElementById("span-tag");
    span.id = "tag";
    span.className = `fa-regular fa-circle-xmark bg-${color}`;
    span.textContent = value;
    tags.appendChild(span);
    span.addEventListener("click", function (e) {
      let value = e.target.innerHTML;
      let index = filters.tags.findIndex((tag) => tag === value);
      filters.tags.splice(index, 1);
      span.remove();
      filterTagInput(filters.input);
      filterVue();
    });
    filterVue();
  }

  function displayList(elems, typeIndex) {
    let color, ul;
    if (typeIndex === 0) {
      ul = ingredientUl;
      color = "blue";
    } else if (typeIndex === 1) {
      ul = appareilUl;
      color = "green";
    } else if (typeIndex === 2) {
      ul = ustensileUl;
      color = "orange";
    }
    elems = [...new Set(elems)];
    elems.sort();
    for (const item of elems) {
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
    }
  }

  function toggleListTags(list, angleDown, angleUp) {
    list.style.display === "none"
      ? ((list.style.display = "grid"),
        (angleDown.style.display = "none"),
        (angleUp.style.display = "block"))
      : ((list.style.display = "none"),
        (angleDown.style.display = "block"),
        (angleUp.style.display = "none"));
  }

  // Displays the list of ingredients in the tag
  const inputs = [ingredientInput, appareilInput, ustensileInput];
  const listes = [
    {
      list: document.querySelector(".list-ingredient"),
      angleDown: document.querySelector(".angle-down-ing"),
      angleUp: document.querySelector(".angle-up-ing"),
    },
    {
      list: document.querySelector(".list-appareil"),
      angleDown: document.querySelector(".angle-down-app"),
      angleUp: document.querySelector(".angle-up-app"),
    },
    {
      list: document.querySelector(".list-ustensile"),
      angleDown: document.querySelector(".angle-down-us"),
      angleUp: document.querySelector(".angle-up-us"),
    },
  ];
  inputs.map((input, index) =>
    input.addEventListener("click", () =>
      toggleListTags(
        listes[index].list,
        listes[index].angleDown,
        listes[index].angleUp
      )
    )
  );

  displayList(lists.ingredients, 0);
  displayList(lists.appareils, 1);
  displayList(lists.ustensils, 2);
})();
