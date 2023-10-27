require("dotenv").config();

const { Composer } = require('grammy');
const config = require('../config');
const prisma = require('../db/prisma');
const { MAIN_MENU, TIME_WORK_KEYB, DOCUMENTS_LIST, GROUPS_LIST, BACK_MENU, SORT_RASPISANIE, ACCEPT_OR_CANCEL, STUDENT_OR_TEACHER, ENTER_GROUPS_LIST } = require('../locales_keyboards');

const generateKeyboard = require('./keyboardConstructor')

const callbackComposer = new Composer();

callbackComposer.callbackQuery('registration_first', async ctx => {

  await ctx.editMessageText(
    `<b>❔ Вы преподаватель или студент? (отвечайте честно)</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: STUDENT_OR_TEACHER(ctx.from.id),
    },
  );
});

callbackComposer.callbackQuery('reg_student', async ctx => {
  await ctx.editMessageText(
    `<b>⬇️ Выберите вашу группу:</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: ENTER_GROUPS_LIST,
    },
  );
});

callbackComposer.callbackQuery(/enter_group_(\w+)/, async ctx => {
  const isAdmin = config.ownerIds.includes(ctx.msg.from.id) || false;
  const uid = BigInt(ctx.from.id);

  await prisma.user.upsert({
    where: { uid },
    create: {
      uid,
      name: ctx.from.first_name,
      username: ctx.from.username,
      isAdmin: isAdmin,
      group: ctx.match[1]
    },
    update: {},
  });

  await ctx.editMessageText(
    `<b>👋 Добро пожаловать в StudyAssistant Bot!</b>\n<b>👇 Выберите нужный вам раздел на клавиатуре</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: MAIN_MENU,
    },
  );
});

callbackComposer.callbackQuery(/reg_teacher_(\w+)/, async (ctx) => {
  const telegram_id = ctx.match[1]
  const uid = BigInt(ctx.from.id);
  const isAdmin = config.ownerIds.includes(ctx.from.id) || false;
  await prisma.user.upsert({
    where: { uid },
    create: {
      uid,
      name: ctx.from.first_name,
      username: ctx.from.username,
      isAdmin: isAdmin,
    },
    update: {},
  });
  ctx.api.sendMessage(process.env.ADMINS_CHAT, `❗️ Возможный учитель - <a href="tg://user?id=${telegram_id}">пользователь</a>`, {
    parse_mode: "HTML",
    reply_markup: ACCEPT_OR_CANCEL(telegram_id)
  })

  return ctx.editMessageText(`<b>⏳ Ваша заявка на статус преподавателя была отправлена. Ожидайте.</b>`, {
    parse_mode: "HTML"
  })
})

callbackComposer.callbackQuery(/accept_teacher_(\w+)/, async (ctx) => {
  const telegram_id = ctx.match[1]
  await prisma.user.update({
    where: { uid: telegram_id },
    data: { type: 'Teacher' },
  })

  ctx.api.sendMessage(telegram_id, `<b>✅ Ваш статус был изменен на "Преподаватель"!</b>`, {
    parse_mode: "HTML",
    reply_markup: BACK_MENU
  })

  return ctx.editMessageText(`<b>✅ Статус <a href="tg://user?id=${telegram_id}">пользователя</a> изменен успешно.</b>`, {
    parse_mode: "HTML"
  })
})

callbackComposer.callbackQuery(/decline_teacher_(\w+)/, async (ctx) => {
  const telegram_id = ctx.match[1]
  ctx.api.sendMessage(telegram_id, `<b>❌ К сожалению, ваша заявка на смену статуса была отклонена.</b>`, {
    parse_mode: "HTML",
    reply_markup: BACK_MENU
  })

  return ctx.editMessageText(`<b>✅ Статус <a href="tg://user?id=${telegram_id}">пользователя</a> изменен успешно.</b>`, {
    parse_mode: "HTML"
  })
})

callbackComposer.callbackQuery('menu', ctx => {
  return ctx.editMessageText(
    `<b>👋 Добро пожаловать в StudyAssistant Bot!</b>\n<b>👇 Выберите нужный вам раздел на клавиатуре</b>`,
    {
      parse_mode: 'HTML',
      reply_markup: MAIN_MENU,
    },
  );
});

callbackComposer.callbackQuery('raspisanie', async ctx => {
  return ctx.editMessageText(`<b>Выберите группу:</b>`, {
    parse_mode: "HTML",
    reply_markup: GROUPS_LIST
  })
});

// callbackComposer.callbackQuery('raspisanie', async ctx => {
//   let teachers = await prisma.teacher.findMany()
//   let keyb = await generateKeyboard(teachers, 1, `enter_teacher`)
//   console.log(keyb)
//   return ctx.editMessageText(`<b>Выберите преподавателя:</b>`, {
//     parse_mode: "HTML",
//     reply_markup: keyb
//   })
// });

callbackComposer.callbackQuery('time_work', ctx => {
  return ctx.editMessageText('<b>Выберите интересующее отделение:</b>', {
    parse_mode: "HTML",
    reply_markup: TIME_WORK_KEYB
  });
});

callbackComposer.callbackQuery('time_buchgalteriya', ctx => {
  return ctx.editMessageText('🕰 <b>Время работы бухгалтерии: <code>8:00 - 15:00</code></b>', {
    parse_mode: "HTML",
    reply_markup: BACK_MENU
  });
});

callbackComposer.callbackQuery('time_kafedra', ctx => {
  return ctx.editMessageText('🕰 <b>Время работы кафедры: <code>9:30 - 16:30</code></b>', {
    parse_mode: "HTML",
    reply_markup: BACK_MENU
  });
});

callbackComposer.callbackQuery('time_medpunkt', ctx => {
  return ctx.editMessageText('🕰 <b>Время работы медпункта: <code>7:30 - 18:00</code></b>', {
    parse_mode: "HTML",
    reply_markup: BACK_MENU
  });
});

callbackComposer.callbackQuery('materials', ctx => {
  return ctx.editMessageText('<b>Выберите вашу группу:</b>', {
    parse_mode: "HTML",
    reply_markup: GROUPS_LIST
  });
});

callbackComposer.callbackQuery('study_plan', ctx => {
  // ctx.answerCallbackQuery('<b>Выберите вашу группу для просмотра учебного плана:</b>');
  return ctx.editMessageText('<b>Выберите вашу группу для просмотра учебного плана:</b>', {
    parse_mode: "HTML",
    reply_markup: GROUPS_LIST
  });
});

callbackComposer.callbackQuery('documents', async ctx => {
  return ctx.editMessageText('<b>Выберите желаемый вид заявления или пояснительной записки:</b>', {
    parse_mode: "HTML",
    reply_markup: DOCUMENTS_LIST
  });
});

module.exports = {
  callbackComposer,
};
