import { expect } from 'chai';
import Deck from '../src/deck';
import { Range } from 'immutable';
import Chance from 'chance';

const chance = new Chance();
const pickups = 10000;
const delta = 0.05;

function pick(deck, neighbours) {
  let forests = 0;
  let rocks = 0;

  Range(0, pickups).forEach(() => {
    const tile = deck.getTile(neighbours);

    if (tile === 'forest') {
      forests += 1;
    }
    else if (tile === 'rock') {
      rocks += 1;
    }
  });

  return { forests, rocks };
}

describe(`Probability tests with ${pickups} pickups and ${delta} delta`, function() {
  describe(`Picking up tiles from deck with 80% forests and 20% rocks`, function() {
    const size = 1000;
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
          rock: 0.8,
          forest: 0.2
        }
      }
    ];
    const deck = new Deck(size, types);

    describe('when there is no neighbour', function() {
      const fOutcome = Math.round(pickups * 0.8);
      const rOutcome = Math.round(pickups * 0.2);
      const { forests, rocks } = pick(deck);

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });

    describe('when there is a forest neighbour', function() {
      const fOutcome = Math.round(pickups * 0.94);
      const rOutcome = Math.round(pickups * 0.0589);
      const { forests, rocks } = pick(deck, ['forest']);

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });

    describe('when there is a rock neighbour', function() {
      const fOutcome = Math.round(pickups * 0.5);
      const rOutcome = Math.round(pickups * 0.5);
      const { forests, rocks } = pick(deck, ['rock']);

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });

    describe('when there is both a rock and a forest neighbour', function() {
      const fOutcome = Math.round(pickups * 0.8);
      const rOutcome = Math.round(pickups * 0.2);
      const { forests, rocks } = pick(deck, ['forest', 'rock']);

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });

    describe('when there are two forest neighbours', function() {
      const fOutcome = Math.round(pickups * 0.94);
      const rOutcome = Math.round(pickups * 0.06);
      const { forests, rocks } = pick(deck, ['forest']);

      it(`should get about ${fOutcome} forests`, function() {
        expect(forests).to.be.closeTo(fOutcome, pickups * delta);
      });

      it(`should get about ${rOutcome} rocks`, function() {
        expect(rocks).to.be.closeTo(rOutcome, pickups * delta);
      });
    });
  });
});
