const chai = require('chai');

const { expect } = chai;

const { Comparator } = require('../../src/utils');

const { InputExpressionTokenizer } = require('../../src/streamTransformers');

const { NERManager, SystemEntities } = require('../../src/streamTransformers');

const { NERTokenizer } = require('../../src/streamTransformers');

const LANG = 'fr';

describe('Entities Comparator', () => {
  const ner = new NERManager();
  const tokenizerUtterance = new NERTokenizer(LANG, ner);
  const tokenizerInput = new InputExpressionTokenizer();
  const simpleComparator = new Comparator();

  SystemEntities.getSystemEntities().forEach(e => {
    ner.addNamedEntity(e);
  });

  it("Compare '@email' to 'john@doe.com' should be true", () => {
    const input = '@email';
    const utterance = 'john@doe.com';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.context.email).to.equal(utterance);
  });
});
