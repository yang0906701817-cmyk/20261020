/*
  垃圾分類拖曳遊戲

  左側：只顯示垃圾物品圖示
  右側：顯示垃圾分類桶
  玩家要把垃圾拖到正確的分類桶
*/

var gameState = "start";

var items = [
  {
    name: "寶特瓶",
    answer: 1,
    explain: "寶特瓶清空後可以回收。",
    icon: "寶特瓶"
  },
  {
    name: "香蕉皮",
    answer: 2,
    explain: "香蕉皮屬於廚餘。",
    icon: "香蕉皮"
  },
  {
    name: "電池",
    answer: 3,
    explain: "電池應交給回收站。",
    icon: "電池"
  },
  {
    name: "鋁罐",
    answer: 1,
    explain: "鋁罐屬於資源回收。",
    icon: "鋁罐"
  },
  {
    name: "玻璃瓶",
    answer: 1,
    explain: "玻璃瓶清空後可以回收。",
    icon: "玻璃瓶"
  },
  {
    name: "衛生紙",
    answer: 0,
    explain: "使用過的衛生紙屬於一般垃圾。",
    icon: "衛生紙"
  }
];

var categories = [
  "一般垃圾",
  "資源回收",
  "廚餘",
  "有害垃圾"
];

var itemCards = [];
var draggingItem = -1;
var dragOffsetX = 0;
var dragOffsetY = 0;

var score = 0;
var completed = 0;
var startTime = 0;
var finalTime = 0;

var feedbackText = "";
var feedbackColor = "#333333";
var feedbackTimer = 0;

function setup() {
  createCanvas(800, 600);
  textAlign(CENTER, CENTER);
  createItemCards();
}

function draw() {
  background("#EEF1F4");

  if (gameState === "start") {
    drawStartPage();
  } else if (gameState === "play") {
    drawGamePage();
  } else if (gameState === "result") {
    drawResultPage();
  }
}

function drawStartPage() {
  fill("#2F7658");
  noStroke();
  rect(0, 0, 800, 70);

  fill("#FFFFFF");
  textSize(25);
  text("垃圾分類小達人", 400, 35);

  fill("#333333");
  textSize(30);
  text("把垃圾拖到正確的分類桶", 400, 180);

  fill("#3C9D70");
  textSize(70);
  text("♻", 400, 280);

  fill("#3C9D70");
  rect(280, 370, 240, 60, 12);

  fill("#FFFFFF");
  textSize(22);
  text("開始遊戲", 400, 400);
}

function drawGamePage() {
  fill("#2F7658");
  noStroke();
  rect(0, 0, 800, 70);

  fill("#FFFFFF");
  textSize(25);
  text("垃圾分類小達人", 400, 35);

  fill("#34495E");
  textSize(17);
  text("完成：" + completed + " / 6", 90, 105);

  text("答對：" + score + " 題", 220, 105);

  text("時間：" + getTime(), 690, 105);

  fill("#333333");
  textSize(19);
  text("垃圾物品", 220, 145);

  text("分類桶", 620, 145);

  drawItems();
  drawCategories();
  drawButtons();

  if (feedbackTimer > 0) {
    fill(feedbackColor);
    textSize(18);
    text(feedbackText, 400, 500);

    feedbackTimer--;

    if (feedbackTimer === 0) {
      feedbackText = "";
    }
  }
}

function drawItems() {
  var i;
  var item;
  var x;
  var y;

  for (i = 0; i < itemCards.length; i++) {
    item = itemCards[i];

    if (item.finished && draggingItem !== i) {
      continue;
    }

    x = item.x;
    y = item.y;

    fill(item.finished ? "#BDEDCB" : "#FFFFFF");
    stroke("#C4CDD3");
    strokeWeight(2);
    rect(x, y, 135, 100, 12);

    fill("#A8DEC4");
    noStroke();
    ellipse(x + 67, y + 38, 52, 52);

    fill("#315C4A");
    textSize(25);
    text(items[item.id].icon, x + 67, y + 38);

    fill("#333333");
    textSize(14);
    text("物品 #" + (item.id + 1), x + 67, y + 78);
  }
}

function drawCategories() {
  var i;
  var x;
  var y;
  var colors = [
    "#D8DDE2",
    "#BDEDCB",
    "#FFF0A8",
    "#D4DDF4"
  ];

  for (i = 0; i < 4; i++) {
    x = 500;
    y = 165 + i * 75;

    fill(colors[i]);
    stroke("#87939B");
    strokeWeight(2);
    rect(x, y, 240, 58, 12);

    fill("#333333");
    noStroke();
    textSize(18);
    text(categories[i], x + 120, y + 29);
  }
}

function drawButtons() {
  fill("#3C9D70");
  rect(25, 535, 150, 40, 10);

  fill("#FFFFFF");
  textSize(16);
  text("交卷看成績", 100, 555);

  fill("#87939B");
  rect(190, 535, 130, 40, 10);

  fill("#FFFFFF");
  text("重新開始", 255, 555);
}

function drawResultPage() {
  background("#EEF1F4");

  fill("#2F7658");
  rect(0, 0, 800, 70);

  fill("#FFFFFF");
  textSize(25);
  text("測驗結果", 400, 35);

  fill("#333333");
  textSize(30);
  text("答對：" + score + " / 6 題", 400, 170);

  fill("#F2B83F");
  textSize(42);
  text(getStars(), 400, 245);

  fill("#56636B");
  textSize(20);
  text("完成時間：" + formatTime(finalTime), 400, 305);

  fill("#3C9D70");
  rect(290, 400, 220, 60, 12);

  fill("#FFFFFF");
  textSize(20);
  text("再玩一次", 400, 430);
}

function createItemCards() {
  itemCards = [];

  var i;

  for (i = 0; i < 6; i++) {
    itemCards.push({
      id: i,
      x: 80 + (i % 2) * 170,
      y: 170 + floor(i / 2) * 115,
      homeX: 80 + (i % 2) * 170,
      homeY: 170 + floor(i / 2) * 115,
      finished: false
    });
  }
}

function mousePressed() {
  var i;
  var item;

  if (gameState === "start") {
    if (
      mouseX > 280 &&
      mouseX < 520 &&
      mouseY > 370 &&
      mouseY < 430
    ) {
      startGame();
    }

    return;
  }

  if (gameState === "result") {
    if (
      mouseX > 290 &&
      mouseX < 510 &&
      mouseY > 400 &&
      mouseY < 460
    ) {
      startGame();
    }

    return;
  }

  if (gameState !== "play") {
    return;
  }

  if (
    mouseX > 25 &&
    mouseX < 175 &&
    mouseY > 535 &&
    mouseY < 575
  ) {
    finalTime = getSeconds();
    gameState = "result";
    return;
  }

  if (
    mouseX > 190 &&
    mouseX < 320 &&
    mouseY > 535 &&
    mouseY < 575
  ) {
    startGame();
    return;
  }

  for (i = itemCards.length - 1; i >= 0; i--) {
    item = itemCards[i];

    if (item.finished) {
      continue;
    }

    if (
      mouseX > item.x &&
      mouseX < item.x + 135 &&
      mouseY > item.y &&
      mouseY < item.y + 100
    ) {
      draggingItem = i;
      dragOffsetX = mouseX - item.x;
      dragOffsetY = mouseY - item.y;
      return;
    }
  }
}

function mouseDragged() {
  if (draggingItem === -1) {
    return;
  }

  itemCards[draggingItem].x = mouseX - dragOffsetX;
  itemCards[draggingItem].y = mouseY - dragOffsetY;
}

function mouseReleased() {
  var item;
  var category;

  if (draggingItem === -1) {
    return;
  }

  item = itemCards[draggingItem];
  category = findCategory(item.x + 67, item.y + 50);

  if (category === -1) {
    returnItem(item);
    draggingItem = -1;
    return;
  }

  if (category === items[item.id].answer) {
    item.finished = true;
    completed++;
    score++;

    feedbackText = "答對了！" + items[item.id].explain;
    feedbackColor = "#278653";
    feedbackTimer = 120;
  } else {
    returnItem(item);

    feedbackText = "答錯了，再試一次！";
    feedbackColor = "#C33B3B";
    feedbackTimer = 100;
  }

  draggingItem = -1;
}

function findCategory(x, y) {
  var i;
  var categoryX = 500;
  var categoryY;

  for (i = 0; i < 4; i++) {
    categoryY = 165 + i * 75;

    if (
      x > categoryX &&
      x < categoryX + 240 &&
      y > categoryY &&
      y < categoryY + 58
    ) {
      return i;
    }
  }

  return -1;
}

function returnItem(item) {
  item.x = item.homeX;
  item.y = item.homeY;
}

function touchStarted() {
  mousePressed();
  return false;
}

function touchMoved() {
  mouseDragged();
  return false;
}

function touchEnded() {
  mouseReleased();
  return false;
}

function startGame() {
  gameState = "play";
  startTime = millis();
  finalTime = 0;
  score = 0;
  completed = 0;
  draggingItem = -1;
  feedbackText = "";
  feedbackTimer = 0;

  createItemCards();
}

function getSeconds() {
  if (startTime === 0) {
    return 0;
  }

  return floor((millis() - startTime) / 1000);
}

function getTime() {
  return formatTime(getSeconds());
}

function formatTime(seconds) {
  var minutes = floor(seconds / 60);
  var remain = seconds % 60;

  return nf(minutes, 2) + ":" + nf(remain, 2);
}

function getStars() {
  if (score === 6) {
    return "★★★★★";
  }

  if (score >= 4) {
    return "★★★★☆";
  }

  if (score >= 2) {
    return "★★★☆☆";
  }

  if (score >= 1) {
    return "★★☆☆☆";
  }

  return "★☆☆☆☆";
}