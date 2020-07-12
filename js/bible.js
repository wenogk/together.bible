
const API_KEY = "8f9a8691f65ba3301a5d8373a350feea"; //api.bible public API key

let BIBLE_LANGUAGE = ""; //language of bible
let CURRENT_SELECTED_BIBLE_VERSION_LIST = [];
let CURRENT_SELECTED_BIBLE_BOOK_LIST = [];

let BIBLE_VERSION = ""; //Versions of bible
let BIBLE_VERSION_ID = ""; //Versions of bible
let BIBLE_VERSION_ABBR = ""; //Versions of bible

let BIBLE_BOOK_ID = ""; //Books of Bible

let BIBLE_CHAPTER = ""; //Chapter of bible

let languageVersionObject = {}
let versionBooksObject = {}

function refreshSelects(level) { //level can be 1 for language, 2 for version, 3 for book
  if(level==1) {
    document.getElementById("versionSelectButton").innerText = "Version";

    document.getElementById("bookSelectButton").innerText = "Book";
    document.querySelector(`#bible-book-list`).innerHTML = "<li>Select a version first</li>"

    document.getElementById("chapterSelectButton").innerText = "Chapter";
    document.querySelector(`#bible-chapter-list`).innerHTML = "<li>Select a Book first</li>"
  } else if(level==2) {
    document.getElementById("bookSelectButton").innerText = "Book";

    document.getElementById("chapterSelectButton").innerText = "Chapter";
    document.querySelector(`#bible-chapter-list`).innerHTML = "<li>Select a Book first</li>"
  } else if(level==3) {
    document.getElementById("bookSelectButton").innerText = "Book";
  }
}

function setLanguage(language) {
  refreshSelects(1)
  function populatelanguageListByLanguage(languageVal) { // closure function for population cus i might need to take this out later
    const versionList = document.querySelector(`#bible-version-list`);
    versionList.innerHTML = '';
    let versionHTML = ``;
    for (let version of languageVersionObject[languageVal]) {
      versionHTML += `<li><a class="dropdown-item" onclick="setVersion('${version.id}','${version.name}','${version.abbreviation}')">${version.name}</a></li>`;
    }
    versionList.innerHTML = versionHTML;
  }

  populatelanguageListByLanguage(language);
  CURRENT_SELECTED_BIBLE_VERSION_LIST =  [...languageVersionObject[language]];
  BIBLE_LANGUAGE = language;
  document.getElementById("languageSelectButton").innerText = BIBLE_LANGUAGE;
  languageSelectButton

}

function setVersion(id,name,abbr) {
  refreshSelects(2)
  getBooks(id).then((bookList) => {
   CURRENT_SELECTED_BIBLE_BOOK_LIST = [...bookList];
   const bookListElement = document.querySelector(`#bible-book-list`);
   bookListElement.innerHTML = '';
   let bookHTML = ``;
   for (let book of bookList) {
     bookHTML += `<li><a class="dropdown-item" onclick="setBook('${id}','${book.id}','${book.name}')">${book.name}</a></li>`;
   }
   bookListElement.innerHTML = bookHTML;
 });

  BIBLE_VERSION = name;
  BIBLE_VERSION_ID = id;
  BIBLE_VERSION_ABBR = abbr;
  document.getElementById("versionSelectButton").innerText = BIBLE_VERSION_ABBR;
}

function setBook(bibleVersionID,bibleBookID, name) {
  refreshSelects(3)
  //bible-chapter-list
  getChapters(bibleVersionID, bibleBookID).then((chapterList) => {
    const chapterListElement = document.querySelector(`#bible-chapter-list`);
    chapterListElement.innerHTML = '';
    let chapterHTML = ``;
    for (let chapter of chapterList) {
      chapterHTML += `<li><a class="dropdown-item" onclick="setChapter('${bibleVersionID}','${chapter.id}','${chapter.number}')"> ${chapter.number} </a></li>`;
    }
    chapterListElement.innerHTML = chapterHTML;
  });

  BIBLE_BOOK_ID = bibleBookID
  document.getElementById("bookSelectButton").innerText = name;
}

function setChapter(bibleVersionID, chapterID, num) {
  const chapterTextElement = document.querySelector(`#bible-chapter-text`);
  getChapterText(bibleVersionID,chapterID).then((content) => {
    chapterTextElement.innerHTML = content;
  });
  BIBLE_CHAPTER = chapterID;
  document.getElementById("chapterSelectButton").innerText = num;
}




      const languageList = document.querySelector(`#bible-language-list`);
      let languageHTML = ``;
      getBibleVersions().then((biblelanguageList) => {
        const sortedVersions = sortVersionsByLanguage(biblelanguageList);

        for (let languageGroup in sortedVersions) {
          const language = languageGroup;
          languageHTML += `<li><a class="dropdown-item" onclick="setLanguage('${language}')">${language}</a></li>`;
          const versions = sortedVersions[languageGroup];
          languageVersionObject[language] = [];
          for (let version of versions) {
            languageVersionObject[language].push(version)
            // languageHTML += `<div class="bible">
            //                   <a href="book.html?version=${version.id}&abbr=${version.abbreviation}">
            //                     <abbr class="bible-version-abbr" title="${version.name}">${version.abbreviation}</abbr>
            //                     <span>
            //                       <span class="bible-version-name">${version.name}</span>
            //                       ${version.description ? '<span class="bible-version-desc">' + version.description + "</span>" : ''}
            //                     </span>
            //                   </a>
            //                 </div>`;
          }
          languageHTML += `</div>`;
        }
        console.log("lang: " + JSON.stringify(languageVersionObject))
        languageList.innerHTML = languageHTML;

      });


      /**
       * Gets Bible versions from API.Bible
       * @returns {Promise} containing list of Bible versions
       */
      function getBibleVersions() {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;

          xhr.addEventListener(`readystatechange`, function() {
            if (this.readyState === this.DONE) {
              const {data} = JSON.parse(this.responseText);
              const versions = data.map( (data) => {
                return {
                  name: data.name,
                  id: data.id,
                  abbreviation: data.abbreviation,
                  description: data.description,
                  language: data.language.name
                };
              });

              resolve(versions);
            }
          });

          xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles`);
          xhr.setRequestHeader(`api-key`, API_KEY);

          xhr.onerror = () => reject(xhr.statusText);

          xhr.send();
        });
      }

      /**
       * Sorts Bible versions by language and alphabetically by abbreviation
       * @params {Object} biblelanguageList list of Bible versions
       * @returns {Object} sorted list of Bibles
       */
      function sortVersionsByLanguage(biblelanguageList) {
        let sortedVersions = {};

        for (const version of biblelanguageList) {
          if (!sortedVersions[version.language]) {
            sortedVersions[version.language] = [];
          }
          sortedVersions[version.language].push(version);
        }
        for (const version in sortedVersions) {
          sortedVersions[version].sort( (a, b) => {
            const nameA = a.abbreviation.toUpperCase();
            const nameB = b.abbreviation.toUpperCase();
            if (nameA < nameB) {
              return -1;
            }
            if (nameA > nameB) {
              return 1;
            }
            return 0;
          } );
        }
        return sortedVersions;
      }

/**
 * Gets books of the Bible from API.Bible
 * @param {string} bibleVersionID to get books from
 * @returns {Promise} containing list of books of the Bible
 */
function getBooks(bibleVersionID) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function() {
      if (this.readyState === this.DONE) {
        const {data} = JSON.parse(this.responseText);
        const books = data.map( ({name, id}) => { return {name, id}; } );

        resolve(books);
      }
    });

    xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books`);
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}


      const bibleChapterList = document.querySelector(`#chapter-list`);
      const bibleSectionList = document.querySelector(`#section-list`);
      const bibleVersionID = getParameterByName(`version`);
      const bibleBookID = getParameterByName(`book`);
      const abbreviation = getParameterByName(`abbr`);

      let chapterHTML = ``;
      let sectionHTML = ``;

      if (!bibleVersionID || !bibleBookID) {
      //  window.location.href = `./index.html`;
      }

      getChapters(bibleVersionID, bibleBookID).then((chapterList) => {
        chapterHTML += `<ol>`;
        for (let chapter of chapterList) {
          chapterHTML += `<li class="grid"><a class="grid-link" href="verse.html?version=${bibleVersionID}&abbr=${abbreviation}&chapter=${chapter.id}"> ${chapter.number} </a></li>`;
        }
        chapterHTML += `</ol>`;
        bibleChapterList.innerHTML = chapterHTML;
      });

      getSections(bibleVersionID, bibleBookID).then((sectionList) => {
        if (sectionList) {
          sectionHTML += `<ol>`;
          for (let section of sectionList) {
            sectionHTML += `<li class="section"><a href="section.html?version=${bibleVersionID}&abbr=${abbreviation}&section=${section.id}"><abbr class="section-id">${section.id}</abbr><span class="bible-version-name"> ${section.title} </span></a></li>`;
          }
          sectionHTML += `</ol>`;
        } else {
          sectionHTML += `<div>There are no sections for this version and chapter.</div>`;
        }

        bibleSectionList.innerHTML = sectionHTML;
      });

      document.querySelector(`#viewing`).innerHTML = `${bibleBookID}`;
      const breadcrumbsHTML = `
        <ul>
          <li><a href="book.html?version=${bibleVersionID}&abbr=${abbreviation}">${abbreviation}</a></li>
          <li>${bibleBookID}</li>
        </ul>
      `;
      breadcrumbs.innerHTML = breadcrumbsHTML;

      /**
       * Gets chapters from API.Bible
       * @param {string} bibleVersionID to get chapters from
       * @param {string} bibleBookID to get chapters from
       * @returns {Promise} containing list of chapters from selected book
       */
      function getChapters(bibleVersionID, bibleBookID) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;

          xhr.addEventListener(`readystatechange`, function() {
            if (this.readyState === this.DONE) {
              const {data} = JSON.parse(this.responseText);
              const chapters = data.map( ({number, id}) => { return {number, id}; } );

              resolve(chapters);
            }
          });

          xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}/chapters`);
          xhr.setRequestHeader(`api-key`, API_KEY);

          xhr.onerror = () => reject(xhr.statusText);

          xhr.send();
        });
      }

      /**
       * Gets sections from API.Bible
       * @param {string} bibleVersionID to get sections from
       * @param {string} bibleBookID to get sections from
       * @returns {Promise} containing list of sections from selected book
       */
      function getSections(bibleVersionID, bibleBookID) {
        return new Promise((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhr.withCredentials = false;

          xhr.addEventListener(`readystatechange`, function() {
            if (this.readyState === this.DONE) {
              const {data} = JSON.parse(this.responseText);
              const sections = data ? data.map( ({title, id}) => { return {title, id}; } ) : null;

              resolve(sections);
            }
          });

          xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/books/${bibleBookID}/sections`);
          xhr.setRequestHeader(`api-key`, API_KEY);

          xhr.onerror = () => reject(xhr.statusText);

          xhr.send();
        });
      }

      /**
       * Gets query parameter from URL based on name
       * @param {string} name of query parameter
       * @returns {string} value of query parameter
       */
      function getParameterByName(name) {
        const url = window.location.href;
        name = name.replace(/[\[\]]/g, `\\$&`);
        const regex = new RegExp(`[?&]` + name + `(=([^&#]*)|&|#|$)`),
          results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return ``;
        return decodeURIComponent(results[2].replace(/\+/g, ` `));
      }

      /**
       * Loads page for new search
       */
      function searchButton(){
        const searchInput = document.querySelector(`#search-input`);
        window.location.href = `./search.html?&version=${bibleVersionID}&abbr=${abbreviation}&query=${searchInput.value}`;
      }

      function getChapterText(bibleVersionID,bibleChapterID) {
            return new Promise((resolve, reject) => {
              const xhr = new XMLHttpRequest();
              xhr.withCredentials = false;

              xhr.addEventListener(`readystatechange`, function() {
                if (this.readyState === this.DONE) {
                  const {data, meta} = JSON.parse(this.responseText);
                  resolve(data.content);
                }
              });

              xhr.open(`GET`, `https://api.scripture.api.bible/v1/bibles/${bibleVersionID}/chapters/${bibleChapterID}`);
              xhr.setRequestHeader(`api-key`, API_KEY);

              xhr.onerror = () => reject(xhr.statusText);

              xhr.send();
            });
          }
