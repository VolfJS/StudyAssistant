const { InlineKeyboard } = require('grammy');

const MAIN_MENU = new InlineKeyboard()
  .text('Мое расписание', 'raspisanie')
  .text('Поиск расписания', 'raspisanie_find')
  .row()
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
  .text('добавить материалы', 'time_work')
  .row().text(`🔙 Меню`, 'menu');

  const TIME_WORK_KEYB = new InlineKeyboard()
  .text('Бухгалтерия', 'time_buchgalteriya')
  .row()
  .text('Кафедра', 'time_kafedra')
  .row()
  .text('Медпункт', 'time_medpunkt')
  .row().text(`🔙 Назад`, 'menu');

  const DOCUMENTS_LIST = new InlineKeyboard()
  .text('Вступление в профсоюз', 'profsoyuz')
  .row()
  .text('Отчисление', 'otchislenie')
  .row()
  .text('Заявление об отсутствии', 'otsutstvie')
  .row().text(`🔙 Назад`, 'menu');

  const GROUPS_LIST = new InlineKeyboard()
  .text('1 ПИ', '1_pi')
  .text('2 ПИ', '2_pi')
  .row()
  .text('3 ПИ', '3_pi')
  .text('4 ПИ', '4_pi')
  .row()
  .text('1 ИСИП', '1_isip')
  .text('2 ИСИП', '2_isip')
  .row()
  .text('3 ИСИП', '3_isip')
  .text('4 ИСИП', '4_isip')
  .row().text(`🔙 Назад`, 'menu');

  const ENTER_GROUPS_LIST = new InlineKeyboard()
  .text('1 ПИ', 'enter_group_1pi')
  .text('2 ПИ', 'enter_group_2pi')
  .row()
  .text('3 ПИ', 'enter_group_3pi')
  .text('4 ПИ', 'enter_group_4pi')
  .row()
  .text('1 ИСИП', 'enter_group_1isip')
  .text('2 ИСИП', 'enter_group_2isip')
  .row()
  .text('3 ИСИП', 'enter_group_3isip')
  .text('4 ИСИП', 'enter_group_4isip')

  const SORT_RASPISANIE = new InlineKeyboard()
  .text('По предмету', 'sort_predmet')
  .row()
  .text('По преподавателю', 'sort_teacher')
  .row()
  .text('По группе', 'sort_group')
  .row().text(`🔙 Назад`, 'menu');

  const LESSONS_LIST = new InlineKeyboard()
  .text('Программирование', 'profsoyuz')
  .text('Разработка интерфейса', 'otchislenie')
  .row()
  .text('Высшая математика', 'profsoyuz')
  .text('Дискретная математика', 'otchislenie')
  .row().text(`🔙 Назад`, 'menu');

  const STUDENT_OR_TEACHER = (tgId) => new InlineKeyboard()
  .text('Преподаватель', `reg_teacher_${tgId}`)
  .row()
  .text('Студент', 'reg_student')

  const ACCEPT_OR_CANCEL = (tgId) => new InlineKeyboard()
  .text('Принять заявку', `accept_teacher_${tgId}`)
  .row()
  .text('Отклонить заявку', `decline_teacher_${tgId}`)

  const BACK_MENU = new InlineKeyboard()
  .text(`🔙 В меню`, 'menu');

const CONTINUE = new InlineKeyboard().text('Далее', 'registration_first');

module.exports = {
  MAIN_MENU,
  ADMIN_PANEL,
  CONTINUE,
  TIME_WORK_KEYB,
  DOCUMENTS_LIST,
  GROUPS_LIST,
  LESSONS_LIST,
  BACK_MENU,
  SORT_RASPISANIE,
  STUDENT_OR_TEACHER,
  ACCEPT_OR_CANCEL,
  ENTER_GROUPS_LIST
};
