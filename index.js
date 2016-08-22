import { Map } from 'immutable';
import Chance from 'chance';

const chance = new Chance();

export default class Deck {
  constructor(size, types) {
    this.buildDeck(size, types);
    this.size = this.getSize();
  }

  getTile(neighbours) {
    const index = chance.natural({ min: 1, max: this.size });
    let offset = 0;
    let result;

    this.deck.forEach((type, key) => {
      const size = type.get('size');

      debugger;

      if (offset < index) {
        if (index - offset <= size) {
          result = key;
        }

        offset += size;
      }
    });

    return Map({ type: result });
  }

  /* Private */

  buildDeck(size, types) {
    let totalDist = 0;
    this.deck = Map();

    types.forEach(type => {
      totalDist += type.dist;
    });

    types.forEach((type, index) => {
      const dist = Math.round((type.dist / totalDist) * size);
      const path = [type.type, 'size'];

      this.deck = this.deck.setIn(path, dist);
      const deckSize = this.getSize();

      if (index + 1 === types.length && deckSize !== size) {
        const diff = size - deckSize;
        const newDist = this.deck.getIn(path) + diff;

        this.deck = this.deck.setIn(path, newDist);
      }
    });
  }

  getSize() {
    let size = 0;
    this.deck.forEach(type => {
      size += type.get('size');
    });
    return size;
  }
}
