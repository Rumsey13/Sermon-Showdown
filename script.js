// Pastor Wars - v0.2

// -------------------------------
// ELEMENT REFERENCES
// -------------------------------
const startScreen = document.getElementById("startScreen");
const gameContent = document.getElementById("gameContent");
const numPlayersInput = document.getElementById("numPlayers");
const playerNamesContainer = document.getElementById("playerNamesContainer");
const startGameButton = document.getElementById("startGameButton");

const playerLeftContainer = document.getElementById("playerLeft");
const playerRightContainer = document.getElementById("playerRight");

const randomBox = document.getElementById("randomBox");
const timerBtn = document.getElementById("timerButton");
const timerOutput = document.getElementById("timerOutput");

const popup = document.getElementById("popupCard");
const popupContent = document.getElementById("popupContent");

// -------------------------------
// DYNAMIC PLAYER NAME INPUTS
// -------------------------------
numPlayersInput.addEventListener("input", () => {
  const num = parseInt(numPlayersInput.value) || 1;
  playerNamesContainer.innerHTML = "";
  for (let i = 1; i <= num; i++) {
    const input = document.createElement("input");
    input.placeholder = `Player ${i} Name`;
    input.id = `playerName${i}`;
    playerNamesContainer.appendChild(input);
  }
});
numPlayersInput.dispatchEvent(new Event("input"));

// -------------------------------
// START GAME
// -------------------------------
startGameButton.addEventListener("click", () => {
  startScreen.style.display = "none";
  gameContent.style.display = "block";

  const numPlayers = parseInt(numPlayersInput.value) || 1;
  createPlayerSilhouettesWithNames(numPlayers);
  addScoreControls();
});

// -------------------------------
// RANDOM CATEGORY BUTTON
// -------------------------------
const categories = ["Movies", "Music", "Games", "Items", "TV Shows"];
let availableCategories = [...categories];
let lastCategory = null;

function pickRandomCategory() {
  resetTimer(); // reset timer each time category is picked

  // Change button text to "Reroll"
  const randomButton = document.getElementById("randomButton");
  randomButton.textContent = "Reroll";

  if (availableCategories.length === 0) availableCategories = [...categories];

  let chosen;
  do {
    const idx = Math.floor(Math.random() * availableCategories.length);
    chosen = availableCategories[idx];
  } while (chosen === lastCategory && availableCategories.length > 1);

  lastCategory = chosen;
  randomBox.textContent = chosen;
}
// -------------------------------
// TIMER FUNCTION
// -------------------------------
let timerInterval = null;

function startTimer() {
  timerBtn.style.display = "none";
  timerOutput.style.display = "flex";

  clearInterval(timerInterval);
  let timeLeft = 60;
  timerOutput.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      timerOutput.textContent = `${timeLeft}s`;
    } else {
      clearInterval(timerInterval);

      // Show "Preach!" with animation
      timerOutput.textContent = "Preach!";
      timerOutput.classList.add("preach");

      // Wait for animation to finish (1s here)
      setTimeout(() => {
        // Remove animation class
        timerOutput.classList.remove("preach");
        // Hide timer display
        timerOutput.style.display = "none";
        timerOutput.textContent = "60s";

        // Show the clock button
        timerBtn.style.display = "flex";

        // Reset random button
        document.getElementById("randomButton").textContent = "Pick Category";

        // Move to next player
        nextTurn();
      }, 2000); // match the CSS animation duration
    }
  }, 1000);
}
function resetTimer() {
  clearInterval(timerInterval);
  timerBtn.style.display = "flex";
  timerOutput.style.display = "none";
  timerOutput.textContent = "60s"; // reset the timer display

  // Reset the random button text
  const randomButton = document.getElementById("randomButton");
  randomButton.textContent = "Pick Category";
}

// -------------------------------
// CATEGORY CARDS
// -------------------------------
const categoryItems = [
  ["Inception","Avatar","Titanic","The Matrix","Joker","Avengers: Endgame","The Dark Knight","Interstellar","Gladiator","Forrest Gump","The Lord of the Rings","Star Wars: A New Hope","Jurassic Park","Pirates of the Caribbean","Toy Story","The Lion King","The Godfather","Harry Potter","Spider-Man: No Way Home","Black Panther"],
  ["Blinding Lights - The Weeknd","Shape of You - Ed Sheeran","Bad Guy - Billie Eilish","Uptown Funk - Mark Ronson ft. Bruno Mars","Rolling in the Deep - Adele","Bohemian Rhapsody - Queen","Happy - Pharrell Williams","Lose Yourself - Eminem","Old Town Road - Lil Nas X","Hey Jude - The Beatles","Shallow - Lady Gaga & Bradley Cooper","Stay - The Kid LAROI & Justin Bieber","Poker Face - Lady Gaga","Smells Like Teen Spirit - Nirvana","Levitating - Dua Lipa","Watermelon Sugar - Harry Styles","Thunderstruck - AC/DC","Paint It Black - The Rolling Stones","Call Me Maybe - Carly Rae Jepsen","All of Me - John Legend"],
  ["Minecraft","Fortnite","The Legend of Zelda","Super Mario Odyssey","Call of Duty","Animal Crossing","Overwatch","League of Legends","Halo","Among Us","Grand Theft Auto V","Elden Ring","Cyberpunk 2077","God of War","Red Dead Redemption 2","Hades","Stardew Valley","The Witcher 3","Mario Kart 8","Super Smash Bros"],
  ["Fork","Tractor","Tire","Notebook","Backpack","Lamp","Bicycle","Phone","Chair","Cup","Bottle","Glasses","Shoes","Clock","Pen","Headphones","Pillow","Table","Wallet","Spoon"],
  ["Friends","Breaking Bad","The Office","Stranger Things","Game of Thrones","The Simpsons","The Mandalorian","Better Call Saul","Grey's Anatomy","Seinfeld","The Crown","Sherlock","Westworld","The Witcher","Rick and Morty","How I Met Your Mother","Lost","The Big Bang Theory","House of Cards","The Boys"]
];

const availableItems = categoryItems.map(arr => [...arr]);
const lastPicked = [null, null, null, null, null];

function pickFromCard(cardIndex) {
  if (availableItems[cardIndex].length === 0) {
    availableItems[cardIndex] = [...categoryItems[cardIndex]];
    lastPicked[cardIndex] = null;
  }

  let chosen;
  do {
    const r = Math.floor(Math.random() * availableItems[cardIndex].length);
    chosen = availableItems[cardIndex][r];
  } while (chosen === lastPicked[cardIndex] && availableItems[cardIndex].length > 1);

  lastPicked[cardIndex] = chosen;
  availableItems[cardIndex].splice(availableItems[cardIndex].indexOf(chosen), 1);

  popupContent.textContent = chosen;

  const buttonColors = ["#ff6666", "#66ff66", "#6666ff", "#ffcc66", "#66ffff"];
  popupContent.style.backgroundColor = buttonColors[cardIndex];

  popup.style.display = "flex";
  setTimeout(() => popup.classList.add("show"), 10);
}

function closePopup() {
  popup.classList.remove("show");
  setTimeout(() => {
    popup.style.display = "none";
  }, 400);
}

// -------------------------------
// PLAYER SILHOUETTES & NAMES
// -------------------------------
function createPlayerSilhouettesWithNames(numPlayers) {
  playerLeftContainer.innerHTML = "";
  playerRightContainer.innerHTML = "";

  const names = [];
  for (let i = 1; i <= numPlayers; i++) {
    const input = document.getElementById(`playerName${i}`);
    names.push(input ? input.value || `Player ${i}` : `Player ${i}`);
  }

  names.forEach((name, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-container");

    // Circle container
    const circleDiv = document.createElement("div");
    circleDiv.classList.add("player-silhouette");

    // Optional: add image inside the circle
    const img = document.createElement("img");
    img.src = "avatar.png"; // replace with each player's image if you want
    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    circleDiv.appendChild(img);

    playerDiv.appendChild(circleDiv);

    // Player name below circle
    const nameDiv = document.createElement("div");
    nameDiv.textContent = name;
    nameDiv.style.color = "white";
    nameDiv.style.fontWeight = "bold";
    nameDiv.style.textAlign = "center";
    nameDiv.style.marginTop = "6px";
    playerDiv.appendChild(nameDiv);

    if (index < 4) playerLeftContainer.appendChild(playerDiv);
    else playerRightContainer.appendChild(playerDiv);
  });
}
// -------------------------------
// SCORE CONTROLS
// -------------------------------
function addScoreControls() {
  // Wait until player silhouettes exist
  const allPlayers = [...playerLeftContainer.children, ...playerRightContainer.children];

  allPlayers.forEach(playerContainer => {
    // Skip if already has score controls
    if (playerContainer.querySelector(".player-score-container")) return;

    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("player-score-container");

    // Minus button
    const minusBtn = document.createElement("button");
    minusBtn.classList.add("score-btn");
    minusBtn.style.padding = "0";
    minusBtn.style.border = "none";
    minusBtn.style.background = "none";
    minusBtn.style.cursor = "pointer";

    const minusImg = document.createElement("img");
    minusImg.src = "minus.png";
    minusImg.style.width = "25px";
    minusImg.style.height = "25px";
    minusBtn.appendChild(minusImg);

    // Score text
    const scoreText = document.createElement("span");
    scoreText.textContent = "0";
    scoreText.classList.add("score-text");

    // Plus button
    const plusBtn = document.createElement("button");
    plusBtn.classList.add("score-btn");
    plusBtn.style.padding = "0";
    plusBtn.style.border = "none";
    plusBtn.style.background = "none";
    plusBtn.style.cursor = "pointer";

    const plusImg = document.createElement("img");
    plusImg.src = "plus.png";
    plusImg.style.width = "25px";
    plusImg.style.height = "25px";
    plusBtn.appendChild(plusImg);

    // Click events
    minusBtn.addEventListener("click", () => {
      scoreText.textContent = Math.max(0, parseInt(scoreText.textContent) - 1);
    });
    plusBtn.addEventListener("click", () => {
      scoreText.textContent = parseInt(scoreText.textContent) + 1;
    });

    scoreDiv.appendChild(minusBtn);
    scoreDiv.appendChild(scoreText);
    scoreDiv.appendChild(plusBtn);

    playerContainer.appendChild(scoreDiv);
  });
}
// -------------------------------
// ATTACH EVENT LISTENERS TO CARDS
// -------------------------------
document.querySelectorAll(".card").forEach((btn, index) => {
  btn.addEventListener("click", () => pickFromCard(index));
});

// -------------------------------
// POPUP CLICK TO CLOSE
// -------------------------------
popup.addEventListener("click", closePopup);


function openRules() {
  document.getElementById("rulesPopup").style.display = "block";
}

function closeRules() {
  document.getElementById("rulesPopup").style.display = "none";
}

// Optional: close popup when clicking outside
window.onclick = function(event) {
  let popup = document.getElementById("rulesPopup");
  if (event.target === popup) {
    popup.style.display = "none";
  }
}

function openRules() {
  document.getElementById("rulesPopup").classList.add("show");
}

function closeRules() {
  document.getElementById("rulesPopup").classList.remove("show");
}
