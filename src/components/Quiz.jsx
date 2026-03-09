import { useState, useMemo } from 'react';

const TOTAL = 12;

export default function Quiz({ questions, onComplete }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(null);
  const [allSelectedAnswers, setAllSelectedAnswers] = useState([]);

  const question = questions[currentQuestionIndex];
  const progress = (currentQuestionIndex / TOTAL) * 100;

  const particles = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      size: 2 + Math.random() * 4,
      duration: 8 + Math.random() * 12,
      delay: Math.random() * 15,
    }));
  }, []);

  const handleGoBack = () => {
    if (currentQuestionIndex === 0) return;
    setCurrentQuestionIndex(prev => prev - 1);
    setAllSelectedAnswers(prev => prev.slice(0, -1));
    setSelectedAnswerIndex(null);
  };

  const handleAnswerClick = (answerIndex) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(answerIndex);

    const chosenAnswer = question.answers[answerIndex];
    const updatedAnswers = [...allSelectedAnswers, chosenAnswer];

    setTimeout(() => {
      if (currentQuestionIndex === TOTAL - 1) {
        onComplete(updatedAnswers);
      } else {
        setAllSelectedAnswers(updatedAnswers);
        setCurrentQuestionIndex(prev => prev + 1);
        setSelectedAnswerIndex(null);
      }
    }, 350);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(ellipse at 60% 30%, rgba(139,0,0,0.12) 0%, transparent 60%), radial-gradient(ellipse at 20% 80%, rgba(75,0,130,0.12) 0%, transparent 60%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '88px',
      paddingBottom: '40px',
      position: 'relative',
      overflow: 'hidden',
    }}>

      {/* Floating particles */}
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            bottom: 0,
            width: `${p.size}px`,
            height: `${p.size}px`,
            borderRadius: '50%',
            background: '#D4AF37',
            animation: `floatParticle ${p.duration}s ${p.delay}s infinite ease-in`,
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      ))}

      {/* Quiz card */}
      <div style={{
        background: 'rgba(8,6,18,0.88)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(212,175,55,0.2)',
        borderRadius: '20px',
        padding: '40px 36px',
        maxWidth: '640px',
        width: '92%',
        margin: '0 auto',
        boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 1,
      }}>

        {/* Back button */}
        {currentQuestionIndex > 0 && (
          <button
            onClick={handleGoBack}
            disabled={selectedAnswerIndex !== null}
            style={{
              background: 'none', border: 'none',
              color: 'rgba(212,175,55,0.6)',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '13px', letterSpacing: '1px',
              cursor: selectedAnswerIndex !== null ? 'default' : 'pointer',
              padding: '0 0 12px 0',
              display: 'flex', alignItems: 'center', gap: '6px',
              opacity: selectedAnswerIndex !== null ? 0.4 : 1,
              transition: 'opacity 200ms ease',
            }}
          >
            ← Back
          </button>
        )}

        {/* Progress bar */}
        <div style={{
          width: '100%', height: '6px',
          background: 'rgba(255,255,255,0.05)',
          borderRadius: '4px', overflow: 'visible',
          marginBottom: '16px', position: 'relative',
        }}>
          <div style={{
            height: '100%',
            width: `${progress}%`,
            background: 'linear-gradient(90deg, #8B6914, #D4AF37, #FFD700, #D4AF37)',
            backgroundSize: '200% auto',
            animation: 'shimmer 2s linear infinite',
            borderRadius: '4px',
            transition: 'width 400ms ease',
            position: 'relative',
          }}>
            {progress > 0 && (
              <div style={{
                position: 'absolute', right: '-5px', top: '50%',
                transform: 'translateY(-50%)',
                width: '10px', height: '10px', borderRadius: '50%',
                background: '#FFD700',
                boxShadow: '0 0 8px #FFD700, 0 0 16px rgba(212,175,55,0.8)',
                animation: 'buttonPulse 1.5s ease-in-out infinite',
              }} />
            )}
          </div>
        </div>

        {/* Question counter */}
        <p style={{
          fontFamily: "'Crimson Text', serif",
          fontSize: '13px', color: 'rgba(192,192,192,0.7)',
          textAlign: 'center', marginBottom: '24px',
        }}>
          {currentQuestionIndex + 1} of {TOTAL}
        </p>

        {/* Question + answers — key triggers fadeIn */}
        <div key={currentQuestionIndex} style={{ animation: 'fadeIn 300ms ease both' }}>

          {/* Q-number pill */}
          <div style={{
            display: 'inline-block', padding: '2px 10px', borderRadius: '20px',
            background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.3)',
            fontFamily: "'Cormorant Garamond', serif", fontSize: '11px',
            color: '#D4AF37', letterSpacing: '2px', marginBottom: '12px',
          }}>
            Q{currentQuestionIndex + 1}
          </div>

          {/* Question text — left-aligned */}
          <h2 style={{
            fontFamily: "'Cinzel Decorative', cursive",
            fontSize: 'clamp(1rem, 2.5vw, 1.25rem)',
            color: '#F5E6C8',
            textAlign: 'left',
            marginBottom: '24px',
            lineHeight: 1.4,
            textShadow: '0 0 30px rgba(212,175,55,0.2)',
          }}>
            {question.text}
          </h2>

          {/* Answer cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {question.answers.map((answer, idx) => {
              const isSelected = selectedAnswerIndex === idx;
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswerClick(idx)}
                  disabled={selectedAnswerIndex !== null}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '14px',
                    background: isSelected
                      ? 'linear-gradient(135deg, #3A2E10 0%, #2A1E0A 100%)'
                      : 'linear-gradient(135deg, #2A1E0A 0%, #1C1208 100%)',
                    border: isSelected ? '1px solid #FFD700' : '1px solid rgba(212,175,55,0.35)',
                    borderLeft: isSelected ? '3px solid #FFD700' : '3px solid rgba(212,175,55,0.5)',
                    borderRadius: '10px',
                    padding: '14px 20px',
                    cursor: selectedAnswerIndex !== null ? 'default' : 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    boxShadow: isSelected ? '0 0 20px rgba(212,175,55,0.3)' : 'none',
                    transition: 'all 200ms ease',
                    outline: 'none',
                  }}
                >
                  {/* Letter badge */}
                  <span style={{
                    minWidth: '32px', height: '32px', borderRadius: '50%',
                    background: isSelected ? '#D4AF37' : 'rgba(212,175,55,0.1)',
                    border: isSelected ? 'none' : '1px solid rgba(212,175,55,0.3)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: "'Cormorant Garamond', serif", fontSize: '14px',
                    color: isSelected ? '#0A0A1A' : '#D4AF37',
                    flexShrink: 0, transition: 'all 200ms ease',
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>

                  {/* Answer text */}
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '17px', color: '#F5E6C8', lineHeight: 1.4,
                  }}>
                    {answer.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
