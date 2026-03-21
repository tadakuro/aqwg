'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../admin.module.css';
import pageStyles from '../new-player/page.module.css';

interface Acronym {
  id: string;
  category: string;
  abbreviation: string;
  full_name: string;
}

export default function AdminAcronymsPage() {
  const [acronyms, setAcronyms] = useState<Acronym[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<Acronym | null>(null);
  const [error, setError] = useState('');

  const [formCategory, setFormCategory] = useState('');
  const [formAbbr, setFormAbbr] = useState('');
  const [formFull, setFormFull] = useState('');

  useEffect(() => { loadAcronyms(); }, []);

  const loadAcronyms = async () => {
    setLoading(true);
    const res = await fetch('/api/resources/acronyms');
    const d = await res.json();
    setAcronyms(d.data || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditingItem(null);
    setFormCategory('');
    setFormAbbr('');
    setFormFull('');
    setError('');
    setShowForm(true);
  };

  const openEdit = (a: Acronym) => {
    setEditingItem(a);
    setFormCategory(a.category);
    setFormAbbr(a.abbreviation);
    setFormFull(a.full_name);
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formCategory.trim() || !formAbbr.trim() || !formFull.trim()) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError('');

    const method = editingItem ? 'PUT' : 'POST';
    const body = editingItem
      ? { id: editingItem.id, category: formCategory, abbreviation: formAbbr, full_name: formFull }
      : { category: formCategory, abbreviation: formAbbr, full_name: formFull };

    const res = await fetch('/api/resources/acronyms', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) { await loadAcronyms(); setShowForm(false); }
    else { setError('Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this acronym?')) return;
    setDeletingId(id);
    await fetch('/api/resources/acronyms', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setAcronyms((prev) => prev.filter((a) => a.id !== id));
    setDeletingId(null);
  };

  const grouped = acronyms.reduce<Record<string, Acronym[]>>((acc, a) => {
    if (!acc[a.category]) acc[a.category] = [];
    acc[a.category].push(a);
    return acc;
  }, {});

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Acronyms</h1>
        <p>Manage game abbreviations grouped by category</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <button className={pageStyles.newBtn} onClick={openNew}>➕ Add Acronym</button>
      </div>

      {showForm && (
        <div className={pageStyles.form}>
          <h2>{editingItem ? 'Edit Acronym' : 'New Acronym'}</h2>
          {error && <p className={pageStyles.error}>{error}</p>}
          <div className={pageStyles.field}>
            <label>Category * <span className={pageStyles.hint}>(e.g., Classes, Items, Game)</span></label>
            <input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="Classes" />
          </div>
          <div className={pageStyles.field}>
            <label>Abbreviation *</label>
            <input value={formAbbr} onChange={(e) => setFormAbbr(e.target.value)} placeholder="VHL" />
          </div>
          <div className={pageStyles.field}>
            <label>Full Name *</label>
            <input value={formFull} onChange={(e) => setFormFull(e.target.value)} placeholder="Void Highlord" />
          </div>
          <div className={pageStyles.formActions}>
            <button onClick={handleSave} disabled={saving} className={pageStyles.saveBtn}>{saving ? 'Saving…' : '💾 Save'}</button>
            <button onClick={() => setShowForm(false)} className={pageStyles.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : acronyms.length === 0 ? (
        <div className={pageStyles.empty}><p>No acronyms yet. Add one above!</p></div>
      ) : (
        <div className={pageStyles.list}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className={pageStyles.card}>
              <div className={pageStyles.cardTop}>
                <h3>{category}</h3>
              </div>
              {items.map((item) => (
                <div key={item.id} className={pageStyles.row}>
                  <span className={pageStyles.rowLabel}>
                    <strong style={{ color: '#4db8ff', fontFamily: 'monospace' }}>{item.abbreviation}</strong>
                    {' — '}{item.full_name}
                  </span>
                  <div className={pageStyles.actions}>
                    <button onClick={() => openEdit(item)} className={pageStyles.editBtn}>✏️</button>
                    <button onClick={() => handleDelete(item.id)} disabled={deletingId === item.id} className={pageStyles.deleteBtn}>🗑</button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
