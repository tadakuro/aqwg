'use client';

import styles from './page.module.css';

export default function NewPlayerPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1>New Player Guide</h1>
        <p>Everything you need to know to get started in AdventureQuest Worlds</p>
      </div>

      <section className={styles.content}>
        <div className={styles.card}>
          <h2>Game Basics</h2>
          <p>
            AdventureQuest Worlds is a browser-based MMORPG where you can:
          </p>
          <ul>
            <li>Complete quests and farm for items</li>
            <li>Level up and unlock classes</li>
            <li>Join the Good, Evil, or Chaos faction</li>
            <li>Earn weapons and armor through grinding</li>
            <li>Customize your character with cosmetics</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Getting Started</h2>
          <ol>
            <li>Create an account at <a href="https://aqwwiki.wikidot.com/" target="_blank">AQW official site</a></li>
            <li>Download and install the game launcher</li>
            <li>Create your character</li>
            <li>Complete the tutorial quests</li>
            <li>Start the 13 Lords of Chaos story</li>
          </ol>
        </div>

        <div className={styles.card}>
          <h2>Leveling Up</h2>
          <p>
            Your level determines your power. The max level is 100. 
            Earn XP by:
          </p>
          <ul>
            <li>Completing quests</li>
            <li>Defeating monsters</li>
            <li>Participating in events</li>
            <li>Using XP boosters</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Currency</h2>
          <ul>
            <li><strong>Gold</strong> - In-game currency (earned from quests/combat)</li>
            <li><strong>Adventure Coins (ACs)</strong> - Premium currency (paid)</li>
            <li><strong>Class Points (CP)</strong> - Rank up your current class</li>
            <li><strong>Reputation</strong> - Join factions and earn rewards</li>
          </ul>
        </div>

        <div className={styles.card}>
          <h2>Community</h2>
          <p>
            Join our Discord to connect with other players, ask questions, 
            and stay updated on new guides!
          </p>
          <a href="https://discord.gg/your-server" target="_blank" className={styles.discordBtn}>
            Join Discord Server
          </a>
        </div>

        <div className={styles.card}>
          <h2>More Resources</h2>
          <ul>
            <li><a href="/guides">Browse all guides</a></li>
            <li><a href="/farming-list">Farming strategies</a></li>
            <li><a href="/acronyms">Game terminology</a></li>
          </ul>
        </div>
      </section>
    </div>
  );
}
