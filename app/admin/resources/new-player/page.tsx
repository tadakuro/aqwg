'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import RichEditor from '@/app/components/RichEditor';
import styles from '../../admin.module.css';
import pageStyles from './page.module.css';

interface Card {
  id: string;
  title: string;
  content: string;
  sort_order: number;
}

export default function AdminNewPlayerPage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [error, setError] = useState('');

  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formOrder, setFormOrder] = useState(0);

  const [expandedCards, setExpandedCards] = useState<Set<string>>(new Set());

  const toggleExpanded = (id: string) => {
    setExpandedCards((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  useEffect(() => { loadCards(); }, []);

  const loadCards = async () => {
    setLoading(true);
    const res = await fetch('/api/resources/new-player');
    const d = await res.json();
    setCards(d.data || []);
    setLoading(false);
  };

  const openNew = () => {
    setEditingCard(null);
    setFormTitle('');
    setFormContent('');
    setFormOrder(cards.length);
    setError('');
    setShowForm(true);
  };

  const openEdit = (card: Card) => {
    setEditingCard(card);
    setFormTitle(card.title);
    setFormContent(card.content);
    setFormOrder(card.sort_order);
    setError('');
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formTitle.trim() || !formContent.trim()) {
      setError('Title and content are required.');
      return;
    }
    setSaving(true);
    setError('');

    const method = editingCard ? 'PUT' : 'POST';
    const body = editingCard
      ? { id: editingCard.id, title: formTitle, content: formContent, order: formOrder }
      : { title: formTitle, content: formContent, order: formOrder };

    const res = await fetch('/api/resources/new-player', {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (res.ok) {
      await loadCards();
      setShowForm(false);
    } else {
      setError('Failed to save. Check your Supabase connection.');
    }
    setSaving(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this card?')) return;
    setDeletingId(id);
    await fetch('/api/resources/new-player', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    setCards((prev) => prev.filter((c) => c.id !== id));
    setDeletingId(null);
  };

  return (
    <div className={styles.admin}>
      <div className={styles.header}>
        <h1>New Player Guide</h1>
        <p>Manage the cards shown on the New Player page</p>
      </div>

      <div className={pageStyles.toolbar}>
        <Link href="/admin" className={pageStyles.backBtn}>← Dashboard</Link>
        <button className={pageStyles.newBtn} onClick={openNew}>➕ Add Card</button>
      </div>

      {showForm && (
        <div className={pageStyles.form}>
          <h2>{editingCard ? 'Edit Card' : 'New Card'}</h2>
          {error && <p className={pageStyles.error}>{error}</p>}
          <div className={pageStyles.field}>
            <label>Title *</label>
            <input value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="e.g., Game Basics" />
          </div>
          <div className={pageStyles.field}>
            <label>Content *</label>
            <RichEditor
              value={formContent}
              onChange={setFormContent}
              placeholder="Write the card content here..."
              minHeight={200}
            />
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
      ) : cards.length === 0 ? (
        <div className={pageStyles.empty}><p>No cards yet. Add one above!</p></div>
      ) : (
        <div className={pageStyles.list}>
          {cards.map((card) => (
            <div key={card.id} className={pageStyles.card}>
              <div className={pageStyles.cardTop}>
                <span className={pageStyles.order}>#{card.sort_order}</span>
                <h3>{card.title}</h3>
                <div className={pageStyles.actions}>
                  <button onClick={() => openEdit(card)} className={pageStyles.editBtn}>✏️ Edit</button>
                  <button onClick={() => handleDelete(card.id)} disabled={deletingId === card.id} className={pageStyles.deleteBtn}>🗑 Delete</button>
                </div>
              </div>
              <div
                className={`${pageStyles.preview} ${expandedCards.has(card.id) ? pageStyles.expanded : ''}`}
                dangerouslySetInnerHTML={{ __html: card.content }}
              />
              <button
                className={pageStyles.readMoreBtn}
                onClick={() => toggleExpanded(card.id)}
              >
                {expandedCards.has(card.id) ? '▲ Show Less' : '▼ Read More'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
