const chai = require('chai');

const { expect } = chai;

const { Renderer } = require('../../src/utils');

const { OutputExpressionTokenizer } = require('../../src/streamTransformers');

describe('Renderer', () => {
  const tokenizerOutput = new OutputExpressionTokenizer();

  it('Should render basic text', () => {
    const output = 'I need to be rendered';

    const tokenizeO = tokenizerOutput.tokenize(output);

    const result = Renderer.render(tokenizeO, {});
    expect(result).to.equal(output);
  });

  it('Should render text with openNLX expression OUTPUT', () => {
    const output = 'I need to be rendered a variable {{variable}}';

    const tokenizeO = tokenizerOutput.tokenize(output);

    const result = Renderer.render(tokenizeO, { variable: 'bob' });
    expect(result).to.equal('I need to be rendered a variable bob');
  });

  it('Should render text with openNLX expression OUTPUT affectation', () => {
    const output = 'I need to be rendered a variable {{variable=other}}';
    const context = { variable: 'bob', other: 'boby' };
    const tokenizeO = tokenizerOutput.tokenize(output);

    const result = Renderer.render(tokenizeO, context);
    expect(result).to.equal('I need to be rendered a variable boby');
    expect(context.variable).to.equal('boby');
  });

  it('Should render text with openNLX expression CODE', () => {
    const output = 'I need to be rendered a variable<<variable="toto">>';
    const context = { variable: 'bob' };
    const tokenizeO = tokenizerOutput.tokenize(output);

    const result = Renderer.render(tokenizeO, context);
    expect(result).to.equal('I need to be rendered a variable');
    expect(context.variable).to.equal('toto');
  });

  it('Should throw an error if no expression type', () => {
    const output = 'I need to be rendered a variable';
    const tokenizeO = tokenizerOutput.tokenize(output);
    // Add unknown expression
    tokenizeO.append({ expression: {} });

    expect(() => Renderer.render(tokenizeO, {})).to.throw('Invalid OutputRendering Render - Unknown expression');
  });
});
