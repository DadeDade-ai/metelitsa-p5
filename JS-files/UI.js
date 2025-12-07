
function uiDraw() {

     // Air valve logic
  airValve = airValveSlider.value()

  // RawSteam generation
  rawSteam = RoundToFourDig(rawSteam + calculateRawSteam(coalRate, airValve, deltaTime))
  console.log(rawSteam)

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
  text(`Клапан подачи кислорода - ${airValve}%`, 200, 180);
 

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
 