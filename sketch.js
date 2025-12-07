// =================================================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// =================================================================
let Ugol = 1000;          // Количество угля (единиц)
let streetTemp = -100;     // Температура на улице (°C)
const TEMP_MIN = -100;     // Нижняя граница для цветовой карты
const TEMP_MAX = 0;      // Верхняя граница для цветовой карты

// КОНСТАНТЫ ПОПОЛНЕНИЯ УГЛЯ
const REPLENISH_AMOUNT = 100; // 100 угля в минуту
const REPLENISH_INTERVAL = 60000; // 1 минута = 60 000 миллисекунд
// Переменная для отслеживания времени, прошедшего с последнего пополнения
let timeSinceReplenish = 0;


// СОЗДАНИЕ ИГРОВОГО ВРЕМЕНИ (СЧЕТЧИКА)
let gameTimeMs = 0; // Общее время в миллисекундах
const MS_IN_GAME_MINUTE = 1000; // 1 реальная секунда = 1 игровая минута
const MS_IN_GAME_HOUR = 60 * MS_IN_GAME_MINUTE; // 60 реальных секунд = 1 игровой час
const MS_IN_GAME_DAY = 24 * MS_IN_GAME_HOUR; // 24 игровых часа

let gameDays = 1; // Начинаем с первого дня



// Управление Топкой
let selectedLevel = 0; // 0 - выключено, 1-4 - уровни скорости 
let coalRate = 0         
const COAL_RATE_MAP = [0, 1, 5, 10, 20]; // 0 ед/с, 1 ед/с, 5 ед/с, 10 ед/с, 20 ед/с

// UI-элементы
let coalRadio; // Объект для хранения радиокнопок
let consumptionRatePerSec = 0;



// =================================================================
// ЗАПУСК 
// =================================================================

// разовая инициализация всего
function setup() {
  createCanvas(1200, 700);
  background(100);
  colorMode(HSB, 360, 100, 100); // пеерключаемся в режим окрашния HSB

  // --- СОЗДАНИЕ ПЕРЕКЛЮЧАТЕЛЕЙ КОНВЕЙЕРА ---
  coalRadio = createRadio();
  
  // .option('Отображаемый текст', значение)
coalRadio.option('0', 'Выкл (0 ед/с)'); // Значение '0', подпись 'Выкл...'
coalRadio.option('1', 'Ур. 1 (1 ед/с)');
coalRadio.option('2', 'Ур. 2 (5 ед/с)');
coalRadio.option('3', 'Ур. 3 (10 ед/с)');
coalRadio.option('4', 'Ур. 4 (20 ед/с)');
  
  coalRadio.position(50, 100); // Позиция блока
  coalRadio.selected('0'); // Выбираем начальное значение: Выкл (0)
  coalRadio.style('width', '800px'); // Добавляем базовый стиль для вертикального размещения
}


// =================================================================
// ОБНОВЛЕНИЕ 
// =================================================================
function draw() {
  background(220); // Очищаем холст

// --- ЛОГИКА ПОПОЛНЕНИЯ УГЛЯ ---
  // deltaTime - время, прошедшее с предыдущего кадра (в мс)
  timeSinceReplenish += deltaTime; 

  if (timeSinceReplenish >= REPLENISH_INTERVAL) {
    Ugol += REPLENISH_AMOUNT; // Добавляем 100 угля
    
    // Сбрасываем счетчик, вычитая интервал, чтобы сохранить точность (если прошло, например, 60005 мс)
    timeSinceReplenish -= REPLENISH_INTERVAL; 
  }


  // --- ЛОГИКА ИГРОВОГО ВРЕМЕНИ ---
  gameTimeMs += deltaTime;

  // 1. Рассчитываем общее количество прошедших игровых минут (1 реальная секунда = 1 минута)
  let totalGameMinutes = floor(gameTimeMs / MS_IN_GAME_MINUTE);
  
  // 2. Рассчитываем компоненты времени:
  gameDays = 1 + floor(totalGameMinutes / (24 * 60)); // Дни
  // Минуты и часы в пределах текущего дня:
  let minutesInCurrentDay = totalGameMinutes % (24 * 60);
  let currentHours = floor(minutesInCurrentDay / 60); // Часы (0-23)
  let currentMinutes = floor(minutesInCurrentDay % 60); // Минуты (0-59)

  // 3. Форматирование (добавляем ведущий ноль, например 09:05)
  // Мы используем встроенный метод JS padStart()
  let formattedHours = String(currentHours).padStart(2, '0');
  let formattedMinutes = String(currentMinutes).padStart(2, '0');

  
// --- ЛОГИКА КОНВЕЙЕРА ---
  selectedLevel = parseInt(coalRadio.value());
  coalRate = COAL_RATE_MAP[selectedLevel]
  Ugol = Ugol - (coalRate * deltaTime / 1000)
  if (Ugol <= 0) {
    Ugol = 0
    coalRadio.selected('0')
  }

  // --- Параметры Блока Температуры (Верхний Центр) ---
  const boxWidth = 110;
  const boxHeight = 60;
  // Рассчитываем позицию X для центрирования
  const boxX = (width / 2) - (boxWidth / 2); 
  const boxY = 10; // Отступ сверху
  const borderRadius = 15;
  
  // 1. Динамический расчет цвета
  // Функция map() переводит streetTemp из диапазона [-40, 20] в Оттенки [240 (Синий) до 0 (Красный)]
  let tempHue = map(streetTemp, TEMP_MIN, TEMP_MAX, 240, 0); 
  
  // 2. Рисуем скругленный КВАДРАТ/БЛОК (он рисуется ПЕРВЫМ)
  noStroke(); // Убираем рамку
  fill(tempHue, 80, 80);
  rect(boxX, boxY, boxWidth, boxHeight, borderRadius); 
  
  // 3. Выводим ТЕКСТ (он рисуется ПОВЕРХ БЛОКА)
  fill(0); // Цвет текста - Черный
  textSize(24);
  textStyle(BOLD); 
  textAlign(CENTER, CENTER); // Выравниваем текст по центру блока
  text(`${streetTemp}°C`, boxX + boxWidth/2, boxY + boxHeight/2);
  
  textStyle(NORMAL); // Сбрасываем стиль, чтобы другой текст не был жирным
  
  // ============================================
  
  text(`⬛Склад угля: ${nfc(Ugol, 1)}кг`, 150, 50);
 

  // 4. Вывод текста (Верхний правый угол)
  fill(0);
  textSize(20);
  // Устанавливаем выравнивание по правому краю, чтобы текст "прилипал" к правой границе
  textAlign(RIGHT, TOP); 
  let timeString = `⏲️${gameDays} день ${formattedHours}:${formattedMinutes}`;
  text(timeString, width - 10, 10); // 10px отступ от правого и верхнего края

  // Сброс выравнивания
  textAlign(LEFT, TOP);




}





