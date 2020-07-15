//,'https://gun-us.herokuapp.com/gun','https://gun-eu.herokuapp.com/gun'

var gun = Gun([
  "https://mvp-gun.herokuapp.com/gun",
  "https://e2eec.herokuapp.com/gun",
]);
var connectionEngineGraph = gun.get("together.bible.cursors");
var bibleInfoGraph = gun.get("together.bible.info");
var localData = {};
var localBibleData = {};
//start cursor stuff
let countUsersConnected = 0;
let isAmenClicked = false;
let curX = 0;
let curY = 0;
let randomUserID = "9999999";
var randomColor = "#000000".replace(/0/g, function () {
  return (~~(Math.random() * 16)).toString(16);
});
let amenSoundAudio = new Audio("assets/sounds/amen2.mp3");
let cursorsHolder = document.getElementById("cursorsHolder");
let localUserSubscribedChapterUpdates = {};
if (localStorage.getItem("userID") === null) {
  randomUserID = generateId(10);
  window.localStorage.setItem("userID", randomUserID);
} else {
  randomUserID = window.localStorage.getItem("userID");
}

let firstTime = true;
function dec2hex(dec) {
  return dec < 10 ? "0" + String(dec) : dec.toString(16);
}

function debugText(text) {
  //var elem = document.getElementById("debugText");
  //elem.innerHTML = text;
  return null;
}

function highlightTextInBible(selectedText, local = true) {
  let strippedHTML = stripHTML(BIBLE_CHAPTER_TEXT);
  let indexCopied = strippedHTML.indexOf(selectedText);
  var instance = new Mark(document.querySelector("#bible-chapter-text"));
  if (indexCopied > 0) {
    instance.mark(selectedText, {
      separateWordSearch: false,
      accuracy: "complementary",
      acrossElements: true,
    });
    if (local) {
      BIBLE_DATA_FOR_CONNECTION_ENGINE["highlighted"] = selectedText;
      BIBLE_DATA_FOR_CONNECTION_ENGINE["lastHighlightUpdated"] = Math.floor(
        Date.now() / 1000
      );
      bibleGraphSendData();
    }
  }
}
function bibleGraphSendData() {
  BIBLE_DATA_FOR_CONNECTION_ENGINE["userID"] = randomUserID;
  bibleInfoGraph.get(randomUserID).put(BIBLE_DATA_FOR_CONNECTION_ENGINE);
}

function renderBibleData(d) {
  for (let [nodeID, node] of Object.entries(d)) {
    if (node !== null) {
    }
  }
}

function stripHTML(html) {
  let tmp = document.createElement("div");
  tmp.style.display = "none";
  tmp.innerHTML = html;
  let stripped = tmp.textContent || tmp.innerText;
  return stripped.replace(/\s+/g, " ").trim();
}

function generateId(len) {
  var arr = new Uint8Array((len || 40) / 2);
  window.crypto.getRandomValues(arr);
  return Array.from(arr, dec2hex).join("");
}

//end cursor stuff
function addNewLocalCursor(
  nodeID,
  x,
  y,
  color,
  amenClicked = false,
  mX = 0,
  mY = 0
) {
  //mX is max X
  let timeNow = Math.floor(Date.now() / 1000);
  let data = {
    userID: nodeID,
    x: x,
    y: y,
    lastUpdated: timeNow,
    color: color,
    mX: mX,
    mY: mY,
    amenClicked: amenClicked,
  };
  //console.log("new Data: " + JSON.stringify(data))
  connectionEngineGraph.get(nodeID).put(data);
  //console.log("localData: " + JSON.stringify(localData))
  //connectionEngineGraph.set(data);
}
function deleteCursorNode(nodeID) {
  function removeElement(id) {
    var elem = document.getElementById(id);
    if (elem) {
      elem.style.display = "none";
      //return elem.parentNode.removeChild(elem);
    }
  }
  console.log("deleting " + nodeID);
  removeElement(nodeID);
  //  connectionEngineGraph.get(nodeID).put(null);
}

function ratioWidth(val, maxVal) {
  return (val / maxVal) * window.innerWidth; //remove this line for responsive ish cursor
  if (maxVal > window.innerWidth) {
    return (val / maxVal) * window.innerWidth;
  }
  return val;
}
function ratioHeight(val, maxVal) {
  return (val / maxVal) * window.innerHeight; //remove this line for responsive ish cursor
  if (maxVal > window.innerHeight) {
    return (val / maxVal) * window.innerHeight;
  }
  return val;
}
function updateConnectedCount() {
  countUsersConnected = 0;
  for (let nodeID in localData) {
    if (localData[nodeID] != null) {
      countUsersConnected += 1;
    }
  }
}
function renderList(todos) {
  console.log("re-rendering cursors...");
  for (let [nodeID, node] of Object.entries(todos)) {
    if (node !== null) {
      //randomColor
      var cursorExisting = document.getElementById(nodeID);
      let debugText =
        "nodeID: " +
        node.userID +
        " x: " +
        node.x +
        "/" +
        node.mX +
        " = " +
        ratioWidth(node.x, node.mX) +
        " y: " +
        node.y +
        "/" +
        node.mY +
        " = " +
        ratioHeight(node.y, node.mY) +
        " amen clicked: " +
        node.amenClicked;
      if (document.body.contains(cursorExisting)) {
        cursorExisting.style.display = "block";
        cursorExisting.style.top =
          node.userID !== randomUserID ? ratioHeight(node.y, node.mY) : node.y;
        cursorExisting.style.left =
          node.userID !== randomUserID ? ratioWidth(node.x, node.mX) : node.x;

        document.getElementById("debug-" + nodeID).innerText = debugText;
      } else {
        var vCursor = document.createElement("div");
        vCursor.className = "virtualCursor";
        vCursor.id = nodeID;
        vCursor.style.display = "block";
        vCursor.style.background = node.color;
        vCursor.style.top = ratioHeight(node.y, node.mY);
        vCursor.style.left = ratioWidth(node.x, node.mX);
        document.getElementById("cursorsHolder").appendChild(vCursor);
        //debugging
        var text = document.createElement("div");
        text.id = "debug-" + nodeID;
        text.className = node.status;
        text.innerText = debugText;
        var item = document.createElement("li");
        item.appendChild(text);

        document.getElementById("debugger").appendChild(item);
      }

      if (node.amenClicked) {
        playAmenSound();
      }
    }
  }
  updateConnectedCount();
  let textCount =
    countUsersConnected > 1
      ? countUsersConnected + " people reading God's word right now."
      : "It's just you and God's word right now.";
  document.getElementById("connectedCount").innerText = textCount;
  document.getElementById("connectedCountMobile").innerText = textCount;
}

let isCurrentUserClickingAmen = false;
function amenClicked() {
  isAmenClicked = true;
  isCurrentUserClickingAmen = true;
  addNewLocalCursor(
    randomUserID,
    curX,
    curY,
    randomColor,
    isAmenClicked,
    window.innerWidth,
    window.innerHeight
  );
}
let isAmenPlaying = false;
function playAmenSound() {
  if (!isAmenPlaying) {
    isAmenPlaying = true;

    amenSoundAudio.play();
    runHeartAnimation();
    amenSoundAudio.addEventListener("ended", function () {
      isAmenPlaying = false;
      isAmenClicked = false;
    });
  }
}
function close_window() {
  if (confirm("Close Window?")) {
    close();
  }
}
window.onload = () => {
  document.getElementById("bodyHolder").addEventListener("mousemove", (e) => {
    curX = e.clientX;
    curY = e.clientY;
    addNewLocalCursor(
      randomUserID,
      curX,
      curY,
      randomColor,
      isAmenClicked,
      window.innerWidth,
      window.innerHeight
    );
  });

  document.addEventListener(
    "touchstart",
    function (e) {
      //for mobile
      curX = e.touches[0].clientX;
      curY = e.touches[0].clientY;
      addNewLocalCursor(
        randomUserID,
        curX,
        curY,
        randomColor,
        isAmenClicked,
        window.innerWidth,
        window.innerHeight
      );
    },
    false
  );

  document.addEventListener(
    "touchend",
    function (e) {
      //for mobile
      curX = e.changedTouches[0].clientX;
      curY = e.changedTouches[0].clientY;
      addNewLocalCursor(
        randomUserID,
        curX,
        curY,
        randomColor,
        isAmenClicked,
        window.innerWidth,
        window.innerHeight
      );
    },
    false
  );

  document.addEventListener(
    "touchmove",
    function (e) {
      //for mobile move
      curX = e.changedTouches[0].clientX;
      curY = e.changedTouches[0].clientY;
      addNewLocalCursor(
        randomUserID,
        curX,
        curY,
        randomColor,
        isAmenClicked,
        window.innerWidth,
        window.innerHeight
      );
    },
    false
  );

  document.addEventListener(
    "mouseup",
    function (event) {
      //listener for highlight text done in pc
      highlightTextInBible(document.getSelection().toString());
    },
    false
  );
  // document.addEventListener('contextmenu', function(event) {
  //   setTimeout(highlightTextInBible(document.getSelection().toString()), 1);
  // }); //listener for highlight text done in mobile

  connectionEngineGraph.map().on(
    function (node, nodeID) {
      let timeNow = Math.floor(Date.now() / 1000);
      connectionEngineGraph.get(nodeID).bye().put(null);
      if (node != null && timeNow - node.lastUpdated > 5) {
        deleteCursorNode(nodeID);
      } else if (node != null) {
        localData[nodeID] = node;
        renderList(localData);
      }
    },
    { change: true }
  );

  bibleInfoGraph.map().on(function (node, nodeID) {
    let timeNow = Math.floor(Date.now() / 1000);

    if (node != null && timeNow - node.lastHighlightUpdated < 5) {
      if (node.userID == randomUserID) {
        return;
      }
      if (node.highlighted != "") {
        highlightTextInBible(node.highlighted, false);
      }
    } else if (node != null && timeNow - node.lastChapterUpdated < 5) {
      if (node.userID == randomUserID) {
        return;
      }
      if (node.chapter != "") {
        //alert(node.book)
        if (
          localUserSubscribedChapterUpdates[node.id] == node.lastChapterUpdated
        ) {
          return;
        }
        let flagURL =
          node.countryCode !== undefined
            ? `https://www.countryflags.io/${node.countryCode}/flat/32.png`
            : "";
        let timeTitle = new Date().toLocaleString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        });
        let text =
          "Someone from " +
          node.country +
          " is reading " +
          node.book.split("**")[1] +
          " " +
          node.chapter.split("**")[1];
        if (node.country === undefined) {
          text =
            "Someone is reading " +
            node.book.split("**")[1] +
            " " +
            node.chapter.split("**")[1];
        }
        Toastify({
          text: text,
          avatar: flagURL,
          duration: 3300,
          newWindow: false,
          close: false,
          gravity: "bottom", // `top` or `bottom`,
          position: "right",
          backgroundColor: "rgb(0,0,0,0.8)",
          stopOnFocus: true,
        }).showToast();
        localUserSubscribedChapterUpdates[node.id] = node.lastChapterUpdated;
      }
    }
  }, {});

  var initialModal = new bootstrap.Modal(
    document.getElementById("initialModal"),
    {
      keyboard: false,
      backdrop: "static",
    }
  );
  document
    .getElementById("firstModalStartButton")
    .addEventListener("click", function () {
      document.getElementById("bodyContent").style.display = "block";
      amenSoundAudio.play();
      initialModal.hide();
    });

  // document.getElementById("firstModalQuitButton").addEventListener("click", function(){
  //   close_window()
  // });
  initialModal.show();
};

//
