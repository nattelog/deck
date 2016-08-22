import { expect } from 'chai';
import Deck from '../index';
import { Range } from 'immutable';
import Chance from 'chance';

const chance = new Chance();
const pickups = 10000;
const delta = 0.055;

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
      const pickedUpTile = deck.getTile().get('type');

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
          const pickedUpTile = deck.getTile().get('type');

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

  describe(`Picking up tiles from deck with 80% forests and 20% rocks`, function() {
    const size = 1000;
    const types = [
      {
        type: 'forest',
        dist: 8,
        neightbours: [
          ['forest', 8],
          ['rock', 2]
        ]
      },
      {
        type: 'rock',
        dist: 2,
        neighbours: [
          ['rock', 8],
          ['forest', 2]
        ]
      }
    ];

    describe('when there is no neighbour', function() {
      let forests = 0;
      let rocks = 0;
      const fOutcome = Math.round(pickups * 0.8);
      const rOutcome = Math.round(pickups * 0.2);

      Range(0, pickups).forEach(() => {
        const deck = new Deck(size, types);
        const type = deck.getTile().get('type');

        if (type === 'forest') {
          forests += 1;
        }
        else if (type === 'rock') {
          rocks += 1;
        }
      });

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });
  });
});
