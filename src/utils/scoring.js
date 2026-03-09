export const initScores = () => ({
  Harry: 0, Hermione: 0, Ron: 0, Luna: 0, Neville: 0,
  Dumbledore: 0, Snape: 0, Draco: 0, Ginny: 0, Sirius: 0
});

export const calculateResult = (selectedAnswers) => {
  const totals = initScores();
  selectedAnswers.forEach(answer => {
    Object.entries(answer.scores).forEach(([char, pts]) => {
      totals[char] += pts;
    });
  });

  const maxScore = Math.max(...Object.values(totals));
  const tied = Object.keys(totals).filter(k => totals[k] === maxScore);

  if (tied.length === 1) return tied[0];

  // Tie-breaker: last 5 answers (Q8-Q12)
  const tiebreaker = initScores();
  selectedAnswers.slice(7).forEach(answer => {
    Object.entries(answer.scores).forEach(([char, pts]) => {
      tiebreaker[char] += pts;
    });
  });

  return tied.reduce((a, b) => tiebreaker[a] >= tiebreaker[b] ? a : b);
};
