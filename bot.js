const { Bot, session } = require('grammy');

const config = require('./config');
const scenes = require('./scenes/scenes_handler');
const callback = require('./utils/callback');

const bot = new Bot(config.token);

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

// bot.on('callback_query:data', callback);
bot.use(callback.callbackComposer);

module.exports = {
  bot,
};
