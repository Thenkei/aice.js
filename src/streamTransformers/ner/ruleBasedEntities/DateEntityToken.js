/* eslint-disable radix */
const RuleBasedEntity = require('./RuleBasedEntity');
const Entity = require('../Entity');

class DateEntityToken extends RuleBasedEntity {
  constructor() {
    super({
      name: 'date',
    });
  }

  /**
   * Extract matched PhoneNumberRuleEntity from utterance.
   * @param {String} lang Language of the utterance.
   * @param {String} tokenizeUtterance Preprocess utterance to be processed.
   * @returns {Entity[]} List of entity that matched a value from an enumeration.
   */
  // eslint-disable-next-line class-methods-use-this
  extract(lang, tokenizeUtterance) {
    const extracted = [];

    // TODO Temporary
    const tokens = tokenizeUtterance.split(' ');
    let index = 0;
    while (index < tokens.length) {
      // Is this token a date : DayMonthYear ?
      let res = DateEntityToken.lookForDateMonthYears(tokens, index);
      ({ index } = res);

      // Is this token an expression : eg: Tomorrow, next week ...
      if (!res.done) {
        res = DateEntityToken.lookForDateMonthYears(tokens, index);
        ({ index } = res);
      }

      if (res.done) {
        const entity = new Entity({
          match: tokens[res.index],
          confidence: 1,
          type: this.type,
          name: this.name,
          start: res.index,
          end: res.index + tokens[res.index].length,
          resolution: res.date,
        });
        extracted.push(entity);
      }
    }
    return extracted;
  }

  static lookForDateMonthYears(tokens, index) {
    const token = tokens[index];
    const result = {};
    if (Number.isInteger(parseInt(token[0]))) {
      let ddmmyyyy = token.split('/');
      if (ddmmyyyy === token) {
        ddmmyyyy = token.split('-');
      }

      const month = index + 1 < tokens.length && DateEntityToken.matchMonth(tokens[index + 1]);
      if (ddmmyyyy === token && month) {
        // token is a month eg. 03 mars
        result.day = parseInt(token);
        result.month = month;
        const year = index + 2 < tokens.length && parseInt(tokens[index + 2]);
        if (Number.isInteger(year)) {
          result.year = year;
        }
      } else {
        // token matches a date pattern like 03/01/2015, 03-01-2015, 03/01, 03-01
        [result.day, result.month] = ddmmyyyy;
        if (ddmmyyyy.length === 3) {
          [, , result.year] = ddmmyyyy;
        }
      }
    }

    if (result.day) {
      const thisYear = new Date(Date.now()).getFullYear();
      const date = new Date(`${result.month}/${result.day}/${result.year ? result.year : thisYear}`);
      return { index, date, done: true };
    }
    return { index, date: null, done: false };
  }
}

module.exports = DateEntityToken;
