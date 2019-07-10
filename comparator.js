/**
 * @class Comparator
 */
class Comparator {

  /**
   * Match two LinkedLists (Sentences)
   * @param {Sentence} linkedListA A linkedlist representing an input (can comporte expression from ExpressionParser)
   * @param {Sentence} linkedListB A linkedlist representing a utterance (can comporte expression from NER)
   * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
   */
  static compare(linkedListA, linkedListB) {
    let result = { context: [], match: false, confidence: 1.0 };

    // Simpliest strict equality check
    result.match = [...linkedListA.values()].equals([...linkedListB.values()]);

    // Expressioned equality check
    if (!result.match) {
      result = Comparator.compareExpressions(linkedListA.values(), linkedListB.values());
    }

    return result;
  }

  static compareExpressions(expressionA, expressionB) {
    let result = { context: [], match: false };
    
    console.log(expressionA);
    console.log(expressionB);

    return result;
  }
}

Array.prototype.equals = function (array) {
  return this.length == array.length &&
    this.every(function (this_i, i) { return this_i == array[i] })
}

module.exports = Comparator;