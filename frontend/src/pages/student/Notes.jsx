import { useState, useMemo } from 'react';
import { FileText, Plus, Trash2, Search, Tag, X, Star, StarOff, Clock } from 'lucide-react';
import './NotesSchedule.css';

const STORAGE_KEY = 'eduportal_notes';
const COLORS = [
  { name: 'Lavender', value: '#F5EDF5', border: '#DFC8DF' },
  { name: 'Pink',     value: '#FDF0F4', border: '#F5CADA' },
  { name: 'Sky',      value: '#EEF4FF', border: '#C0D4F5' },
  { name: 'Mint',     value: '#EDF8F2', border: '#B8DDCA' },
  { name: 'Peach',    value: '#FFF3EC', border: '#F5D4BC' },
  { name: 'White',    value: '#FFFFFF', border: '#E8D8E8' },
];

const load = () => { try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) || []; } catch { return []; } };
const save = (d) => localStorage.setItem(STORAGE_KEY, JSON.stringify(d));

const Notes = () => {
  const [notes, setNotes]         = useState(load);
  const [search, setSearch]       = useState('');
  const [activeTag, setActiveTag] = useState('');
  const [editId, setEditId]       = useState(null);

  // Form state
  const [form, setForm] = useState({ title: '', body: '', color: COLORS[0].value, tag: '', pinned: false });

  const persist = (next) => { setNotes(next); save(next); };

  // All unique tags
  const allTags = useMemo(() => [...new Set(notes.flatMap(n => n.tag ? [n.tag] : []))], [notes]);

  // Filtered & sorted notes
  const filtered = useMemo(() => {
    return notes
      .filter(n => {
        const q = search.toLowerCase();
        const matchSearch = !q || n.title.toLowerCase().includes(q) || n.body.toLowerCase().includes(q);
        const matchTag = !activeTag || n.tag === activeTag;
        return matchSearch && matchTag;
      })
      .sort((a, b) => (b.pinned - a.pinned) || new Date(b.updatedAt) - new Date(a.updatedAt));
  }, [notes, search, activeTag]);

  const pinned   = filtered.filter(n => n.pinned);
  const unpinned = filtered.filter(n => !n.pinned);

  const handleSave = () => {
    if (!form.title.trim() && !form.body.trim()) return;
    if (editId) {
      persist(notes.map(n => n.id === editId ? { ...n, ...form, updatedAt: new Date().toISOString() } : n));
      setEditId(null);
    } else {
      const newNote = { id: Date.now().toString(), ...form, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
      persist([newNote, ...notes]);
    }
    setForm({ title: '', body: '', color: COLORS[0].value, tag: '', pinned: false });
  };

  const openEdit = (note) => {
    setEditId(note.id);
    setForm({ title: note.title, body: note.body, color: note.color, tag: note.tag, pinned: note.pinned });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const togglePin  = (id) => persist(notes.map(n => n.id === id ? { ...n, pinned: !n.pinned } : n));
  const deleteNote = (id) => persist(notes.filter(n => n.id !== id));
  const cancelEdit = () => { setEditId(null); setForm({ title: '', body: '', color: COLORS[0].value, tag: '', pinned: false }); };

  const colorObj = COLORS.find(c => c.value === form.color) || COLORS[0];

  const NoteCard = ({ note }) => {
    const c = COLORS.find(c => c.value === note.color) || COLORS[5];
    return (
      <div
        className="note-card"
        style={{ background: c.value, borderColor: c.border }}
        onClick={() => openEdit(note)}
      >
        {note.pinned && <div className="note-pin-badge"><Star size={11} /> Pinned</div>}
        <div className="note-card-title">{note.title || 'Untitled'}</div>
        <div className="note-card-body">{note.body}</div>
        <div className="note-card-footer">
          {note.tag && <span className="note-tag-chip">#{note.tag}</span>}
          <span className="note-time"><Clock size={11} /> {new Date(note.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
        </div>
        <div className="note-card-actions" onClick={e => e.stopPropagation()}>
          <button className="note-action-btn" onClick={() => togglePin(note.id)} title={note.pinned ? 'Unpin' : 'Pin'}>
            {note.pinned ? <StarOff size={14} /> : <Star size={14} />}
          </button>
          <button className="note-action-btn danger" onClick={() => deleteNote(note.id)} title="Delete">
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div className="page-header">
        <div>
          <h1>Notes</h1>
          <p>Capture ideas, summaries, and study material.</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.25)', borderRadius: 'var(--radius-sm)', padding: '0.5rem 1rem', fontWeight: 700, fontSize: '0.9rem' }}>
          {notes.length} {notes.length === 1 ? 'Note' : 'Notes'}
        </div>
      </div>

      {/* Editor */}
      <div className="note-editor" style={{ background: colorObj.value, borderColor: colorObj.border }}>
        <input
          className="note-editor-title"
          placeholder="Note title..."
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
        />
        <textarea
          className="note-editor-body"
          placeholder="Start writing your note here..."
          rows={5}
          value={form.body}
          onChange={e => setForm(f => ({ ...f, body: e.target.value }))}
        />
        <div className="note-editor-toolbar">
          {/* Color Picker */}
          <div className="color-strip">
            {COLORS.map(c => (
              <button
                key={c.value}
                className={`color-dot ${form.color === c.value ? 'active' : ''}`}
                style={{ background: c.value, borderColor: c.border }}
                onClick={() => setForm(f => ({ ...f, color: c.value }))}
                title={c.name}
              />
            ))}
          </div>
          {/* Tag */}
          <input
            className="note-tag-input"
            placeholder="Tag (e.g. Physics)"
            value={form.tag}
            onChange={e => setForm(f => ({ ...f, tag: e.target.value.replace(/\s/g, '') }))}
            maxLength={20}
          />
          {/* Pin toggle */}
          <button
            className={`note-action-btn ${form.pinned ? 'pinned' : ''}`}
            onClick={() => setForm(f => ({ ...f, pinned: !f.pinned }))}
            title="Pin note"
          >
            <Star size={16} /> {form.pinned ? 'Pinned' : 'Pin'}
          </button>
          {/* Save / Cancel */}
          <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
            {editId && <button className="note-cancel-btn" onClick={cancelEdit}><X size={14} /> Cancel</button>}
            <button className="note-save-btn" onClick={handleSave} disabled={!form.title.trim() && !form.body.trim()}>
              <Plus size={16} /> {editId ? 'Update' : 'Save Note'}
            </button>
          </div>
        </div>
      </div>

      {/* Search + Tag Filters */}
      <div className="notes-controls">
        <div className="notes-search">
          <Search size={16} color="var(--text-secondary)" />
          <input
            placeholder="Search notes..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <button onClick={() => setSearch('')}><X size={14} /></button>}
        </div>
        <div className="tag-filter-strip">
          <button className={`tag-filter-btn ${!activeTag ? 'active' : ''}`} onClick={() => setActiveTag('')}>All</button>
          {allTags.map(t => (
            <button key={t} className={`tag-filter-btn ${activeTag === t ? 'active' : ''}`} onClick={() => setActiveTag(activeTag === t ? '' : t)}>
              #{t}
            </button>
          ))}
        </div>
      </div>

      {/* Pinned Notes */}
      {pinned.length > 0 && (
        <div>
          <div className="notes-section-label"><Star size={14} /> Pinned</div>
          <div className="notes-grid">{pinned.map(n => <NoteCard key={n.id} note={n} />)}</div>
        </div>
      )}

      {/* All Notes */}
      {unpinned.length > 0 ? (
        <div>
          {pinned.length > 0 && <div className="notes-section-label"><FileText size={14} /> Other Notes</div>}
          <div className="notes-grid">{unpinned.map(n => <NoteCard key={n.id} note={n} />)}</div>
        </div>
      ) : pinned.length === 0 && (
        <div className="empty-state">
          <FileText size={36} style={{ opacity: 0.4, color: 'var(--primary-color)', marginBottom: '0.5rem' }} />
          <p>No notes yet. Write your first one above!</p>
        </div>
      )}
    </div>
  );
};

export default Notes;
