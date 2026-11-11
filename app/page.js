"use client";
import { useEffect, useRef, useState } from "react";

const COLORS = ["#fde68a", "#fbcfe8", "#bfdbfe", "#bbf7d0", "#fed7aa"];

export default function Home() {
  const [notes, setNotes] = useState([]);
  const [color, setColor] = useState(COLORS[0]);
  const [loaded, setLoaded] = useState(false);
  const timers = useRef({});

  useEffect(() => {
    fetch("/api/notes")
      .then((r) => r.json())
      .then((data) => setNotes(data))
      .finally(() => setLoaded(true));
  }, []);

  async function addNote() {
    const res = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ color }),
    });
    const note = await res.json();
    setNotes((n) => [note, ...n]);
  }

  function patch(id, changes) {
    setNotes((n) => n.map((x) => (x.id === id ? { ...x, ...changes } : x)));
    clearTimeout(timers.current[id]);
    timers.current[id] = setTimeout(() => {
      fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
    }, 400); // debounced autosave
  }

  async function remove(id) {
    setNotes((n) => n.filter((x) => x.id !== id));
    await fetch(`/api/notes/${id}`, { method: "DELETE" });
  }

  return (
    <main>
      <header>
        <h1>Sticky Notes</h1>
        <div className="controls">
          <div className="swatches">
            {COLORS.map((c) => (
              <button
                key={c}
                aria-label={`Pick color ${c}`}
                className={c === color ? "swatch active" : "swatch"}
                style={{ background: c }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
          <button className="add" onClick={addNote}>+ New note</button>
        </div>
      </header>

      {loaded && notes.length === 0 && (
        <p className="empty">No notes yet. Click “New note” to start.</p>
      )}

      <section className="grid">
        {notes.map((note) => (
          <article key={note.id} className="note" style={{ background: note.color }}>
            <textarea
              value={note.text}
              placeholder="Write something..."
              maxLength={2000}
              onChange={(e) => patch(note.id, { text: e.target.value })}
            />
            <footer>
              <span>{new Date(note.createdAt).toLocaleDateString()}</span>
              <button onClick={() => remove(note.id)} aria-label="Delete note">✕</button>
            </footer>
          </article>
        ))}
      </section>
    </main>
  );
}
