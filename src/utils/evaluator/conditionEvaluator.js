/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const ValueEvaluator = require('./valueEvaluator');

class ConditionEvaluator {
  static evaluate(condition, context) {
    if (condition.type === 'LeftRightExpression') {
      return ConditionEvaluator.leftRightExpressionEvaluator(condition, context);
    }

    if (condition.type === 'UnaryExpression') {
      return ConditionEvaluator.unaryExpressionEvaluator(condition, context);
    }

    throw new Error('ConditionEvaluator.evaluate - Unknown condition type');
  }

  static leftRightExpressionEvaluator(condition, context) {
    let Lvalue = null;
    let Rvalue = null;
    let result;
    if (condition.Lvalue.operande) {
      Lvalue = ConditionEvaluator.evaluate(condition.Lvalue, context);
    }

    if (condition.Rvalue.operande) {
      Rvalue = ConditionEvaluator.evaluate(condition.Lvalue, context);
    }

    if (!Lvalue) {
      Lvalue = ValueEvaluator.evaluateValue(condition.Lvalue, context);
    }

    if (!Rvalue) {
      Rvalue = ValueEvaluator.evaluateValue(condition.Rvalue, context);
    }

    switch (condition.operande) {
      case 'eq':
        result = Lvalue === Rvalue;
        break;

      case 'ne':
        result = Lvalue !== Rvalue;
        break;

      case 'or':
        result = Lvalue || Rvalue;
        break;

      case 'and':
        result = Lvalue && Rvalue;
        break;

      default:
        throw new Error('ConditionEvaluator.leftRightExpressionEvaluator - Unknown condition operande');
    }

    return result;
  }

  static unaryExpressionEvaluator(condition, context) {
    let LRvalue = null;
    let result;
    if (condition.LRvalue.operande) {
      LRvalue = ConditionEvaluator.evaluate(condition.Lvalue, context);
    }

    if (!LRvalue) {
      LRvalue = ValueEvaluator.evaluateValue(condition.Lvalue, context);
    }

    switch (condition.operande) {
      case 'not':
        result = !LRvalue;
        break;

      default:
        throw new Error('ConditionEvaluator.unaryExpressionEvaluator - Unknown condition operande');
    }

    return result;
  }
}

module.exports = ConditionEvaluator;
