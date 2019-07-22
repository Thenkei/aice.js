const rulesBaseOrdinals = [
  { name: 'premiere', value: 1 },
  { name: 'premier', value: 1 },
  { name: 'deuxieme', value: 2 },
  { name: 'second', value: 2 },
  { name: 'troisieme', value: 3 },
  { name: 'quatrieme', value: 4 },
  { name: 'cinquieme', value: 5 },
  { name: 'sixieme', value: 6 },
  { name: 'septieme', value: 7 },
  { name: 'huitieme', value: 8 },
  { name: 'neuvieme', value: 9 },
  { name: 'dixieme', value: 10 },
  { name: 'onzieme', value: 11 },
  { name: 'douzieme', value: 12 },
  { name: 'treizieme', value: 13 },
  { name: 'quatorzieme', value: 14 },
  { name: 'quinzieme', value: 15 },
  { name: 'seizieme', value: 16 },
];

/*

  name = "ordinals (premier..seizieme)"


  { name = "ordinal (digits)"
  , pattern =
    [ regex "0*(\\d+) ?(ere?|ère|ème|eme|e)"
    ]
  , prod = \case
      (Token RegexMatch (GroupMatch (match:_)):_) -> ordinal <$> parseInt match
      _ -> Nothing
  }
*/
