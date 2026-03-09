import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Intro from '../components/Intro';
import Quiz from '../components/Quiz';
import Results from '../components/Results';
import questions from '../data/questions';
import { calculateResult } from '../utils/scoring';
import { characters } from '../data/characters';

export default function Home() {
  const [screen, setScreen] = useState('intro');
  const [resultCharacter, setResultCharacter] = useState(null);
  const location = useLocation();

  useEffect(() => {
    document.title = 'Which Harry Potter Character Are You? | Wizarding World Quiz';
    document.querySelector('meta[name="description"]')?.setAttribute('content',
      'Take our free 12-question personality quiz and discover which Harry Potter character matches your personality. Harry, Hermione, Ron, Luna, Snape and more.');
  }, []);

  // Reset when header "Take the Quiz" navigates here with resetQuiz state
  useEffect(() => {
    if (location.state?.resetQuiz) {
      setScreen('intro');
      setResultCharacter(null);
      localStorage.removeItem('quizResult');
      // Clear the state so navigating back doesn't re-trigger the reset
      window.history.replaceState({}, '');
    }
  }, [location.state?.resetQuiz]);

  // Push a history entry when quiz starts; handle browser back from both quiz and results
  useEffect(() => {
    if (screen === 'intro') return;

    // Push a history entry only when entering quiz (so back = return to intro)
    if (screen === 'quiz') {
      window.history.pushState({ quizActive: true }, '');
    }

    const handlePop = () => {
      setScreen('intro');
      setResultCharacter(null);
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [screen]);

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
    localStorage.removeItem('quizResult');
  };

  return (
    <div className="quiz-page">
      {screen === 'intro' && <Intro onStart={() => setScreen('quiz')} />}
      {screen === 'quiz' && <Quiz questions={questions} onComplete={handleComplete} />}
      {screen === 'results' && <Results character={resultCharacter} onRetake={handleRetake} />}
    </div>
  );
}
