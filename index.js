
// const DoubleLinkedList = require('./doubleLinkedList');
/*
// Usages - to be removed
const list = new DoubleLinkedList();
list.append("red");
list.append("orange");
list.append("green");
list.append("yellow");

console.log(JSON.stringify(list));
    
// get the second item in the list
console.log(list.get(1));

// print out all items
for (const color of list) {
    console.log(color);
}

// convert to an array
const array1 = [...list.values()];
const array2 = [...list];

console.log(JSON.stringify(array1));
console.log(JSON.stringify(array2));

console.log(list);

list.append("blue");
list.append("gray");
console.log(...list);
*/

/*const SimpleTokenizer = require('./simpleTokenizer');
const ComplexeTokenizer = require('./complexeTokenizer');

const tokenizedText = new SimpleTokenizer().tokenize(' On va découper en tokens un texte français, en français !!! ')
//console.log([...tokenizedText.values()]);

for(token of tokenizedText)  {
  console.log(token.value);
  for(characters of token.value)  {
    console.log(characters); // Truc à la con mais bon pour faire des traitements COOL
  }
}

const tokenizer = new ComplexeTokenizer();

const cTokenizedText = tokenizer.tokenize('On va  découper   en tokens  un second texte français   ')
console.log([...cTokenizedText.values()]);

const dTokenizedText = tokenizer.tokenize('   Nous   allons  tokeniser,  ce dernier,texte français   ')
console.log([...dTokenizedText]);
*/

const OpenNLXSyntaxAdapter = require('./openNLXSyntaxAdapter');

const documentOldNLX = {
  "name": "OplaSite",
  "welcome": "Bienvenue, je suis Alfred, votre robot majordome. Pour me solliciter, tapez OK",
  "intents": [
    {
      "id": "VkoiTNzXDH1JC7W4SdiNCQEiobCxAaMy6Z8sqg5VdkiVyIW6",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "Ok",
      "input": [
        "Hello",
        "ok"
      ],
      "output": [
        "En préambule de notre conversation, vois disposez de droits sur la [confidentialité de vos données personnelles](https://opla.fr/confidentialite-de-vos-donnees)<br/><br/>[Imgur](https://imgur.com/i7YVWOT.png)<br/>Bonjour. Comment puis-je vous servir?<br/><br/><button>M'en dire plus sur OPLA</button><button>Contacter OPLA</button><<action=premiereetape>>"
      ],
      "order": 1
    },
    {
      "id": "OCu6fMYR39muzkOdcbuqmzj3Kzul0XUNjBVExE2OHDflR2cz",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "M'en dire plus sur OPLA",
      "input": [
        "M'en dire plus sur OPLA"
      ],
      "output": [
        {
          "type": "condition",
          "children": [
            {
              "name": "action",
              "value": "premiereetape",
              "text": "Très bien. Quel thème souhaitez-vous consulter?<br/><br/><button>La marque OPLA</button><button>La solution OPLA</button><<action=deuxiemeetape>>",
              "type": "item"
            }
          ]
        }
      ],
      "order": 2
    },
    {
      "id": "OxFf1dg8B64Bs5vXAIFjuP49Dsjz7oQaf0VeaZucgQPCWgEk",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "La marque OPLA",
      "input": [
        "La marque OPLA"
      ],
      "output": [
        {
          "type": "condition",
          "children": [
            {
              "name": "action",
              "value": "deuxiemeetape",
              "text": "Opla est une marque de la startup CWB, éditrice de logiciels.<br/>CWB a été créée en 2015 par Marie Dorange et Mik Bry. Aujourd'hui, l'équipe est pluridisciplinaire et constituée de 16 personnes.<br/><br/><button>Lire la suite</button><button>Nous contacter</button><<action=troisiemeetape>>",
              "type": "item"
            }
          ]
        }
      ],
      "order": 3
    },
    {
      "id": "gtMeX3WrZoLqUxwLPGGM82mTnl64eLzOAeSjcXLX7g5SmaiE",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "Lire la suite",
      "input": [
        "Lire la suite",
        "Un autre exemple"
      ],
      "output": [
        {
          "type": "condition",
          "children": [
            {
              "name": "action",
              "value": "troisiemeetape",
              "text": "Après 3 ans de R&D dans les assistants virtuels et l'Intelligence Artificiell, je suis fier de vous présenter Opla, le logiciel de création d'asistants conversationnels.<br/><br/><button>Lire la suite</button><button>Nous contacter</button><<action=quatriemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "quatriemeetape",
              "text": "\"La combinaison de l'homme et de l'intelligence artificielle est plus performante que l'homme ou l'intelligence artificielle tout seuls\" Cédric Villani<br/><br/>Opla accompagne les entreprises dans leur transformation digitale en articulant son intelligence artificielle autour de l'humain.<br/><br/><button>Lire la suite</button><button>Nous contacter</button><<action=cinquiemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "cinquiemeetape",
              "text": "Ayant pour but d'aider les entreprises, Opla vous assiste à la fois<br/><br/>● en interne pour améliorer votre productivité<br/>● en externe pour faciliter les démarches de vos clients et de vos partenaires professionnels<br/><button>La solution OPLA</button><button>Nous contacter</button><<action=deuxiemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "sixiemeetape",
              "text": "Les assistants Opla simplifient les échanges en synthétisant les informations clés d'un large volume de données.<br/><br/>[Imgur](https://imgur.com/JQOnTfZ.gif)<br/><br/><button>Lire la suite</button><button>Nous contacter</button><<action=septiemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "septiemeetape",
              "text": "Les avantages de l'outil Opla :<br/>● Gain de temps<br/>● Simple, réactif et personnalisable<br/>● Indépendant des GAFA et en Open source<br/>● Cellule R&D interne en NLP<br/>● Disponible sur le cloud ou sur vos serveurs<br/><br/><button>Lire la suite</button><button>Nous contacter</button><<action=huitiemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "huitiemeetape",
              "text": "Un exemple d’utilisation en interne :<br/>Vous êtes responsable de production et vous n’avez pas le temps de regrouper vos chiffres pour votre prochaine réunion ?<br/>Le chatbot Opla vous aide à établir votre tableau de bord souhaité. Plus besoin de calculer vos statistiques, gagnez du temps avec Opla  😎<br/><br/><button>Un autre exemple</button><button>Nous contacter</button><<action=neuviemeetape>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "neuviemeetape",
              "text": "Exemple externe : <br/><br/>Votre client recherche des informations sur vos produits depuis votre site internet. Vous souhaitez activer et accompagner son acte d’achat ?<br/><br/>Le chatbot Opla regroupe les informations produit sur une seule et même interface interactive pour accompagner votre client vers son achat. Fini la navigation interminable et vivez l’expérience Opla!<br/><br/><button>Nous contacter</button><<action=contact>>",
              "type": "item"
            }
          ]
        }
      ],
      "order": 4
    },
    {
      "id": "ixWqL4XesrB5avLNgdzuNcVxlaPLWUyA5Sm9jXIdp2hrAuyY",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "La solution OPLA",
      "input": [
        "La solution OPLA"
      ],
      "output": [
        "La solution Opla vous permet de construire un assistant conversationnel pour automatiser des tâches répétitives et complexes. <br/><br/>[Imgur](https://imgur.com/jPL4A1b.png)<br/><button>Lire la suite</button><button>Nous contacter</button><<action=sixiemeetape>>"
      ],
      "order": 5
    },
    {
      "id": "RbLmEdRMhQ9xdyfYThydYJQugEAlFGHFR7pzpz3ogXvzowok",
      "botId": "9VzdJKtKX8QaukoD93hGkeVun3eaAxKjB23GcQoNNbf2EGKd",
      "name": "Contacter Opla/Nous contacter",
      "input": [
        "Contacter Opla",
        "Nous contacter"
      ],
      "output": [
        {
          "type": "condition",
          "children": [
            {
              "name": "action",
              "value": "premiereetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<<action=stockagemail>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "deuxiemeetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<<action=stockagemail>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "troisiemeetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<<action=stockagemail>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "quatriemeetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<<action=stockagemail>>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "cinquiemeetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<button>action=stockagemail</button>",
              "type": "item"
            },
            {
              "name": "action",
              "value": "sixiemeetape",
              "text": "Merci pour votre confiance.<br/><br/>Dans le cas d'un échange au plus proche de votre besoin, pourriez-vous me communiquer une adresse mail pour vous recontacter?<<action=stockagemail>>",
              "type": "item"
            }
          ]
        }
      ],
      "order": 6
    }
  ]
};

// const fs = require('fs');

// const json = JSON.stringify(OpenNLXSyntaxAdapter(documentOldNLX));

// fs.writeFile('oplaWebSite.json', json, 'utf8', (err) => {
//   if (err) throw err;
//   console.log('complete');
// });

// console.log(OpenNLXSyntaxAdapter(documentOldNLX));

/*
// TODO TESTS
const callableText = 'Je suis un text suivi d\'un ws qui retourne un text {{ws.call( blbl, `{$namevar}, are we good`, variable, $variable)}} {{mavar}}';

console.log(parseAdaptInlineSyntax(callableText));

const oldJsonOutputs = [
  "I'm not a condition",
  {
  "type": "condition",
  "children": [
    {
      "name": "action",
      "value": "aaaa",
      "text": "aaaaa",
      "type": "item"
    },
    {
      "name": "action",
      "value": "bbbb",
      "text": "bbbbb",
      "type": "item"
    }
  ]
}];

*/

// const Comparator = require('./comparator');

// const ComplexeTokenizer = require('./complexeTokenizer');
// const { InputExpressionTokenizer } = require('./inputExpressionTokenizer');

// const tokenizedA = new ComplexeTokenizer().tokenize(' Am I equal to the same sentence ? ');
// const tokenizedB = new ComplexeTokenizer().tokenize('  Am I equal to  the same  sentence ? ');

// console.log([...tokenizedB.values()]);

// console.log(Comparator.compare(tokenizedA, tokenizedA));
// console.log(Comparator.compare(tokenizedA, tokenizedB));

// const tokenizedU = new ComplexeTokenizer().tokenize('Hello ! My name is morgan');
// const tokenizedI = new InputExpressionTokenizer().tokenizeInput('* My,,, name is {{name=*}}');
// console.log([...tokenizedI.values()]);

// const tokenizedI2 = new InputExpressionTokenizer().tokenizeInput('*My,,,@name is {{name=*}}');
// console.log([...tokenizedI2.values()]);
// //console.log(Comparator.compare(tokenizedI, tokenizedU));


// const { InputExpressionParser } = require('./inputExpressionTokenizer');


// console.log(InputExpressionParser.parseInputFromTextToken('*'));
// console.log(InputExpressionParser.parseInputFromTextToken('{{varName=*}}'));
// console.log(InputExpressionParser.parseInputFromTextToken('@email'));
// console.log(InputExpressionParser.parseInputFromTextToken('{{varName=@email}}'));

const { OutputExpressionTokenizer } = require('./outputExpressionTokenizer');

const tokenizedO = new OutputExpressionTokenizer().tokenize('La réponse est : {{varName}} {{var2=any}}');
console.log([...tokenizedO.values()]);

const InputExpressionTokenizer = require('./inputExpressionTokenizer');
const tokenizedI = new InputExpressionTokenizer().tokenize('* My,,, name is {{name=@name}}');
console.log([...tokenizedI.values()]);
