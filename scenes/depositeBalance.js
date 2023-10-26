const { Scene } = require('grammy-scenes');
const depositeBalance = new Scene('depositeBalance');

const axios = require('axios');
const cheerio = require('cheerio');
const https = require('https');

const { Users } = require('../db/connect');

const { CryptoPay, Assets, PaidButtonNames } = require('@foile/crypto-pay-api');

// const cryptoPay = new CryptoPay('115995:AAy30I3cqAPaLvSRzsBqwfAZUFeLnBhg1cA');
const cryptoPay = new CryptoPay('115995:AAy30I3cqAPaLvSRzsBqwfAZUFeLnBhg1cA', {
  hostname: 'pay.crypt.bot',
  protocol: 'https'
});

async function convertUsdToRub(usd) {
  try {
    const html = await axios.get(`https://usd.mconvert.net/rub/${usd}`);
    const $ = cheerio.load(html.data);

    let amount = $('div.convert_result span.green').last().text().replace(',', '.').replace(' ', '');

    return amount;
  } catch (e) {
    console.error(e);
  }
}

const { CANCELLED_SCENE, MAIN_MENU, CHECK_PAYMENT, DEPOSITE } = require('../locales_keyboards');

// Scene extends Composer, so you may use all methods such as .use() .on() etc.
depositeBalance.use((ctx, next) => {
  console.log('Entering send message for phone scene...');
  return next();
});

// sendSmsScene.on('callback_query:data', async ctx => {
//   console.log(ctx.callbackQuery.data);
// });

// Simply put, do() is a use() which automatically calls next()
depositeBalance.do(async ctx => {
  await ctx.editMessageText(`<b>👉 Введите сумму пополнения в <code>USDT</code> (<code>от 0.1$</code>):</b>`, {
    parse_mode: 'HTML',
    reply_markup: CANCELLED_SCENE,
  });
});

// As the flow comes to wait() middleware, the execution will stop and next Telegram updates will be passed to the inner middleware.
// The inner middleware should call ctx.scene.resume() to proceed to the next scene step.
depositeBalance.wait(async ctx => {
  if (ctx.callbackQuery) {
    if (ctx.callbackQuery.data == 'cancel_scene') {
      await ctx.answerCallbackQuery();
      await ctx.editMessageText(`✅ <b>Вы отменили пополнение баланса.</b>`, {
        parse_mode: 'HTML',
        reply_markup: MAIN_MENU,
      });
      return ctx.scene.exit();
    }
  }
  ctx.message.text = Number(ctx.message.text);

  if (!Number(ctx.message.text))
    return ctx.reply(`❌ Вы ввели не число для пополнения\n🔄 <b>Попробуйте ввести сумму пополнения ещё раз.</b>`, {
      parse_mode: 'HTML',
    });
  if (ctx.message.text < 0.1)
    return ctx.reply(`<b>❌ Введите сумму пополнения ОТ 0.1$</b>`, {
      parse_mode: 'HTML',
    });

  await ctx.reply(`🔄 Генерируем ссылку...`);

  try {
    let test = await convertUsdToRub(ctx.message.text);
    console.log(test);
    // const res = await axios.get(
    //   `https://api.crystalpay.ru/v1/?s=d71d028957dee7c503de1b8564d10d5873876b19&n=Sms&o=invoice-create&amount=${Number(
    //     test,
    //   ).toFixed(2)}&lifetime=1440&redirect=https://t.me/Europe_sender_bot&extra=${ctx.from.id}`,
    // );
    // const agent = new https.Agent({
    //   rejectUnauthorized: false,
    // });

    // let res = await axios({
    //   method: 'post',
    //   url: 'https://api.crystalpay.io/v2/invoice/create/',
    //   httpsAgent: agent,
    //   data: {
    //     auth_login: 'sms',
    //     auth_secret: 'd71d028957dee7c503de1b8564d10d5873876b19',
    //     amount: Number(test).toFixed(2),
    //     type: 'purchase',
    //     extra: ctx.from.id,
    //     lifetime: 1440,
    //   },
    // });
    cryptoPay
    .createInvoice(Assets.USDT, ctx.message.text, {
      description: ctx.from.id,
      paid_btn_name: PaidButtonNames.VIEW_ITEM,
      paid_btn_url: 'https://t.me/bb_rent_bot',
    })
    .then(async x => {
      console.log(x);
      // await ctx.reply(x.pay_url);
      await ctx.reply(
        `<b>💲 Чтобы пополнить баланс на сумму <code>${ctx.message.text} USDT (${Number(test).toFixed(
          2,
        )} RUB)</code> , нажмите на кнопку ниже.</b>
  ➖➖➖➖➖➖➖➖➖➖➖➖
  <b>🕰 Время на оплату: <code>24 часа</code></b>`,
        {
          parse_mode: 'HTML',
          reply_markup: DEPOSITE(x.pay_url),
        },
      );
    });

    return ctx.scene.exit();
  } catch (e) {
    console.log(e);
  }
});

module.exports = {
  depositeBalance,
};
