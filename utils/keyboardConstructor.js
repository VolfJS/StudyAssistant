const { InlineKeyboard } = require('grammy');

async function generateKeyboard(arrayDB, buttonsPerRow = 2, value_button, back_button = 'menu') {
  try {

    const keyboard = new InlineKeyboard();

    let buttonsInRow = 0;

    arrayDB.forEach((select, index) => {
      
        keyboard.text(select.title, `${value_button}_${select.id}`) 
        buttonsInRow++;

        // Если набрано достаточное количество кнопок в текущем ряду или это последняя кнопка, переходим на новую строку
        if (buttonsInRow === buttonsPerRow || index === arrayDB.length - 1) {
            keyboard.row();
            buttonsInRow = 0;
        }
    });

    return keyboard.row().text(`🔙 Назад`, back_button);
  } catch (error) {
    console.error('Error creating keyboard from database:', error);
    return null;
  }
}

module.exports = generateKeyboard;