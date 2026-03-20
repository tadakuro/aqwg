'use client';

import styles from './page.module.css';

export default function AcronymsPage() {
  const acronyms = {
    Classes: [
      { abbr: 'AF', full: 'ArchFiend' },
      { abbr: 'AP', full: 'ArchPaladin' },
      { abbr: 'VHL', full: 'Void Highlord' },
      { abbr: 'LR', full: 'Legion Revenant' },
      { abbr: 'DoT', full: 'Dragon of Time' },
    ],
    Items: [
      { abbr: 'BLoD', full: 'Blinding Light of Destiny' },
      { abbr: 'BBoA', full: 'Burning Blade of Abezeth' },
      { abbr: 'NSoD', full: 'Necrotic Sword of Doom' },
      { abbr: 'CoA', full: 'Cape of Awe' },
    ],
    Game: [
      { abbr: 'XP', full: 'Experience Points' },
      { abbr: 'AC', full: 'Adventure Coins' },
      { abbr: 'CP', full: 'Class Points' },
      { abbr: 'HP', full: 'Health Points' },
      { abbr: 'MP', full: 'Mana Points' },
      { abbr: 'DPS', full: 'Damage Per Second' },
    ],
  };

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>Game Acronyms</h1>
        <p>Common abbreviations used in the AQW community</p>
      </div>

      <div className={styles.acronymsList}>
        {Object.entries(acronyms).map(([category, items]) => (
          <section key={category} className={styles.section}>
            <h2>{category}</h2>
            <table className={styles.table}>
              <tbody>
                {items.map((item) => (
                  <tr key={item.abbr}>
                    <td className={styles.abbr}>{item.abbr}</td>
                    <td className={styles.full}>{item.full}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        ))}
      </div>

      <p style={{ textAlign: 'center', color: '#888', marginTop: '2rem' }}>
        More acronyms available in individual guide pages!
      </p>
    </div>
  );
}
