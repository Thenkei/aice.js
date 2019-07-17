const chai = require('chai');

const { expect } = chai;

const { SimpleTokenizer, ComplexeTokenizer } = require('../src/streamTransformers/tokenizer/');

describe('Simple Tokenizer', () => {
  it('Should tokenize "Hello"', () => {
    const textToTokenize = 'Hello';
    const tokenizedText = SimpleTokenizer.tokenize(textToTokenize);

    expect(tokenizedText.get().value.text).to.equal('Hello');
  });

  it('Should tokenize "Hello my friend"', () => {
    const textToTokenize = 'Hello my friend';
    const tokenizedText = SimpleTokenizer.tokenize(textToTokenize);

    const it = tokenizedText.values();
    let node = it.next();
    expect(node.value.text).to.equal('Hello');
    node = it.next();
    expect(node.value.text).to.equal('my');
    node = it.next();
    expect(node.value.text).to.equal('friend');
    node = it.next();
    expect(node.value).to.equal(undefined);
  });
});

describe('Complexe Tokenizer', () => {
  it('Should tokenize "Hello"', () => {
    const textToTokenize = 'Hello';
    const tokenizedText = ComplexeTokenizer.tokenize(textToTokenize);

    expect(tokenizedText.get().value.text).to.equal('Hello');
  });

  it('Should tokenize "Hello my friend"', () => {
    const textToTokenize = 'Hello my friend';
    const tokenizedText = SimpleTokenizer.tokenize(textToTokenize);

    const it = tokenizedText.values();
    let node = it.next();
    expect(node.value.text).to.equal('Hello');
    node = it.next();
    expect(node.value.text).to.equal('my');
    node = it.next();
    expect(node.value.text).to.equal('friend');
    node = it.next();
    expect(node.value).to.equal(undefined);
  });
});
