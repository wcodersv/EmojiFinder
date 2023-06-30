import { data } from "./database.js";

const ulElement = document.querySelector(".card-body");

function renderCard(card) {
    const liElement = document.createElement("li");
    liElement.classList.add("card");

    const divElement = document.createElement("div");
    divElement.classList.add("card-inform");
    liElement.append(divElement);

    const titleElement = document.createElement("h2");
    titleElement.textContent = card.title;
    titleElement.classList.add("card-inform__title");

    const symbolElement = document.createElement("p");
    symbolElement.textContent = card.symbol;
    symbolElement.classList.add("card-inform__symbol");

    const keywordsElement = document.createElement("p");
    keywordsElement.textContent = card.keywords;
    keywordsElement.classList.add("card-inform__description");

    divElement.append(symbolElement);
    divElement.append(titleElement);
    divElement.append(keywordsElement);

    ulElement.append(liElement);
}


function filterCards(searchKeyword) {
    if (!searchKeyword) {
        return data;
    }

    function isCardMatched(card) {
        return card.keywords.includes(searchKeyword);
    }

    return data.filter(isCardMatched);
}



function renderDataList(searchKeyword) {
    clearList();

    filterCards(searchKeyword).forEach(renderCard);
}

renderDataList();

const inputElement = document.getElementById("search");
inputElement.addEventListener("input", function (event) {
    renderDataList(event.target.value);
});

function clearList() {
    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }
}
