import React, { useState } from 'react';
import { ageGroups } from './games';

export default function AgeGames({ onPlay }) {
  const [selectedId, setSelectedId] = useState(null);
  const selected = ageGroups.find(group => group.id === selectedId);

  return <section id="age-games" className="library age-library" aria-labelledby="age-heading">
    <div className="sectionheading">
      <div><span className="eyebrow">Little steps, big discoveries</span><h2 id="age-heading">Find their next favorite game</h2></div>
      <p className="age-intro">A little wonder for every age.</p>
    </div>
    <div className="age-groups" aria-label="Games by age">
      {ageGroups.map(group => <button
        key={group.id}
        type="button"
        className={`age-tile ${selectedId === group.id ? 'is-selected' : ''}`}
        style={{ '--tile-bg': group.background, '--tile-ink': group.ink }}
        disabled={!group.games.length}
        aria-pressed={selectedId === group.id}
        aria-expanded={selectedId === group.id}
        aria-controls="age-game-list"
        onClick={() => setSelectedId(group.id)}
      >
        <span className="age-doodle" aria-hidden="true">{group.emoji}</span>
        <span className="tile-label">{group.label}</span>
        <span className="age-status">{group.games.length ? `${group.games.length} games · Explore →` : 'Coming soon'}</span>
      </button>)}
    </div>
    {selected && <div key={selected.id} id="age-game-list" className={`age-game-list ${selected.collectionClass || ''}`} aria-labelledby="selected-age-heading" style={{ '--collection-bg': selected.background, '--collection-ink': selected.ink }}>
      <div className="collection-banner">
        <span className="collection-mascot" aria-hidden="true">{selected.emoji}</span>
        <div className="collection-copy"><span className="collection-kicker">{selected.label} · {selected.games.length} {selected.features ? 'challenges to discover' : 'little adventures'}</span><h3 id="selected-age-heading">{selected.title}</h3><p>{selected.description}</p>{selected.features && <ul className="collection-features">{selected.features.map(feature => <li key={feature}>{feature}</li>)}</ul>}</div>
        <span className="collection-sticker" aria-hidden="true">LET’S<br/>PLAY! ✦</span>
      </div>
      <div className="toddler-grid">
        {selected.games.map(game => <button key={game.id} className="toddler-tile" style={{ '--tile-bg': game.background, '--tile-ink': game.ink || '#3a2c1c' }} onClick={() => onPlay(game)}>
          <span className="tile-spark" aria-hidden="true">✦</span>
          {game.skill && <span className="game-skill">{game.skill}</span>}
          <span className="toddler-illustration" aria-hidden="true">{game.emoji}</span>
          <span className="tile-copy"><span className="tile-label">{game.name}</span><span className="tile-description">{game.description}</span></span>
          <span className="tile-play" aria-hidden="true">▶</span>
        </button>)}
      </div>
      <p className="toddler-note">{selected.note || `Made for tapping and exploring. No scores, no losing. Parents can hold the home button inside a game to return to the ${selected.title} menu.`}</p>
    </div>}
  </section>;
}
