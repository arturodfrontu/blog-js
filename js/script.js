'use strict';

const activeClass = 'active';
const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optLinkSelector = 'titles a';
const optArticleTagsSelector ='.post-tags .list';

const titleClickHandler = function (event) {
  event.preventDefault();

  const clickedElement = this;
  const activeLinks = document.querySelectorAll(optLinkSelector +'.'+ activeClass);
  const href = clickedElement.getAttribute('href');
  const selectedArticle = document.querySelector(href);
  const activeArticles = document.querySelectorAll('.posts article.' + activeClass);

  removeClassFromList(activeLinks);
  addClassToElement(clickedElement);
  removeClassFromList(activeArticles);
  addClassToElement(selectedArticle);

  function addClassToElement(element, className = activeClass) {
    element.classList.add(className);
  }
  function removeClassFromList(list, className = activeClass) {
    for (let element of list) {
      element.classList.remove(className);    }
  }
};

const removeElement = function(element) {
  element.innerHTML = '';
};

const generateTitleLinks = function () {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector);

  let html = '';

  removeElement(titleList);

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(optTitleSelector).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

};

generateTitleLinks();

const links = document.querySelectorAll('.titles a');
for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

const generateTags = function(){
  const articles = document.querySelectorAll(optArticleSelector);
  for(let article of articles){
    let html ='';
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    const tags = article.getAttribute('data-tags');
    const tagsArray = tags.split(' ');

    for(let tag of tagsArray){
      const tagHTML = '<li class="tag"><a href="#tag-' + tag + ' "><span>' + tag + '</span></a></li>';
      html = html + tagHTML;
    }
    tagsWrapper.innerHTML = html;
  }
};
generateTags();
