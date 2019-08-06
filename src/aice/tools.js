/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const { OutputExpressionTokenizer } = require('../streamTransformers/expression');
const { Renderer } = require('../utils/');

const outputExpressionTokenizer = new OutputExpressionTokenizer();

class Tools {
  /**
   * Evaluate nlxSyntax using the context
   * Replace the NLXSyntax by its value in the context
   * @param {String} nlxSyntax A string that contains NLXSyntax.
   * @param {Object} context The context containing the variables.
   * @return {reponse} A string with the variables replaced by there values
   */
  static evaluateFromContext(nlxSyntax, context) {
    const tokenizedNlxSyntax = outputExpressionTokenizer.tokenize(nlxSyntax);
    return Renderer.render(tokenizedNlxSyntax, context);
  }
}

module.exports = Tools;
