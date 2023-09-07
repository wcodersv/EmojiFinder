
let filteredCards;
let prevSearchKeyword;

/* Привязывание обработчика к элементу input */
const inputElement = document.getElementById("search");
inputElement.addEventListener("input", function (event) {
    renderAllPage(event.target.value, 0, +cardsOnPageCount.value);
});

/* Привязывание обработчика к элементу select */
const cardsOnPageCount = document.querySelector('#list-pages');
cardsOnPageCount.addEventListener("change", function (event) {
    renderAllPage(inputElement.value, 0, +event.target.value);
});

/* Привязывание обработчика к элементу ul/li */
const pagesBar = document.querySelector('.pages-bar');
pagesBar.addEventListener("click", function (event) {
    renderAllPage(inputElement.value, event.target.dataset.value, +cardsOnPageCount.value);
})

let ldsEllipsis = document.querySelector('.lds-ellipsis');

/* Функция для получения карточек по фильтру из API */
function fetchCards(searchKeyword, onCardCallback) {
    let url;
    if (!searchKeyword) {
        url = "http://api.codeoverdose.space/api/emoji/v1";
    } else {
        url = `http://api.codeoverdose.space/api/emoji/v1/find/?query=${searchKeyword}`;
    }

    ldsEllipsis.style.display = 'block';
    fetch(url)
        .then((response) => response.json())
        .then((data) => {
            filteredCards = data;
            onCardCallback();
            ldsEllipsis.style.display = 'none';
        })
        .catch((error) => {
            ldsEllipsis.style.display = 'none';
            console.log("Произошла ошибка", error);
            alert('Упссс! Ошибка не моя, что-то с API')
        });
}

const ulElement = document.querySelector(".card-body");

/* Функция для отрисовки всей страницы */
function renderAllPage(searchKeyword, currentPage, cardsOnPage) {
    if (searchKeyword !== prevSearchKeyword) {
        fetchCards(searchKeyword, () => renderPageElements(filteredCards, currentPage, cardsOnPage));
        prevSearchKeyword = searchKeyword;
    } else {
        renderPageElements(filteredCards, currentPage, cardsOnPage);
    }
}

/* Функция для отрисовки элементов страницы */
function renderPageElements(filteredCards, currentPage, cardsOnPage) {
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

/*** РЕАЛИЗАЦИЯ ПАГИНАЦИИ ***/
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

/* Функция для подсчета количества страниц */
function calculateAllPagesCount(allCardsCount, cardsOnPage) {
    return Math.max(Math.ceil(allCardsCount / cardsOnPage), 1);
}

/* Функция для конвертации номера страницы (строка) в число */
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

/* Функция для проверки корректности текущего номера страниц */
function validateCurrentPage(currentPage, allPagesCount) {
    if (currentPage < 0 || currentPage >= allPagesCount) {
        throw new Error(`currentPage out of range: ${currentPage}`);
    }
}

renderAllPage(inputElement.value, 0, +cardsOnPageCount.value);
