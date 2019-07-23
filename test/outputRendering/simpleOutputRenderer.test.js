const chai = require('chai');

const { expect } = chai;

const { SimpleOutputRenderer } = require('../../src/outputRendering');

const { OutputExpressionTokenizer } = require('../../src/streamTransformers');

describe('SimpleOutputRenderer', () => {
  const tokenizerOutput = new OutputExpressionTokenizer();
  it('Should process empty intents', () => {
    const renderer = new SimpleOutputRenderer({});

    const result = renderer.process('fr', [], {});
    expect(result).to.equal(undefined);
  });

  it('Should process answers', () => {
    const renderer = new SimpleOutputRenderer({
      answers: [
        { lang: 'fr', intentid: 1, tokenizedOutput: tokenizerOutput.tokenize('This is an answer'), conditions: [] },
        { lang: 'en', intentid: 1, tokenizedOutput: tokenizerOutput.tokenize('Not the good answer'), conditions: [] },
      ],
    });

    const result = renderer.process('fr', [{ intentid: 1, score: 0.99 }], {});
    expect(result.score).to.equal(0.99);
    expect(result.renderResponse).to.equal('This is an answer');
  });
});
