import { data } from "./database.js";

const ulElement = document.querySelector(".card-body");

function renderDataList(searchKeyword) {
    let filteredData;
    if (!searchKeyword) {
        filteredData = data;
    } else {
        filteredData = data.filter((obj) => obj.keywords.includes(searchKeyword));
    }

    clearList();

    for (let obj of filteredData) {
        const liElement = document.createElement("li");
        liElement.classList.add("card");

        const divElement = document.createElement("div");
        divElement.classList.add("card-inform");
        liElement.append(divElement);

        const titleObj = document.createElement("h2");
        titleObj.textContent = obj.title;
        titleObj.classList.add("card-inform__title");

        const symbolObj = document.createElement("p");
        symbolObj.textContent = obj.symbol;
        symbolObj.classList.add("card-inform__symbol");

        const keywordsObj = document.createElement("p");
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
