const chai = require('chai');

const { expect } = chai;

const { NERManager, EnumEntity, SystemEntities } = require('../src/streamTransformers/ner/utteranceBasedNer');

const { EmailRegExpEntity, UrlRegExpEntity, EmojiRegExpEntity } = SystemEntities;

const LANG = 'fr';

describe('EmailRegExpEntity', () => {
  it('Should find a single match for entity email', () => {
    const utterance = 'Mon mail est jeff@example.fr si cela vous convient';
    const result = EmailRegExpEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: 'jeff@example.fr' });
  });
  it('Should find multiple if sentences contains more than one email', () => {
    const utterance = 'Mon mail est jeff@example.fr, mais celui de mon collègue est morgan@example2.de';
    const result = EmailRegExpEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: 'jeff@example.fr' });
    expect(result[1]).to.deep.include({ match: 'morgan@example2.de' });
  });
  it('Should find nothing if no mail is in the utterance - with a twist', () => {
    const utterance = 'Mon mail est jeff@opla';
    const result = EmailRegExpEntity.extract(LANG, utterance);
    expect(result).to.deep.equal([]);
  });
});

describe('EnumEntity', () => {
  const enumEntity = new EnumEntity({
    id: '@size',
    name: 'size',
    scope: 'global',
    enumeration: [
      { key: 'S', values: ['small'] },
      { key: 'M', values: ['medium'] },
      { key: 'L', values: ['large', 'grande'] },
    ],
  });

  it('Should find a single match for entity enum custom', () => {
    const utterance = 'Je veux un tee-shirt de taille medium';
    const result = enumEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: 'medium' });
  });
  it('Should find a multiple match for entity enum custom', () => {
    const utterance = 'Je veux un tee-shirt de taille medium et un en grande taille';
    const result = enumEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: 'medium' });
    expect(result[1]).to.deep.include({ match: 'grande' });
  });
  it('Should find nothing if no enum element is in the utterance', () => {
    const utterance = 'Je veux un tee-shirt de taille moyenne et un en taille énorme';
    const result = enumEntity.extract(LANG, utterance);
    expect(result).to.deep.equal([]);
  });
});

describe('EmojiEntity', () => {
  it('Should find a single match for entity emoji', () => {
    const utterance = "J'aimerais avoir un 😾";
    const result = EmojiRegExpEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: '😾' });
  });
  it('Should find a multiple match for entity emoji', () => {
    const utterance = 'Je veux un 😾 et un 👻';
    const result = EmojiRegExpEntity.extract(LANG, utterance);
    expect(result[0]).to.deep.include({ match: '😾' });
    expect(result[1]).to.deep.include({ match: '👻' });
  });
  it('Should find nothing if no emoji is in the utterance', () => {
    const utterance = 'Je veux rien, laisse moi tranquille';
    const result = EmojiRegExpEntity.extract(LANG, utterance);
    expect(result).to.deep.equal([]);
  });
});

describe('URLRegExpEntity', () => {
  it('Should find a single match for entity email', () => {
    const utterance = 'Mon site est https://www.jeffladiray.com voilà';
    const entities = UrlRegExpEntity.extract(LANG, utterance);
    expect(entities[0]).to.deep.include({ match: 'https://www.jeffladiray.com' });
  });
  it('Should find multiple if sentences contains more than one url', () => {
    const utterance = 'Mon site est https://www.jeffladiray.com et le sien www.morgan.xxx';
    const entities = UrlRegExpEntity.extract(LANG, utterance);
    expect(entities[0]).to.deep.include({ match: 'https://www.jeffladiray.com' });
    expect(entities[1]).to.deep.include({ match: 'www.morgan.xxx' });
  });
  it('Should find nothing if no url is in the utterance - with a twist', () => {
    const utterance = "Il n'y a pas de match dans cette phrase: http://morgan";
    const ner = new NERManager();
    ner.addNamedEntity(UrlRegExpEntity);
    const entities = ner.findEntitiesFromUtterance(LANG, utterance);
    expect(entities).to.deep.equal([]);
  });
});

describe('NERManager', () => {
  it('Should find a match for both email and url', () => {
    const utterance = "C'est un test avec un mail jeff@example.fr et une url https://morgan.corp merci bien";
    const ner = new NERManager();
    ner.addNamedEntity(EmailRegExpEntity);
    ner.addNamedEntity(UrlRegExpEntity);
    const entities = ner.findEntitiesFromUtterance(LANG, utterance);
    expect(entities[0]).to.deep.include({ match: 'jeff@example.fr' });
    expect(entities[1]).to.deep.include({ match: 'https://morgan.corp' });
  });

  it('Should get normalized utterance for email and url', () => {
    const utterance = "C'est un test avec un mail jeff@example.fr et une url https://morgan.corp merci bien";
    const ner = new NERManager();
    ner.addNamedEntity(UrlRegExpEntity);
    ner.addNamedEntity(EmailRegExpEntity);
    const results = ner.normalizeEntityUtterance(LANG, utterance);
    expect(results).to.equal(
      "C'est un test avec un mail @{{system.regex.email}} et une url @{{system.regex.url}} merci bien",
    );
  });

  it('Should get normalized utterance for url and email', () => {
    const utterance = "C'est un test avec un url https://morgan.corp et un mail jeff@example.fr";
    const ner = new NERManager();
    ner.addNamedEntity(UrlRegExpEntity);
    ner.addNamedEntity(EmailRegExpEntity);
    const results = ner.normalizeEntityUtterance(LANG, utterance);
    expect(results).to.equal("C'est un test avec un url @{{system.regex.url}} et un mail @{{system.regex.email}}");
  });

  it('Should get normalized utterance for many entities', () => {
    const utterance =
      "C'est un test 😾 avec un mail jeff@example.fr et une url https://morgan.corp merci bien. Je crois que Jeff Boss est parti voici son numéro 0651382265. Appelle le rapidement. https://underthelimits.fr est un superbe site ! Mon chat a 9 ans dans une semaine.";
    const ner = new NERManager();
    ner.addNamedEntity(UrlRegExpEntity);
    ner.addNamedEntity(EmailRegExpEntity);
    ner.addNamedEntity(EmojiRegExpEntity);
    const results = ner.normalizeEntityUtterance(LANG, utterance);
    expect(results).to.equal(
      "C'est un test @{{system.regex.emoji}} avec un mail @{{system.regex.email}} et une url @{{system.regex.url}} merci bien. Je crois que Jeff Boss est parti voici son numéro 0651382265. Appelle le rapidement. @{{system.regex.url}} est un superbe site ! Mon chat a 9 ans dans une semaine.",
    );
  });

  it('Should not find a match for entity email - SystemEntity Not Added', () => {
    const utterance = 'Mon mail est jeff@example.fr si cela vous convient';
    const ner = new NERManager();
    const entities = ner.findEntitiesFromUtterance(LANG, utterance);
    expect(entities).to.deep.equal([]);
  });

  it('Should only find whitelisted entity email', () => {
    const utterance = "C'est un test avec un mail jeff@example.fr et une url https://morgan.corp merci bien";
    const ner = new NERManager();
    ner.addNamedEntity(UrlRegExpEntity);
    ner.addNamedEntity(EmailRegExpEntity);
    const results = ner.normalizeEntityUtterance(LANG, utterance, [EmailRegExpEntity]);
    expect(results).to.equal(
      "C'est un test avec un mail @{{system.regex.email}} et une url https://morgan.corp merci bien",
    );
  });
});
