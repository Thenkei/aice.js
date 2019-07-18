/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

class ValueEvaluator {
  static evaluateValue(value, context) {
    if (value.type === 'VARIABLE') {
      return ValueEvaluator.evaluateContext(value.value, context);
    }

    if (value.type === 'TEXT') {
      return value.value;
    }
    throw new Error('VariableEvaluator.evaluateValue - Unknown value type');
  }

  static evaluateContext(variable, context) {
    return !variable || variable === '' || context[variable];
  }
}

module.exports = ValueEvaluator;
