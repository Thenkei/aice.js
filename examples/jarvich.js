/* eslint-disable no-console */

const readline = require('readline');

const threshold = 0.5;
const { AICE } = require('../src/');

const BOT_NAME = 'jarvich';
const isSilent = process.argv[2] === '--silent';
const ctxt = {};

(async () => {
  const say = console.log;
  say('[training] start');
  let start = +Date.now();
  const nlp = new AICE();
  // Fallback
  nlp.addInput('fr', '*', 'agent.fallback');

  nlp.addAnswer('fr', 'agent.fallback', 'Je ne comprends pas.', 'fr');
  nlp.addAnswer('fr', 'agent.fallback', 'Je ne sais pas quoi vous répondre.', 'fr');
  nlp.addAnswer('fr', 'agent.fallback', "J'essaie' de m'améliorer mais la je bloque...", 'fr');
  nlp.addAnswer('fr', 'agent.fallback', 'Je ne comprends pas vraiment pas.', 'fr');

  nlp.addInput('fr', 'Bonjour^', 'agent.presentation');
  nlp.addInput('fr', 'Coucou^', 'agent.presentation');
  nlp.addInput('fr', 'Salut^', 'agent.presentation');
  nlp.addInput('fr', 'Hello^', 'agent.presentation');

  nlp.addAnswer('fr', 'agent.presentation', 'Coucou :)', 'fr');

  nlp.addInput('fr', '^je suis {{name=*}}', 'agent.askname');
  nlp.addInput('fr', "^je m'appelle {{name=*}}", 'agent.askname');

  nlp.addAnswer('fr', 'agent.askname', 'Hello {{name}}', 'fr');

  nlp.addInput('fr', '^bye^', 'agent.bye');
  nlp.addInput('fr', '^a la prochaine^', 'agent.bye');
  nlp.addInput('fr', '^a plus^', 'agent.bye');
  nlp.addInput('fr', '^bonne journée^', 'agent.bye');

  nlp.addAnswer('fr', 'agent.bye', 'A la prochaine!', 'fr');

  nlp.train();
  let end = +Date.now();
  say('[training] done');
  say(`[training] spent:  ${end - start}ms`);
  say(`[${BOT_NAME}] Bonjour !`);
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: false,
  });
  rl.on('line', async line => {
    if (line.toLowerCase() === 'quit') {
      rl.close();
      process.exit();
    } else {
      start = +Date.now();
      const result = await nlp.process(line, ctxt);
      end = +Date.now();
      const answer =
        result.score > threshold && result.answer ? result.answer : 'Désolé, je ne comprends pas votre question';
      const extra = !isSilent ? `- spent: ${end - start}ms - extra: ${JSON.stringify(result)}` : '';
      say(`[${BOT_NAME}] - ${answer} ${extra}`);
    }
  });
})();
