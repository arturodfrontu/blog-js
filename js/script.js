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

const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';

function removeElement(element){
    element.innerHTML = '';
}

const generateTitleLinks = function(){
    const titleList = document.querySelector(optTitleListSelector);

    removeElement(titleList);

    const articles = document.querySelectorAll(optArticleSelector);

    let html ='';

    for(let article of articles){
        const articleId = article.getAttribute('id');
        const articleTitle = article.querySelector(optTitleSelector).innerHTML;
        const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
        html = html + linkHTML

    }

    titleList.innerHTML = html;

}

generateTitleLinks();

const links = document.querySelectorAll('.titles a');
for (let link of links) {
    link.addEventListener('click', titleClickHandler);
}

