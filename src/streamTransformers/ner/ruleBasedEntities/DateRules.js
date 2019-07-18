const RuleBasedEntity = require('./RuleBasedEntity');

const ruleMonths = [
  { value: 'Janvier', regex: 'janvier|janv\\.?' },
  { value: 'Fevrier', regex: 'f(é|e)vrier|f(é|e)v\\.?' },
  { value: 'Mars', regex: 'mars|mar\\.?' },
  { value: 'Avril', regex: 'avril|avr\\.?' },
  { value: 'Mai', regex: 'mai' },
  { value: 'Juin', regex: 'juin|jun\\.?' },
  { value: 'Juillet', regex: 'juillet|juil?\\.' },
  { value: 'Aout', regex: 'ao(û|u)t|aou\\.?' },
  { value: 'Septembre', regex: 'septembre|sept?\\.?' },
  { value: 'Octobre', regex: 'octobre|oct\\.?' },
  { value: 'Novembre', regex: 'novembre|nov\\.?' },
  { value: 'Decembre', regex: 'd(é|e)cembre|d(é|e)c\\.?' },
];

const ruleDaysOfWeek = [
  { value: 'Lundi', regex: 'lun\\.?(di)?' },
  { value: 'Mardi', regex: 'mar\\.?(di)?' },
  { value: 'Mercredi', regex: 'mer\\.?(credi)?' },
  { value: 'Jeudi', regex: 'jeu\\.?(di)?' },
  { value: 'Vendredi', regex: 'ven\\.?(dredi)?' },
  { value: 'Samedi', regex: 'sam\\.?(edi)?' },
  { value: 'Dimanche', regex: 'dim\\.?(anche)?' },
];

const ruleDaysExpressions = [
  {
    value: 'demain',
    regex: '(demain)|(le lendemain)',
    resolution: () => {
      const currentDate = new Date();
      return currentDate.setDate(currentDate.getDate() + 1);
    },
  },
  {
    value: 'hier',
    regex: 'hier|la veille',
    resolution: () => {
      const currentDate = new Date();
      return currentDate.setDate(currentDate.getDate() - 1);
    },
  },
  {
    value: "aujourd'hui",
    regex: "(aujourd'? ?hui)|(ce jour)|(dans la journ(é|e)e?)|(en ce moment)",
    resolution: () => {
      const currentDate = new Date();
      return currentDate;
    },
  },
  {
    value: 'après-Demain',
    regex: 'apr(e|è)s[- ]?demain?',
    resolution: () => {
      const currentDate = new Date();
      return currentDate.setDate(currentDate.getDate() + 2);
    },
  },
  {
    value: 'avant-hier',
    regex: 'avant[- ]?hier',
    resolution: () => {
      const currentDate = new Date();
      return currentDate.setDate(currentDate.getDate() - 2);
    },
  },
];

// Look later might use lookForDateMonthYears instead
const ruleDdMmYyyy = [
  {
    value: 'yyyy',
    regex: 'd{4})',
    resolution: yyyy => {
      const date = new Date(`${yyyy}`);
      return date;
    },
  },
  {
    value: 'dd/mm',
    regex: '(3[01]|[12]\\d|0?[1-9])[/-](1[0-2]|0?[1-9])',
    resolution: (dd, mm) => {
      const yyyy = new Date(Date.now()).getFullYear();
      const date = new Date(`${mm}/${dd}/${yyyy}`);
      return date;
    },
  },
  {
    value: 'dd/mm/yyyy',
    regex: '(3[01]|[12]\\d|0?[1-9])[/-](1[0-2]|0?[1-9])[-/](\\d{2,4})',
    resolution: (dd, mm, yyyy) => {
      const date = new Date(`${mm}/${dd}/${yyyy}`);
      return date;
    },
  },
];

class DateEntity extends RuleBasedEntity {
  constructor() {
    super({
      name: 'date',
    });
    // I NEED THE REGEX MASTER
    // Build regex and use resolution fonctions
  }

  /**
   * Extract matched PhoneNumberRuleEntity from utterance.
   * @param {String} lang Language of the utterance.
   * @param {String} utterance Preprocess utterance to be processed.
   * @returns {Entity[]} List of entity that matched a value from an enumeration.
   */
  extract(lang, utterance) {
    const extracted = [];
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
        resolution: typeof this.resolve === 'function' ? this.resolve(v) : v,
      });
      extracted.push(entity);
    }

    return extracted;
  }

  static lookForDateMonthYears(tokens, index) {}
}

module.exports = DateEntity;
