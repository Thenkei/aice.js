/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { Comparator } = require('./comparator');

const { ExactStrategy } = require('./wordsComparator');

/**
 * @class SimilarComparator
 */
class NeedlemanComparator extends Comparator {
  constructor(wordsComparator = new ExactStrategy(), weighting = { default: 1, entities: 5, anyornothing: 0 }) {
    super(wordsComparator);
    this.weighting = weighting;
  }

  /**
   * Give the weighting for an input token
   * @param {Object} expression InputExpression
   */
  getInputTokenWeight(expression) {
    const weight =
      expression && expression.type !== 'ANY' && expression.type !== 'ANYORNOTHING'
        ? this.weighting.entities
        : this.weighting.anyornothing;
    return expression ? weight : this.weighting.default;
  }

  /**
   * Match (Similar strategy) two LinkedLists (Sentences)
   * @param {Sentence} linkedListI A linkedlist representing an input (can comporte expression from ExpressionParser)
   * @param {Sentence} linkedListU A linkedlist representing a utterance (can comporte expression from NER)
   * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
   */
  compare(linkedListI, linkedListU) {
    let result = { context: [], match: false, confidence: 1.0 };

    const matrix = [];
    const indel = -1;

    const lengthI = [...linkedListI.values()].length;
    const lengthU = [...linkedListU.values()].length;

    // init of matrix, scores in the first row and column
    for (let i = 0; i <= lengthU; i += 1) {
      const row = [];
      row.length = lengthI + 1;
      matrix.push(row);
      matrix[i][0] = -i;
    }

    for (let j = 0; j <= lengthI; j += 1) {
      matrix[0][j] = -j;
    }

    // Initialize uterance iterator
    result.iteratorGeneratorU = linkedListU.values();
    result.iteratorU = result.iteratorGeneratorU.next();

    // fill matrix
    let i = 1;
    while (!result.iteratorU.done) {
      let j = 1;
      // Initialize input iterator
      result.iteratorGeneratorI = linkedListI.values();
      result.iteratorI = result.iteratorGeneratorI.next();
      while (!result.iteratorI.done) {
        const { expression } = result.iteratorI.value;
        let weight = this.getInputTokenWeight(expression);
        if (weight !== 0) {
          result = this.compareExpressions(result);
          weight = result.match ? weight : -weight;
        }
        const diag = matrix[i - 1][j - 1] + weight;
        const left = matrix[i][j - 1] + indel;
        const up = matrix[i - 1][j] + indel;

        matrix[i][j] = Math.max(diag, left, up);

        // Initialize next loop
        result.iteratorI = result.iteratorGeneratorI.next();
        j += 1;
      }
      // Initialize next loop
      result.iteratorU = result.iteratorGeneratorU.next();
      i += 1;
    }

    // Computing score
    let score = matrix[lengthU][lengthI];

    // Calculating the maximum score
    let maxScore = 0;
    result.iteratorGeneratorI = linkedListI.values();
    result.iteratorI = result.iteratorGeneratorI.next();
    while (!result.iteratorI.done) {
      maxScore += this.getInputTokenWeight(result.iteratorI.value.expression);
      result.iteratorI = result.iteratorGeneratorI.next();
    }

    // Normalizing score
    score = (score + maxScore) / (2 * maxScore);
    result.confidence = score < 0 ? 0 : score;
    result.match = result.confidence > 0;

    // Delete iterator from result
    delete result.iteratorGeneratorI;
    delete result.iteratorGeneratorU;
    delete result.iteratorI;
    delete result.iteratorU;

    return result;
  }
}

module.exports = { NeedlemanComparator };
