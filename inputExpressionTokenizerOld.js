/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 * 
 * Authors: Morgan Perre
 */

const DoubleLinkedList = require('./doubleLinkedList');

/**
 * 
 */
class InputExpressionParser {

  /**
   * regex: the regex used to capture an expession
   * parser: the function used to parse the expession captured
   */
  static get expressionTypes() {
    return [
      {
        regex: /(\*)/,
        parser: InputExpressionParser.parseAny,
      },
      {
        regex: /(\^)/,
        parser: InputExpressionParser.parseAnyOrNothing,
      },
      {
        regex: /\@(.+)/,
        parser: InputExpressionParser.parseEntity,
      },
    ];
  }

  static get regex() {
    return new RegExp(InputExpressionParser.expressionTypes.map(b => b.regex.source).join('|'));
  }

  static parseInputAssignment(match) {
    const contextName = match[0];
    const expression = InputExpressionParser.parseInputFromTextToken(match[1]);

    return { ...expression, contextName }
  }

  static parseAny() {
    return { type: 'ANY' };
  }

  static parseAnyOrNothing() {
    return { type: 'ANYORNOTHING' };
  }

  static parseEntity(match) {
    return { type: 'ENTITY', entityType: match };
  }

  static parseInputFromTextToken(potentialExpressionToken) {
    const matchAssignment = /{{(.+?)\=(.+?)}}/.exec(potentialExpressionToken);

    if (matchAssignment) {
      matchAssignment.shift();
      return InputExpressionParser.parseInputAssignment(matchAssignment);
    }

    const matchInput = InputExpressionParser.regex.exec(potentialExpressionToken);
    if (matchInput !== null) {
      matchInput.shift(); // Remove first element who is the global matchInput for get only captured groups
      const type = matchInput.findIndex(e => e); // Get the block type

      if (typeof type !== 'undefined' || type !== null) {
        return InputExpressionParser.expressionTypes[type].parser(matchInput[type]);
      }
    }
    return undefined;
  }
}


const isSeparator = (charToken) =>
    (charToken < "0" || (charToken > "9" && charToken < "@") ||
    (charToken > "Z" && charToken < "a") ||
    (charToken > "}" && charToken.charCodeAt(0) < 127) ||
    (charToken < "!"));

const isCharExpression = (charToken) =>
    (charToken === "*" || charToken === "^");

/**
 * InputExpressionTokenizer
 */
class InputExpressionTokenizer {

  constructor() {
    this.expressionParser = InputExpressionParser.parseInputFromTextToken;
  }

  /**
  * Tokenize an Intent Input or Intent Output
  * @param {String} stream Raw Intent Input or Intent Output
  * @param {DoubleLinkedList} list A linkedlist that represent the Intent Input or Intent Output
  * @returns {result} match: true if it matched & context[] that will be used to change user context (contains capture / entities)
  */
  tokenizeInput(stream, list = new DoubleLinkedList(), normalize = true) {

    const normalized = normalize
      ? stream.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
      : stream;

    const appendToken = (acc) => { if (acc.text !== "") { list.append(acc); } };

    let word = "";
    for (const charToken of normalized) {
      const startExpression = word.includes('{{');
      const doneExpression = startExpression && (word.includes('}}'));

      // Process word and charToken
      if (isCharExpression(charToken) && !startExpression) {
        const expressionChar = this.expressionParser(charToken);
        const expressionWord = this.expressionParser(word);

        appendToken( { text: word, expression: expressionWord } );
        appendToken( { text: charToken, expression: expressionChar } );
        word = "";

      // Process word only
      } else if ((isSeparator(charToken) && !startExpression) || doneExpression) {
        const expressionWord = this.expressionParser(word);

        appendToken( { text: word, expression: expressionWord } );
        word = "";

      } else {
        word += charToken;
      }
    };

    const expression = this.expressionParser(word);
    appendToken({ text: word, expression });
    return list;
  }
}

module.exports = { InputExpressionTokenizer, InputExpressionParser };
