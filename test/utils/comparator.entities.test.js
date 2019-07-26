const chai = require('chai');

const { expect } = chai;

const { Comparator } = require('../../src/utils');

const {
  EnumEntity,
  NERTokenizer,
  NERManager,
  SystemEntities,
  InputExpressionTokenizer,
} = require('../../src/streamTransformers');

const LANG = 'fr';

describe('Entities Comparator', () => {
  const ner = new NERManager();
  ner.addNamedEntity(
    new EnumEntity({
      name: 'size',
      scope: 'global',
      enumeration: [{ key: 'S', values: ['small'] }, { key: 'M', values: ['medium'] }, { key: 'L', values: ['large'] }],
    }),
  );
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

  it("Compare '^@email^' to 'john@doe.com' should be true", () => {
    const input = '^@email^';
    const utterance = 'john@doe.com';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.context.email).to.equal(utterance);
    expect(Object.entries(result.context).length).to.equal(3); // anyornothing email anyornothing_1
  });

  it("Compare '^@email' to 'hello' should be false", () => {
    const input = '^@email';
    const utterance = 'hello';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
  });

  it("Compare '^@email' to 'hello' should be false", () => {
    const input = '^@email @phonenumber';
    const utterance = 'test@opla.ai';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
  });

  it('Compare should sub enum entity', () => {
    const input = '@S @M @L';
    const utterance = 'small medium large';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
  });
});
