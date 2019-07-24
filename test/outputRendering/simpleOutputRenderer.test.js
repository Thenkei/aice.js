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
      outputs: [
        {
          intentid: 1,
          answers: [
            { lang: 'fr', tokenizedOutput: tokenizerOutput.tokenize('Ceci est une reponse'), conditions: [] },
            { lang: 'en', tokenizedOutput: tokenizerOutput.tokenize('This is not the good answer'), conditions: [] },
          ],
        },
      ],
    });

    const result = renderer.process('fr', [{ intentid: 1, score: 0.99 }], {});
    expect(result.score).to.equal(0.99);
    expect(result.renderResponse).to.equal('Ceci est une reponse');
  });
});
