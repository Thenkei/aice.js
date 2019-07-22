const rulesBaseNumbers = [
  { name: 'zero', value: 0 },
  { name: 'un', value: 1 },
  { name: 'une', value: 1 },
  { name: 'deux', value: 2 },
  { name: 'trois', value: 3 },
  { name: 'quatre', value: 4 },
  { name: 'cinq', value: 5 },
  { name: 'six', value: 6 },
  { name: 'sept', value: 7 },
  { name: 'huit', value: 8 },
  { name: 'neuf', value: 9 },
  { name: 'dix', value: 10 },
  { name: 'onze', value: 11 },
  { name: 'douze', value: 12 },
  { name: 'treize', value: 13 },
  { name: 'quatorze', value: 14 },
  { name: 'quinze', value: 15 },
  { name: 'seize', value: 16 },
];

const rulesDecade = [
  { name: 'vingt', value: 20 },
  { name: 'trente', value: 30 },
  { name: 'quarante', value: 40 },
  { name: 'cinquante', value: 50 },
  { name: 'soixante', value: 60 },
];

const rulesPowerOfTen = [
  { name: 'cent', value: 100 },
  { name: 'mille', value: 1000 },
  { name: 'million', value: 1000000 },
  { name: 'milliard', value: 1000000000 },
];

// quatre vingt trois 'compose by multiplication'

/*
  { name = "numbers 21 31 41 51"
  , pattern =
    [ oneOf [20, 50, 40, 30]
    , regex "-?et-?"
    , numberWith TNumeral.value (== 1)
    ]
    
{ name = "numbers 22..29 32..39 .. 52..59"
  , pattern =
    [ oneOf [20, 50, 40, 30]
    , regex "[\\s\\-]+"
    , numberBetween 2 10
    ]


    { name = "numbers 81"
  , pattern =
    [ numberWith TNumeral.value (== 80)
    , numberWith TNumeral.value (== 1)
    ]
  , prod = \_ -> integer 81


{ name = "decimal number"
  , pattern =
    [ regex "(\\d*,\\d+)"
    ]


      { name = "numbers 62..69 .. 92..99"
  , pattern =
    [ oneOf [60, 80]
    , regex "[\\s\\-]+"
    , numberBetween 2 20
    ]


    name = "number (17..19)"
  , pattern =
    [ numberWith TNumeral.value (== 10)
    , regex "[\\s\\-]+"
    , numberBetween 7 10
    ]


    { name = "numbers 61 71"
  , pattern =
    [ numberWith TNumeral.value (== 60)
    , regex "-?et-?"
    , oneOf [1, 11]
    ]
  , prod = \tokens -> case tokens of
      (Token Numeral NumeralData{TNumeral.value = v1}:
       _:
       Token Numeral NumeralData{TNumeral.value = v2}:
       _) -> double $ v1 + v2
      _ -> Nothing
  }


  ruleNumeralsSuffixesKMG = Rule
  { name = "numbers suffixes (K, M, G)"
  , pattern =
    [ dimension Numeral
    , regex "([kmg])(?=[\\W$€¢£]|$)"
    ]
  , prod = \tokens -> case tokens of
      (Token Numeral NumeralData{TNumeral.value = v}:
       Token RegexMatch (GroupMatch (match:_)):
       _) -> case Text.toLower match of
         "k" -> double $ v * 1e3
         "m" -> double $ v * 1e6
         "g" -> double $ v * 1e9
         _   -> Nothing
      _ -> Nothing
  }

  ruleNumeral4 = Rule
  { name = "number 80"
  , pattern =
    [ regex "quatre"
    , regex "vingts?"
    ]
  , prod = \_ -> integer 80
  }
*/
