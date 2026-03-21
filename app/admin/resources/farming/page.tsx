'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../../admin.module.css';
import pageStyles from '../new-player/page.module.css';

interface FarmingEntry {
  id: string;
  category: string;
  label: string;
  value: string;
  order: number;
}

export default function AdminFarmingPage() {
  const [entries, setEntries] = useState<FarmingEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEntry, setEditingEntry] = useState<FarmingEntry | null>(null);
  const [error, setError] = useState('');

  const [formCategory, setFormCategory] = useState('');
  const [formLabel, setFormLabel] = useState('');
  const [formValue, setFormValue] = useState('');
  const [formOrder, setFormOrder] = useState(0);

  useEffect(() => { loadEntries(); }, []);

  const loadEntries = async () => {
    setLoading(true);
    const res = await fetch('/api/resources/farming');
    const d = await res.json();
    setEntries(d.data || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditingEntry(null);
    setFormCategory('');
    setFormLabel('');
    setFormValue('');
    setFormOrder(entries.length);
    setError('');
    setShowForm(true);
  };

  const openEdit = (e: FarmingEntry) => {
    setEditingEntry(e);
    setFormCategory(e.category);
    setFormLabel(e.label);
    setFormValue(e.value);
    setFormOrder(e.order);
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formCategory.trim() || !formLabel.trim() || !formValue.trim()) {
      setError('All fields are required.');
      return;
    }
    setSaving(true);
    setError('');

    const method = editingEntry ? 'PUT' : 'POST';
    const body = editingEntry
      ? { id: editingEntry.id, category: formCategory, label: formLabel, value: formValue, order: formOrder }
      : { category: formCategory, label: formLabel, value: formValue, order: formOrder };

    const res = await fetch('/api/resources/farming', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) { await loadEntries(); setShowForm(false); }
    else { setError('Failed to save.'); }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this entry?')) return;
    setDeletingId(id);
    await fetch('/api/resources/farming', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setEntries((prev) => prev.filter((e) => e.id !== id));
    setDeletingId(null);
  };

  const grouped = entries.reduce<Record<string, FarmingEntry[]>>((acc, e) => {
    if (!acc[e.category]) acc[e.category] = [];
    acc[e.category].push(e);
    return acc;
  }, {});

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>Farming List</h1>
        <p>Manage farming entries grouped by category</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <button className={pageStyles.newBtn} onClick={openNew}>➕ Add Entry</button>
      </div>

      {showForm && (
        <div className={pageStyles.form}>
          <h2>{editingEntry ? 'Edit Entry' : 'New Entry'}</h2>
          {error && <p className={pageStyles.error}>{error}</p>}
          <div className={pageStyles.field}>
            <label>Category * <span className={pageStyles.hint}>(e.g., XP Farming, Item Farming)</span></label>
            <input value={formCategory} onChange={(e) => setFormCategory(e.target.value)} placeholder="XP Farming" />
          </div>
          <div className={pageStyles.field}>
            <label>Label * <span className={pageStyles.hint}>(e.g., Level 1-49)</span></label>
            <input value={formLabel} onChange={(e) => setFormLabel(e.target.value)} placeholder="Level 1-49" />
          </div>
          <div className={pageStyles.field}>
            <label>Value * <span className={pageStyles.hint}>(e.g., /firewar - Fire Dragons)</span></label>
            <input value={formValue} onChange={(e) => setFormValue(e.target.value)} placeholder="/firewar (Fire Dragons)" />
          </div>
          <div className={pageStyles.field}>
            <label>Order</label>
            <input type="number" value={formOrder} onChange={(e) => setFormOrder(Number(e.target.value))} style={{ width: '100px' }} />
          </div>
          <div className={pageStyles.formActions}>
            <button onClick={handleSave} disabled={saving} className={pageStyles.saveBtn}>{saving ? 'Saving…' : '💾 Save'}</button>
            <button onClick={() => setShowForm(false)} className={pageStyles.cancelBtn}>Cancel</button>
          </div>
        </div>
      )}

      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : entries.length === 0 ? (
        <div className={pageStyles.empty}><p>No entries yet. Add one above!</p></div>
      ) : (
        <div className={pageStyles.list}>
          {Object.entries(grouped).map(([category, items]) => (
            <div key={category} className={pageStyles.card}>
              <div className={pageStyles.cardTop}>
                <h3>{category}</h3>
              </div>
              {items.map((item) => (
                <div key={item.id} className={pageStyles.row}>
                  <span className={pageStyles.rowLabel}><strong>{item.label}:</strong> {item.value}</span>
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
