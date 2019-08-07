const chai = require('chai');

const { expect } = chai;

const { NeedlemanComparator } = require('../../src/utils');

const { InputExpressionTokenizer, NERTokenizer, NERManager, SystemEntities } = require('../../src/streamTransformers');

const tokenizerInput = new InputExpressionTokenizer();
const ner = new NERManager();
SystemEntities.getSystemEntities().forEach(e => {
  ner.addNamedEntity(e);
});
const tokenizerUtterance = new NERTokenizer(ner);
const LANG = 'en';

describe('LazzyUnorderComparator', () => {
  const needlemanComparator = new NeedlemanComparator();

  it('Should not match different sentences', () => {
    const input = 'Hello my email is {{@email}}';
    const utterance = 'Heureux qui comme Ulysse a fait un beau voyage';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(LANG, utterance);

    const result = needlemanComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
    expect(result.confidence).to.equal(0.0);
  });

  it('Should match similar sentences', () => {
    const input = 'Hello my email is {{@email}}';
    const utterance = 'Hello my email adress is leto@opla.ai';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(LANG, utterance);

    const result = needlemanComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.be.greaterThan(0.9);
  });

  it('Should exact match same Sentences', () => {
    const input = 'Hello';
    const utterance = 'Hello';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(LANG, utterance);

    const result = needlemanComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should not take into acount ANY/ANYORNOTHING expressions', () => {
    const input = '{{^}} You are awesome {{*}}';
    const utterance = 'You are awesome my friend';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(LANG, utterance);

    const result = needlemanComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.be.greaterThan(0.6);
  });
});
