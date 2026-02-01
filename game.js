const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

// подгоняем под размер окна
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// =====================
// 1. Изображения
// =====================
const bg = new Image();
bg.src = "background.png"; // фон коридора

const grandmaImg = new Image();
grandmaImg.src = "grandma.png"; // бабушка

const bookImg = new Image();
bookImg.src = "book.png"; // книги

// =====================
// 2. Полосы движения
// =====================
const lanes = [
  canvas.width / 2 - 200, // левая
  canvas.width / 2,       // центральная
  canvas.width / 2 + 200  // правая
];

// =====================
// 3. Бабушка
// =====================
const grandma = {
  lane: 1,
  x: lanes[1] - 40,
  y: canvas.height - 160,
  width: 80,
  height: 120,
  targetX: lanes[1] - 40, // цель по X для плавного движения
  speedX: 15              // скорость движения в px за кадр
};

// =====================
// 4. Игровые переменные
// =====================
let speed = 5;       // скорость книг/игры
let score = 0;
let books = [];
let gameOver = false;

// =====================
// 5. Создание книги
// =====================
function spawnBook() {
  const lane = Math.floor(Math.random() * 3);
  books.push({
    lane: lane,
    x: lanes[lane] - 25,
    y: -60,
    size: 50
  });
}

// =====================
// 6. Управление клавишами
// =====================
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

// =====================
// 7. Обновление состояния игры
// =====================
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

  // движение книг и проверка сбора
  books.forEach((book, i) => {
    book.y += speed;

    // сбор книги
    if (
      book.lane === grandma.lane &&
      book.y + book.size > grandma.y &&
      book.y < grandma.y + grandma.height
    ) {
      score++;
      document.getElementById("score").textContent = "Счёт: " + score;
      books.splice(i, 1); // удаляем собранную книгу
    }

    // удаляем книги за пределами экрана
    if (book.y > canvas.height + 100) {
      books.splice(i, 1);
    }
  });

  // случайная генерация новых книг
  if (Math.random() < 0.02) spawnBook();

  // плавное ускорение игры
  speed += 0.0005;
}

// =====================
// 8. Отрисовка
// =====================
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

// =====================
// 9. Игровой цикл
// =====================
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}

// запускаем игру
loop();
