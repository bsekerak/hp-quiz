import { useState, useEffect } from 'react';
import Intro from '../components/Intro';
import Quiz from '../components/Quiz';
import Results from '../components/Results';
import questions from '../data/questions';
import { calculateResult } from '../utils/scoring';
import { characters } from '../data/characters';

export default function Home() {
  const [screen, setScreen] = useState('intro');
  const [resultCharacter, setResultCharacter] = useState(null);

  useEffect(() => {
    document.title = 'Which Harry Potter Character Are You? | Wizarding World Quiz';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Take our free 12-question personality quiz and discover which Harry Potter character matches your personality. Harry, Hermione, Ron, Luna, Snape and more.');
  }, []);

  const handleComplete = (selectedAnswers) => {
    const key = calculateResult(selectedAnswers);
    const character = characters[key];
    localStorage.setItem('quizResult', JSON.stringify({ character }));
    setResultCharacter(character);
    setScreen('results');
  };

  const handleRetake = () => {
    setResultCharacter(null);
    setScreen('intro');
  };

  return (
    <div className="quiz-page">
      {screen === 'intro' && <Intro onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz questions={questions} onComplete={handleComplete} />}
      {screen === 'results' && <Results character={resultCharacter} onRetake={handleRetake} />}
    </div>
  );
}
