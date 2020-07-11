
const API_KEY = "8f9a8691f65ba3301a5d8373a350feea"; //api.bible public API key

let SET_LANGUAGE = ""; //language of bible

let SET_VERSION = ""; //Versions of bible

let SET_BOOK = ""; //Books of Bible

let SET_CHAPTER = ""; //Chapter of bible

let languageVersionObject = {}

function setLanguage(language) {

  function populatelanguageListByLanguage(languageVal) { // closure function for population cus i might need to take this out later
    const versionList = document.querySelector(`#bible-version-list`);
    versionList.innerHTML = '';
    let versionHTML = ``;
    for (let version of languageVersionObject[languageVal]) {
      versionHTML += `<li><a class="dropdown-item" href="#">${version.name}</a></li>`;
    }
    versionList.innerHTML = versionHTML;
  }

  populatelanguageListByLanguage(language);
  SET_LANGUAGE = language;

}

function setVersion(version) {
  SET_VERSION = version;

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
