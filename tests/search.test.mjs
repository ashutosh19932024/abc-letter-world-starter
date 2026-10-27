import test from 'node:test';
import assert from 'node:assert/strict';
import { searchGames, searchCatalog } from '../src/search.mjs';

test('finds titles regardless of case and whitespace', () => {
  assert.equal(searchGames('  JUNGLE   adventure ')[0].id, 'jungle-adventure');
  assert.deepEqual(searchGames('   '), []);
});
test('searches skills and collections with every word required', () => {
  assert.ok(searchGames('algorithms').some(game => game.module === 'robot'));
  assert.ok(searchGames('tiny shapes').some(game => game.id === 'shapes'));
  assert.equal(searchGames('jungle nonexistentword').length, 0);
});
test('filters combine and unavailable games never appear', () => {
  assert.equal(searchGames('number train').length, 0);
  assert.equal(searchGames('jungle', { category: 'Learning' }).length, 0);
  assert.ok(searchGames('shapes', { ageGroupId: 'ages-1-3', category: 'Learning' }).length);
  assert.equal(searchGames('jungle', { ageGroupId: 'ages-1-3' }).length, 0);
});
test('IDs are unique and module worlds are indexed once', () => {
  assert.equal(new Set(searchCatalog.map(game => game.searchId)).size, searchCatalog.length);
  assert.equal(searchCatalog.filter(game => game.module === 'robot').length, 1);
  for (const game of searchCatalog.filter(game => game.ready)) assert.ok(game.url || game.module);
});
test('literal punctuation is safe and exact titles precede description matches', () => {
  assert.deepEqual(searchGames('['), []);
  const catalog = [{name:'Other', description:'robot', ready:true}, {name:'Robot', ready:true}];
  assert.equal(searchGames('robot', {}, catalog)[0].name, 'Robot');
});
