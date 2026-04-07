import { useEffect, useRef, useState, useCallback } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Clock, Lightbulb, CheckCircle2 } from 'lucide-react';
import './Pomodoro.css';

const MODES = {
  focus: { label: 'Focus',       duration: 25 * 60, color: '#22D3EE' },
  short: { label: 'Short Break', duration:  5 * 60, color: '#34D399' },
  long:  { label: 'Long Break',  duration: 15 * 60, color: '#A78BFA' },
};

const Pomodoro = () => {
  const [mode, setMode]       = useState('focus');
  const [timeLeft, setTimeLeft] = useState(MODES.focus.duration);
  const [running, setRunning] = useState(false);
  const [soundOn, setSoundOn] = useState(true);
  const [sessions, setSessions] = useState([]);
  const intervalRef = useRef(null);

  const R            = 95;
  const CIRCUMFERENCE = 2 * Math.PI * R;
  const totalDuration = MODES[mode].duration;
  const dashOffset   = CIRCUMFERENCE * (1 - timeLeft / totalDuration);

  const tick = useCallback(() => {
    setTimeLeft(prev => {
      if (prev <= 1) {
        clearInterval(intervalRef.current);
        setRunning(false);
        playChime();
        setSessions(s => [
          { mode, finishedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) },
          ...s.slice(0, 4),
        ]);
        
        // Log focus stats if it was a focus session
        if (mode === 'focus') {
          try {
            const dateStr = new Date().toISOString().split('T')[0];
            const stats = JSON.parse(localStorage.getItem('eduportal_pomo_stats')) || {};
            const durationMins = Math.round(MODES.focus.duration / 60);
            stats[dateStr] = (stats[dateStr] || 0) + durationMins;
            localStorage.setItem('eduportal_pomo_stats', JSON.stringify(stats));
          } catch (e) {}
        }
        
        return 0;
      }
      return prev - 1;
    });
  }, [mode]);

  useEffect(() => {
    if (running) intervalRef.current = setInterval(tick, 1000);
    else clearInterval(intervalRef.current);
    return () => clearInterval(intervalRef.current);
  }, [running, tick]);

  const handleModeChange = (m) => {
    setMode(m); setTimeLeft(MODES[m].duration);
    setRunning(false); clearInterval(intervalRef.current);
  };
  const handleReset = () => {
    setRunning(false); clearInterval(intervalRef.current);
    setTimeLeft(MODES[mode].duration);
  };

  const playChime = () => {
    if (!soundOn) return;
    try {
      const ctx   = new (window.AudioContext || window.webkitAudioContext)();
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, i) => {
        const osc  = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.type = 'sine'; osc.frequency.value = freq;
        const t = ctx.currentTime + i * 0.28;
        gain.gain.setValueAtTime(0, t);
        gain.gain.linearRampToValueAtTime(0.4, t + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);
        osc.start(t); osc.stop(t + 0.9);
      });
    } catch (e) {}
  };

  const fmt = (s) =>
    `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  const TIPS = [
    'Silence notifications before each session starts.',
    'Write one clear goal before you begin focusing.',
    'Keep water at your desk — hydration aids concentration.',
    'Stand and stretch during every short break.',
  ];

  return (
    <div className="pomodoro-page">
      <div className="page-header">
        <div>
          <h1>Focus Timer</h1>
          <p>One session at a time. Stay in the zone.</p>
        </div>
      </div>

      <div className="pomodoro-layout">
        {/* Timer Card */}
        <div className="timer-card">
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

          <div className="ring-container">
            <svg className="ring-svg" viewBox="0 0 220 220">
              <circle className="ring-bg" cx="110" cy="110" r={R} />
              <circle
                className="ring-progress"
                cx="110" cy="110" r={R}
                style={{
                  strokeDasharray:  CIRCUMFERENCE,
                  strokeDashoffset: dashOffset,
                  stroke: MODES[mode].color,
                }}
              />
            </svg>
            <div className="ring-inner">
              <div className="timer-display">{fmt(timeLeft)}</div>
              <div className="timer-mode-label">{MODES[mode].label}</div>
            </div>
          </div>

          <div className="timer-controls">
            <button className="ctrl-btn" onClick={handleReset} title="Reset">
              <RotateCcw size={18} />
            </button>
            <button
              className="ctrl-btn primary"
              onClick={() => setRunning(r => !r)}
              title={running ? 'Pause' : 'Start'}
            >
              {running ? <Pause size={22} /> : <Play size={22} />}
            </button>
            <label className="ctrl-btn" style={{ cursor: 'pointer' }} title="Toggle Sound">
              {soundOn ? <Volume2 size={18} /> : <VolumeX size={18} />}
              <input
                type="checkbox" checked={soundOn}
                onChange={e => setSoundOn(e.target.checked)}
                style={{ display: 'none' }}
              />
            </label>
          </div>

          <label className="sound-toggle">
            <input type="checkbox" checked={soundOn} onChange={e => setSoundOn(e.target.checked)} />
            {soundOn ? 'Sound On' : 'Sound Off'}
          </label>

          <div className="session-count">
            {sessions.filter(s => s.mode === 'focus').length} focus sessions today
          </div>
        </div>

        {/* Right Panel */}
        <div className="pomodoro-right">
          <div className="tips-card">
            <h3><Lightbulb size={15} color="var(--primary-color)" /> Focus Tips</h3>
            <ul className="tips-list">
              {TIPS.map((tip, i) => (
                <li key={i}>
                  <span className="tip-dot" />
                  {tip}
                </li>
              ))}
            </ul>
          </div>

          <div className="history-card">
            <h3><Clock size={15} color="var(--primary-color)" /> Session Log</h3>
            {sessions.length === 0 ? (
              <div className="empty-log">Complete a session to see it logged here.</div>
            ) : (
              <div className="session-log">
                {sessions.map((s, i) => (
                  <div className="session-log-item" key={i}>
                    <span style={{ display:'flex', alignItems:'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="#34D399" />
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
