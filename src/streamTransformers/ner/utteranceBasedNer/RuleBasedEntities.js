/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NamedEntity = require('./NamedEntity');

class RuleEntity extends NamedEntity {
  constructor(name) {
    super({
      name,
      scope: 'system',
      type: 'rule-based',
    });
  }
}

class PhoneNumberEntity extends RuleEntity {
  constructor() {
    super({
      name: 'phonenumber',
    });
  }

  /**
   * Extract matched PhoneNumberRuleEntity from utterance.
   * @param {String} lang Language of the utterance.
   * @param {String} tokenizeUtterance Preprocess utterance to be processed.
   * @returns {Entity[]} List of entity that matched a value from an enumeration.
   */
  extract(/* lang, tokenizeUtterance */) {
    const extracted = [];
    this.todo = true;
    /*
    Need a preprocess -> tokenize utterance & trim

    forEachToken
    // located

    if ((!Number.isNaN(num)) &&
    ((value[0] === "0" && value.length === 10) ||
    (((value[0] === "3" && value[1] === "3") || token.raw[0] === "+") && value.length > 10))) {
      const entity = new Entity({
        match: value,
        row: value,
        confidence: 1,
        type: this.type,
        name: this.name,
        index: located,
        scope: this.scope,
      });
      extracted.push(entity);
    } */
    return extracted;
  }
}

module.exports = PhoneNumberEntity;
