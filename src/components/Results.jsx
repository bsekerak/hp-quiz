import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { generateWizardingPortrait } from '../utils/generatePortrait';
import jsPDF from 'jspdf';

const houseColors = {
  Gryffindor: { primary: '#740001', secondary: '#D3A625', glow: 'rgba(211,166,37,0.25)' },
  Slytherin: { primary: '#1A472A', secondary: '#AAAAAA', glow: 'rgba(26,71,42,0.35)' },
  Ravenclaw: { primary: '#0E1A40', secondary: '#946B2D', glow: 'rgba(14,26,64,0.35)' },
  Hufflepuff: { primary: '#ECB939', secondary: '#000000', glow: 'rgba(236,185,57,0.25)' }
};

export default function Results({ character: characterProp, onRetake }) {
  const navigate = useNavigate();
  const cardRef = useRef(null);

  const [character, setCharacter] = useState(null);
  const [portrait, setPortrait] = useState(null);
  const [portraitLoading, setPortraitLoading] = useState(false);
  const [portraitError, setPortraitError] = useState(false);
  const [showPhotoPanel, setShowPhotoPanel] = useState(false);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  useEffect(() => {
    document.title = 'Your Result | Wizarding World Quiz';
    const saved = localStorage.getItem('quizResult');
    const char = characterProp || (saved ? JSON.parse(saved).character : null);
    if (char) setCharacter(char);
  }, [characterProp]);

  const handlePhotoSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleGeneratePortrait = async () => {
    if (!photoPreview || !character) return;
    setPortraitLoading(true);
    setPortraitError(false);
    setShowPhotoPanel(false);
    const url = await generateWizardingPortrait(photoPreview, character);
    if (url) {
      setPortrait(url);
    } else {
      setPortraitError(true);
    }
    setPortraitLoading(false);
  };

  const handleDownloadPDF = async () => {
    if (!character) return;
    setPdfGenerating(true);

    try {
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'a4' });
      const W = 595;
      const H = 842;

      // House color map (must be defined before portrait section uses it)
      const houseColorMap = {
        Gryffindor: [116, 0, 1],
        Slytherin: [26, 71, 42],
        Ravenclaw: [14, 26, 64],
        Hufflepuff: [200, 150, 10]
      };

      // Background
      pdf.setFillColor(8, 6, 18);
      pdf.rect(0, 0, W, H, 'F');

      // Outer gold border
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(2);
      pdf.roundedRect(20, 20, W - 40, H - 40, 10, 10, 'S');

      // Inner border
      pdf.setLineWidth(0.5);
      pdf.roundedRect(28, 28, W - 56, H - 56, 8, 8, 'S');

      // Eyebrow
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text('- YOUR RESULT -', W / 2, 68, { align: 'center' });

      // Portrait image (if exists)
      let portraitBottom = 110;
      if (portrait) {
        try {
          const res = await fetch(portrait);
          const blob = await res.blob();
          const b64 = await new Promise((resolve) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.readAsDataURL(blob);
          });
          const imgSize = 160;
          const imgX = (W - imgSize) / 2;
          const imgY = 80;
          pdf.addImage(b64, 'JPEG', imgX, imgY, imgSize, imgSize);
          pdf.setDrawColor(212, 175, 55);
          pdf.setLineWidth(2);
          pdf.roundedRect(imgX, imgY, imgSize, imgSize, 8, 8, 'S');
          portraitBottom = imgY + imgSize + 20;
        } catch (e) {
          console.warn('Could not embed portrait');
          const hc2 = houseColorMap[character.house] || [60, 40, 100];
          pdf.setFillColor(...hc2);
          pdf.circle(W / 2, 155, 50, 'F');
          pdf.setDrawColor(212, 175, 55);
          pdf.setLineWidth(2);
          pdf.circle(W / 2, 155, 52, 'S');
          pdf.setTextColor(212, 175, 55);
          pdf.setFontSize(72);
          pdf.setFont('helvetica', 'bold');
          const initial = character.name ? character.name.charAt(0).toUpperCase() : 'W';
          pdf.text(initial, W / 2, 178, { align: 'center' });
          portraitBottom = 230;
        }
      } else {
        const hc2 = houseColorMap[character.house] || [60, 40, 100];
        pdf.setFillColor(...hc2);
        pdf.circle(W / 2, 155, 50, 'F');
        pdf.setDrawColor(212, 175, 55);
        pdf.setLineWidth(2);
        pdf.circle(W / 2, 155, 52, 'S');
        pdf.setTextColor(212, 175, 55);
        pdf.setFontSize(72);
        pdf.setFont('helvetica', 'bold');
        const initial = character.name ? character.name.charAt(0).toUpperCase() : 'W';
        pdf.text(initial, W / 2, 178, { align: 'center' });
        portraitBottom = 230;
      }

      // Character name
      pdf.setTextColor(245, 230, 200);
      pdf.setFontSize(38);
      pdf.setFont('helvetica', 'bold');
      pdf.text(character.name.toUpperCase(), W / 2, portraitBottom + 10, { align: 'center' });

      // Thin gold line
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.line(W / 2 - 120, portraitBottom + 22, W / 2 + 120, portraitBottom + 22);

      // House pill
      const hc = houseColorMap[character.house] || [60, 40, 100];
      pdf.setFillColor(...hc);
      pdf.roundedRect(W / 2 - 60, portraitBottom + 30, 120, 24, 5, 5, 'F');
      pdf.setTextColor(255, 220, 100);
      pdf.setFontSize(13);
      pdf.setFont('helvetica', 'bold');
      pdf.text(character.house || '', W / 2, portraitBottom + 46, { align: 'center' });

      // MBTI pill
      pdf.setFillColor(25, 18, 50);
      pdf.roundedRect(W / 2 - 90, portraitBottom + 60, 180, 24, 5, 5, 'F');
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.roundedRect(W / 2 - 90, portraitBottom + 60, 180, 24, 5, 5, 'S');
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(12);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`${character.mbti} — ${character.mbtiTitle}`, W / 2, portraitBottom + 76, { align: 'center' });

      // Divider
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.line(W / 2 - 150, portraitBottom + 100, W / 2 + 150, portraitBottom + 100);

      // Description
      pdf.setTextColor(245, 230, 200);
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'normal');
      const descLines = pdf.splitTextToSize(character.description || '', 480);
      pdf.text(descLines, W / 2, portraitBottom + 124, { align: 'center', lineHeightFactor: 1.8 });

      // Traits
      const traitsY = portraitBottom + 124 + (descLines.length * 14 * 1.8) + 16;
      if (character.traits?.length) {
        pdf.setTextColor(212, 175, 55);
        pdf.setFontSize(11);
        const traitsString = character.traits.join('   |   ');
        const traitLines = pdf.splitTextToSize(traitsString, 480);
        pdf.text(traitLines, W / 2, traitsY, { align: 'center' });
      }

      // Footer
      pdf.setDrawColor(212, 175, 55);
      pdf.setLineWidth(0.5);
      pdf.line(W / 2 - 120, H - 55, W / 2 + 120, H - 55);
      pdf.setTextColor(212, 175, 55);
      pdf.setFontSize(9);
      pdf.text('WIZARDING WORLD QUIZ', W / 2, H - 38, { align: 'center' });
      pdf.text('wizardingworldquiz.com', W / 2, H - 24, { align: 'center' });

      pdf.save(`${character.name.replace(/ /g, '-')}-Wizard-Identity-Card.pdf`);

    } catch (err) {
      console.error('PDF error:', err);
      alert('PDF failed: ' + err.message);
    }

    setPdfGenerating(false);
  };

  if (!character) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#F5E6C8', fontFamily: "'Cormorant Garamond', serif", fontSize: '1.2rem' }}>
          Loading your result...
        </p>
      </div>
    );
  }

  const colors = houseColors[character.house] || houseColors.Gryffindor;

  return (
    <div style={{
      minHeight: '100vh',
      background: `radial-gradient(ellipse at 60% 20%, ${colors.glow} 0%, transparent 55%),
                   radial-gradient(ellipse at 20% 80%, rgba(75,0,130,0.1) 0%, transparent 55%)`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      paddingTop: '88px',
      paddingBottom: '60px',
      paddingLeft: '16px',
      paddingRight: '16px',
      position: 'relative',
      zIndex: 1,
    }}>

      {/* ── IDENTITY CARD (captured for PDF) ── */}
      <div ref={cardRef} data-pdf-card="true" style={{
        background: 'rgba(8,6,18,0.96)',
        border: '1px solid rgba(212,175,55,0.35)',
        borderRadius: '20px',
        padding: '52px 48px',
        maxWidth: '780px',
        width: '100%',
        boxShadow: `0 32px 80px rgba(0,0,0,0.7), 0 0 60px ${colors.glow}`,
        marginBottom: '16px'
      }}>

        {/* Eyebrow */}
        <div style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '11px', letterSpacing: '5px',
          color: '#D4AF37', opacity: 0.7,
          textTransform: 'uppercase',
          textAlign: 'center', marginBottom: '28px'
        }}>
          ✦ Your Result ✦
        </div>

        {/* Portrait + Name row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px', marginBottom: '28px', flexWrap: 'wrap' }}>

          {/* Circle / portrait */}
          <div style={{
            width: '120px', height: '120px', borderRadius: '50%',
            border: `3px solid ${colors.secondary}`,
            boxShadow: `0 0 30px ${colors.glow}`,
            overflow: 'hidden', flexShrink: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: `radial-gradient(circle, ${colors.primary} 0%, rgba(8,6,18,0.9) 100%)`,
            fontSize: '52px'
          }}>
            {portrait ? (
              <img src={portrait} alt="Wizarding portrait" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : portraitLoading ? (
              <span style={{ fontSize: '28px', display: 'inline-block', animation: 'spin 1.5s linear infinite' }}>⚡</span>
            ) : (
              <span>{character.emoji}</span>
            )}
          </div>

          {/* Name + badges */}
          <div style={{ flex: 1, minWidth: '200px' }}>
            <h1 style={{
              fontFamily: "'Cinzel Decorative', serif",
              fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
              color: '#F5E6C8',
              textShadow: '0 0 30px rgba(212,175,55,0.4)',
              marginBottom: '12px', lineHeight: 1.1
            }}>
              {character.name}
            </h1>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span style={{
                background: colors.primary, color: colors.secondary,
                padding: '4px 14px', borderRadius: '20px',
                fontSize: '12px', fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, letterSpacing: '1px'
              }}>
                {character.house}
              </span>
              <span style={{
                background: 'rgba(212,175,55,0.1)', color: '#D4AF37',
                padding: '4px 14px', borderRadius: '20px',
                fontSize: '12px', fontFamily: "'Cormorant Garamond', serif",
                fontWeight: 600, letterSpacing: '1px',
                border: '1px solid rgba(212,175,55,0.3)'
              }}>
                {character.mbti} — {character.mbtiTitle}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div style={{
          height: '1px', marginBottom: '28px',
          background: 'linear-gradient(to right, transparent, rgba(212,175,55,0.4), transparent)'
        }} />

        {/* Description */}
        <p style={{
          fontSize: '1.1rem', lineHeight: 1.85,
          color: 'rgba(245,230,200,0.85)',
          fontFamily: "'Crimson Text', serif",
          textAlign: 'center', marginBottom: '24px'
        }}>
          {character.description}
        </p>

        {/* Traits */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '28px' }}>
          {character.traits?.map((trait, i) => (
            <span key={i} style={{
              background: 'rgba(212,175,55,0.08)',
              border: '1px solid rgba(212,175,55,0.25)',
              color: 'rgba(245,230,200,0.75)',
              padding: '6px 16px', borderRadius: '20px',
              fontSize: '12px', fontFamily: "'Cormorant Garamond', serif",
              letterSpacing: '1px'
            }}>
              {trait}
            </span>
          ))}
        </div>

        {/* Portrait loading message — inside card so it appears in PDF if generating */}
        {portraitLoading && (
          <div style={{
            textAlign: 'center', padding: '12px',
            color: '#D4AF37', fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem', letterSpacing: '2px', opacity: 0.8
          }}>
            ✦ Conjuring your wizarding portrait... ✦
          </div>
        )}

        {/* Branding footer inside card */}
        <div style={{
          textAlign: 'center', marginTop: '8px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '10px', letterSpacing: '3px',
          color: 'rgba(212,175,55,0.35)', textTransform: 'uppercase'
        }}>
          ✦ Wizarding World Quiz ✦ wizardingworldquiz.com
        </div>
      </div>

      {/* ── AI PORTRAIT BUTTON / PANEL (outside PDF card) ── */}
      {!portrait && !portraitLoading && (
        <div style={{ maxWidth: '780px', width: '100%', marginBottom: '16px' }}>
          {!showPhotoPanel ? (
            <button
              onClick={() => setShowPhotoPanel(true)}
              style={{
                width: '100%',
                background: 'rgba(212,175,55,0.08)',
                border: '1px solid rgba(212,175,55,0.35)',
                color: '#D4AF37',
                padding: '18px',
                borderRadius: '12px',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '14px', letterSpacing: '2px',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
            >
              ✦ Generate My Wizarding Portrait with AI ✦
            </button>
          ) : (
            <div style={{
              background: 'rgba(8,6,18,0.92)',
              border: '1px solid rgba(212,175,55,0.25)',
              borderRadius: '16px', padding: '32px',
              textAlign: 'center'
            }}>
              <p style={{
                color: 'rgba(245,230,200,0.8)',
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: '1rem', marginBottom: '20px', lineHeight: 1.6
              }}>
                Upload a clear photo of your face to generate your custom {character.house} wizarding portrait
              </p>

              {photoPreview && (
                <img src={photoPreview} alt="Your photo" style={{
                  maxWidth: '180px', maxHeight: '180px',
                  borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)',
                  objectFit: 'cover', display: 'block', margin: '0 auto 20px'
                }} />
              )}

              <input type="file" accept="image/*" onChange={handlePhotoSelect}
                style={{ display: 'none' }} id="portrait-upload" />

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxWidth: '360px', margin: '0 auto' }}>
                <label htmlFor="portrait-upload" style={{
                  background: 'rgba(212,175,55,0.12)',
                  border: '1px solid rgba(212,175,55,0.4)',
                  color: '#D4AF37', padding: '12px 24px',
                  borderRadius: '8px', cursor: 'pointer',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '13px', letterSpacing: '1px',
                  textAlign: 'center', display: 'block'
                }}>
                  {photoPreview ? 'Choose Different Photo' : 'Choose Photo'}
                </label>

                {photoPreview && (
                  <button onClick={handleGeneratePortrait} style={{
                    background: '#D4AF37', color: '#0A0A1A',
                    padding: '14px 24px', borderRadius: '8px',
                    fontFamily: "'Cormorant Garamond', serif",
                    fontSize: '13px', fontWeight: 600,
                    letterSpacing: '2px', textTransform: 'uppercase',
                    cursor: 'pointer', border: 'none'
                  }}>
                    Generate My Portrait ✦
                  </button>
                )}

                <button onClick={() => { setShowPhotoPanel(false); setPhotoPreview(null); }} style={{
                  background: 'transparent',
                  border: '1px solid rgba(212,175,55,0.15)',
                  color: 'rgba(245,230,200,0.45)',
                  padding: '10px', borderRadius: '8px',
                  cursor: 'pointer',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '12px'
                }}>
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {portraitError && (
        <p style={{
          color: 'rgba(245,100,100,0.8)',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '0.95rem', marginBottom: '12px',
          maxWidth: '780px', width: '100%', textAlign: 'center'
        }}>
          Portrait generation failed — please try again.
        </p>
      )}

      {/* ── ACTION BUTTONS ── */}
      <div style={{ maxWidth: '780px', width: '100%', display: 'flex', flexDirection: 'column', gap: '12px', position: 'relative', zIndex: 10 }}>

        <button onClick={handleDownloadPDF} disabled={pdfGenerating} style={{
          background: '#D4AF37', color: '#0A0A1A',
          padding: '16px 24px', borderRadius: '10px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '14px', fontWeight: 600,
          letterSpacing: '2px', textTransform: 'uppercase',
          cursor: pdfGenerating ? 'not-allowed' : 'pointer',
          border: 'none', opacity: pdfGenerating ? 0.7 : 1,
          transition: 'all 0.3s ease'
        }}>
          {pdfGenerating ? '⚡ Generating PDF...' : '⬇ Download Wizard Identity Card'}
        </button>

        <button onClick={() => {
          if (navigator.share) {
            navigator.share({
              title: `I got ${character.name}!`,
              text: `I just found out I'm ${character.name} (${character.mbti}) on the Wizarding World Quiz!`,
              url: 'https://wizardingworldquiz.com'
            });
          } else {
            navigator.clipboard.writeText('https://wizardingworldquiz.com');
            alert('Link copied to clipboard!');
          }
        }} style={{
          background: 'rgba(212,175,55,0.08)',
          border: '1px solid rgba(212,175,55,0.3)',
          color: '#D4AF37', padding: '14px 24px',
          borderRadius: '10px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '13px', letterSpacing: '2px',
          textTransform: 'uppercase',
          cursor: 'pointer', transition: 'all 0.3s ease'
        }}>
          Share My Result
        </button>

        <button type="button" onClick={() => { localStorage.removeItem('quizResult'); if (onRetake) { onRetake(); } else { navigate('/'); } }} style={{
          background: 'transparent',
          border: '1px solid rgba(212,175,55,0.15)',
          color: 'rgba(245,230,200,0.45)',
          padding: '12px 24px', borderRadius: '10px',
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: '13px', letterSpacing: '1px',
          cursor: 'pointer', transition: 'all 0.3s ease'
        }}>
          Retake Quiz
        </button>
      </div>
    </div>
  );
}
