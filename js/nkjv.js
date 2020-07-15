//A wrapper to add the NKJV bible alongside the bible versions that API.BIBLE provides

let FULL_NKJV = ``;

fetch("../assets/NKJV.bible.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
    FULL_NKJV = data;
  })
  .catch((err) => {
    console.log("Error while getting nkjv json");
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
  let text = FULL_NKJV["books"][bookIndex].chapters[chapterIndex].join("");
  return text;
}
