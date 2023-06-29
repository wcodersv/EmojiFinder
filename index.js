import { data } from "./test.js";

// Получаем элемент <div> с классом .field-cards
let cardBodyDiv = document.querySelector('.field-cards');

// Создаем элемент <ul>
let ulElement = document.createElement('ul');

// Добавляем класс "card-body" к элементу <ul>
ulElement.classList.toggle('card-body');

// Добавляем элемент <ul> внутрь элемента <div>
cardBodyDiv.append(ulElement);

for (let obj = 0; obj < data.length; obj++) {
    let liElement = document.createElement('li');
    liElement.classList.add('card');

    let titleObj = document.createElement('h2');
    titleObj.textContent = data[obj].title;

    let symbolObj = document.createElement('p');
    symbolObj.textContent = data[obj].symbol;

    let keywordsObj = document.createElement('p');
    keywordsObj.textContent = data[obj].keywords;

    liElement.append(titleObj);
    liElement.append(symbolObj);
    liElement.append(keywordsObj);
    

    ulElement.append(liElement);

}


/* {
    title: "100",
    symbol: "💯",
    keywords:
      "hundred points symbol symbol wow wow win win perfect perfect parties parties",
  }, */