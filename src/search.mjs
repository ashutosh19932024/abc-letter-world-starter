import { games, ageGroups } from './games.js';
import { worlds } from './learning/content.mjs';

export const normalize = value => String(value ?? '').normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().trim();
export const tokensFor = value => normalize(value).split(/\s+/).filter(Boolean);

export function buildSearchCatalog() {
  const entries = games.map(game => ({ ...game, searchId: `main-${game.id}`, collection: 'Main library', ageGroupId: '' }));
  for (const group of ageGroups) {
    for (const game of group.games) {
      if (game.module) continue; // All worlds are indexed once below.
      entries.push({ ...game, searchId: `${group.id}-${game.id}`, category: game.category || 'Learning', collection: group.title, ageGroupId: group.id, age: game.age || group.label });
    }
  }
  for (const world of worlds) {
    const group = ageGroups.find(group => group.games.some(game => game.module === world.id));
    entries.push({ id: `discovery-${world.id}`, searchId: `world-${world.id}`, name: world.title, description: world.description, emoji: world.icon, background: world.color, skill: world.skills.join(' '), category: 'Learning', collection: 'Discovery Club', ageGroupId: group?.id || '', age: world.age, module: world.id, ready: true });
  }
  return entries;
}

export const searchCatalog = buildSearchCatalog();

export function searchGames(query, { category = 'All', ageGroupId = '' } = {}, catalog = searchCatalog) {
  const tokens = tokensFor(query);
  if (!tokens.length) return [];
  return catalog.filter(game => game.ready && (category === 'All' || game.category === category) && (!ageGroupId || game.ageGroupId === ageGroupId))
    .map((game, order) => {
      const title = normalize(game.name);
      const text = normalize([game.name, game.description, game.category, game.skill, game.collection, game.age].join(' '));
      if (!tokens.every(token => text.includes(token))) return null;
      const phrase = tokens.join(' ');
      const score = (title === phrase ? 100 : title.startsWith(phrase) ? 50 : title.includes(phrase) ? 25 : 0) + tokens.filter(token => title.includes(token)).length * 5;
      return { game, score, order };
    }).filter(Boolean).sort((a, b) => b.score - a.score || a.order - b.order).map(result => result.game);
}
