//A wrapper to add the NKJV bible alongside the bible versions that API.BIBLE provides

fetch("../assets/NKJV.bible.json")
  .then((response) => {
    return response.json();
  })
  .then((data) => {
    console.log(data);
  })
  .catch((err) => {});
