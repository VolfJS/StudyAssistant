// bot by SC TEAM

const { bot } = require('./bot');
const { cmd } = require('./commands/cmd');
const prisma = require('./db/prisma');


const Levenshtein = require('fast-levenshtein');

const fs = require('fs');

bot.use(cmd);

const trainingData = require('./training_data.json');

class MarkovChatbot {
  constructor(trainingData) {
      this.questions = trainingData.questions;
      this.answers = trainingData.answers;
      this.transitions = this.trainMarkovChain();
      this.previousResponses = [];
  }

  trainMarkovChain() {
      const transitions = {};
      this.questions.forEach((question, index) => {
          const answer = this.answers[index];
          if (!transitions[question]) {
              transitions[question] = [];
          }
          transitions[question].push(answer);
      });
      return transitions;
  }

  findClosestQuestion(inputText) {
      let minDistance = Infinity;
      let closestQuestion = null;

      for (const question of this.questions) {
          const distance = Levenshtein.get(inputText, question);
          if (distance < minDistance) {
              minDistance = distance;
              closestQuestion = question;
          }
      }
      return closestQuestion;
  }

  generateResponse(inputText) {
      const closestQuestion = this.findClosestQuestion(inputText);
      if (closestQuestion) {
        const distance = Levenshtein.get(inputText, closestQuestion);
        if (distance > 5) { // Настраиваем порог на ваше усмотрение
            return "Не знаю ответа на ваш вопрос.";
        }
          const possibleResponses = this.transitions[closestQuestion];
          const response = possibleResponses[Math.floor(Math.random() * possibleResponses.length)];
          this.previousResponses.push(response);
          return response;
      } else {
          return "Извините, не могу понять ваш вопрос.";
      }
  }

  generateAdditionalText(userText) {
      if (this.previousResponses.length > 0) {
          const lastResponse = this.previousResponses[this.previousResponses.length - 1];
          const additionalText = this.generateResponse(lastResponse);
          this.previousResponses.push(additionalText);
          this.saveAdditionalText(userText, additionalText);
          return additionalText;
      } else {
          return "Я не могу сгенерировать дополнительный текст без предыдущего ответа.";
      }
  }

  saveAdditionalText(userText, additionalText) {
      const logText = `Пользователь: ${userText}\nБот (дополнительный текст): ${additionalText}\n\n`;
      fs.appendFile('additional_text.txt', logText, (err) => {
          if (err) {
              console.error('Ошибка записи в файл: ' + err);
          }
      });
  }
}

const chatbot = new MarkovChatbot(trainingData);

bot.on("message:text", async (ctx) => {

  const response = chatbot.generateResponse(ctx.msg.text);

  return ctx.reply(`🤖 <b>[AI] ></b> <b><i>${response}</i></b>`, {
    parse_mode: "HTML"
  })

})

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
