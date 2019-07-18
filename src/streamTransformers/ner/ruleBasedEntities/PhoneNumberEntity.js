const RuleBasedEntity = require('./RuleBasedEntity');
const Entity = require('../Entity');

class PhoneNumberEntity extends RuleBasedEntity {
  constructor() {
    super({
      name: 'phonenumber',
    });
  }

  /**
   * Extract matched PhoneNumberRuleEntity from utterance.
   * @param {String} lang Language of the utterance.
   * @param {String} utterance Preprocess utterance to be processed.
   * @returns {Entity[]} List of entity that matched a value from an enumeration.
   */
  extract(lang, utterance) {
    const extracted = [];
    switch (lang) {
      case 'fr': {
        const regex = /(?:(?:\+|00)33[\s.-]{0,3}(?:\(0\)[\s.-]{0,3})?|0)[1-9](?:(?:[\s.-]?\d{2}){4}|\d{2}(?:[\s.-]?\d{3}){2})/g;
        let match;
        // eslint-disable-next-line no-cond-assign
        while ((match = regex.exec(utterance)) !== null) {
          const v = match[0];
          const entity = new Entity({
            match: v,
            confidence: 1,
            type: this.type,
            name: this.name,
            start: match.index,
            end: match.index + v.length,
            resolution: v,
          });
          extracted.push(entity);
        }
        break;
      }
      default:
        break;
    }
    return extracted;
  }
}

module.exports = PhoneNumberEntity;
