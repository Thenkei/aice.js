/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const Entity = require('./Entity');
const EnumEntity = require('./EnumEntity');
const NamedEntity = require('./NamedEntity');
const NERManager = require('./NERManager');
const RegExpEntity = require('./RegExpEntity');
const RuleBasedEntities = require('./RuleBasedEntities');
const SystemEntities = require('./SystemEntities');

module.exports = {
  Entity,
  EnumEntity,
  NamedEntity,
  NERManager,
  RegExpEntity,
  RuleBasedEntities,
  SystemEntities,
};
