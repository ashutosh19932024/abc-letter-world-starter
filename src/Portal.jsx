import React, { useEffect, useRef, useState } from 'react';
import { Search, Home, Heart, Clock3, Shapes, ArrowLeft, Maximize, RotateCcw, Gamepad2, Sparkles, X, ArrowUpRight } from 'lucide-react';
import { ageGroups } from './games';
import { searchCatalog, searchGames, tokensFor } from './search.mjs';
import AgeGames from './AgeGames';
import LearningHub from './learning/LearningHub';
import PortalArt from './PortalArt';

const playable = searchCatalog.filter(game => game.ready);
const genres = ['All games', 'Adventure', 'Learning', 'Puzzles', 'Creative', 'Science & tech'];
const matchesGenre = (game, genre) => genre === 'All games' || (genre === 'Adventure' ? game.category === 'Adventure' : genre === 'Learning' ? game.category === 'Learning' : genre === 'Puzzles' ? /puzzle|pattern|memory|logic|maze|match|bridge/i.test(`${game.id} ${game.skill}`) : genre === 'Creative' ? /paint|color|chef|dress|garden|city|kite/i.test(game.id) : /science|robot|computer|space|math/i.test(game.id));
const instructions = game => game.module ? 'Use the activity buttons to explore, test your ideas and complete each mission. Hints and a 2D view are available inside the activity.' : /kite/.test(game.id) ? 'Tap, click or press Space to keep your kite in the sky. Avoid obstacles and see how far you can fly.' : game.description;

function Highlight({ text, query }) {
  const words = tokensFor(query).map(word => word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
  if (!words.length) return text;
  return String(text).split(new RegExp(`(${words.join('|')})`, 'ig')).map((part, index) => index % 2 ? <mark key={index}>{part}</mark> : part);
}

function Player({ game, onBack, onPlay, saved, onSave }) {
  const [version, setVersion] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [notice, setNotice] = useState('');
  const frame = useRef(null);
  const title = useRef(null);
  useEffect(() => { title.current?.focus(); setLoaded(false); setNotice(''); }, [game.searchId]);
  async function fullscreen() {
    try {
      if (!frame.current?.requestFullscreen) { setNotice('Fullscreen is unavailable in this browser. You can keep playing below.'); return; }
      await frame.current.requestFullscreen();
    } catch { setNotice('Fullscreen could not open. You can keep playing below.'); }
  }
  const related = playable.filter(item => item.searchId !== game.searchId && item.category === game.category).slice(0, 6);
  return <main className="portal-player play">
    <div className="playhead"><button className="back" onClick={onBack}><ArrowLeft size={18}/> All games</button><span>{game.name}</span><button className="back" onClick={fullscreen}><Maximize size={18}/> Fullscreen</button></div>
    <div className="player-layout"><div><div className="player-stage" ref={frame}>
      {!game.module && !loaded && <div className="player-loading" role="status">Opening your game… <button onClick={() => { setVersion(value => value + 1); setNotice('Reloading the game. If it stays blank, return to the library and try another game.'); }}>Try again</button></div>}
      {game.module ? <div id="game-frame"><LearningHub key={`${game.searchId}-${version}`} initialWorld={game.module}/></div> : <iframe key={`${game.searchId}-${version}`} id="game-frame" title={game.name} src={game.url} onLoad={() => setLoaded(true)} onError={() => { setLoaded(true); setNotice('The game could not load. Try restarting or return to all games.'); }} allow="fullscreen; autoplay" allowFullScreen/>}
    </div><div className="player-details"><div><small>{game.collection} · {game.age ? `Ages ${game.age.replace(/^Ages\s*/, '')}` : 'Explore at your own pace'}</small><h1 ref={title} tabIndex="-1">{game.name}</h1></div><div className="player-actions"><button onClick={() => onSave(game.searchId)} aria-pressed={saved}><Heart size={18} fill={saved ? 'currentColor' : 'none'}/>{saved ? 'Saved' : 'Save'}</button><button onClick={() => { setLoaded(false); setVersion(value => value + 1); }}><RotateCcw size={18}/> Restart</button></div><p role="status">{notice}</p><h2>How to play</h2><p>{instructions(game)}</p><p className="player-note">Follow the instructions inside the game for its controls. Restart may keep the game's original saved progress.</p></div></div>
    <aside className="related-games"><h2>Keep exploring <Sparkles size={18}/></h2>{related.map((item, index) => <button key={item.searchId} onClick={() => onPlay(item)}><PortalArt game={item} index={index + 2}/><span>{item.name}<small>{item.collection}</small></span><ArrowUpRight size={17}/></button>)}</aside></div>
  </main>;
}

export default function Portal() {
  const [query, setQuery] = useState('');
  const [genre, setGenre] = useState('All games');
  const [age, setAge] = useState('');
  const [shelf, setShelf] = useState('discover');
  const [saved, setSaved] = useState([]);
  const [recent, setRecent] = useState([]);
  const [active, setActive] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const input = useRef(null);
  const scroll = useRef(0);
  const origin = useRef(null);
  const previous = useRef(null);
  const applyRoute = () => {
    const route = window.location.hash.slice(1);
    if (route.startsWith('/play/')) {
      const game = playable.find(item => item.searchId === route.slice(6));
      setActive(game || null); setNotFound(!game);
    } else if (route.startsWith('/category/')) {
      let name; try { name = decodeURIComponent(route.slice(10)); } catch { name = ''; }
      setGenre(genres.includes(name) ? name : 'All games'); setActive(null); setNotFound(!genres.includes(name));
    } else { setActive(null); setNotFound(!!route && route !== '/'); }
  };
  useEffect(() => { applyRoute(); window.addEventListener('hashchange', applyRoute); return () => window.removeEventListener('hashchange', applyRoute); }, []);
  useEffect(() => {
    document.title = active ? `${active.name} · ABC Play` : 'ABC Play · Your next favorite game';
    if (active) {
      setRecent(items => [active.searchId, ...items.filter(id => id !== active.searchId)].slice(0, 20));
      window.scrollTo(0, 0);
    } else if (previous.current) {
      window.scrollTo(0, scroll.current);
      if (origin.current?.isConnected) origin.current.focus({ preventScroll: true });
      else document.querySelector(`[data-game-id="${previous.current}"] .tile-launch`)?.focus({ preventScroll: true });
    }
    previous.current = active?.searchId || null;
  }, [active?.searchId]);
  function launch(game) {
    const selected = playable.find(item => item.searchId === game.searchId || (game.module ? item.module === game.module : item.url === game.url));
    if (!selected) return;
    if (!active) { scroll.current = window.scrollY; origin.current = document.activeElement; }
    window.location.hash = `/play/${selected.searchId}`;
  }
  function home(nextShelf = 'discover') { setShelf(nextShelf); setNotFound(false); window.location.hash = '/'; }
  function showCollections() { home(); window.setTimeout(() => document.getElementById('collections')?.scrollIntoView({ behavior: 'auto' }), 50); }
  function toggleSave(id) { setSaved(items => items.includes(id) ? items.filter(item => item !== id) : [...items, id]); }
  const base = query.trim() ? searchGames(query) : playable;
  const visible = base.filter(game => matchesGenre(game, genre) && (!age || game.ageGroupId === age) && (shelf === 'saved' ? saved.includes(game.searchId) : shelf === 'recent' ? recent.includes(game.searchId) : true));
  if (shelf === 'recent') visible.sort((a, b) => recent.indexOf(a.searchId) - recent.indexOf(b.searchId));
  const clear = () => { setQuery(''); setGenre('All games'); setAge(''); setShelf('discover'); window.location.hash = '/'; input.current?.focus(); };
  return <div className="portal">
    <aside className="portal-rail"><button className="rail-logo" aria-label="ABC Play home" onClick={() => { clear(); home(); }}><span>a<span>b</span>c</span><small>PLAY</small></button><nav aria-label="Main navigation">{[[Home,'discover','Discover'],[Heart,'saved','Saved'],[Clock3,'recent','Recent']].map(([Icon,id,label]) => <button key={id} className={!active && shelf === id ? 'is-current' : ''} onClick={() => home(id)} aria-label={label} title={label}><Icon size={24}/><small>{label}</small></button>)}<button onClick={showCollections} title="Age collections"><Shapes size={24}/><small>By age</small></button></nav><span className="rail-bottom"><Gamepad2 size={24}/><small>JUST PLAY.</small></span></aside>
    <div className="portal-body"><header className="portal-header"><a className="mobile-brand" href="#/">abc<span>play</span></a><div className="header-caption">Small games.<br/><strong>Big discoveries.</strong></div>{!active && <form role="search" onSubmit={event => event.preventDefault()} className="portal-search"><Search size={22}/><label className="sr-only" htmlFor="game-search-input">Search games and learning worlds</label><input ref={input} id="game-search-input" type="search" placeholder="What are you playing today?" maxLength={160} autoComplete="off" value={query} onChange={event => setQuery(event.target.value)} onKeyDown={event => { if (event.key === 'Escape') clear(); }} aria-controls="game-search-results"/>{query && <button type="button" aria-label="Clear search" onClick={clear}><X size={19}/></button>}<kbd aria-hidden="true">Search</kbd></form>}<span className="header-stamp"><span/> Free to play. Made to explore.</span></header>
    {notFound ? <main className="portal-empty"><h1>This adventure wandered off.</h1><p>That page doesn't exist. Find a new favorite in the library.</p><button onClick={clear}>Back to all games</button></main> : active ? <Player key={active.searchId} game={active} onBack={() => home(shelf)} onPlay={launch} saved={saved.includes(active.searchId)} onSave={toggleSave}/> : <main className="portal-main">
      <nav className="genre-bar" aria-label="Game categories">{genres.map((item, index) => <button aria-pressed={genre === item} key={item} onClick={() => { setGenre(item); window.location.hash = `/category/${encodeURIComponent(item)}`; }}><span aria-hidden="true">{['✦','🌴','🚀','🧩','🎨','🤖'][index]}</span>{item}</button>)}</nav>
      <div className="browse-heading"><div><div className="portal-kicker">YOUR DAILY DOSE OF PLAY</div><h1>{query.trim() ? `Results for “${query.trim()}”` : shelf === 'saved' ? 'Your little favorites' : shelf === 'recent' ? 'Pick up the fun' : 'Find your next favorite.'}<span className="heading-spark">✳</span></h1></div><label className="age-select"><span>Explore by age</span><select aria-label="Age collection" value={age} onChange={event => setAge(event.target.value)}><option value="">All ages</option>{ageGroups.map(group => <option key={group.id} value={group.id}>{group.label} · {group.title}</option>)}</select></label></div>
      <div className="browse-meta"><p role="status" className="search-count">{visible.length} {visible.length === 1 ? 'game' : 'games'} {query.trim() ? 'found' : 'to discover'} <span>· No downloads. Just play.</span></p>{(query || age || genre !== 'All games') && <button onClick={clear}>Reset filters <X size={14}/></button>}{shelf !== 'discover' && <small>For this visit only · reload clears your list</small>}</div>
      <section id="game-search-results" aria-label="Game library" className="portal-grid">
        {!query.trim() && shelf === 'discover' && !age && genre === 'All games' && <div className="welcome-tile"><span className="welcome-pill">A LITTLE CURIOUS?</span><h2>Let's<br/>play<span>!</span></h2><p>Explore a world<br/>of happy little adventures.</p><span className="welcome-doodle">✳</span><small>{playable.length} games. Endless bright ideas.</small></div>}
        {visible.map(game => { const index = playable.indexOf(game); return <article key={game.searchId} data-game-id={game.searchId} className={`portal-tile ${query.trim() ? 'search-card' : ''} ${index === 0 && !query.trim() && shelf === 'discover' && !age && genre === 'All games' ? 'featured-tile' : ''}`}><button className="tile-launch" onClick={() => launch(game)} aria-label={`Play ${game.name}`}><PortalArt game={game} index={index}/><span className="tile-shine"/><span className="tile-caption"><span><small>{game.collection}</small><h3><Highlight text={game.name} query={query}/></h3></span><span className="tile-arrow"><ArrowUpRight size={22}/></span></span>{index === 0 && <span className="tile-badge">✦ FEATURED</span>}{game.module && <span className="module-badge">DISCOVER</span>}</button><button className={`tile-save ${saved.includes(game.searchId) ? 'is-saved' : ''}`} aria-label={`${saved.includes(game.searchId) ? 'Unsave' : 'Save'} ${game.name}`} aria-pressed={saved.includes(game.searchId)} onClick={() => toggleSave(game.searchId)}><Heart size={17} fill={saved.includes(game.searchId) ? 'currentColor' : 'none'}/></button></article>; })}
      </section>
      {!visible.length && <div className="portal-empty search-empty"><Search size={38}/><h2>{shelf === 'saved' ? 'Make room for your favorites.' : shelf === 'recent' ? 'Your next adventure starts here.' : 'No games found. Keep exploring!'}</h2><p>{shelf === 'saved' ? 'Tap the heart on a game to save it for this visit.' : shelf === 'recent' ? 'Play a game and it will show up here during this visit.' : 'Try a shorter word, another category or all ages.'}</p><button onClick={clear}>Explore all games <ArrowUpRight size={18}/></button></div>}
      <div className="play-promise"><span>✦</span><p>A little play goes a long way.<small>Free browser games for curious minds. No accounts. No public chat.</small></p><Gamepad2 size={36}/></div>
      <div id="collections"><AgeGames onPlay={launch}/></div>
      <LearningHub/>
      <section className="portal-about"><span className="portal-kicker">A WORLD WORTH EXPLORING</span><h2>Little games. Big possibilities.</h2><p>Build a robot, take a rocket ride, crack a puzzle or mix something colorful. ABC Play brings ABC Letter World's adventures together in one happy place. Pick a game and follow your curiosity.</p><div><span>✦ Play instantly</span><span>✦ Explore at your pace</span><span>✦ Learn something new</span></div></section>
    </main>}
    <nav className="mobile-navigation" aria-label="Mobile navigation"><button onClick={() => home()} aria-pressed={!active && shelf === 'discover'}><Home size={20}/><span>Discover</span></button><button onClick={() => home('saved')} aria-pressed={!active && shelf === 'saved'}><Heart size={20}/><span>Saved</span></button><button onClick={() => home('recent')} aria-pressed={!active && shelf === 'recent'}><Clock3 size={20}/><span>Recent</span></button><button onClick={showCollections}><Shapes size={20}/><span>By age</span></button></nav>
    <footer className="portal-footer"><strong>abc<span>play</span></strong><p>PLAY · EXPLORE · LEARN</p><small>© {new Date().getFullYear()} ABC Letter World. Original games & curious adventures.</small><a href="#/" onClick={clear}>Back to discovery ↑</a></footer></div>
  </div>;
}
