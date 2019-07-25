const chai = require('chai');

const { expect } = chai;

const { AICE } = require('../src/');

const { SystemEntities, RegExpEntity } = require('../src/streamTransformers');

describe('AICE NLP', () => {
  it('Basic Use Case - All API', () => {
    const aice = new AICE();
    // Initialization
    aice.addInput('fr', 'Bonjour', 'agent.presentation');
    aice.addInput('fr', 'Coucou', 'agent.presentation');
    aice.addInput('fr', 'Salut', 'agent.presentation');

    aice.addOutput('fr', 'agent.presentation', 'Coucou :)');

    aice.addInput('fr', '^je suis {{name=*}}', 'agent.askname');
    aice.addInput('fr', "^je m'appelle {{name=*}}", 'agent.askname');

    aice.addOutput('fr', 'agent.askname', 'Hello {{name}}');

    aice.addInput('fr', '^bye^', 'agent.bye');
    aice.addInput('fr', '^a la prochaine^', 'agent.bye');
    aice.addInput('fr', '^bonne journée^', 'agent.bye');

    aice.addOutput('fr', 'agent.bye', 'A la prochaine!');

    // Fallback
    aice.addInput('fr', '*', 'agent.fallback');

    aice.addOutput('fr', 'agent.fallback', "Je n'ai pas compris");

    aice.train();

    // Tests
    const context = {};
    let res = aice.process('bonjour', context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.presentation');
    expect(res.answer).to.equal('Coucou :)');

    res = aice.process("Superbe, je m'appelle Morgan", context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.askname');
    expect(res.answer).to.equal('Hello Morgan');

    res = aice.process('Squeezie ft Joyca - Bye Bye', context);
    expect(res.score).to.equal(1.0);
    expect(res.intent).to.equal('agent.bye');
    expect(res.answer).to.equal('A la prochaine!');
  });

  it('AICE - API getAllEntities', () => {
    const aice = new AICE();
    expect(aice.getAllEntities().length).to.equal(SystemEntities.getSystemEntities().length);
  });

  it('AICE - API addEntity', () => {
    const aice = new AICE();
    aice.addEntity(new RegExpEntity({ name: 'test', regex: /test/gi }));
    expect(aice.getAllEntities().length).to.equal(SystemEntities.getSystemEntities().length + 1);
  });

  it('AICE - API addInput', () => {
    const aice = new AICE();
    aice.addInput('en', 'Hey', 'agent.presentation');
    expect(aice.inputs.length).to.equal(1);
  });

  it('AICE - API addInput same input twice', () => {
    const aice = new AICE();
    aice.addInput('en', 'Hey', 'agent.presentation');
    aice.addInput('en', 'Hey', 'agent.presentation');
    expect(aice.inputs.length).to.equal(1);
  });

  it('AICE - API addOutput', () => {
    const aice = new AICE();
    aice.addOutput('en', 'agent.presentation', 'Hey');
    const numberAnswers = aice.outputs[0].answers.length;
    expect(numberAnswers).to.equal(1);
  });

  it('AICE - API addOutput same output twice', () => {
    const aice = new AICE();
    aice.addOutput('en', 'agent.presentation', 'Hey');
    aice.addOutput('en', 'agent.presentation', 'Hey');
    const numberAnswers = aice.outputs[0].answers.length;
    expect(numberAnswers).to.equal(1);
  });

  it('AICE - API clear', () => {
    const aice = new AICE();
    aice.addInput('en', 'Hey', 'agent.presentation');
    aice.clear();
    expect(aice.inputs.length).to.equal(0);
    expect(aice.outputs.length).to.equal(0);
  });

  it('AICE - API normalizeInputEntities', () => {
    const aice = new AICE();
    const normalizedEntities = aice.normalizeInputEntities('fr', 'My informations are: example@mail.com 0625475309');
    expect(normalizedEntities).to.equal('My informations are: @email @phonenumber');
  });
});
