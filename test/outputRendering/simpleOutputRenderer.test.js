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

  it('Should process answers - lang filtering', () => {
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

  it('Should process answers - lang filtering but no response', () => {
    const renderer = new SimpleOutputRenderer({
      outputs: [
        {
          intentid: 1,
          answers: [
            {
              lang: 'fr',
              tokenizedOutput: tokenizerOutput.tokenize('Ceci est une reponse'),
              conditions: [{ type: 'UnaryExpression', operande: 'not', LRvalue: true }],
            },
            { lang: 'en', tokenizedOutput: tokenizerOutput.tokenize('This is not the good answer'), conditions: [] },
          ],
        },
      ],
    });

    const result = renderer.process('fr', [{ intentid: 1, score: 0.99 }], {});
    expect(result).to.equal(undefined);
  });

  const goodAnwser = 'This is the good answer';
  const alsoMultiAnwser = 'This is also a good answer in multiple';

  const settings = {
    outputs: [
      {
        intentid: 1,
        answers: [
          {
            lang: 'en',
            tokenizedOutput: tokenizerOutput.tokenize('This is not the good answer'),
            conditions: [{ type: 'UnaryExpression', operande: 'not', LRvalue: true }],
          },
          { lang: 'en', tokenizedOutput: tokenizerOutput.tokenize(goodAnwser), conditions: [] },
          {
            lang: 'en',
            tokenizedOutput: tokenizerOutput.tokenize(alsoMultiAnwser),
            conditions: [],
          },
        ],
      },
    ],
  };

  it('Should process answers - output type single', () => {
    settings.outputs[0].outputType = 'single';
    const renderer = new SimpleOutputRenderer(settings);

    const result = renderer.process('en', [{ intentid: 1, score: 0.99 }], {});
    expect(result.score).to.equal(0.99);
    expect(result.renderResponse).to.equal(goodAnwser);
  });

  it('Should process answers - output type multiple', () => {
    settings.outputs[0].outputType = 'multiple';
    const renderer = new SimpleOutputRenderer(settings);

    const result = renderer.process('en', [{ intentid: 1, score: 0.99 }], {});
    expect(result.score).to.equal(0.99);
    expect(result.renderResponse).to.equal(goodAnwser + alsoMultiAnwser); // TODO NEED TO CHANGE [This is the good answer, This is also a good answer in multiple]
  });

  it('Should process answers - random', () => {
    settings.outputs[0].outputType = 'random';
    const renderer = new SimpleOutputRenderer(settings);

    const result = renderer.process('en', [{ intentid: 1, score: 0.99 }], {});
    expect(result.score).to.equal(0.99);
    expect([goodAnwser, alsoMultiAnwser]).to.include(result.renderResponse);
  });
});
