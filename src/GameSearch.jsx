import React, { useRef } from 'react';
import { ageGroups } from './games';
import { searchGames, tokensFor } from './search.mjs';
import './search.css';

function Highlight({ text, query }) {
  const tokens = tokensFor(query).map(token => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!tokens.length) return text;
  const pattern = new RegExp(`(${tokens.join('|')})`, 'ig');
  return String(text).split(pattern).map((part, index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

export default function GameSearch({ onPlay, state, setState }) {
  const { query, category, ageGroupId } = state;
  const setQuery = query => setState(previous => ({ ...previous, query }));
  const setCategory = category => setState(previous => ({ ...previous, category }));
  const setAgeGroupId = ageGroupId => setState(previous => ({ ...previous, ageGroupId }));
  const input = useRef(null);
  const active = !!query.trim();
  const results = searchGames(query, { category, ageGroupId });
  const clear = () => { setQuery(''); setCategory('All'); setAgeGroupId(''); input.current?.focus(); };
  return <section className="game-search" aria-labelledby="search-heading">
    <div className="search-intro"><span className="eyebrow">FIND YOUR NEXT ADVENTURE</span><h2 id="search-heading">What would you like to play?</h2><p>Find a game, a skill or a whole new world.</p></div>
    <form role="search" onSubmit={event => event.preventDefault()}>
      <label className="search-label" htmlFor="game-search-input">Search games and learning worlds</label>
      <div className="search-field"><span aria-hidden="true">⌕</span><input ref={input} id="game-search-input" type="search" autoComplete="off" maxLength={160} placeholder="Try robots, letters or puzzles…" value={query} aria-controls="game-search-results" onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') clear(); }} />{query && <button type="button" onClick={clear} aria-label="Clear search">Clear</button>}</div>
      {active && <div className="search-filters"><label>Category<select value={category} onChange={event => setCategory(event.target.value)}>{['All', 'Adventure', 'Learning'].map(value => <option key={value}>{value}</option>)}</select></label><label>Age collection<select value={ageGroupId} onChange={event => setAgeGroupId(event.target.value)}><option value="">All collections</option>{ageGroups.map(group => <option value={group.id} key={group.id}>{group.label} · {group.title}</option>)}</select></label><button type="button" onClick={() => { setCategory('All'); setAgeGroupId(''); }}>Reset filters</button></div>}
    </form>
    <div id="game-search-results">
      <p className="search-count" role="status" aria-live="polite">{active ? `${results.length} ${results.length === 1 ? 'game' : 'games'} found` : 'Search all playable games. No account needed.'}</p>
      {active && (results.length ? <div className="search-grid">{results.map(game => <article className="search-card" key={game.searchId}><div className="search-art" style={{ background: game.background || '#e5edcc' }} aria-hidden="true">{game.emoji}</div><div className="search-copy"><small>{game.collection}{game.age ? ` · ${game.age.startsWith('Ages') ? game.age : `Ages ${game.age}`}` : ''}</small><h3><Highlight text={game.name} query={query}/></h3><p><Highlight text={game.description} query={query}/></p><button type="button" onClick={() => onPlay(game)} aria-label={`Play ${game.name}`}>Play now →</button></div></article>)}</div> : <div className="search-empty"><h3>No adventures found yet</h3><p>Try a shorter word like “robot” or “math”, or reset your filters.</p><button type="button" onClick={clear}>Clear search and start again</button></div>)}
    </div>
  </section>;
}
