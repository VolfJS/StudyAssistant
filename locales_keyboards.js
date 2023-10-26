const { InlineKeyboard } = require('grammy');

const MAIN_MENU = new InlineKeyboard()
  .text('Расписание', 'raspisanie')
  .text('Режим работы', 'time_work')
  .row()
  .text('Материалы', 'materials')
  .row()
  .text('Учебный план', 'study_plan')
  .row()
  .text('Документы', 'documents');

const ADMIN_PANEL = new InlineKeyboard()
  .text('Найти пользователя', 'raspisanie')
  .row()
  .text('Запустить рассылку', 'time_work')
  .row()
  .text('добавить материалы', 'time_work');

const CONTINUE = new InlineKeyboard().text('Далее', 'registration');

module.exports = {
  MAIN_MENU,
  ADMIN_PANEL,
  CONTINUE,
};
