/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Levenshtein = require('./levenshtein');
const Damerau = require('./damerau');
const ContextMutator = require('./contextMutator');

class ExactComparator {
  static compare(a, b) {
    const result = { match: a.toLowerCase() === b.toLowerCase(), score: 1.0 };
    return result;
  }
}

class LevenshteinComparator {
  static compare(a, b, threshold = 0.49) {
    const result = {};

    const levenshteinScore = Levenshtein(a.toLowerCase(), b.toLowerCase());
    result.score = levenshteinScore !== 0 ? (a.length - levenshteinScore) / a.length : 1.0;

    result.match = result.score > threshold;
    return result;
  }
}

class DamerauLevenshteinComparator {
  static compare(a, b) {
    const result = {};

    const damerauScore = Damerau.distance(a.toLowerCase(), b.toLowerCase());
    result.score = damerauScore !== 0 ? (a.length - damerauScore) / a.length : 1.0;

    // Possible rule based on score - using a cut off on DamerauScore
    const cutoffDamerauScore = a.length > 5 ? Math.floor(a.length / 2) - 1 : Math.floor(a.length / 2);
    result.match = damerauScore <= cutoffDamerauScore;
    return result;
  }
}

/**
 * @class Comparator
 */
class Comparator {
  constructor(internalComparator = ExactComparator) {
    this.comparator = internalComparator.compare;
  }

  /**
   * Match two LinkedLists (Sentences)
   * @param {Sentence} linkedListI A linkedlist representing an input (can comporte expression from ExpressionParser)
   * @param {Sentence} linkedListU A linkedlist representing a utterance (can comporte expression from NER)
   * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
   */
  compare(linkedListI, linkedListU) {
    let result = { context: [], match: false, done: false, confidence: 1.0 };

    // Simpliest strict word token equality check
    result.match = [...linkedListI.values()].equalsText([...linkedListU.values()]);

    // Expressioned equality check
    if (!result.match) {
      result.match = true;
      result.iteratorI = linkedListI.get(0);
      result.iteratorU = linkedListU.get(0);

      while (result.match && !result.done) {
        result = this.compareExpressions(result);

        if (!result.done) {
          result.iteratorI = result.iteratorI.next;
          result.iteratorU = result.iteratorU.next;
        }

        // Do we need to process next tokens
        result.done = !result.iteratorI;
      }

      // It only match if the iterators are both null (at the end of each sentences)
      if (result.match) {
        result.match = !result.iteratorI && !result.iteratorU;
      }

      // Delete iterator from result
      delete result.iteratorI;
      delete result.iteratorU;
      delete result.done;
    }

    return result;
  }

  /**
   * Matchs Expressions
   * @param {result} result result is a complexe object used to process Sentences comparison
   * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
   */
  compareExpressions(resultState) {
    let result = resultState;

    const { expression, text } = result.iteratorI.value;

    // Case iteratorI contains an expression
    switch (expression && expression.type) {
      case 'ANY':
      case 'ANYORNOTHING':
        {
          const res = this.compareGenericAnyOrNothing(result, expression.type === 'ANY');

          result = { ...result, ...res.result };
        }
        break;

      case 'ENTITY':
        {
          if (!result.iteratorU) {
            result.match = false;
            break;
          }
          const { ner, text: textU } = result.iteratorU.value;
          result.match = expression.entityType === ner.entityType;

          if (result.match) {
            const varName = expression.contextName || expression.entityType.toLowerCase();
            // TODO Will change after the NER TOKEN Implementation => ner.value ? ner.row ? ner.match ...
            ContextMutator.addVariableToContext(result.context, { name: varName, value: textU });
          }
        }
        break;

      default: {
        if (!result.iteratorU) {
          result.match = false;
          break;
        }
        const { text: textU } = result.iteratorU.value;
        const res = this.comparator(text.toLowerCase(), textU.toLowerCase());
        result.match = res.match;
        // TODO handle comparison score // max user typing error // max % error by wordToken
        // result.confidence = res.score !== 1 ? 0.9
      }
    }
    return result;
  }

  /**
   * Matchs Any Expression or AnyOrNothing Expression
   * @param {result} result result is a complexe object used to process Sentences comparison
   * @param {Boolean} caseAny AnyOrNothing
   * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
   */
  compareGenericAnyOrNothing(resultState, caseAny = true) {
    const result = resultState;
    let text = '';

    const varName =
      result.iteratorI.value.expression.contextName || result.iteratorI.value.expression.type.toLowerCase();

    // Iterate on Input
    result.iteratorI = result.iteratorI.next;

    // case Not Last Token in Input
    if (result.iteratorI !== null) {
      // Case ANY - At least one token needed
      if (caseAny) {
        text += result.iteratorU.value.text;
        result.iteratorU = result.iteratorU.next;
      }
      // Iterate until same expression or end of sentence
      while (result.iteratorU !== null && !this.compareExpressions(result).match) {
        const { text: textU } = result.iteratorU.value;
        text += (!text && textU) || ` ${textU}`;
        result.iteratorU = result.iteratorU.next;
      }

      result.done = result.iteratorU === null;
      if (!result.done) {
        result.match = this.compareExpressions(result).match;
      }

      // case Ending Token in Input
    } else {
      // Iterate until end of sentence
      while (result.iteratorU) {
        const { text: textU } = result.iteratorU.value;
        text += (!text && textU) || ` ${textU}`;
        result.iteratorU = result.iteratorU.next;
      }
      result.done = true;

      // Case ANY - At least one token needed
      if (caseAny) {
        result.match = text !== '';
      }
    }

    if (result.match) {
      ContextMutator.addVariableToContext(result.context, { name: varName, value: text });
    }
    return result;
  }
}

/* eslint no-extend-native: ["error", { "exceptions": ["Array"] }] */
Array.prototype.equalsText = a => this.length === a.length && this.every((t, i) => t.text === a[i].text);

module.exports = { Comparator, LevenshteinComparator, DamerauLevenshteinComparator };
