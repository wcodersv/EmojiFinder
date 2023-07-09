import { data } from "./database.js";

const ulElement = document.querySelector(".card-body");

let filteredCards = data;
let prevSearchKeyword = '';
function renderAllPage(searchKeyword, currentPage, cardsOnPage) {
    if (searchKeyword !== prevSearchKeyword) {
        filteredCards = filterCards(searchKeyword);
        prevSearchKeyword = searchKeyword;
    }

    const allPagesCount = calculateAllPagesCount(filteredCards.length, cardsOnPage);
    currentPage = convertCurrentPageToNumber(currentPage, allPagesCount);
    validateCurrentPage(currentPage, allPagesCount);

    renderPagesBar(allPagesCount, currentPage);
    renderCards(filteredCards, currentPage, cardsOnPage);
}

/* Функция для отрисовки карточек with pagination */
function renderCards(filteredCards, currentPage, cardsOnPage) {
    clearList();
    const start = cardsOnPage * currentPage;
    const end = start + cardsOnPage;
    filteredCards.slice(start, end).forEach(renderCard);
}

/*Функция для удаления li внутри ul*/
function clearList() {
    ulElement.innerHTML = "";
}

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

/* Привязывание обработчика к элементу input */
const inputElement = document.getElementById("search");
inputElement.addEventListener("input", function (event) {
    renderAllPage(event.target.value, 0, +cardsOnPageCount.value);
});

/* Реализация пагинации */
const cardsOnPageCount = document.querySelector('#list-pages');
const pagesBar = document.querySelector('.pages-bar');

cardsOnPageCount.addEventListener("change", function (event) {
    renderAllPage(inputElement.value, 0, +event.target.value);
});

pagesBar.addEventListener("click", function (event) {
    renderAllPage(inputElement.value, event.target.dataset.value, +cardsOnPageCount.value);
})


/* Функция для отрисовки цифр */
function renderPagesBar(allPagesCount, currentPage) {
    pagesBar.innerHTML = "";

    const pageIndices = creatPageIndices(allPagesCount, currentPage);

    let liFirst = document.createElement('li');
    liFirst.dataset.value = 'First';
    liFirst.innerHTML = 'First';
    pagesBar.appendChild(liFirst);

    for (let pageIndex of pageIndices) {
        let li = document.createElement('li');
        li.dataset.value = pageIndex;
        li.innerHTML = pageIndex + 1;
        pagesBar.appendChild(li);

        if (pageIndex === currentPage) {
            li.classList.add("active");
        }
    }

    let liLast = document.createElement('li');
    liLast.dataset.value = 'Last';
    liLast.innerHTML = 'Last';
    pagesBar.appendChild(liLast);
}

/* Функция для создания инекдсов номеров страниц (не больше 5 или allPagesCount)
 и включающих currentPage */
function creatPageIndices(allPagesCount, currentPage) {
    let pageIndices = [];
    if (allPagesCount <= 5) {
        for (let i = 0; i < allPagesCount; i++) {
            pageIndices.push(i);
        }
        return pageIndices;
    }

    let leftFromCurrentCount;
    let rightFromCurrentCount;
    leftFromCurrentCount = Math.min(2, currentPage - 0)
    rightFromCurrentCount = Math.min(2, allPagesCount - 1 - currentPage);
    if (rightFromCurrentCount < 2) {
        leftFromCurrentCount += 2 - rightFromCurrentCount;
    }
    if (leftFromCurrentCount < 2) {
        rightFromCurrentCount += 2 - leftFromCurrentCount;
    }

    for (let i = leftFromCurrentCount; i > 0; i--) {
        pageIndices.push(currentPage - i);
    }
    pageIndices.push(currentPage);
    for (let i = 0; i < rightFromCurrentCount; i++) {
        pageIndices.push(currentPage + i + 1);
    }

    return pageIndices;
}

function calculateAllPagesCount(allCardsCount, cardsOnPage) {
    return Math.max(Math.ceil(allCardsCount / cardsOnPage), 1);
}

function convertCurrentPageToNumber(currentPage, allPagesCount) {
    if (currentPage === 'First') {
        currentPage = 0;
    } else if (currentPage === 'Last') {
        currentPage = allPagesCount - 1;
    } else {
        currentPage = +currentPage;
    }
    return currentPage;
}

function validateCurrentPage(currentPage, allPagesCount) {
    if (currentPage < 0 || currentPage >= allPagesCount) {
        throw new Error(`currentPage out of range: ${currentPage}`);
    }
}

renderAllPage(inputElement.value, 0, +cardsOnPageCount.value);
