// bot by SC TEAM

require('dotenv').config();

const { Bot, session } = require('grammy');

const { Users } = require('./db/connect');

const { MAIN_MENU, ADMIN_PANEL, BACK_MENU } = require('./locales_keyboards');
const callback = require('./callback');
// const { MENU_INFO } = require('./locale_texts');

const config = require('./config');

const scenes = require('./scenes/scenes_handler');

const bot = new Bot(process.env.BOT_TOKEN);

bot.use(
  session({
    initial: () => ({}),
  }),
);

const userList = new Map();

bot.use(async (ctx, next) => {
  const user = ctx.from.id;
  const now = Date.now();

  if (!userList.has(user)) {
    userList.set(user, {
      messages: [],
      lastMessage: now,
      blocked: false,
    });
  }

  const userData = userList.get(user);
  if (userData.blocked) {
    return;
  }

  userData.messages.push(now);

  const timeWindow = 10 * 1000; // 10 seconds
  const messageLimit = 10;

  while (userData.messages.length && userData.messages[0] < now - timeWindow) {
    userData.messages.shift();
  }

  if (userData.messages.length >= messageLimit) {
    userData.blocked = true;
    setTimeout(() => {
      userData.blocked = false;
      userData.messages = [];
    }, timeWindow);

    if (ctx.callbackQuery) {
      return ctx.answerCallbackQuery(`❌ Пожалуйста, не спамьте!\n😔 Повторите попытку через 10 секунд`);
    }

    return ctx.reply(`<b>❌ Пожалуйста, не спамьте!</b>\n😔 Повторите попытку через 10 секунд`, {
      parse_mode: 'HTML',
    });
  }

  next();
});

bot.use(scenes.manager());

bot.use(scenes);

bot.on('callback_query:data', callback);

bot.command('start', async ctx => {
  try {
    let user = await Users.findOne({ where: { tgId: ctx.from.id } });

    if (!user) {
        await Users.create({
            tgId: ctx.from.id,
            name: ctx.from.first_name,
            admin: false
        })
    } 

    return ctx.reply(`<b>👋 Добро пожаловать в StudyAssistant Bot!</b>\n<b>👇 Выберите нужный вам раздел на клавиатуре</b>`, {
        parse_mode: "HTML",
        reply_markup: MAIN_MENU
    })
  } catch (e) {
    console.log(e);
  }
});

bot.command('admin', async ctx => {
    let user = await Users.findOne({ where: { tgId: ctx.from.id } })
  if (!user.admin) return;
  return ctx.reply(`<b>👑 Панель администратора 👑</b>`, {
    parse_mode: 'HTML',
    reply_markup: ADMIN_PANEL,
  });
});

bot.catch(err => {
  const ctx = err.ctx;
  console.error(`Error while handling update ${ctx.update.update_id}:\n${err}`);
});

bot.start();