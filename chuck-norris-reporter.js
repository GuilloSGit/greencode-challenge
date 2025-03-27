// Chuck Norris Jest Reporter

const chuckNorrisJokes = [
  "Chuck Norris can test code just by looking at it.",
  "Chuck Norris doesn't need tests. The code fixes itself out of fear.",
  "Chuck Norris' tests don't run. They intimidate the bugs until they fix themselves.",
  "When Chuck Norris writes tests, bugs test themselves.",
  "Chuck Norris doesn't debug. He just stares at the console until it confesses.",
  "Chuck Norris's code doesn't have race conditions. The threads are too afraid to get in his way.",
  "Chuck Norris doesn't need to use breakpoints when debugging. His code stops itself when he glares at it.",
  "Chuck Norris doesn't need error handling, because errors are too afraid to occur in his code.",
  "Chuck Norris can compile a program just by staring at the source code.",
  "Chuck Norris can delete the Recycle Bin.",
  "Chuck Norris can access the database FROM the UI layer."
];

class ChuckNorrisReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig;
    this._options = options;
  }

  onRunComplete(contexts, results) {
    const joke = chuckNorrisJokes[Math.floor(Math.random() * chuckNorrisJokes.length)];
    
    console.log('\n');
    console.log('*'.repeat(80));
    console.log('\n🥋 CHUCK NORRIS SAYS: ' + joke);
    console.log('\n' + '*'.repeat(80));
  }
}

module.exports = ChuckNorrisReporter;
