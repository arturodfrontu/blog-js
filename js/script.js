'use strict';

const activeClass = 'active';
const selector ={
  all: {
    articles: '.post',
    linksTo: {
      tags: 'a[href^="#tag-"]',
      authors: 'a[href^="#authors-"]',
    },
    links: '.titles a',
    listOf: {
      titles: '.titles',
      tags: '.tags .list',
      authors: '.authors .list',
    },
  },
  article: {
    tags: '.post-tags .list',
    author: '.post-author',
  },
  title: '.post-title',
  active: {
    articles: '.post article.' + activeClass,
  }
};

const opt = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};

/*
const activeClass = 'active';
const optArticleSelector = '.post';
const optTitleSelector = '.post-title';
const optTitleListSelector = '.titles';
const optLinkSelector = 'titles a';
const optArticleTagsSelector = '.post-tags .list';
const optArticleAuthorSelector = '.post-author';
const opt = {
  tagSizes: {
    count: 5,
    classPrefix: 'tag-size-',
  },
};
*/

const titleClickHandler = function (event) {
  event.preventDefault();
  const clickedElement = this;
  const activeLinks = document.querySelectorAll(selector.all.links  + '.' + activeClass);
  const href = clickedElement.getAttribute('href');
  const selectedArticle = document.querySelector(href);
  const activeArticles = document.querySelectorAll(selector.active.articles);

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
  const titleList = document.querySelector(selector.all.listOf.titles);
  const articles = document.querySelectorAll(selector.all.articles + customSelector);

  let html = '';

  removeElement(titleList);

  for (let article of articles) {
    const articleId = article.getAttribute('id');
    const articleTitle = article.querySelector(selector.title).innerHTML;
    const linkHTML = '<li><a href="#' + articleId + '"><span>' + articleTitle + '</span></a></li>';
    html = html + linkHTML;
  }

  titleList.innerHTML = html;

};

generateTitleLinks();

const links = document.querySelectorAll(selector.all.links);
for (let link of links) {
  link.addEventListener('click', titleClickHandler);
}

const calculateTagsParams = function(tags){
  const params = {
    min: 99999,
    max: 0,
  };

  for(let tag in tags){
    if(tags[tag] > params.max){
      params.max = tags[tag];
    }
    if(tags[tag] < params.min){
      params.min = tags[tag];
    }
  }
  return params;
};

//calculateTagsParams();

const calculateTagClass = function(count, params){
  const normalizedCount = count - params.min;
  const normalizedMax = params.max - params.min;
  const percentage = normalizedCount / normalizedMax;
  const classNumber = Math.floor( percentage * (opt.tagSizes.count - 1) + 1 );

  return opt.tagSizes.classPrefix+classNumber;

};

const generateTags = function () {
  let allTags = {};
  const articles = document.querySelectorAll(selector.all.articles);
  for (let article of articles) {
    let html = ' ';
    const tagsWrapper = article.querySelector(selector.article.tags);
    const tags = article.getAttribute('data-tags');
    const tagsArray = tags.split(' ');

    for (let tag of tagsArray) {
      const tagHTML = '<li class="tag"><a href="#tag-' + tag + '"><span>' + tag + '</span></a></li>';
      html = html + tagHTML;
      if(!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    const tagList = document.querySelector('.tags');
    //tagList.innerHTML = allTags.join('');
    const tagsParams = calculateTagsParams(allTags);
    let allTagsHTML = '';
    for(let tag in allTags){
      // allTagsHTML += '<li class="tag"><a class="" href="#tag-'+ tag + '">' + tag + ' (' + allTags[tag] + ')</a></li>';
      allTagsHTML += '<span class="tag ' + calculateTagClass(allTags[tag], tagsParams) + '"><a href="#tag-'+ tag + '">' + tag + ' (' + allTags[tag] + ')</a></span>';
    }
    tagList.innerHTML = allTagsHTML;
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
    sameTagLink.classList.add(activeClass );
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

const generateAuthorList = function(){
  const articles = document.querySelectorAll(selector.all.articles);
  for(let article of articles){
    const authorWrapper = article.querySelector(selector.article.author);
    let html = '';
    const tagAuthor = article.getAttribute('data-author');
    const linkHTML = '<li>by <a href="#author-' + tagAuthor + '">' + tagAuthor + '</a></li>';
    html = html + linkHTML;
    authorWrapper.innerHTML = html;
  }
};
generateAuthorList();

const authorListClickHandler = function(event) {
  event.preventDefault();
  const clickedElement = this;
  const href = clickedElement.getAttribute('href');
  const tag = href.replace('#author-', '');
  const activeAuthorLinks = document.querySelectorAll('a.active[href^="#author-"]');
  for(let activeAuthorLink of activeAuthorLinks){
    activeAuthorLink.classList.remove('active');
  }
  const foundAuthorLinks = document.querySelectorAll('a[href="' + href + '"]');
  for(let foundAuthorLink of foundAuthorLinks){
    foundAuthorLink.classList.add('active');
  }

  generateTitleLinks('[data-author="' + tag + '"]');
};

const addClickListenersToAuthorsList = function(){
  const linkAuthors = document.querySelectorAll('a[href^="#author-"]');

  for(let linkAuthor of linkAuthors){
    linkAuthor.addEventListener('click', authorListClickHandler);
  }
};
addClickListenersToAuthorsList();
