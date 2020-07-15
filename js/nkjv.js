//A wrapper to add the NKJV bible alongside the bible versions that API.BIBLE provides

let FULL_NKJV = ``;

fetch("../assets/NKJV.bible.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    FULL_NKJV = data;
    let debug = ``;
    for (let bookIndex in FULL_NKJV["books"]) {
      for (let chapterIndex in FULL_NKJV["books"][bookIndex].chapters) {
        let chapter = FULL_NKJV["books"][bookIndex].chapters[chapterIndex];
        debug += `case "${chapter.name}" : \n return "" \n break; \n`;
      }
    }

    console.log(debug);
  })
  .catch((err) => {
    console.log("Error while getting nkjv json" + err);
  });

function nkjvGetBooksHandler() {
  const bookListElement = document.querySelector(`#bible-book-list`);
  bookListElement.innerHTML = "";
  let bookHTML = ``;
  for (let bookIndex in FULL_NKJV["books"]) {
    let book = FULL_NKJV["books"][bookIndex];
    bookHTML += `<a class="dropdown-item" onclick="setBook('nkjv','${bookIndex}','${book.name}')">${book.name}</a>`;
  }
  bookListElement.innerHTML = bookHTML;
}

function nkjvGetChapterHandler(bookIndex) {
  const chapterListElement = document.querySelector(`#bible-chapter-list`);
  chapterListElement.innerHTML = "";
  let chapterHTML = ``;
  for (let chapterIndex in FULL_NKJV["books"][bookIndex].chapters) {
    let chapter = FULL_NKJV["books"][bookIndex].chapters[chapterIndex];
    chapterHTML += `<a class="dropdown-item" onclick="setChapter('nkjv','${chapterIndex}','${chapter.num}')" data-toggle="collapse" data-target=".navbar-collapse.show"> ${chapter.num} </a>`;
  }
  chapterListElement.innerHTML = chapterHTML;
}

function nkjvGetTextByChapter(bookIndex, chapterIndex) {
  let versesArray = FULL_NKJV["books"][bookIndex].chapters[chapterIndex].verses;
  let text = ``;
  for (let verseIndex in versesArray) {
    text += versesArray[verseIndex].num + " " + versesArray[verseIndex].text;
  }
  return text;
}

function fetchSectionVerses(chapterName) {
  let chapterID = nkjvChapterNameToAPIChapterID(chapterName);
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = false;

    xhr.addEventListener(`readystatechange`, function () {
      if (this.readyState === this.DONE) {
        const { data, meta } = JSON.parse(this.responseText);
        resolve(data.content);
      }
    });

    xhr.open(
      `GET`,
      `https://api.scripture.api.bible/v1/bibles/v1/bibles/de4e12af7f28f599-01/chapters/${chapterID}/sections`
    );
    xhr.setRequestHeader(`api-key`, API_KEY);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

function nkjvChapterNameToAPIChapterID(n) {
  return n;
  switch (n) {
    case "Genesis":
      return "GEN";
      break;
    case "Exodus":
      return "EXO";
      break;
    case "Leviticus":
      return "";
      break;
    case "Numbers":
      break;
  }
}
