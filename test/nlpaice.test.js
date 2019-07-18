const chai = require('chai');

const { expect } = chai;

const { AICE } = require('../src/');

describe('AICE NLP', () => {
  it('Basic Use Case', () => {
    const nlp = new AICE();

    nlp.addInput('fr', 'Bonjour', 'agent.presentation');
    nlp.addInput('fr', 'Coucou', 'agent.presentation');
    nlp.addInput('fr', 'Salut', 'agent.presentation');

    nlp.addAnswer('fr', 'agent.presentation', 'Coucou :)', 'fr');

    nlp.addInput('fr', '^je suis {{name=*}}', 'agent.askname');
    nlp.addInput('fr', "^je m'apelle {{name=*}}", 'agent.askname');

    nlp.addAnswer('fr', 'agent.askname', 'Hello {{name}}', 'fr');

    nlp.addInput('fr', '^bye^', 'agent.bye');
    nlp.addInput('fr', '^a la prochaine^', 'agent.bye');
    nlp.addInput('fr', '^bonne journée^', 'agent.bye');

    nlp.addAnswer('fr', 'agent.bye', 'A la prochaine!', 'fr');

    // Fallback
    nlp.addInput('fr', '*', 'agent.fallback');

    nlp.addAnswer('fr', 'agent.fallback', "Je n'ai pas compris", 'fr');

    nlp.train();
  });
});
