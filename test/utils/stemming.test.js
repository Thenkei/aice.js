const chai = require('chai');

const { expect } = chai;

const Stemming = require('../../src/utils/comparator/wordsComparator/stemming');

// TEST stemming
describe('Word stemming', () => {
  it('Testing suffixes', () => {
    expect(Stemming('Remplacement')).to.equal(Stemming('Remplacer'));
    expect(Stemming('fabricatrice')).to.equal('fabriqu');
    expect(Stemming('importance')).to.equal('import');
    expect(Stemming('psychologie')).to.equal('psychologi');
    expect(Stemming('fusion')).to.equal('fusion');
    expect(Stemming('télédiffusion')).to.equal('télédiffu');
    expect(Stemming('apparences')).to.equal('apparent');
    expect(Stemming('activité')).to.equal('activ');
    expect(Stemming('délicatement')).to.equal('délicat');
    expect(Stemming('finirai')).to.equal('finir');
    expect(Stemming('tourbilloneriez')).to.equal('tourbillon');
    expect(Stemming('refleurissement')).to.equal('refleur');
    expect(Stemming('tourbillonnâmes')).to.equal('tourbillon');
  });
});
