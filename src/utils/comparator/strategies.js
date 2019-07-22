const Levenshtein = require('./levenshtein');
const Damerau = require('./damerau');

class StrategyComparator {
  constructor(name) {
    this.name = name;
  }

  // eslint-disable-next-line class-methods-use-this
  compare() {
    throw new Error('StrategyComparator - Cannot use compare function on abstract class');
  }
}

class ExactStrategy extends StrategyComparator {
  constructor() {
    super('exact-comparator');
    this.score = 1.0;
  }

  compare(a, b) {
    const result = { match: a.toLowerCase() === b.toLowerCase(), score: this.score };
    return result;
  }
}

class LevenshteinStrategy extends StrategyComparator {
  constructor(threshold = 0.49) {
    super('levenshtein-comparator');
    this.threshold = threshold;
  }

  compare(a, b) {
    const result = {};

    const levenshteinScore = Levenshtein(a.toLowerCase(), b.toLowerCase());
    result.score = levenshteinScore !== 0 ? (a.length - levenshteinScore) / a.length : 1.0;

    result.match = result.score > this.threshold;
    return result;
  }
}

class DamerauLevenshteinStrategy extends StrategyComparator {
  constructor(cutoffDamerauScoreFunc = a => (a.length > 4 ? 2 : 1)) {
    super('damerau-levenshtein-comparator');
    this.cutoffDamerauScoreFunc = cutoffDamerauScoreFunc;
  }

  compare(a, b) {
    const result = {};

    const damerauScore = Damerau.distance(a.toLowerCase(), b.toLowerCase());
    result.score = damerauScore !== 0 ? (a.length - damerauScore) / a.length : 1.0;

    // Possible rule based on score - using a cut off on DamerauScore
    const cutoffDamerauScore = this.cutoffDamerauScoreFunc(a);
    result.match = damerauScore <= cutoffDamerauScore;
    return result;
  }
}

module.exports = { StrategyComparator, ExactStrategy, LevenshteinStrategy, DamerauLevenshteinStrategy };
