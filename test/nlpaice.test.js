const chai = require('chai');

const { expect } = chai;

const { AICE } = require('../src/');

describe('AICE NLP', () => {
  it('Basic Use Case', () => {
    const nlp = new AICE();
    // Initialization
    nlp.addInput('fr', 'Bonjour', 'agent.presentation');
    nlp.addInput('fr', 'Coucou', 'agent.presentation');
    nlp.addInput('fr', 'Salut', 'agent.presentation');

    nlp.addAnswer('fr', 'agent.presentation', 'Coucou :)', 'fr');

    nlp.addInput('fr', '^je suis {{name=*}}', 'agent.askname');
    nlp.addInput('fr', "^je m'appelle {{name=*}}", 'agent.askname');

    nlp.addAnswer('fr', 'agent.askname', 'Hello {{name}}', 'fr');

    nlp.addInput('fr', '^bye^', 'agent.bye');
    nlp.addInput('fr', '^a la prochaine^', 'agent.bye');
    nlp.addInput('fr', '^bonne journée^', 'agent.bye');

    nlp.addAnswer('fr', 'agent.bye', 'A la prochaine!', 'fr');

    // Fallback
    nlp.addInput('fr', '*', 'agent.fallback');

    nlp.addAnswer('fr', 'agent.fallback', "Je n'ai pas compris", 'fr');

    nlp.train();

    // Tests
    const context = {};
    let res = nlp.process('bonjour', context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.presentation');
    expect(res.answer).to.equal('Coucou :)');

    res = nlp.process("Superbe, je m'appelle Morgan", context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.askname');
    expect(res.answer).to.equal('Hello Morgan');

    res = nlp.process('Squeezie ft Joyca - Bye Bye', context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.bye');
    expect(res.answer).to.equal('A la prochaine!');
  });
});
