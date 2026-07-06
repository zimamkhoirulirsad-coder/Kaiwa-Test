export type VocabCard = {
  id: string;
  word: string;
  reading: string;
  meaning: string;
  example: string;
  exampleRomaji: string;
  exampleTranslation: string;
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1";
};

export const vocabDeck: VocabCard[] = [
  { id: "v1", word: "水", reading: "みず", meaning: "Water", example: "水をください。", exampleRomaji: "Mizu wo kudasai.", exampleTranslation: "Water, please.", jlpt: "N5" },
  { id: "v2", word: "食べる", reading: "たべる", meaning: "To eat", example: "寿司を食べます。", exampleRomaji: "Sushi wo tabemasu.", exampleTranslation: "I eat sushi.", jlpt: "N5" },
  { id: "v3", word: "行く", reading: "いく", meaning: "To go", example: "学校に行きます。", exampleRomaji: "Gakkou ni ikimasu.", exampleTranslation: "I go to school.", jlpt: "N5" },
  { id: "v4", word: "元気", reading: "げんき", meaning: "Healthy, energetic", example: "今日は元気です。", exampleRomaji: "Kyou wa genki desu.", exampleTranslation: "Today I'm well.", jlpt: "N5" },
  { id: "v5", word: "美味しい", reading: "おいしい", meaning: "Delicious", example: "このラーメンは美味しい。", exampleRomaji: "Kono raamen wa oishii.", exampleTranslation: "This ramen is delicious.", jlpt: "N5" },
  { id: "v6", word: "友達", reading: "ともだち", meaning: "Friend", example: "友達と映画を見ます。", exampleRomaji: "Tomodachi to eiga wo mimasu.", exampleTranslation: "I watch a movie with a friend.", jlpt: "N5" },
  { id: "v7", word: "時間", reading: "じかん", meaning: "Time", example: "時間がありません。", exampleRomaji: "Jikan ga arimasen.", exampleTranslation: "I don't have time.", jlpt: "N5" },
  { id: "v8", word: "勉強", reading: "べんきょう", meaning: "Study", example: "日本語を勉強します。", exampleRomaji: "Nihongo wo benkyou shimasu.", exampleTranslation: "I study Japanese.", jlpt: "N5" },
  { id: "v9", word: "仕事", reading: "しごと", meaning: "Work, job", example: "仕事は忙しいです。", exampleRomaji: "Shigoto wa isogashii desu.", exampleTranslation: "Work is busy.", jlpt: "N4" },
  { id: "v10", word: "難しい", reading: "むずかしい", meaning: "Difficult", example: "漢字は難しい。", exampleRomaji: "Kanji wa muzukashii.", exampleTranslation: "Kanji is difficult.", jlpt: "N5" },
  { id: "v11", word: "旅行", reading: "りょこう", meaning: "Travel, trip", example: "京都へ旅行します。", exampleRomaji: "Kyouto e ryokou shimasu.", exampleTranslation: "I travel to Kyoto.", jlpt: "N4" },
  { id: "v12", word: "頑張る", reading: "がんばる", meaning: "To do one's best", example: "毎日頑張ります。", exampleRomaji: "Mainichi ganbarimasu.", exampleTranslation: "I do my best every day.", jlpt: "N4" },
  { id: "v13", word: "経験", reading: "けいけん", meaning: "Experience", example: "良い経験になりました。", exampleRomaji: "Ii keiken ni narimashita.", exampleTranslation: "It became a good experience.", jlpt: "N3" },
  { id: "v14", word: "説明", reading: "せつめい", meaning: "Explanation", example: "説明してください。", exampleRomaji: "Setsumei shite kudasai.", exampleTranslation: "Please explain.", jlpt: "N3" },
  { id: "v15", word: "遅刻", reading: "ちこく", meaning: "Being late", example: "電車で遅刻しました。", exampleRomaji: "Densha de chikoku shimashita.", exampleTranslation: "I was late due to the train.", jlpt: "N3" },
];
