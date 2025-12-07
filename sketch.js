

// FUNCTION 
function calculateRawSteam(coalRate, airValveValue, deltaTime) { // просчет генерации rawsteam
  return (coalRate * (airValveValue / 100)) * (deltaTime / 1000);
}

function RoundToFourDig(n) { // округление генерации rawsteam
  return Math.round(n * 10000) / 10000
}



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

  // creating air valve slider
  airValveSlider = createSlider(1, 100, airValve)
  // 1. Позиционируем и поворачиваем (на 270 градусов, чтобы был вертикальным)
  airValveSlider.position(60, 200); // Сдвигаем вниз и вправо
  airValveSlider.style('width', '250px'); // Длина рычага
  // airValveSlider.style('transform', 'rotate(270deg)'); 

  // 2. Базовая стилизация (CSS):
  airValveSlider.style('background', '#E74C3C'); // Красный фон
  airValveSlider.style('border-radius', '5px');
  
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
  //Coal consumption
  selectedLevel = parseInt(coalRadio.value());
  coalRate = COAL_RATE_MAP[selectedLevel]
  Ugol = Ugol - (coalRate * deltaTime / 1000)
  // Ugol limit on zero
  if (Ugol <= 0) {
    Ugol = 0;
    coalRadio.selected('0');
  }



  uiDraw();


}





