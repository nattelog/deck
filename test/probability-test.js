import { expect } from 'chai';
import Deck from '../src/deck';
import { Range } from 'immutable';
import Chance from 'chance';

const chance = new Chance();
const pickups = 10000;
const delta = 0.1;

describe(`Probability tests with ${pickups} pickups and ${delta} delta`, function() {
  describe('Deck with one type', function() {
    const size = 100;
    const types = [{
      type: 'forest',
      dist: 1
    }];
    let forests = 0;

    Range(0, pickups).forEach(() => {
      const deck = new Deck(size, types);
      const pickedUpTile = deck.getTile();

      if (pickedUpTile === 'forest') {
        forests += 1;
      }
    });

    it(`should have picked up ${pickups} forests`, function() {
      expect(forests).to.be.equal(pickups);
    })
  });

  describe('Generate distributions', function() {
    const cases = 3;

    Range(1, cases + 1).forEach(i => {
      const deckSize = chance.natural({ min: 1, max: 100 });
      const noTypes = chance.natural({ min: 1, max: Math.min(10, deckSize) });
      const types = [];
      let totalDist = 0;

      Range(0, noTypes).forEach(() => {
        const type = chance.word();
        const dist = chance.natural({ min: 1, max: 15 });
        types.push({ type, dist });
        totalDist += dist;
      });

      types.forEach(type => {
        type.probSize = Math.round(type.dist / totalDist * pickups);
        type.picks = 0;
      });

      describe(`Distribution ${i}, types: ${noTypes}, size ${deckSize}`, function() {
        let undefinedTiles = 0;

        Range(0, pickups).forEach(() => {
          const deck = new Deck(deckSize, types);
          const pickedUpTile = deck.getTile();

          if (!pickedUpTile) {
            undefinedTiles += 1;
          }

          types.forEach(type => {
            if (pickedUpTile === type.type) {
              type.picks += 1;
            }
          });
        });

        types.forEach(type => {
          it(`should pick up about ${type.probSize} '${type.type}'`, function() {
            expect(undefinedTiles).to.be.equal(0);
            expect(type.picks).to.be.closeTo(type.probSize, pickups * delta);
          });
        });
      });
    });
  });
});
