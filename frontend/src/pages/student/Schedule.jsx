import { useState } from 'react';
import { Calendar, Plus, Trash2, Clock, X, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import './NotesSchedule.css';
import './Goals.css';

const STORAGE_KEY = 'eduportal_schedule';
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const SHORT_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const COLORS = [
  { label: 'Lavender', bg: '#F0E8F8', border: '#C8A2C8', text: '#7A4E7A' },
  { label: 'Pink',     bg: '#FDE8F0', border: '#F8C8DC', text: '#9C4060' },
  { label: 'Blue',     bg: '#E8F0FE', border: '#A8C0F8', text: '#2D5AB0' },
  { label: 'Green',    bg: '#E8F8EE', border: '#A8D8B8', text: '#2D7A50' },
  { label: 'Orange',   bg: '#FEF2E8', border: '#F8D0A8', text: '#9C5A20' },
];

const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const save = (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

const Schedule = () => {
  const [events, setEvents]     = useState(load);
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState(new Date().getDay());
  const [form, setForm] = useState({ title: '', day: new Date().getDay(), startTime: '09:00', endTime: '10:00', subject: '', color: COLORS[0].label });

  const persist = (next) => { setEvents(next); save(next); };

  const handleAdd = (e) => {
    e.preventDefault();
    if (!form.title.trim()) return;
    persist([...events, { id: Date.now().toString(), ...form }]);
    setForm({ title: '', day: selectedDay, startTime: '09:00', endTime: '10:00', subject: '', color: COLORS[0].label });
    setShowForm(false);
  };

  const deleteEvent = (id) => persist(events.filter(e => e.id !== id));

  const dayEvents = events
    .filter(e => Number(e.day) === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  const today = new Date().getDay();

  // Get start of current week (Sunday)
  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());

  const getDateForDay = (dayIndex) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + dayIndex);
    return d;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <div>
          <h1>Weekly Schedule</h1>
          <p>Plan and manage your weekly classes and study sessions.</p>
        </div>
        <button className="btn-new-goal" onClick={() => { setShowForm(s => !s); setForm(f => ({ ...f, day: selectedDay })); }}>
          {showForm ? <><X size={18} /> Cancel</> : <><Plus size={18} /> Add Event</>}
        </button>
      </div>

      {/* Week Strip */}
      <div className="week-strip">
        {DAYS.map((day, i) => {
          const d = getDateForDay(i);
          const isToday = i === today;
          const isSelected = i === selectedDay;
          const count = events.filter(e => Number(e.day) === i).length;
          return (
            <button
              key={i}
              className={`week-day-btn ${isSelected ? 'selected' : ''} ${isToday ? 'today' : ''}`}
              onClick={() => setSelectedDay(i)}
            >
              <span className="week-day-label">{SHORT_DAYS[i]}</span>
              <span className="week-day-num">{d.getDate()}</span>
              {count > 0 && <span className="week-day-dot">{count}</span>}
            </button>
          );
        })}
      </div>

      {/* Add Event Form */}
      {showForm && (
        <div className="add-goal-form">
          <h3 className="form-title"><Calendar size={18} color="var(--primary-hover)" /> New Event — {DAYS[selectedDay]}</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
              <input
                className="goal-form-input"
                placeholder="Event title (e.g. Advanced Mathematics)"
                value={form.title}
                onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                required
              />
              <input
                type="time"
                className="goal-form-input"
                value={form.startTime}
                onChange={e => setForm(f => ({ ...f, startTime: e.target.value }))}
              />
              <input
                type="time"
                className="goal-form-input"
                value={form.endTime}
                onChange={e => setForm(f => ({ ...f, endTime: e.target.value }))}
              />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
              <select
                className="goal-form-input"
                value={form.day}
                onChange={e => setForm(f => ({ ...f, day: Number(e.target.value) }))}
              >
                {DAYS.map((d, i) => <option key={i} value={i}>{d}</option>)}
              </select>
              <input
                className="goal-form-input"
                placeholder="Subject / Room (optional)"
                value={form.subject}
                onChange={e => setForm(f => ({ ...f, subject: e.target.value }))}
              />
              <select
                className="goal-form-input"
                value={form.color}
                onChange={e => setForm(f => ({ ...f, color: e.target.value }))}
              >
                {COLORS.map(c => <option key={c.label} value={c.label}>{c.label}</option>)}
              </select>
            </div>
            <div className="form-actions">
              <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
              <button type="submit" className="btn-add-goal" disabled={!form.title.trim()}>
                <Plus size={16} /> Add Event
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Day Schedule */}
      <div className="schedule-layout">
        {/* Left: Day List */}
        <div className="schedule-main">
          <div className="schedule-day-header">
            <h2 className="goals-section-title" style={{ margin: 0 }}>
              <Calendar size={18} color="var(--primary-hover)" />
              {DAYS[selectedDay]}
              {selectedDay === today && (
                <span style={{ fontSize: '0.75rem', background: 'var(--primary-color)', color: '#fff', padding: '0.2rem 0.65rem', borderRadius: '20px', fontWeight: 700 }}>
                  Today
                </span>
              )}
            </h2>
            <span className="goals-count-chip">{dayEvents.length} events</span>
          </div>

          {dayEvents.length === 0 ? (
            <div className="goals-empty">
              <Calendar size={36} color="var(--primary-color)" style={{ opacity: 0.4 }} />
              <p>No events for {DAYS[selectedDay]}. Hit "Add Event" to add one!</p>
            </div>
          ) : (
            <div className="schedule-list">
              {dayEvents.map((event, idx) => {
                const colorObj = COLORS.find(c => c.label === event.color) || COLORS[0];
                return (
                  <div
                    key={event.id}
                    className="schedule-event-card"
                    style={{ background: colorObj.bg, borderColor: colorObj.border }}
                  >
                    <div className="event-time-block" style={{ color: colorObj.text }}>
                      <Clock size={13} />
                      {event.startTime} – {event.endTime}
                    </div>
                    <div className="event-content">
                      <div className="event-title" style={{ color: colorObj.text }}>{event.title}</div>
                      {event.subject && (
                        <div className="event-subject">
                          <BookOpen size={12} /> {event.subject}
                        </div>
                      )}
                    </div>
                    <button className="note-action-btn danger" onClick={() => deleteEvent(event.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: Weekly Summary */}
        <div>
          <div className="schedule-weekly-summary">
            <h3 style={{ margin: '0 0 1.25rem', fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)' }}>
              Week Overview
            </h3>
            {DAYS.map((day, i) => {
              const count = events.filter(e => Number(e.day) === i).length;
              const isSelected = i === selectedDay;
              return (
                <div
                  key={i}
                  className={`weekly-summary-row ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedDay(i)}
                >
                  <span className="weekly-summary-day">{SHORT_DAYS[i]}</span>
                  <div className="weekly-summary-bar-track">
                    <div className="weekly-summary-bar-fill" style={{ width: `${Math.min(count * 25, 100)}%` }} />
                  </div>
                  <span className="weekly-summary-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule;
