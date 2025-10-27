// Pastor Wars - v0.3

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
// INITIAL SETUP
// -------------------------------
gameContent.style.display = "none"; // hide game content initially
timerOutput.style.display = "none"; // hide timer initially
timerBtn.style.display = "flex"; // show clock initially

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
  assignRandomIcons(numplayers);
});

// -------------------------------
// RANDOM CATEGORY BUTTON
// -------------------------------
const categories = ["Movies", "Music", "Games", "Items", "TV Shows"];
let availableCategories = [...categories];
let lastCategory = null;

function pickRandomCategory() {
  resetTimer(); // reset timer each time category is picked

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
  timerBtn.style.display = "none";      // hide clock
  timerOutput.style.display = "flex";   // show timer

  clearInterval(timerInterval);
  let timeLeft = 60;
  timerOutput.textContent = `${timeLeft}s`;

  timerInterval = setInterval(() => {
    timeLeft--;
    if (timeLeft > 0) {
      timerOutput.textContent = `${timeLeft}s`;
    } else {
      clearInterval(timerInterval);
      timerOutput.textContent = "Preach!";
      timerOutput.classList.add("preach");

      setTimeout(() => {
        timerOutput.classList.remove("preach");
        timerOutput.style.display = "none"; // hide timer
        timerBtn.style.display = "flex";    // show clock
        timerOutput.textContent = "60s";
        document.getElementById("randomButton").textContent = "Pick Category";
        nextTurn();
      }, 3000);
    }
  }, 1000);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerOutput.style.display = "none";
  timerBtn.style.display = "flex";
  timerOutput.textContent = "60s";
  document.getElementById("randomButton").textContent = "Pick Category";
}

// -------------------------------
// CATEGORY CARDS
// -------------------------------
const categoryItems = [
  ["Inception","Avatar","Titanic","The Matrix","Joker","Avengers: Endgame","The Dark Knight","Interstellar","Gladiator","Forrest Gump","The Lord of the Rings","Star Wars: A New Hope","Jurassic Park","Pirates of the Caribbean","Toy Story","The Lion King","The Godfather","Harry Potter","Spider-Man: No Way Home","Black Panther"],
  ["Blinding Lights - The Weeknd","Shape of You - Ed Sheeran","Bad Guy - Billie Eilish","See you Again - Wiz Khalifa ft Charlie Puth","Rolling in the Deep - Adele","Bohemian Rhapsody - Queen","Happy - Pharrell Williams","Lose Yourself - Eminem","Old Town Road - Lil Nas X","Man in The Mirror- Michael Jackson","Shallow - Lady Gaga & Bradley Cooper","Dont Stop Believin- Journey","Poker Face - Lady Gaga","Smells Like Teen Spirit - Nirvana","Royals-Lorde","Viva La Vida","Thunderstruck - AC/DC","Paint It Black - The Rolling Stones","Let it Be - The Beatles ","All of Me - John Legend"],
  ["Minecraft","Fortnite","The Legend of Zelda","Super Mario Odyssey","Call of Duty","Animal Crossing","Overwatch","League of Legends","Halo","Among Us","Grand Theft Auto ","Elden Ring","Cyberpunk 2077","God of War","Red Dead Redemption ","Hades","Stardew Valley","The Witcher ","Mario Kart ","Super Smash Bros"],
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
  setTimeout(() => popup.style.display = "none", 400);
}

function createPlayerSilhouettesWithNames(numPlayers) {
  playerLeftContainer.innerHTML = "";
  playerRightContainer.innerHTML = "";

  const names = [];
  for (let i = 1; i <= numPlayers; i++) {
    const input = document.getElementById(`playerName${i}`);
    names.push(input ? input.value || `Player ${i}` : `Player ${i}`);
  }

  // Array of your custom PNG filenames
  const playerImages = [
    "avatar1.png",
    "avatar2.png",
    "avatar3.png",
    "avatar4.png",
    "avatar5.png",
    "avatar6.png",
    "avatar7.png",
    "avatar8.png"
  ];

  names.forEach((name, index) => {
    const playerDiv = document.createElement("div");
    playerDiv.classList.add("player-container");

    const circleDiv = document.createElement("div");
    circleDiv.classList.add("player-silhouette");

    const img = document.createElement("img");

    // Pick a random image from the array
    const randomIndex = Math.floor(Math.random() * playerImages.length);
    img.src = playerImages[randomIndex];

    img.style.width = "100%";
    img.style.height = "100%";
    img.style.borderRadius = "50%";
    img.style.objectFit = "cover";
    circleDiv.appendChild(img);

    playerDiv.appendChild(circleDiv);

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
  const allPlayers = [...playerLeftContainer.children, ...playerRightContainer.children];

  allPlayers.forEach(playerContainer => {
    if (playerContainer.querySelector(".player-score-container")) return;

    const scoreDiv = document.createElement("div");
    scoreDiv.classList.add("player-score-container");

    const minusBtn = document.createElement("button");
    minusBtn.classList.add("score-btn");

    const minusImg = document.createElement("img");
    minusImg.src = "minus.png";
    minusImg.style.width = "25px";
    minusImg.style.height = "25px";
    minusBtn.appendChild(minusImg);

    const scoreText = document.createElement("span");
    scoreText.textContent = "0";
    scoreText.classList.add("score-text");

    const plusBtn = document.createElement("button");
    plusBtn.classList.add("score-btn");

    const plusImg = document.createElement("img");
    plusImg.src = "plus.png";
    plusImg.style.width = "25px";
    plusImg.style.height = "25px";
    plusBtn.appendChild(plusImg);

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

// -------------------------------
// RULES POPUP
// -------------------------------
function openRules() {
  document.getElementById("rulesPopup").classList.add("show");
}
function closeRules() {
  document.getElementById("rulesPopup").classList.remove("show");

}


// -------------------------------
// DONATE POPUP
// -------------------------------
function openDonate() {
  const popup = document.getElementById("donatePopup");
  popup.classList.add("show");
}

function closeDonate() {
  const popup = document.getElementById("donatePopup");
  popup.classList.remove("show");
}

// Optional: close donate popup when clicking outside
window.addEventListener("click", function(event) {
  const donatePopup = document.getElementById("donatePopup");
  if (event.target === donatePopup) {
    donatePopup.classList.remove("show");
  }
});



function assignRandomIcons(numPlayers) {
  const icons = [
    "images/player1.png",
    "images/player2.png",
    "images/player3.png",
    "images/player4.png",
    "images/player5.png",
    "images/player6.png",
    "images/player7.png",
    "images/player8.png"
  ];

  // Shuffle icons so each game is different
  let shuffled = [...icons].sort(() => 0.5 - Math.random());

  // Clear old players
  const container = document.getElementById("playersContainer");
  container.innerHTML = "";

  // Create players
  for (let i = 0; i < numPlayers; i++) {
    let playerDiv = document.createElement("div");
    playerDiv.classList.add("player-slot");

    // Icon
    let img = document.createElement("img");
    img.classList.add("player-icon");
    img.src = shuffled[i]; // assign unique icon

    // Label
    let label = document.createElement("div");
    label.textContent = `Player ${i + 1}`;

    playerDiv.appendChild(img);
    playerDiv.appendChild(label);
    container.appendChild(playerDiv);
  }

}
