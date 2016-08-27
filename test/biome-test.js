import { expect } from 'chai';
import Deck from '../src/deck';
import { Range } from 'immutable';
import Chance from 'chance';

const chance = new Chance();
const pickups = 10000;
const delta = 0.05;

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
      let forests = 0;
      let rocks = 0;
      const fOutcome = Math.round(pickups * 0.8);
      const rOutcome = Math.round(pickups * 0.2);

      Range(0, pickups).forEach(() => {
        const tile = deck.getTile();

        if (tile === 'forest') {
          forests += 1;
        }
        else if (tile === 'rock') {
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

    describe('when there is a forest neighbour', function() {
      let forests = 0;
      let rocks = 0;
      const fOutcome = Math.round(pickups * 0.94);
      const rOutcome = Math.round(pickups * 0.0589);

      Range(0, pickups).forEach(() => {
        const tile = deck.getTile(['forest']);

        if (tile === 'forest') {
          forests += 1;
        }
        else if (tile === 'rock') {
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

    describe('when there is a rock neighbour', function() {
      let forests = 0;
      let rocks = 0;
      const fOutcome = Math.round(pickups * 0.5);
      const rOutcome = Math.round(pickups * 0.5);

      Range(0, pickups).forEach(() => {
        const tile = deck.getTile(['rock']);

        if (tile === 'forest') {
          forests += 1;
        }
        else if (tile === 'rock') {
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
