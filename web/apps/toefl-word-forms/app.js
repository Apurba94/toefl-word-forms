/* Word Form Trainer: recognise parts of speech from endings and choose the right form. */
(function () {
  'use strict';
  const ENDINGS = [['noun', ['-tion', '-sion', '-ment', '-ity', '-ness', '-ance', '-ence', '-ism', '-ship']], ['verb', ['-ize', '-ify', '-ate', '-en']], ['adjective', ['-ous', '-ive', '-al', '-ful', '-able', '-ible', '-ic', '-ent', '-ant']], ['adverb', ['-ly']]];
  const PARTS = { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb' };
  // "Which part of speech is 'decisive'?" from the families, so every answer is known.
  const posItems = (fams, n, seed) => {
    const r = SK.rng(seed), pool = [];
    for (const f of fams) for (const k of Object.keys(PARTS)) if (f[k] && !Object.keys(PARTS).some((o) => o !== k && f[o] === f[k])) pool.push([f[k], PARTS[k], f]);
    return SK.sample(r, pool, n).map(([w, pos, f]) => ({ id: 'pos-' + w, type: 'single', topic: 'Part of speech', stem: 'What part of speech is **' + w + '**?', choices: ['noun', 'verb', 'adjective', 'adverb'], answer: ['noun', 'verb', 'adjective', 'adverb'].indexOf(pos), fixedOrder: true, explanation: w + ' is a ' + pos + '. Its family: ' + Object.keys(PARTS).filter((k) => f[k]).map((k) => f[k]).join(', ') + '.' }));
  };
  const App = {
    about: 'Complete the Words and the writing tasks reward knowing word forms: is the missing word decision, decide, decisive or decisively? This app teaches the endings that signal each part of speech and drills them on 60 word families.',
    how: ['Learn the endings in **Endings**.', 'Name the part of speech in **Part of speech**.', 'Choose the right form in the GRE Word Family Builder, which uses the same families.'],
    tabs: [
      { id: 'endings', label: 'Endings', render(el) { el.appendChild(SK.card('Endings and parts of speech', SK.table(['Part of speech', 'Common endings'], ENDINGS.map(([p, e]) => [p, e.join(', ')]), false), SK.note('Endings are a strong hint, not a rule: friendly ends in -ly but is an adjective.'))); } },
      { id: 'pos', label: 'Part of speech', render(el, ctx) { SK.quizStarter(el, { title: 'Part of speech', sizes: [10, 20, 40], make: (t, n, s) => posItems(ctx.data.word_forms, n, s), seconds: (n) => n * 10 }); } },
    ],
    posItems,
    checks: { 'part-of-speech questions are valid and never ambiguous': (data, assert) => {
      for (let s = 1; s < 10; s++) for (const it of posItems(data.word_forms, 40, s)) assert.deepEqual(SK.validateItem(it), []);
      assert.ok(!posItems(data.word_forms, 500, 1).some((it) => it.stem.includes('**benefit**')), 'benefit is both noun and verb, so it is left out');
    } },
  };
  if (typeof module !== 'undefined' && module.exports) module.exports = App; else SK.start(App);
})();
