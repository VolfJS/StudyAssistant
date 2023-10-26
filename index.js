// bot by SC TEAM

// require('dotenv').config();

// const { Bot, session, Composer } = require('grammy');

// const { Users } = require("./db/connect");

// const { MAIN_MENU, ADMIN_PANEL } = require('./locales_keyboards');
// const callback = require('./utils/callback');
// const { MENU_INFO } = require('./locale_texts');
const { bot } = require('./bot');
const { cmd } = require('./commands/cmd');
const prisma = require('./db/prisma');

// const bot = new Bot(config.token);

// bot.use(
//   session({
//     initial: () => ({}),
//   }),
// );

// const userList = new Map();

// bot.use(async (ctx, next) => {
//   const user = ctx.from.id;
//   const now = Date.now();

//   if (!userList.has(user)) {
//     userList.set(user, {
//       messages: [],
//       lastMessage: now,
//       blocked: false,
//     });
//   }

//   const userData = userList.get(user);
//   if (userData.blocked) {
//     return;
//   }

//   userData.messages.push(now);

//   const timeWindow = 10 * 1000; // 10 seconds
//   const messageLimit = 10;

//   while (userData.messages.length && userData.messages[0] < now - timeWindow) {
//     userData.messages.shift();
//   }

//   if (userData.messages.length >= messageLimit) {
//     userData.blocked = true;
//     setTimeout(() => {
//       userData.blocked = false;
//       userData.messages = [];
//     }, timeWindow);

//     if (ctx.callbackQuery) {
//       return ctx.answerCallbackQuery(`❌ Пожалуйста, не спамьте!\n😔 Повторите попытку через 10 секунд`);
//     }

//     return ctx.reply(`<b>❌ Пожалуйста, не спамьте!</b>\n😔 Повторите попытку через 10 секунд`, {
//       parse_mode: 'HTML',
//     });
//   }

//   next();
// });

// bot.use(scenes.manager());

// bot.use(scenes);

// bot.on('callback_query:data', callback);

// const composer = new Composer()
// bot.use(composer.middleware)

// bot.command('start', async ctx => {
//   try {
//     let user = await Users.findOne({ where: { tgId: ctx.from.id } });

//     if (!user) {
//       await Users.create({
//         tgId: ctx.from.id,
//         name: ctx.from.first_name,
//         username: ctx.from.username,
//         admin: false,
//       });
//     }

//     return ctx.reply(
//       `<b>👋 Добро пожаловать в StudyAssistant Bot!</b>\n<b>👇 Выберите нужный вам раздел на клавиатуре</b>`,
//       {
//         parse_mode: 'HTML',
//         reply_markup: MAIN_MENU,
//       },
//     );
//   } catch (e) {
//     console.log(e);
//   }
// });

// bot.command('admin', async ctx => {
//   let user = await Users.findOne({ where: { tgId: ctx.from.id } });
//   if (!user.admin) return;
//   return ctx.reply(`<b>👑 Панель администратора 👑</b>`, {
//     parse_mode: 'HTML',
//     reply_markup: ADMIN_PANEL,
//   });
// });

bot.use(cmd);

bot.catch(err => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:\n${err}`);
});

bot
  .start()
  .then(() => console.log('bot started'))
  .catch(error => {
    console.error(error);
    prisma.$disconnect().then(() => {
      process.exit(1);
    });
  });
