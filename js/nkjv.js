//A wrapper to add the NKJV bible alongside the bible versions that API.BIBLE provides

let FULL_NKJV = ``;

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

function fetchSectionVerses(bookName, chapterIndex) {
  //BIBLE_BOOK_ID is the GEN part, should do GEN.chapterIndex
  let chapterID = nkjvBookNameToAPIBookID(bookName);
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

function nkjvBookNameToAPIBookID(n) {
  switch (n) {
    case "Genesis":
      return "";
    case "Exodus":
      return "";
    case "Leviticus":
      return "";
    case "Numbers":
      return "";
    case "Deuteronomy":
      return "";
    case "Joshua":
      return "";
    case "Judges":
      return "";
    case "Ruth":
      return "";
    case "1 Samuel":
      return "";
    case "2 Samuel":
      return "";
    case "1 Kings":
      return "";
    case "2 Kings":
      return "";
    case "1 Chronicles":
      return "";
    case "2 Chronicles":
      return "";
    case "Ezra":
      return "";
    case "Nehemiah":
      return "";
    case "Esther":
      return "";
    case "Job":
      return "";
    case "Psalm":
      return "";
    case "Proverbs":
      return "";
    case "Ecclesiastes":
      return "";
    case "Song of Solomon":
      return "";
    case "Isaiah":
      return "";
    case "Jeremiah":
      return "";
    case "Lamentations":
      return "";
    case "Ezekiel":
      return "";
    case "Daniel":
      return "";
    case "Hosea":
      return "";
    case "Joel":
      return "";
    case "Amos":
      return "";
    case "Obadiah":
      return "";
    case "Jonah":
      return "";
    case "Micah":
      return "";
    case "Nahum":
      return "";
    case "Habakkuk":
      return "";
    case "Zephaniah":
      return "";
    case "Haggai":
      return "";
    case "Zechariah":
      return "";
    case "Malachi":
      return "";
    case "Matthew":
      return "";
    case "Mark":
      return "";
    case "Luke":
      return "";
    case "John":
      return "";
    case "Acts":
      return "";
    case "Romans":
      return "";
    case "1 Corinthians":
      return "";
    case "2 Corinthians":
      return "";
    case "Galatians":
      return "";
    case "Ephesians":
      return "";
    case "Philippians":
      return "";
    case "Colossians":
      return "";
    case "1 Thessalonians":
      return "";
    case "2 Thessalonians":
      return "";
    case "1 Timothy":
      return "";
    case "2 Timothy":
      return "";
    case "Titus":
      return "";
    case "Philemon":
      return "";
    case "Hebrews":
      return "";
    case "James":
      return "";
    case "1 Peter":
      return "";
    case "2 Peter":
      return "";
    case "1 John":
      return "";
    case "2 John":
      return "";
    case "3 John":
      return "";
    case "Jude":
      return "";
    case "Revelation":
      return "";
    default:
      return n;
  }
}

function shouldAllowBook(n) {
  switch (n) {
    case "1ES":
      return false;
    case "2ES":
      return false;
    case "TOB":
      return false;
    case "JDT":
      return false;
    case "ESG":
      return false;
    case "WIS":
      return false;
    case "SIR":
      return false;
    case "BAR":
      return false;
    case "S3Y":
      return false;
    case "SUS":
      return false;
    case "BEL":
      return false;
    case "MAN":
      return false;
    case "1MA":
      return false;
    case "2MA":
      return false;
    default:
      return true;
  }
}
