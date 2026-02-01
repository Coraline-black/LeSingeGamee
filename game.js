const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// изображения
const bg = new Image();
bg.src = "background.png"; // фон коридора

const grandmaImg = new Image();
grandmaImg.src = "grandma.png"; // бабушка

const bookImg = new Image();
bookImg.src = "book.png"; // книги

// полосы
const lanes = [
  canvas.width / 2 - 200,
  canvas.width / 2,
  canvas.width / 2 + 200
];

// бабушка
const grandma = {
  lane: 1,
  x: lanes[1] - 40,
  y: canvas.height - 160,
  width: 80,
  height: 120,
  targetX: lanes[1] - 40,
  speedX: 15
};

let speed = 5;
let score = 0;
let books = [];
let gameOver = false;

// создание книги
function spawnBook() {
  const lane = Math.floor(Math.random() * 3);
  books.push({
    lane,
    x: lanes[lane] - 25,
    y: -60,
    size: 50
  });
}

// управление
document.addEventListener("keydown", e => {
  if (e.key === "ArrowLeft" && grandma.lane > 0) {
    grandma.lane--;
    grandma.targetX = lanes[grandma.lane] - grandma.width / 2;
  }
  if (e.key === "ArrowRight" && grandma.lane < 2) {
    grandma.lane++;
    grandma.targetX = lanes[grandma.lane] - grandma.width / 2;
  }
});

// обновление
function update() {
  if (gameOver) return;

  // плавное движение бабушки
  if (grandma.x < grandma.targetX) {
    grandma.x += grandma.speedX;
    if (grandma.x > grandma.targetX) grandma.x = grandma.targetX;
  }
  if (grandma.x > grandma.targetX) {
    grandma.x -= grandma.speedX;
    if (grandma.x < grandma.targetX) grandma.x = grandma.targetX;
  }

  // движение книг и проверка столкновения
  books.forEach(book => {
    book.y += speed;

    if (
      book.lane === grandma.lane &&
      book.y + book.size > grandma.y &&
      book.y < grandma.y + grandma.height
    ) {
      score++;
      document.getElementById("score").textContent = score;
      book.y = canvas.height + 100; // убрать книгу после сбора
    }
  });

  books = books.filter(b => b.y < canvas.height + 100);

  // шанс появления новой книги
  if (Math.random() < 0.02) spawnBook();

  speed += 0.0005; // плавное ускорение игры
}

// отрисовка
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0, canvas.width, canvas.height);

  ctx.drawImage(
    grandmaImg,
    grandma.x,
    grandma.y,
    grandma.width,
    grandma.height
  );

  books.forEach(book => {
    ctx.drawImage(bookImg, book.x, book.y, book.size, book.size);
  });
}

// игровой цикл
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

loop();
