'use strict';

const activeClass = 'active';

const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.' + activeClass);

    removeClassFromList(activeLinks);
    addClassToElement(clickedElement);

    const activeArticles = document.querySelectorAll('.posts article.' + activeClass);

    removeClassFromList(activeArticles);

    const href = clickedElement.getAttribute('href');
    const selectedArticle = document.querySelector(href);

    addClassToElement(selectedArticle);

    function addClassToElement(element, className = activeClass) {
        element.classList.add(className);
    }
    function removeClassFromList(list, className = activeClass){
        for(let element of list){
            element.classList.remove(className)
        }
    }
}
const links = document.querySelectorAll('.titles a');
for (let link of links) {
    link.addEventListener('click', titleClickHandler);
}