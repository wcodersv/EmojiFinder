import { data } from "./database.js";

// Получаем элемент <div> с классом .field-cards
const cardBodyDiv = document.querySelector(".field-cards");

// Создаем элемент <ul>
const ulElement = document.createElement("ul");

// Добавляем класс "card-body" к элементу <ul>
ulElement.classList.add("card-body");

// Добавляем элемент <ul> внутрь элемента <div>
cardBodyDiv.append(ulElement);

function renderDataList(searchKeyword) {
    let filteredData;
    if (!searchKeyword) {
        filteredData = data;
    } else {
        filteredData = data.filter((obj) => obj.keywords.includes(searchKeyword));
    }

    clearList();

    for (let obj of filteredData) {
        let liElement = document.createElement("li");
        liElement.classList.add("card");

        let divElement = document.createElement("div");
        divElement.classList.add("card-inform");
        liElement.append(divElement);

        let titleObj = document.createElement("h2");
        titleObj.textContent = obj.title;
        titleObj.classList.add("card-inform__title");

        let symbolObj = document.createElement("p");
        symbolObj.textContent = obj.symbol;
        symbolObj.classList.add("card-inform__symbol");

        let keywordsObj = document.createElement("p");
        keywordsObj.textContent = obj.keywords;
        keywordsObj.classList.add("card-inform__description");

        divElement.append(symbolObj);
        divElement.append(titleObj);
        divElement.append(keywordsObj);

        ulElement.append(liElement);
    }
}

renderDataList();

const inputElement = document.getElementById("search");
inputElement.addEventListener("change", function (event) {
    renderDataList(event.target.value);
});

function clearList() {
    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }
}
