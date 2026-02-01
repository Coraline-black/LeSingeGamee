const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// установка размера
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// изображения
// =====================
const bg = new Image();
bg.src = "background.png";

const grandmaImg = new Image();
grandmaImg.src = "grandma.png";

const bookImg = new Image();
bookImg.src = "book.png";

// =====================
// полосы движения
// =====================
const lanes = [
  canvas.width / 2 - 200,
  canvas.width / 2,
  canvas.width / 2 + 200
];

// =====================
// бабушка
// =====================
const grandma = {
  lane: 1,
  x: lanes[1] - 40,
  y: canvas.height - 160,
  width: 80,
  height: 120,
  targetX: lanes[1] - 40,
  speedX: 10
};

let speed = 5;
let score = 0;
let books = [];

// =====================
// создание книги
// =====================
function spawnBook() {
  const lane = Math.floor(Math.random() * 3);
  books.push({
    lane,
    x: lanes[lane] - 25,
    y: -60,
    size: 50
  });
}

// =====================
// клавиатура
// =====================
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && grandma.lane > 0) {
    grandma.lane--;
    grandma.targetX = lanes[grandma.lane] - grandma.width/2;
  }
  if (e.key === "ArrowRight" && grandma.lane < 2) {
    grandma.lane++;
    grandma.targetX = lanes[grandma.lane] - grandma.width/2;
  }
});

// =====================
// свайпы для мобильного
// =====================
let touchStartX = 0;
let touchStartY = 0;

canvas.addEventListener("touchstart", e => {
  const touch = e.touches[0];
  touchStartX = touch.clientX;
  touchStartY = touch.clientY;
});

canvas.addEventListener("touchend", e => {
  const touch = e.changedTouches[0];
  const dx = touch.clientX - touchStartX;
  const dy = touch.clientY - touchStartY;

  if (Math.abs(dx) > Math.abs(dy)) {
    if (dx > 30 && grandma.lane < 2) {
      grandma.lane++;
      grandma.targetX = lanes[grandma.lane] - grandma.width/2;
    }
    if (dx < -30 && grandma.lane > 0) {
      grandma.lane--;
      grandma.targetX = lanes[grandma.lane] - grandma.width/2;
    }
  }
});

// =====================
// обновление
// =====================
function update() {
  if (grandma.x < grandma.targetX) {
    grandma.x += grandma.speedX;
    if (grandma.x > grandma.targetX) grandma.x = grandma.targetX;
  }
  if (grandma.x > grandma.targetX) {
    grandma.x -= grandma.speedX;
    if (grandma.x < grandma.targetX) grandma.x = grandma.targetX;
  }

  for (let i = books.length - 1; i >= 0; i--) {
    const book = books[i];
    book.y += speed;

    if (
      book.lane === grandma.lane &&
      book.y + book.size > grandma.y &&
      book.y < grandma.y + grandma.height
    ) {
      score++;
      document.getElementById("score").textContent = "Счёт: " + score;
      books.splice(i, 1);
    } else if (book.y > canvas.height + 100) {
      books.splice(i, 1);
    }
  }

  if (Math.random() < 0.02) spawnBook();
  speed += 0.0005;
}

// =====================
// рисуем всё
// =====================
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(grandmaImg, grandma.x, grandma.y, grandma.width, grandma.height);

  books.forEach(book => {
    ctx.drawImage(bookImg, book.x, book.y, book.size, book.size);
  });
}

// =====================
// игровой цикл
// =====================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
