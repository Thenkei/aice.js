/**
 * Copyright (c) 2015-present, CWB SAS
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

const NamedEntity = require('./NamedEntity');
const Entity = require('./Entity');

class RegExpEntity extends NamedEntity {
  constructor({ name, scope, regex }) {
    if (!regex) {
      throw new Error('Invalid Entity constructor - Missing regex');
    }
    super({
      name,
      scope,
      type: 'regex',
    });
    this.addParameter({ regex });
  }

  getRegExp() {
    return new RegExp(this.getParameter('regex'));
  }

  /**
   * Extract matched RegExp from utterance.
   * @param {String} lang Language of the utterance.
   * @param {String} utterance Utterance to be processed.
   * @returns {Entity[]} List of entity that matched RegExp.
   */
  extract(lang, utterance) {
    const regex = this.getRegExp();
    const extracted = [];
    let match;
    // eslint-disable-next-line no-cond-assign
    while ((match = regex.exec(utterance)) !== null) {
      const entity = new Entity({
        match: match[0],
        confidence: 1,
        scope: this.scope,
        type: this.type,
        name: this.name,
        index: match.index,
      });
      extracted.push(entity);
    }
    return extracted;
  }
}

module.exports = RegExpEntity;