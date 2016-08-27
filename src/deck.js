import { Map, fromJS } from 'immutable';

export default class Deck {
  constructor(size, distribution) {
    this.buildDeck(size, distribution);
    this.size = this.getSize();
  }

  getTile(neighbours) {
    const index = Math.random();
    let offset = 0;
    let result;

    const relativeDist = this.deck.map(dist => {
      if (neighbours) {
        const biomeValue = dist.getIn(['biome', neighbours[0]]) || 1;
        return dist.get('count') * biomeValue;
      }
      return dist.get('count');
    });

    const relativeDistSize = relativeDist.reduce((total, dist) => {
      total += dist;
      return total;
    }, 0);

    relativeDist.forEach((dist, type) => {
      const distribution = dist / relativeDistSize;

      if (offset < index) {
        if (index - offset <= distribution) {
          result = type;
        }

        offset += distribution;
      }
    });

    return result;
  }

  removeTile(type) {
    const count = this.deck.getIn([type, 'count']);

    if (count > 0) {
      this.deck = this.deck.setIn([type, 'count'], count - 1);
      this.size = this.getSize();
    }
  }

  /* Private */

  buildDeck(size, types) {
    let totalDist = 0;
    this.deck = Map();

    types.forEach(type => {
      totalDist += type.dist;
    });

    types.forEach((type, index) => {
      const countPath = [type.type, 'count'];
      const biomePath = [type.type, 'biome'];
      const dist = Math.round((type.dist / totalDist) * size);

      if (type.biome) {
        this.deck = this.deck.setIn(biomePath, fromJS(type.biome));
      }

      this.deck = this.deck.setIn(countPath, dist);
      const deckSize = this.getSize();

      if (index + 1 === types.length && deckSize !== size) {
        const diff = size - deckSize;
        const newDist = this.deck.getIn(countPath) + diff;

        this.deck = this.deck.setIn(countPath, newDist);
      }
    });
  }

  getSize() {
    let size = 0;
    this.deck.forEach(type => {
      size += type.get('count');
    });
    return size;
  }
}
