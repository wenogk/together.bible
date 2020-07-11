
    //,'https://gun-us.herokuapp.com/gun','https://gun-eu.herokuapp.com/gun'

        var gun = Gun(['https://mvp-gun.herokuapp.com/gun', 'https://e2eec.herokuapp.com/gun']);
        var connectionEngineGraph = gun.get('together.bible.cursors');
        var localData = {};
         //start cursor stuff
         function dec2hex (dec) {
          return dec < 10
            ? '0' + String(dec)
            : dec.toString(16)
        }

        function debugText(text) {
          //var elem = document.getElementById("debugText");
          //elem.innerHTML = text;
          return null;
        }

        function generateId (len) {
          var arr = new Uint8Array((len || 40) / 2)
          window.crypto.getRandomValues(arr)
          return Array.from(arr, dec2hex).join('')
        }
        let countUsersConnected = 0;
        let isAmenClicked = false;
        let curX = 0;
        let curY = 0;
        let randomUserID = "9999999";
        var randomColor = "#000000".replace(/0/g,function(){return (~~(Math.random()*16)).toString(16);});
        let amenSoundAudio = new Audio('assets/sounds/amen2.mp3');
        let cursorsHolder = document.getElementById("cursorsHolder");
        if (localStorage.getItem("userID") === null) {
          randomUserID = generateId(10);
          window.localStorage.setItem('userID', randomUserID);
        } else {
          randomUserID = window.localStorage.getItem('userID');
        }

        let firstTime = true;
        //end cursor stuff
        function addNewLocalCursor(nodeID,x, y, color, amenClicked = false, mX = 0, mY = 0) { //mX is max X
            let timeNow = Math.floor(Date.now() / 1000);
            let data = {
              userID: nodeID,
              x: x,
              y: y,
              lastUpdated: timeNow,
              color: color,
              mX: mX,
              mY: mY,
              amenClicked: amenClicked
            };
            //console.log("new Data: " + JSON.stringify(data))
            connectionEngineGraph.get(nodeID).put(data);
            //console.log("localData: " + JSON.stringify(localData))
            //connectionEngineGraph.set(data);
        };
        function deleteCursorNode(nodeID) {
          function removeElement(id) {
            var elem = document.getElementById(id);
            if(elem) {
              elem.style.display = "none";
              //return elem.parentNode.removeChild(elem);
            }
        }
          console.log("deleting " + nodeID)
            removeElement(nodeID);
            connectionEngineGraph.get(nodeID).put(null);
        };



        function ratioWidth(val,maxVal) {
          if(maxVal > window.innerWidth) {
            return (val/maxVal)*window.innerWidth;
          }
          return val;
        }
        function ratioHeight(val,maxVal) {
          if(maxVal > window.innerHeight) {
            return (val/maxVal)*window.innerHeight;
          }
          return val;
        }
        function updateConnectedCount() {
          countUsersConnected = 0;
          for (let nodeID in localData) {
            if(localData[nodeID]!= null) {
              countUsersConnected +=1;
            }
          }
        }
        function renderList(todos) {
            console.log('re-rendering cursors...');
            for (let [nodeID, node] of Object.entries(todos)) {
                if (node !== null) {
                    let timeNow = Math.floor(Date.now() / 1000);
                    connectionEngineGraph.get(nodeID).bye().put(null);
                    if((timeNow-node.lastUpdated)>5 || (node.lastUpdated == null)) {
                      deleteCursorNode(nodeID);

                    } else {
                      //randomColor
                      var cursorExisting = document.getElementById(nodeID);
                      let debugText = "nodeID: " + node.userID + " x: " + node.x + "/" + node.mX + " = " + ratioWidth(node.x, node.mX) + " y: " + node.y + "/" + node.mY + " = " + ratioHeight(node.y, node.mY) + " amen clicked: " + node.amenClicked;
                      if(document.body.contains(cursorExisting)) {
                        cursorExisting.style.display = "block";
                        cursorExisting.style.top = ratioHeight(node.y, node.mY);
                        cursorExisting.style.left = ratioWidth(node.x, node.mX);

                        // document.getElementById("debug-" + nodeID).innerText = debugText;
                      } else {
                        var vCursor = document.createElement('div');
                        vCursor.className = "virtualCursor";
                        vCursor.id = nodeID;
                        vCursor.style.display = "block";
                        vCursor.style.background = node.color;
                        vCursor.style.top = ratioHeight(node.y, node.mY);
                        vCursor.style.left = ratioWidth(node.x, node.mX);
                        document.getElementById("cursorsHolder").appendChild(vCursor);
                        //debugging
                        // var text = document.createElement('div');
                        //     text.id = "debug-" + nodeID;
                        //     text.className = node.status
                        //     text.innerText = debugText;
                        // var item = document.createElement('li');
                        //     item.appendChild(text);
                        // cursorsHolder.appendChild(item);
                      }

                      if(node.amenClicked) {
                        playAmenSound();
                      }
                    }
                }
            }
            updateConnectedCount();
            document.getElementById("connectedCount").innerText = countUsersConnected;
        }

          let isCurrentUserClickingAmen = false;
          function amenClicked() {
            isAmenClicked = true;
            isCurrentUserClickingAmen = true;
            addNewLocalCursor(randomUserID, (curX), (curY), randomColor, isAmenClicked, window.innerWidth, window.innerHeight)
          }
          let isAmenPlaying = false;
          function playAmenSound() {
            if(!isAmenPlaying) {

              isAmenPlaying = true;

              setTimeout(function() {
                amenSoundAudio.play();
              }, 100);
              amenSoundAudio.addEventListener("ended", function(){
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
            document.getElementById('bodyHolder').addEventListener('mousemove', e => {
              curX = e.clientX;
              curY = e.clientY;
              addNewLocalCursor(randomUserID, (curX), (curY), randomColor, isAmenClicked, window.innerWidth, window.innerHeight)
            });

            connectionEngineGraph.map().on(function(node, nodeID){
                localData[nodeID] = node;
                renderList(localData);
            });

            var initialModal = new bootstrap.Modal(document.getElementById('initialModal'), {
              keyboard: false,
              backdrop:'static'
            });
            document.getElementById("firstModalStartButton").addEventListener("click", function(){
              document.getElementById("bodyContent").style.display = "block"
              amenSoundAudio.play();
              initialModal.hide();
            });
            // document.getElementById("firstModalQuitButton").addEventListener("click", function(){
            //   close_window()
            // });
            initialModal.show();
          }

          //
