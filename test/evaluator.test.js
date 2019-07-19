const chai = require('chai');

const { expect } = chai;

const { ConditionEvaluator, ValueEvaluator } = require('../src/utils/');

// TEST ConditionEvaluator
describe('ConditionEvaluator', () => {
  it('Simple condition equals', () => {
    const condition = { type: 'LeftRightExpression', operande: 'eq', Lvalue: 'text', Rvalue: 'text' };
    const result = ConditionEvaluator.evaluate(condition, {});
    expect(result).to.equal(true);
  });

  it('Simple condition not equals', () => {
    const condition = { type: 'LeftRightExpression', operande: 'ne', Lvalue: 'text', Rvalue: 'text' };
    const result = ConditionEvaluator.evaluate(condition, {});
    expect(result).to.equal(false);
  });

  it('Simple condition or', () => {
    const condition = { type: 'LeftRightExpression', operande: 'or', Lvalue: false, Rvalue: true };
    const result = ConditionEvaluator.evaluate(condition, {});
    expect(result).to.equal(true);
  });

  it('Simple condition and', () => {
    const condition = { type: 'LeftRightExpression', operande: 'and', Lvalue: true, Rvalue: true };
    const result = ConditionEvaluator.evaluate(condition, {});
    expect(result).to.equal(true);
  });

  it('Complexe condition equals', () => {
    const context = { var1: 'something', var2: 'something' };
    const condition = {
      type: 'LeftRightExpression',
      operande: 'eq',
      Lvalue: { type: 'VARIABLE', value: 'var1' },
      Rvalue: { type: 'VARIABLE', value: 'var2' },
    };
    const result = ConditionEvaluator.evaluate(condition, context);
    expect(result).to.equal(true);
  });

  it("Shouldn't evaluate condition no type error", () => {
    const condition = { Lvalue: 'text', Rvalue: 'text' };

    expect(() => ConditionEvaluator.evaluate(condition, {})).to.throw(
      'ConditionEvaluator.evaluate - Unknown condition type',
    );
  });

  it("Shouldn't evaluate condition no operande error", () => {
    const condition = { type: 'LeftRightExpression', Lvalue: 'text', Rvalue: 'text' };

    expect(() => ConditionEvaluator.evaluate(condition, {})).to.throw(
      'ConditionEvaluator.leftRightExpressionEvaluator - Unknown condition operande',
    );
  });
});

// TEST ValueEvaluator
describe('ValueEvaluator', () => {
  it('Should evaluate value type VARIABLE', () => {
    const value = { type: 'VARIABLE', value: 'varName' };
    const result = ValueEvaluator.evaluateValue(value, { varName: 'someText' });

    expect(result).to.equal('someText');
  });

  it('Should evaluate direct value - String', () => {
    const value = 'text';
    expect(ValueEvaluator.evaluateValue(value, {})).to.equal('text');
  });

  it('Should evaluate direct value - Integer', () => {
    const value = 5;
    expect(ValueEvaluator.evaluateValue(value, {})).to.equal(5);
  });

  it("Shouldn't evaluate object with no type", () => {
    const value = { value: 5 };
    expect(() => ValueEvaluator.evaluateValue(value, {})).to.throw(
      'VariableEvaluator.evaluateValue - Unknown value type',
    );
  });
});
