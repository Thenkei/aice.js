/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NamedEntity = require('../NamedEntity');

class RuleBasedEntity extends NamedEntity {
  constructor(name) {
    super({
      name,
      scope: 'system',
      type: 'rule-based',
    });
  }
}

module.exports = RuleBasedEntity;
