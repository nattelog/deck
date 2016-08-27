import Deck from './deck';

const size = 100;
const types = [
  {
    type: 'forest',
    dist: 8,
    biome: {
      forest: 0.8,
      rock: 0.2,
      sand: 0.1
    }
  },
  {
    type: 'rock',
    dist: 3,
    biome: {
      forest: 0.2,
      rock: 0.8,
      sand: 0.5
    }
  },
  {
    type: 'sand',
    dist: 3,
    biome: {
      forest: 0.1,
      rock: 0.5,
      sand: 0.9
    }
  }
];
const deck = new Deck(size, types);
let print = '';
let lastTile;

while (deck.size > 0) {
  const tile = deck.getTile([lastTile]);
  lastTile = tile;
  deck.removeTile(tile);
  print += tile.charAt(0);
}

console.log(print);
