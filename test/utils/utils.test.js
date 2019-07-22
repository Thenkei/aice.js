const chai = require('chai');

const { expect } = chai;

const { Utils } = require('../../src/utils');

describe('Utils', () => {
  it('Utils - flatten', () => {
    const array1 = [1, 2, [3, 4]];
    expect(Utils.flatten(array1)).to.eql([1, 2, 3, 4]);
  });

  it('Utils - flatten empty array', () => {
    const array1 = [];
    expect(Utils.flatten(array1)).to.eql([]);
  });

  it('Utils - flatten one empty', () => {
    const array1 = [1, 2, []];
    expect(Utils.flatten(array1)).to.eql([1, 2]);
  });
});
