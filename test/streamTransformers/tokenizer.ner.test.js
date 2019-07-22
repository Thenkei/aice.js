const chai = require('chai');

const { expect } = chai;

const { NERTokenizer } = require('../../src/streamTransformers');

const { NERManager, SystemEntities } = require('../../src/streamTransformers');

const { EmailRegExpEntity, UrlRegExpEntity } = SystemEntities;

const LANG = 'fr';

describe('NER Tokenizer', () => {
  const ner = new NERManager();
  ner.addNamedEntity(UrlRegExpEntity);
  ner.addNamedEntity(EmailRegExpEntity);
  const nerTokenizer = new NERTokenizer(LANG, ner);

  it('Should tokenize (with NER pipe) - One Token', () => {
    const textToTokenize = 'jeff@opla.ai';
    const tokenized = nerTokenizer.tokenize(textToTokenize);

    expect(tokenized.get(0).value.ner.match).to.equal('jeff@opla.ai');
  });

  it('Should tokenize (with NER pipe) - Multiple Token', () => {
    const textToTokenize = 'My email is jeff@opla.ai';
    const tokenized = nerTokenizer.tokenize(textToTokenize);

    expect(tokenized.get(3).value.ner.match).to.equal('jeff@opla.ai');
  });

  it('Should tokenize (with NER pipe) - Multiple Token Entities', () => {
    const textToTokenize = 'My email adresse is opla@opla.ai and I love my website www.opla.fr';
    const tokenized = nerTokenizer.tokenize(textToTokenize);

    const emailToken = tokenized.get(4);
    expect(emailToken.value.ner.match).to.equal('opla@opla.ai');
    expect(emailToken.value.ner.type).to.equal('regex');
    expect(emailToken.value.ner.name).to.equal('email');

    const websiteToken = tokenized.get(10);
    expect(websiteToken.value.ner.match).to.equal('www.opla.fr');
    expect(websiteToken.value.ner.type).to.equal('regex');
    expect(websiteToken.value.ner.name).to.equal('url');
  });

  it('Should tokenize (with NER pipe) - Multiple Token (text after entity)', () => {
    const textToTokenize = 'My email adresse is opla@opla.ai and I love you';
    const tokenized = nerTokenizer.tokenize(textToTokenize);

    const emailToken = tokenized.get(4);
    expect(emailToken.value.ner.match).to.equal('opla@opla.ai');
    expect(emailToken.value.ner.type).to.equal('regex');
    expect(emailToken.value.ner.name).to.equal('email');
  });

  it('NERTokenizer - Should throw error required constructor parameters', () => {
    expect(() => new NERTokenizer()).to.throw(
      'Invalid NERTokenizer constructor - NamedEntityRecognizer & lang are required',
    );
  });
});
