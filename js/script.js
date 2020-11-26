'use strict';

const activeClass = 'active';
const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optLinkSelector = 'titles a';
const optArticleTagsSelector = '.post-tags .list';
//const optTagsListSelector = '.tags .list';

const titleClickHandler = function (event) {
  event.preventDefault();

  const clickedElement = this;
  const activeLinks = document.querySelectorAll(optLinkSelector + '.' + activeClass);
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
      element.classList.remove(className);
    }
  }
  console.log(clickedElement);

};
const removeElement = function (element) {
  element.innerHTML = '';
};

const generateTitleLinks = function (customSelector ='') {
  const titleList = document.querySelector(optTitleListSelector);
  const articles = document.querySelectorAll(optArticleSelector + customSelector);

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
console.log(links);
const generateTags = function () {
  let allTags = [];
  const articles = document.querySelectorAll(optArticleSelector);
  for (let article of articles) {
    let html = ' ';
    const tagsWrapper = article.querySelector(optArticleTagsSelector);
    const tags = article.getAttribute('data-tags');
    const tagsArray = tags.split(' ');

    for (let tag of tagsArray) {
      const tagHTML = '<li class="tag"><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      html = html + tagHTML;
      if (allTags.indexOf(tagHTML) == -1) {
        allTags.push(tagHTML);
      }
    }
    const tagList = document.querySelector('.tags');
    tagList.innerHTML = allTags.join('');
    tagsWrapper.innerHTML = html;
  }
};
generateTags();

function tagClickHandler(event) {

  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#tag-', '');
  const tagsActiveClassAll = document.querySelectorAll('a.active[href^="#tag-"]');
  const sameTagsLinks = document.querySelectorAll('a[href="' + href + '"]');

  for(let tagActiveClass of tagsActiveClassAll){
    tagActiveClass.classList.remove(activeClass);
  }

  for(let sameTagLink of sameTagsLinks){
    sameTagLink.classList.add('active');
  }

  generateTitleLinks('[data-tags~="'+tag+'"]');

}

function addClickListenersToTags() {
  const sameTagsLinks = document.querySelectorAll('a[href^="#tag-"]');

  for(let sameTagLink of sameTagsLinks){
    sameTagLink.addEventListener('click', tagClickHandler);
  }

}

addClickListenersToTags();
