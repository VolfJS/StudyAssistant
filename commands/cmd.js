const { Composer } = require('grammy');

const { MAIN_MENU, ADMIN_PANEL } = require('../locales_keyboards');
const prisma = require('../db/prisma');
const config = require('../config');

const cmd = new Composer();

cmd.command('start', async ctx => {
  try {
    const uid = BigInt(ctx.from.id);
    const isAdmin = config.ownerIds.includes(ctx.from.id) || false;

    await prisma.user.upsert({
      where: { uid },
      create: {
        uid,
        name: ctx.from.firstName,
        username: ctx.from.username,
        isAdmin: isAdmin,
      },
      update: {},
    });

    return ctx.reply(
      `<b>👋 Добро пожаловать в StudyAssistant Bot!</b>\n<b>👇 Выберите нужный вам раздел на клавиатуре</b>`,
      {
        parse_mode: 'HTML',
        reply_markup: MAIN_MENU,
      },
    );
  } catch (e) {
    console.log(e);
  }
});

cmd.command('admin', async ctx => {
  // let user = await Users.findOne({ where: { tgId: ctx.from.id } });
  // if (!user.admin) return;
  let user = await prisma.user.findFirst({ where: { uid: BigInt(ctx.from.id) } });
  if (!user.isAdmin) return;

  return ctx.reply(`<b>👑 Панель администратора 👑</b>`, {
    parse_mode: 'HTML',
    reply_markup: ADMIN_PANEL,
  });
});

cmd.command('giveadmin', async ctx => {
  if (!ctx.match) return;
  if (!config.ownerIds.includes(ctx.from.id)) return;

  const uid = BigInt(ctx.match);

  // let user = await Users.findOne({ where: { tgId: ctx.from.id } });
  // if (!user.admin) return;
  let user = await prisma.user.findFirst({ where: { uid } });
  await prisma.user.update({ where: { uid }, data: { isAdmin: true } });

  return ctx.reply(`<b>👑 Админка выдана 👑</b>`, {
    parse_mode: 'HTML',
    reply_markup: ADMIN_PANEL,
  });
});

module.exports = {
  cmd,
};
