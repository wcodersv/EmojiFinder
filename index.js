import { data } from "./database.js";

const ulElement = document.querySelector(".card-body");

/*Функция для отрисовки 1 карточки*/
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
    keywordsElement.textContent = [
        ...createUniqueWordsFromString(card.keywords),
    ].join(" ");
    keywordsElement.classList.add("card-inform__description");

    divElement.append(symbolElement);
    divElement.append(titleElement);
    divElement.append(keywordsElement);

    ulElement.append(liElement);
}

/*Функция для создания множества уникальных слов из строки*/
function createUniqueWordsFromString(string) {
    const splitWords = string
        .toLowerCase()
        .split(" ")
        .filter((word) => word);
    return new Set(splitWords);
}

/*Функция для фильтрации карточек по ключевым словам*/
function filterCards(searchKeyword) {
    if (!searchKeyword) {
        return data;
    }

    let searchKeywordsSet = createUniqueWordsFromString(searchKeyword);

    /*Функция для проверки совпадает ли карточка с ключевыми словами*/
    function isCardMatched(card) {
        const titleSet = createUniqueWordsFromString(card.title);
        const keywordsSet = createUniqueWordsFromString(card.keywords);

        return (
            hasIntersection(titleSet, searchKeywordsSet) ||
            hasIntersection(keywordsSet, searchKeywordsSet)
        );
    }

    return data.filter(isCardMatched);
}

/* Функция для проверки пересечений между двумя Set */
function hasIntersection(set1, set2) {
    for (const value of set1) {
        if (set2.has(value)) {
            return true;
        }
    }
    return false;
}

/*Функция для отрисовки карточек по введеным ключевым словам*/
function renderDataList(searchKeyword) {
    clearList();
    filterCards(searchKeyword).forEach(renderCard);
}

renderDataList();

/*Привязывание обработчика к элементу input*/
const inputElement = document.getElementById("search");
inputElement.addEventListener("input", function (event) {
    renderDataList(event.target.value);
});

/*Функция для удаления li внутри ul*/
function clearList() {
    while (ulElement.firstChild) {
        ulElement.removeChild(ulElement.firstChild);
    }
}
