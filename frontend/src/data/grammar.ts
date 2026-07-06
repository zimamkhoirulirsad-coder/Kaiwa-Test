export type GrammarPoint = {
  id: string;
  title: string;
  jlpt: "N5" | "N4" | "N3" | "N2" | "N1";
  formula: string;
  meaning: string;
  examples: { ja: string; romaji: string; en: string }[];
  commonMistake: string;
};

export const grammarPoints: GrammarPoint[] = [
  {
    id: "g1",
    title: "は particle (topic marker)",
    jlpt: "N5",
    formula: "[Noun] は [Comment].",
    meaning: "Marks the topic of the sentence — what you're talking about.",
    examples: [
      { ja: "私は学生です。", romaji: "Watashi wa gakusei desu.", en: "I am a student." },
      { ja: "これはペンです。", romaji: "Kore wa pen desu.", en: "This is a pen." },
    ],
    commonMistake: "Do not confuse は with が. は introduces the known topic; が marks the subject with new info.",
  },
  {
    id: "g2",
    title: "です・ます polite form",
    jlpt: "N5",
    formula: "[Noun/Adj] です / [Verb-stem] ます",
    meaning: "Basic polite ending. Use with strangers, teachers, colleagues.",
    examples: [
      { ja: "今日は寒いです。", romaji: "Kyou wa samui desu.", en: "It's cold today." },
      { ja: "毎日勉強します。", romaji: "Mainichi benkyou shimasu.", en: "I study every day." },
    ],
    commonMistake: "Don't attach です to a plain verb (× 食べるです). Use ます form directly.",
  },
  {
    id: "g3",
    title: "を particle (direct object)",
    jlpt: "N5",
    formula: "[Object] を [Verb]",
    meaning: "Marks the direct object of an action verb.",
    examples: [
      { ja: "水を飲みます。", romaji: "Mizu wo nomimasu.", en: "I drink water." },
      { ja: "本を読みます。", romaji: "Hon wo yomimasu.", en: "I read a book." },
    ],
    commonMistake: "Pronounced 'o', not 'wo'. And never use with intransitive verbs like ある.",
  },
  {
    id: "g4",
    title: "て-form (connector)",
    jlpt: "N5",
    formula: "Verb + て → connect actions / soft request",
    meaning: "Connects verbs, makes soft requests (〜てください), forms progressive (〜ている).",
    examples: [
      { ja: "起きて、朝ごはんを食べます。", romaji: "Okite, asagohan wo tabemasu.", en: "I get up and eat breakfast." },
      { ja: "見てください。", romaji: "Mite kudasai.", en: "Please look." },
    ],
    commonMistake: "Learners forget the sound changes: 買う → 買って (not 買いて).",
  },
  {
    id: "g5",
    title: "〜たい (want to do)",
    jlpt: "N5",
    formula: "Verb-stem + たい",
    meaning: "Expresses the speaker's desire to do an action.",
    examples: [
      { ja: "日本に行きたいです。", romaji: "Nihon ni ikitai desu.", en: "I want to go to Japan." },
      { ja: "寿司が食べたい。", romaji: "Sushi ga tabetai.", en: "I want to eat sushi." },
    ],
    commonMistake: "〜たい is only for I/you. For 3rd person, use 〜たがっている.",
  },
  {
    id: "g6",
    title: "〜んです / 〜のです",
    jlpt: "N4",
    formula: "Plain form + んです",
    meaning: "Adds emphasis, explanation, or seeks explanation. Softens the tone.",
    examples: [
      { ja: "遅れたんです。", romaji: "Okureta n desu.", en: "(The reason is) I was late." },
      { ja: "どこに行くんですか？", romaji: "Doko ni iku n desu ka?", en: "Where are you going (I'm curious)?" },
    ],
    commonMistake: "Overusing it in every sentence sounds pushy. Use only when explaining.",
  },
  {
    id: "g7",
    title: "〜ば conditional",
    jlpt: "N3",
    formula: "Verb-ば / い-adj → ければ / Noun+なら",
    meaning: "Hypothetical 'if' — usually about general truths or requirements.",
    examples: [
      { ja: "勉強すれば、上手になります。", romaji: "Benkyou sureba, jouzu ni narimasu.", en: "If you study, you'll become good." },
      { ja: "安ければ買います。", romaji: "Yasukereba kaimasu.", en: "If it's cheap, I'll buy it." },
    ],
    commonMistake: "Don't use 〜ば for volitional invitations (×行けば行きましょう).",
  },
  {
    id: "g8",
    title: "受け身 (passive)",
    jlpt: "N3",
    formula: "Verb → られる form",
    meaning: "Someone/something has an action done to them. Often has a nuance of suffering.",
    examples: [
      { ja: "先生に褒められました。", romaji: "Sensei ni homeraremashita.", en: "I was praised by the teacher." },
      { ja: "雨に降られた。", romaji: "Ame ni furareta.", en: "I got rained on (bothered)." },
    ],
    commonMistake: "Don't over-use passive; Japanese prefers active + subject drop when possible.",
  },
];
