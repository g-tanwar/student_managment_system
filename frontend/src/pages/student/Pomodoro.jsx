import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Brain, Lightbulb, CheckCheck, Clock } from 'lucide-react';
import './Pomodoro.css';

const MODES = {
  focus: { label: 'Focus', duration: 25 * 60, color: '#C8A2C8' },
  short:  { label: 'Short Break', duration: 5 * 60,  color: '#F8C8DC' },
  long:   { label: 'Long Break',  duration: 15 * 60, color: '#A8D5E2' },
};

const Pomodoro = () => {
  const [mode, setMode] = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);
  const audioCtxRef = useRef(null);

  // Ring math
  const R = 110;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const totalDuration = MODES[mode].duration;
  const progress = timeLeft / totalDuration;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  // ---- Timer Logic ----
  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        playChime();
        // Log session
        setSessions(s => [
          { mode, finishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...s.slice(0, 4)
        ]);
        return 0;
      }
      return prev - 1;
    });
  }, [mode]);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(tick, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  // When mode changes, reset timer
  const handleModeChange = (m) => {
    setMode(m);
    setTimeLeft(MODES[m].duration);
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleReset = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
    setTimeLeft(MODES[mode].duration);
  };

  // ---- Web Audio Bell Chime ----
  const playChime = () => {
    if (!soundOn) return;
    try {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5 E5 G5 C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.value = freq;
        const start = ctx.currentTime + i * 0.28;
        gain.gain.setValueAtTime(0, start);
        gain.gain.linearRampToValueAtTime(0.5, start + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, start + 0.8);
        osc.start(start);
        osc.stop(start + 0.9);
      });
    } catch (e) {
      console.warn('Audio not available:', e);
    }
  };

  const formatTime = (s) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const ringColor = MODES[mode].color;

  return (
    <div className="pomodoro-page">
      <div className="page-header">
        <div>
          <h1>Focus Timer</h1>
          <p>Stay in the zone. One session at a time.</p>
        </div>
      </div>

      <div className="pomodoro-layout">
        {/* Timer Card */}
        <div className="timer-card">
          {/* Mode Switcher */}
          <div className="mode-tabs">
            {Object.entries(MODES).map(([key, val]) => (
              <button
                key={key}
                className={`mode-tab ${mode === key ? 'active' : ''}`}
                onClick={() => handleModeChange(key)}
              >
                {val.label}
              </button>
            ))}
          </div>

          {/* Circular Ring */}
          <div className="ring-container">
            <svg className="ring-svg" viewBox="0 0 260 260">
              <circle className="ring-bg" cx="130" cy="130" r={R} />
              <circle
                className="ring-progress"
                cx="130"
                cy="130"
                r={R}
                style={{
                  strokeDasharray: CIRCUMFERENCE,
                  strokeDashoffset: dashOffset,
                  stroke: ringColor,
                }}
              />
            </svg>
            <div className="ring-inner">
              <div className="timer-display">{formatTime(timeLeft)}</div>
              <div className="timer-mode-label">{MODES[mode].label}</div>
            </div>
          </div>

          {/* Controls */}
          <div className="timer-controls">
            <button className="ctrl-btn" onClick={handleReset} title="Reset">
              <RotateCcw size={22} />
            </button>
            <button
              className="ctrl-btn primary"
              onClick={() => setRunning(r => !r)}
              title={running ? 'Pause' : 'Start'}
            >
              {running ? <Pause size={28} /> : <Play size={28} />}
            </button>
            <label className="ctrl-btn" style={{ cursor: 'pointer' }} title="Toggle Sound">
              {soundOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
              <input
                type="checkbox"
                checked={soundOn}
                onChange={e => setSoundOn(e.target.checked)}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          {/* Sound Label */}
          <label className="sound-toggle">
            <input type="checkbox" checked={soundOn} onChange={e => setSoundOn(e.target.checked)} />
            {soundOn ? 'Sound On' : 'Sound Off'}
          </label>

          {/* Session Counter */}
          <div className="session-count">
            🍅 {sessions.filter(s => s.mode === 'focus').length} Focus Sessions Today
          </div>
        </div>

        {/* Right Panel */}
        <div className="pomodoro-right">
          {/* Focus Tips */}
          <div className="tips-card">
            <h3><Lightbulb size={18} color="var(--primary-hover)" /> Focus Tips</h3>
            <ul className="tips-list">
              <li>
                <span className="tip-icon">📵</span>
                Put your phone face-down and silence all notifications during focus time.
              </li>
              <li>
                <span className="tip-icon">💧</span>
                Keep a glass of water at your desk. Hydration boosts cognitive performance.
              </li>
              <li>
                <span className="tip-icon">🎯</span>
                Write down one specific goal before starting each focus session.
              </li>
              <li>
                <span className="tip-icon">🚶</span>
                Use your break to stand and stretch — it resets focus for the next round.
              </li>
            </ul>
          </div>

          {/* Session Log */}
          <div className="history-card">
            <h3><Clock size={18} color="var(--primary-hover)" /> Session Log</h3>
            {sessions.length === 0 ? (
              <div className="empty-log">Complete a session to see it logged here!</div>
            ) : (
              <div className="session-log">
                {sessions.map((s, i) => (
                  <div className="session-log-item" key={i}>
                    <span>
                      <CheckCheck size={15} style={{ marginRight: 6, color: '#27ae60' }} />
                      {MODES[s.mode].label}
                    </span>
                    <span className="session-log-badge">{s.finishedAt}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pomodoro;
