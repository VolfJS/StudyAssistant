// require("dotenv").config();

const { Composer } = require('grammy');

// const axios = require("axios");
// const https = require("https");

// const { Users, Projects } = require("../db/connect");
// const chatLog = require("./functions/admin_logs");
// const createKeyboardFromDatabase = require("./functions/select_projects");
// const {
//   BACK_MENU,
//   MAIN_MENU,
//   SEND_SMS,
//   BACK_MENU_OR_REPLENISH,
//   RENT_MENU_KEYB,
//   BACK_RENT_MENU,
//   RENT_EU_KEYB,
//   RENT_SNG_KEYB,
//   ENTER_PROJECT,
// } = require("../locales_keyboards");
// const {
//   GetProfileInfo,
//   TARIFFS_INFO,
//   API_INFO,
//   MENU_INFO,
//   INFO_SUPPORT,
//   RENT_MENU,
//   MY_PROJECTS_TEXT,
//   RENT_EU,
//   RENT_SNG,
// } = require("./locale_texts");

// const {
//   ANTIK_EU_DESC,
//   ANTIK_KZ_DESC,
//   ADS_EU_DESC,
//   ANTIK_RU_DESC,
//   ANTIK_UA_DESC,

//   ANTIK_KZ_LINK,
//   ANTIK_UA_LINK,
//   ANTIK_RU_LINK,
//   ANTIK_EU_LINK,
//   ADS_EU_LINK,
// } = require("./projects");

// async function callback(ctx) {
//   if (ctx.callbackQuery.data) {
//     console.log(ctx.callbackQuery.data);
//     let user = await Users.findOne({ where: { tgId: ctx.from.id } });
//     if (ctx.callbackQuery.data == "menu") {
//       await ctx.editMessageText(MENU_INFO, {
//         parse_mode: "HTML",
//         disable_web_page_preview: true,
//         reply_markup: MAIN_MENU,
//       });
//     } else if (ctx.callbackQuery.data == "rent_menu") {
//       await ctx.editMessageText(RENT_MENU, {
//         parse_mode: "HTML",
//         disable_web_page_preview: true,
//         reply_markup: RENT_MENU_KEYB,
//       });
//     } else if (ctx.callbackQuery.data == "eu") {
//       await ctx.editMessageText(RENT_EU, {
//         parse_mode: "HTML",
//         reply_markup: RENT_EU_KEYB,
//       });
//     } else if (ctx.callbackQuery.data == "ru_antikino") {
//       await ctx.editMessageText(ANTIK_RU_DESC, {
//         reply_markup: ENTER_PROJECT(ANTIK_RU_LINK, "ru_antikino"),
//         parse_mode: "HTML",
//       });
//     } else if (ctx.callbackQuery.data == "kz_antikino") {
//       await ctx.editMessageText(ANTIK_KZ_DESC, {
//         reply_markup: ENTER_PROJECT(ANTIK_KZ_LINK, "kz_antikino"),
//         parse_mode: "HTML",
//       });
//     } else if (ctx.callbackQuery.data == "rent_eu_req") {
//       let user = await Users.findOne({ where: { tgId: ctx.from.id } });
//       if (user.req_proj)
//         return ctx.editMessageText(
//           `❌ <b>Вы уже отправляли заявку, ожидайте.</b>`,
//           {
//             parse_mode: "HTML",
//           }
//         );
//       return ctx.scenes.enter("rentEuReq");
//     } else if (ctx.callbackQuery.data == "ua_antikino") {
//       await ctx.editMessageText(ANTIK_UA_DESC, {
//         reply_markup: ENTER_PROJECT(ANTIK_UA_LINK, "ua_antikino"),
//         parse_mode: "HTML",
//       });
//     } else if (ctx.callbackQuery.data == "eu_ads") {
//       await ctx.editMessageText(ADS_EU_DESC, {
//         reply_markup: ENTER_PROJECT(ADS_EU_LINK, "eu_ads"),
//         parse_mode: "HTML",
//       });
//     } else if (ctx.callbackQuery.data == "eu_antikino") {
//       await ctx.editMessageText(ANTIK_EU_DESC, {
//         reply_markup: ENTER_PROJECT(ANTIK_EU_LINK, "eu_ads"),
//         parse_mode: "HTML",
//       });
//     } else if (ctx.callbackQuery.data == "sng") {
//       await ctx.editMessageText(RENT_SNG, {
//         parse_mode: "HTML",
//         reply_markup: RENT_SNG_KEYB,
//       });
//     } else if (ctx.callbackQuery.data == "my_projects") {
//       let projects = await Projects.findAll({
//         where: { tgId_creator: ctx.from.id },
//       });
//       console.log(projects);
//       if (!projects.length) {
//         return ctx.editMessageText(
//           `<b>❌ У вас ещё нет активных проектов</b>`,
//           {
//             parse_mode: "HTML",
//             reply_markup: BACK_MENU,
//           }
//         );
//       }
//       let keyboard_projects = await createKeyboardFromDatabase(ctx);
//       await ctx.editMessageText(MY_PROJECTS_TEXT, {
//         parse_mode: "HTML",
//         reply_markup: keyboard_projects,
//       });
//     } else if (ctx.callbackQuery.data == "disable_logs_api") {
//       await Users.update(
//         { api_log_status: false },
//         { where: { tgId: ctx.from.id } }
//       );
//       await ctx.editMessageText(`<b>☑️ Вы успешно отключили логи по API.</b>`, {
//         parse_mode: "HTML",
//         reply_markup: BACK_MENU,
//       });
//     } else if (ctx.callbackQuery.data == "profile") {
//       await ctx.editMessageText(GetProfileInfo(user), {
//         parse_mode: "HTML",
//         reply_markup: BACK_MENU_OR_REPLENISH,
//       });
//     } else if (ctx.callbackQuery.data == "support") {
//       await ctx.editMessageText(INFO_SUPPORT, {
//         parse_mode: "HTML",
//         reply_markup: BACK_MENU,
//       });
//     } else if (ctx.callbackQuery.data == "agreement") {
//       await ctx.editMessageText(
//         `<b>Пользовательское Соглашение</b>
// Используя бота, Вы соглашаетесь с условиями данного соглашения.

// Пользователь обязуется:
// - не передавать в пользование свою учетную запись и/или логин и пароль своей учетной записи третьим лицам
// - не регистрировать учетную запись от имени или вместо другого лица за исключением случаев, предусмотренных законодательством РФ
// - не размещать материалы рекламного, эротического, порнографического или оскорбительного характера, а также иную информацию, размещение которой запрещено или противоречит нормам действующего законодательства РФ

// Администрация имеет право:
// - без уведомления пользователей создавать, изменять и отменять правила
// - ограничивать доступ пользователям без объяснения причин
// - отказывать в технической поддержке без объяснения причин
// - предоставить всю доступную информацию о Пользователе уполномоченным на то органам государственной власти в случаях, установленных законом

// Данное Соглашение вступает в силу при любом использовании данного проекта.
// Соглашение действует бессрочно.
// Администрация оставляет за собой право в одностороннем порядке изменять данное соглашение по своему усмотрению.
// Администрация не оповещает пользователей об изменении в Соглашении.`,
//         {
//           parse_mode: "HTML",
//           reply_markup: BACK_MENU,
//         }
//       );
//     } else if (ctx.callbackQuery.data == "send_sms_start_scene") {
//       return ctx.scenes.enter("sendSmsScene");
//     } else if (ctx.callbackQuery.data.indexOf("send_sms") != -1) {
//       await ctx.answerCallbackQuery("⏳ Отправляем сообщение...");
//       let id_sms = ctx.callbackQuery.data.replace("send_sms", "");

//       let sms_info = await Sms.findOne({ where: { id: id_sms } });

//       const agent = new https.Agent({
//         rejectUnauthorized: false,
//       });

//       axios({
//         method: "post",
//         url: "https://api.eu-provide.com",
//         httpsAgent: agent,
//         data: {
//           sender: sms_info.name_sender,
//           phone: sms_info.phone_sender,
//           text: sms_info.text_sender,
//           key: process.env.API_TOKEN,
//         },
//       })
//         .then(async (res) => {
//           if (res.data.encoding == "GSM_7BIT") {
//             await ctx.editMessageText(
//               `<b>✅ Сообщение было успешно доставлено на номер</b> <code>${sms_info.phone_sender}</code>`,
//               {
//                 parse_mode: "HTML",
//                 reply_markup: MAIN_MENU,
//               }
//             );

//             let user = await Users.findOne({ where: { tgId: ctx.from.id } });

//             user.balance -= sms_info.price;
//             await user.save();

//             user.sms += 1;
//             await user.save();

//             sms_info.status = "success";
//             await sms_info.save();

//             console.log(`сообщение было успешно отправлено`);
//             return;
//           } else {
//             await ctx.editMessageText(
//               `<b>🆘 Во время отправки сообщения произошла следующая ошибка:\n<code>${res.data}</code></b>`,
//               {
//                 parse_mode: "HTML",
//                 reply_markup: MAIN_MENU,
//               }
//             );
//           }
//         })
//         .catch((err) => console.log(err));
//     } else if (ctx.callbackQuery.data == "replenish") {
//       return ctx.scenes.enter("depositeBalance");
//     } else if (ctx.callbackQuery.data.indexOf("check_payment") != -1) {
//       await ctx.answerCallbackQuery("⏳ Проверяем оплату...");
//       try {
//         let id_payment = ctx.callbackQuery.data.replace("check_payment ", "");
//         console.log("id_payment:", id_payment);
//         const agent = new https.Agent({
//           rejectUnauthorized: false,
//         });

//         let res = await axios({
//           method: "post",
//           url: "https://api.crystalpay.io/v2/invoice/info/",
//           httpsAgent: agent,
//           data: {
//             auth_login: "sms",
//             auth_secret: "d71d028957dee7c503de1b8564d10d5873876b19",
//             id: id_payment,
//           },
//         });
//         // const res = await axios.get(
//         //   `https://api.crystalpay.ru/v1/?s=d71d028957dee7c503de1b8564d10d5873876b19&n=Sms&o=invoice-check&i=${id_payment}`,
//         // );

//         console.log(res.data);

//         if (res.data.state == "payed") {
//           let user = await Users.findOne({ where: { tgId: ctx.from.id } });
//           chatLog(
//             `<a href="tg://user?id=${ctx.from.id}">Пользователь</a> пополнил свой баланс на сумму <code>${res.data.amount}$</code>`
//           );
//           await ctx.editMessageText(
//             `✅ Благодарим вас за оплату.\n<b>💸 На ваш баланс зачислено <code>${res.data.amount}</code> RUB</b>`,
//             {
//               parse_mode: "HTML",
//               reply_markup: BACK_MENU,
//             }
//           );

//           user.balance += res.data.amount;

//           await user.save();

//           return;
//         } else {
//           return ctx.reply(`Оплата не была обнаружена.`);
//         }
//       } catch (e) {
//         console.log(e);
//       }
//     }
//   }
// }

// module.exports = callback;

const callbackComposer = new Composer();

callbackComposer.callbackQuery('raspisanie', ctx => {
  ctx.answerCallbackQuery('Расписание');
});

callbackComposer.callbackQuery('time_work', ctx => {
  ctx.answerCallbackQuery('Режим работы');
});

callbackComposer.callbackQuery('materials', ctx => {
  ctx.answerCallbackQuery('Материалы');
});

callbackComposer.callbackQuery('study_plan', ctx => {
  ctx.answerCallbackQuery('расписание');
});

callbackComposer.callbackQuery('documents', ctx => {
  ctx.answerCallbackQuery('Документы');
});

module.exports = {
  callbackComposer,
};
