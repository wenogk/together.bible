//code taken and modified from https://codepen.io/shenhuang/pen/yZEwXB
var brd = document.createElement("DIV");
document.body.insertBefore(brd, document.getElementById("board"));

const duration = 3000;
const speed = 1;
const cursorXOffset = 0;
const cursorYOffset = -5;

var hearts = [];

function generateHeart(x, y, xBound, xStart, scale) {
  var heart = document.createElement("DIV");
  heart.setAttribute("class", "heart");
  brd.appendChild(heart);
  heart.time = duration;
  heart.x = x;
  heart.y = y;
  heart.bound = xBound;
  heart.direction = xStart;
  heart.style.left = heart.x + "px";
  heart.style.top = heart.y + "px";
  heart.scale = scale;
  heart.style.transform = "scale(" + scale + "," + scale + ")";
  if (hearts == null) hearts = [];
  hearts.push(heart);
  return heart;
}

var before = Date.now();

let id = null;

function frame() {
  var current = Date.now();
  var deltaTime = current - before;
  before = current;
  for (i in hearts) {
    var heart = hearts[i];
    heart.time -= deltaTime;
    if (heart.time > 0) {
      heart.y -= speed;
      heart.style.top = heart.y + "px";
      heart.style.left =
        heart.x +
        ((heart.direction *
          heart.bound *
          Math.sin((heart.y * heart.scale) / 30)) /
          heart.y) *
          100 +
        "px";
    } else {
      heart.parentNode.removeChild(heart);
      hearts.splice(i, 1);
      if (hearts.length == 0) {
        clearInterval(id);
        id = null;
        return;
      }
    }
  }
}

function runHeartAnimation(numberOfHearts = 20, scaleVal = 1.2) {
  if (id === null) {
    id = setInterval(frame, 5);
    function gen() {
      setTimeout(function () {
        var start = 2;
        var scale = Math.random() * Math.random() * scaleVal + 0.2;
        var bound = 30 + Math.random() * 20;
        let padding = 0.2;
        let x = Math.floor(
          Math.random() * (window.innerWidth - window.innerWidth * padding * 2)
        );
        generateHeart(
          x + padding * window.innerWidth,
          window.innerHeight + 10,
          bound,
          start,
          scale
        );
      }, Math.random() * 2000);
    }
    for (let x = 0; x < numberOfHearts; x++) {
      gen();
    }
  }
}
