const chai = require('chai');

const { expect } = chai;

const { OutputRenderingManager, OutputRenderer } = require('../../src/outputRendering');

describe('OutputRenderingManager', () => {
  it('Should train all sub-outputRenderer ', () => {
    const outputRenderingManager = new OutputRenderingManager({});
    outputRenderingManager.train([1]);

    expect(outputRenderingManager.outputRenderers[0].outputs.length).to.equal(1);
  });

  it('Should custom intentResolvers using settings', () => {
    const outputRenderingManager = new OutputRenderingManager({
      settings: { outputRenderers: [new OutputRenderer({ name: 'test-renderer' })] },
    });
    expect(outputRenderingManager.outputRenderers.length).to.equal(1);
  });

  it('Should process outputRenderers - NEED TO BE TWICK WITH ALL NEW FUTURE RENDERERS', () => {
    const outputRenderingManager = new OutputRenderingManager({});
    const result = outputRenderingManager.process('fr', [], {});

    expect(result).to.equal(undefined);
  });
});
