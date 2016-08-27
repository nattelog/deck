import { expect } from 'chai';
import { Range } from 'immutable';
import Deck from '../src/deck';

describe('Picking tiles', function() {
  const size = 100;
  const types = [
    {
      type: 'forest',
      dist: 1
    }
  ];
  const deck = new Deck(size, types);

  it(`should have ${size - 1} tiles left`, function() {
    const tile = deck.getTile();
    deck.removeTile(tile);
    expect(deck.size).to.be.equal(size - 1);
  });

  it('should have no tiles left', function() {
    Range(0, size - 1).forEach(() => {
      const tile = deck.getTile();
      deck.removeTile(tile);
    });
    expect(deck.size).to.be.equal(0);
  });

  it('should not have negative size', function() {
    const tile = deck.getTile();
    deck.removeTile(tile);
    expect(deck.size).to.be.equal(0);
  });

  it('should be an undefined tile', function() {
    const tile = deck.getTile();
    expect(tile).to.be.undefined;
  });
});
