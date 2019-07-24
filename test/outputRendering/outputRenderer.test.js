const chai = require('chai');

const { expect } = chai;

const { OutputRenderer } = require('../../src/outputRendering');

describe('OutputRenderer', () => {
  it('Should throw error if no name provided', () => {
    expect(() => new OutputRenderer({})).to.throw('Invalid OutputRenderer constructor - Missing name');
  });

  it('Should train model - Empty case', () => {
    const renderer = new OutputRenderer({ name: 'test-renderer' });
    renderer.train();

    expect(renderer.outputs).to.eql([]);
  });

  it('Should train model', () => {
    const renderer = new OutputRenderer({ name: 'test-renderer' });
    renderer.train([1]);

    expect(renderer.outputs).to.eql([1]);
  });

  it('Should throw error, process need to be override in sub-class', () => {
    const renderer = new OutputRenderer({ name: 'test-renderer' });

    expect(() => renderer.process()).to.throw(
      'Invalid OutputRenderer - process() should be implemented in child class',
    );
  });
});
