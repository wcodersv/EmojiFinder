import { data } from "./database.js";

const ulElement = document.querySelector(".card-body");

function renderCard(card) {
    const liElement = document.createElement("li");
    liElement.classList.add("card");

    const divElement = document.createElement("div");
    divElement.classList.add("card-inform");
    liElement.append(divElement);

    const titleObj = document.createElement("h2");
    titleObj.textContent = card.title;
    titleObj.classList.add("card-inform__title");

    const symbolObj = document.createElement("p");
    symbolObj.textContent = card.symbol;
    symbolObj.classList.add("card-inform__symbol");

    const keywordsObj = document.createElement("p");
    keywordsObj.textContent = card.keywords;
    keywordsObj.classList.add("card-inform__description");

    divElement.append(symbolObj);
    divElement.append(titleObj);
    divElement.append(keywordsObj);

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
