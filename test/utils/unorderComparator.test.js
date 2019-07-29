const chai = require('chai');

const { expect } = chai;

const { UnorderComparator } = require('../../src/utils');

const { InputExpressionTokenizer, ComplexeTokenizer } = require('../../src/streamTransformers');

const tokenizerInput = new InputExpressionTokenizer();
const tokenizerUtterance = ComplexeTokenizer;

describe('Simple UnorderComparator', () => {
  const simpleUnorderComparator = new UnorderComparator();

  it('Should not match different sentences', () => {
    const input = 'My name is what';
    const utterance = 'you are slim';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
    expect(result.confidence).to.equal(0.0);
  });

  it('Should exact match same Sentences', () => {
    const input = 'Hello';
    const utterance = 'Hello';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should exact match same unordered Sentences', () => {
    const input = 'Hello my friend';
    const utterance = 'My friend Hello';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.be.closeTo(0.82, 0.1);
  });

  it('Should exact match same unordered Sentences', () => {
    const input = 'Hello my friend';
    const utterance = 'My Hello friend';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(0.5);
  });

  it('Should exact match same Sentences', () => {
    const input = 'Je suis beau, et vous aussi, vous êtes beau.';
    const utterance = 'Je suis beau, et vous aussi, vous êtes beau.';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should exact match same unordered Sentences', () => {
    const input = 'Je suis beau, et vous aussi, vous êtes beau.';
    const utterance = 'Vous êtes beau, et moi aussi, je suis beau.';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleUnorderComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.be.closeTo(0.82, 0.1);
  });
});
