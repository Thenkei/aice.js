const chai = require('chai');

const { expect } = chai;

const { Comparator, LevenshteinComparator } = require('../src/utils/');

const { InputExpressionTokenizer } = require('../src/streamTransformers/expression/');

const { ComplexeTokenizer } = require('../src/streamTransformers/tokenizer/');

const tokenizerInput = new InputExpressionTokenizer();
const tokenizerUtterance = ComplexeTokenizer;

describe('Simple Comparator', () => {
  const simpleComparator = new Comparator();
  it('Should exact match same Sentences', () => {
    const input = 'Hello';
    const utterance = 'Hello';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should match Sentences with special char', () => {
    const input = 'Hello';
    const utterance = 'Hello !';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should match Sentences with useless chars and spaces', () => {
    const input = 'Hello';
    const utterance = ' Hello,,, ,';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });

  it('Should match Sentences with different case', () => {
    const input = 'Change all picture';
    const utterance = 'change ALL picture';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
  });
});

describe('Levenshtein Comparator', () => {
  const levenshteinComparator = new Comparator(LevenshteinComparator);
  it('Should match Sentences with typing error', () => {
    const input = 'Hello';
    const utterance = 'Helli';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    // expect(result.confidence).to.equal(0.9);
  });

  it('Should match Complexe Sentences with typing error', () => {
    const input = '^my name is {{name=*}} shady ^';
    const utterance = 'Hello, my nqme is slime shady !!!!!! REPU';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    // expect(result.confidence).to.equal(0.9);
  });

  it('Should match Complexe Sentences with typing error 2', () => {
    const input = '^my name is {{name=*}} shady ^';
    const utterance = 'Hello, my nqme is slime shody !!!!!! REPU';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    // expect(result.confidence).to.equal(0.9);
  });

  it("Shouldn't match Sentences with typing error", () => {
    const input = 'Hello';
    const utterance = 'Hemmi';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
    // expect(result.confidence).to.equal(0.9);
  });
});

describe('Expression Any/AnyOrNothing simpleComparator', () => {
  const simpleComparator = new Comparator();
  it('Compare "*" to "" should be false', () => {
    const input = '*';
    const utterance = '';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
    expect(result.confidence).to.equal(1.0);
  });

  it('Compare "*" to "something" should be true', () => {
    const input = '*';
    const utterance = 'something';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.any).to.equal('something');
  });

  it('Compare "^" to "" should be true', () => {
    const input = '^';
    const utterance = '';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('');
  });

  it('Compare "^" to "something" should be true', () => {
    const input = '^';
    const utterance = 'something';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('something');
  });

  it('Compare "Hello *" to "Hello Bob!" should be true', () => {
    const input = 'Hello *';
    const utterance = 'Hello Bob!';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.any).to.equal('Bob');
  });

  it('Compare "Hello ^" to "Hello Bob!" should be true', () => {
    const input = 'Hello ^';
    const utterance = 'Hello Bob!';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = simpleComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('Bob');
  });
});

describe('Expression Any/AnyOrNothing levenshteinComparator', () => {
  const levenshteinComparator = new Comparator(LevenshteinComparator);
  it('Compare "*" to "" should be false', () => {
    const input = '*';
    const utterance = '';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(false);
    expect(result.confidence).to.equal(1.0);
  });

  it('Compare "*" to "something" should be true', () => {
    const input = '*';
    const utterance = 'something';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.any).to.equal('something');
  });

  it('Compare "^" to "" should be true', () => {
    const input = '^';
    const utterance = '';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('');
  });

  it('Compare "^" to "something" should be true', () => {
    const input = '^';
    const utterance = 'something';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('something');
  });

  it('Compare "Hello *" to "Hello Bob!" should be true', () => {
    const input = 'Hello *';
    const utterance = 'Hello Bob!';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.any).to.equal('Bob');
  });

  it('Compare "Hello ^" to "Hello Bob!" should be true', () => {
    const input = 'Hello ^';
    const utterance = 'Hello Bob!';

    const sentenceI = tokenizerInput.tokenize(input);
    const sentenceU = tokenizerUtterance.tokenize(utterance);

    const result = levenshteinComparator.compare(sentenceI, sentenceU);
    expect(result.match).to.equal(true);
    expect(result.confidence).to.equal(1.0);
    expect(result.context.anyornothing).to.equal('Bob');
  });
});
