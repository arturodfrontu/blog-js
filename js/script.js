'use strict';

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tag-cloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-author-cloud-link').innerHTML
  ),
};

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
    const linkHTMLData = {id: articleId, title: articleTitle};
    const linkHTML = templates.articleLink(linkHTMLData);
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
    let html = '';
    const tagsWrapper = article.querySelector(selector.article.tags);
    const tags = article.getAttribute('data-tags');
    const tagsArray = tags.split(' ');

    for (let tag of tagsArray) {
      const linkHTMLData = { id: tag, title: tag };
      const tagHTML = templates.tagLink(linkHTMLData);
      html = html + tagHTML;
      console.log(tagHTML);
      if(!allTags[tag]) {
        allTags[tag] = 1;
      } else {
        allTags[tag]++;
      }
    }
    tagsWrapper.innerHTML = html;

    const tagList = document.querySelector('.tags');
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};
    for(let tag in allTags){
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className:'tag ' +  calculateTagClass(allTags[tag], tagsParams)
      });
    }
    tagList.innerHTML = templates.tagCloudLink(allTagsData);


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
    sameTagLink.classList.add(activeClass);
  }

  generateTitleLinks('[data-tags~="'+ tag +'"]');

}

function addClickListenersToTags() {
  const sameTagsLinks = document.querySelectorAll('a[href^="#tag-"]');

  for(let sameTagLink of sameTagsLinks){
    sameTagLink.addEventListener('click', tagClickHandler);
  }

}

addClickListenersToTags();

const generateAuthorList = function(){
  let allAuthors = {};
  const articles = document.querySelectorAll(selector.all.articles);
  for(let article of articles){
    const authorWrapper = article.querySelector(selector.article.author);
    let html = '';
    const tagAuthor = article.getAttribute('data-author');
    const linkHTMLData = { id: tagAuthor, title: tagAuthor };
    const linkHTML = templates.authorLink(linkHTMLData);
    html = html + linkHTML;

    if (!allAuthors[tagAuthor]) {
      allAuthors[tagAuthor] = 1;
    } else {
      allAuthors[tagAuthor]++;
    }

    authorWrapper.innerHTML = html;

  }
  const authorList = document.querySelector('.authors');
  const allAuthorsData = {authors: []};
  for (let author in allAuthors) {

    allAuthorsData.authors.push({
      author: author,
      count: allAuthors[author],
    });

  }

  authorList.innerHTML = templates.authorCloudLink(allAuthorsData);
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
