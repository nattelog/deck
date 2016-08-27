import Deck from './deck';

const size = 100;
const types = [
  {
    type: 'forest',
    dist: 8,
    biome: {
      forest: 0.8,
      rock: 0.2
    }
  },
  {
    type: 'rock',
    dist: 2,
    biome: {
      forest: 0.2,
      rock: 0.8
    }
  }
];
const deck = new Deck(size, types);
let print = '';

while (deck.size > 0) {
  const tile = deck.getTile();
  deck.removeTile(tile);
  print += tile.charAt(0);
}

console.log(print);
