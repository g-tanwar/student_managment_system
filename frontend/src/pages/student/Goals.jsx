import { useState, useMemo } from 'react';
import {
  Target, Plus, CheckCheck, Trash2, CalendarDays,
  TrendingUp, Trophy, Clock, X, Flame
} from 'lucide-react';
import './Goals.css';

// Persist goals in localStorage — no backend needed for this client-side feature
const STORAGE_KEY = 'eduportal_goals';

const loadGoals = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const saveGoals = (goals) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(goals));
};

const PRIORITIES = ['High', 'Medium', 'Low'];

const Goals = () => {
  const [goals, setGoals]             = useState(loadGoals);
  const [showForm, setShowForm]       = useState(false);
  const [title, setTitle]             = useState('');
  const [deadline, setDeadline]       = useState('');
  const [priority, setPriority]       = useState('Medium');

  // ── Derived Stats ──────────────────────────────────────────────
  const active    = useMemo(() => goals.filter(g => !g.completed), [goals]);
  const completed = useMemo(() => goals.filter(g => g.completed),  [goals]);
  const avgProgress = useMemo(() => {
    if (!goals.length) return 0;
    return Math.round(goals.reduce((s, g) => s + g.progress, 0) / goals.length);
  }, [goals]);

  // ── Mutations ──────────────────────────────────────────────────
  const persist = (next) => { setGoals(next); saveGoals(next); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const newGoal = {
      id: Date.now().toString(),
      title: title.trim(),
      deadline,
      priority,
      progress: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    persist([newGoal, ...goals]);
    setTitle(''); setDeadline(''); setPriority('Medium');
    setShowForm(false);
  };

  const updateProgress = (id, value) => {
    persist(goals.map(g =>
      g.id === id ? { ...g, progress: Number(value), completed: Number(value) === 100 } : g
    ));
  };

  const markComplete = (id) => {
    persist(goals.map(g =>
      g.id === id ? { ...g, progress: 100, completed: true } : g
    ));
  };

  const deleteGoal = (id) => {
    persist(goals.filter(g => g.id !== id));
  };

  // ── Helpers ────────────────────────────────────────────────────
  const isOverdue = (deadline) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date() ;
  };

  const formatDate = (d) => {
    if (!d) return 'No deadline';
    return new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const GoalCard = ({ goal }) => (
    <div className={`goal-card priority-${goal.priority.toLowerCase()} ${goal.completed ? 'completed' : ''}`}>
      {/* Header */}
      <div className="goal-card-header">
        <span className="goal-title">{goal.title}</span>
        <span className={`priority-badge ${goal.priority.toLowerCase()}`}>{goal.priority}</span>
      </div>

      {/* Deadline */}
      <div className={`goal-deadline ${isOverdue(goal.deadline) && !goal.completed ? 'overdue' : ''}`}>
        <CalendarDays size={13} />
        {isOverdue(goal.deadline) && !goal.completed ? '⚠ Overdue — ' : ''}
        {formatDate(goal.deadline)}
      </div>

      {/* Progress */}
      <div className="goal-progress-section">
        <div className="progress-header">
          <span className="progress-label">Progress</span>
          <span className="progress-pct">{goal.progress}%</span>
        </div>
        <div className="progress-track">
          <div
            className={`progress-fill ${goal.progress === 100 ? 'complete' : ''}`}
            style={{ width: `${goal.progress}%` }}
          />
        </div>
        {!goal.completed && (
          <input
            type="range"
            min="0"
            max="100"
            step="5"
            value={goal.progress}
            className="progress-slider"
            onChange={(e) => updateProgress(goal.id, e.target.value)}
          />
        )}
      </div>

      {/* Actions */}
      {goal.completed ? (
        <div className="goal-actions">
          <div className="completed-badge">
            <CheckCheck size={14} /> Goal Completed!
          </div>
          <button className="btn-delete" onClick={() => deleteGoal(goal.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      ) : (
        <div className="goal-actions">
          <button className="btn-complete" onClick={() => markComplete(goal.id)}>
            <CheckCheck size={15} /> Mark Complete
          </button>
          <button className="btn-delete" onClick={() => deleteGoal(goal.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="goals-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1>Goals Tracker</h1>
          <p>Set targets, track progress, and crush your academic goals.</p>
        </div>
        <button className="btn-new-goal" onClick={() => setShowForm(s => !s)}>
          {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> New Goal</>}
        </button>
      </div>

      {/* Summary Strip */}
      <div className="goals-summary">
        <div className="summary-card">
          <div className="summary-value">{goals.length}</div>
          <div className="summary-label">Total Goals</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: 'var(--primary-hover)' }}>{active.length}</div>
          <div className="summary-label">In Progress</div>
        </div>
        <div className="summary-card">
          <div className="summary-value" style={{ color: '#27ae60' }}>{completed.length}</div>
          <div className="summary-label">Completed</div>
        </div>
        <div className="summary-card highlight">
          <div className="summary-value">{avgProgress}%</div>
          <div className="summary-label">Avg Progress</div>
        </div>
      </div>

      {/* Add Goal Form */}
      {showForm && (
        <div className="add-goal-form">
          <h3 className="form-title"><Target size={18} color="var(--primary-hover)" /> New Goal</h3>
          <form onSubmit={handleAdd}>
            <div className="goal-form-grid">
              <input
                type="text"
                placeholder="Goal title (e.g. Score 90% in Physics)"
                className="goal-form-input"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
                maxLength={80}
              />
              <input
                type="date"
                className="goal-form-input"
                value={deadline}
                onChange={e => setDeadline(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
              <select
                className="goal-form-input"
                value={priority}
                onChange={e => setPriority(e.target.value)}
              >
                {PRIORITIES.map(p => <option key={p} value={p}>{p} Priority</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => { setShowForm(false); setTitle(''); }}>
                Cancel
              </button>
              <button type="submit" className="btn-add-goal" disabled={!title.trim()}>
                <Plus size={16} /> Add Goal
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Active Goals */}
      <div>
        <h2 className="goals-section-title">
          <Flame size={18} color="var(--primary-hover)" />
          Active Goals
          <span className="goals-count-chip">{active.length}</span>
        </h2>
        {active.length === 0 ? (
          <div className="goals-empty">
            <Target size={36} color="var(--primary-color)" style={{ opacity: 0.5 }} />
            <p>No active goals yet. Hit "New Goal" to get started!</p>
          </div>
        ) : (
          <div className="goals-grid">
            {active.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        )}
      </div>

      {/* Completed Goals */}
      {completed.length > 0 && (
        <div>
          <h2 className="goals-section-title">
            <Trophy size={18} color="#27ae60" />
            Completed
            <span className="goals-count-chip" style={{ background: '#d5f5e3', color: '#27ae60', borderColor: '#a9dfbf' }}>
              {completed.length}
            </span>
          </h2>
          <div className="goals-grid">
            {completed.map(goal => <GoalCard key={goal.id} goal={goal} />)}
          </div>
        </div>
      )}
    </div>
  );
};

export default Goals;
