//A wrapper to add the NKJV bible alongside the bible versions that API.BIBLE provides
let API_KEY_2 = "8f9a8691f65ba3301a5d8373a350feea"; //api.bible public API key

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
  let bookNameNKJV = FULL_NKJV["books"][bookIndex].name;
  fetchSectionVerses(bookNameNKJV, chapterIndex).then((sections) => {
    console.log("SECTIONS: " + sections);
  });
  return text;
}

function fetchSectionVerses(bookName, chapterIndex) {
  //BIBLE_BOOK_ID is the GEN part, should do GEN.chapterIndex
  let chapterID = nkjvBookNameToAPIBookID(bookName) + "." + (chapterIndex + 1);

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
      `https://api.scripture.api.bible/v1/bibles/de4e12af7f28f599-01/chapters/${chapterID}/sections`
    );
    xhr.setRequestHeader(`api-key`, API_KEY_2);

    xhr.onerror = () => reject(xhr.statusText);

    xhr.send();
  });
}

function nkjvBookNameToAPIBookID(n) {
  switch (n) {
    case "Genesis":
      return "GEN";
    case "Exodus":
      return "EXO";
    case "Leviticus":
      return "LEV";
    case "Numbers":
      return "NUM";
    case "Deuteronomy":
      return "DEU";
    case "Joshua":
      return "JOS";
    case "Judges":
      return "JDG";
    case "Ruth":
      return "RUT";
    case "1 Samuel":
      return "1SA";
    case "2 Samuel":
      return "2SA";
    case "1 Kings":
      return "1KI";
    case "2 Kings":
      return "2KI";
    case "1 Chronicles":
      return "1CH";
    case "2 Chronicles":
      return "2CH";
    case "Ezra":
      return "EZR";
    case "Nehemiah":
      return "NEH";
    case "Esther":
      return "EST";
    case "Job":
      return "JOB";
    case "Psalm":
      return "PSA";
    case "Proverbs":
      return "PRO";
    case "Ecclesiastes":
      return "ECC";
    case "Song of Solomon":
      return "SNG";
    case "Isaiah":
      return "ISA";
    case "Jeremiah":
      return "JER";
    case "Lamentations":
      return "LAM";
    case "Ezekiel":
      return "EZK";
    case "Daniel":
      return "DAN";
    case "Hosea":
      return "HOS";
    case "Joel":
      return "JOL";
    case "Amos":
      return "AMO";
    case "Obadiah":
      return "OBA";
    case "Jonah":
      return "JON";
    case "Micah":
      return "MIC";
    case "Nahum":
      return "NAM";
    case "Habakkuk":
      return "HAB";
    case "Zephaniah":
      return "ZEP";
    case "Haggai":
      return "HAG";
    case "Zechariah":
      return "ZEC";
    case "Malachi":
      return "MAL";
    case "Matthew":
      return "MAT";
    case "Mark":
      return "MRK";
    case "Luke":
      return "LUK";
    case "John":
      return "JHN";
    case "Acts":
      return "ACT";
    case "Romans":
      return "ROM";
    case "1 Corinthians":
      return "1CO";
    case "2 Corinthians":
      return "2CO";
    case "Galatians":
      return "GAL";
    case "Ephesians":
      return "EPH";
    case "Philippians":
      return "PHP";
    case "Colossians":
      return "COL";
    case "1 Thessalonians":
      return "1TH";
    case "2 Thessalonians":
      return "2TH";
    case "1 Timothy":
      return "1TI";
    case "2 Timothy":
      return "2TI";
    case "Titus":
      return "TIT";
    case "Philemon":
      return "PHM";
    case "Hebrews":
      return "HEB";
    case "James":
      return "JAS";
    case "1 Peter":
      return "1PE";
    case "2 Peter":
      return "2PE";
    case "1 John":
      return "1JN";
    case "2 John":
      return "2JN";
    case "3 John":
      return "3JN";
    case "Jude":
      return "JUD";
    case "Revelation":
      return "REV";
    default:
      return n;
  }
}

function shouldAllowBook(n) {
  /* DEBUG CODE
    let debug = ``;
      getBooks("de4e12af7f28f599-01").then((bookList) => {
        let index = 0;
        let index2 = 0;
       for (let book of bookList) {
        if (!shouldAllowBook(book.id)) {
          //console.log("ignored " + book.id);
          continue;
        }
        let bookIDAPI = book.id;
        try {
          let bookNameNKJV = FULL_NKJV["books"][index].name;
          debug += `case "${bookNameNKJV}" : \n return "${bookIDAPI}" \n`;
        } catch {
          //console.log("error " + bookIDAPI);
          debug += `case "undefined" : \n return "${bookIDAPI}" \n`;
        }
        index += 1;
        index2 += 1;
      }
      //console.log("max nkjv: " + index + " - max api: " + index2);
      console.log(debug);
    });
    */

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

function gs1() {
  let elem = document.getElementById("bible-chapter-text");
  var children = elem.children;
  for (var i = 0; i < children.length; i++) {
    //children[i].
  }
}
