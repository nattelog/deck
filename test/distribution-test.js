import assert from 'assert';
import Deck from '../index';
import { Range } from 'immutable';

describe('Simple Deck', function() {
  const size = 10;
  const types = [
    { type: 'forest', dist: 2 },
    { type: 'rock', dist: 1 }
  ];
  const deck = new Deck(size, types);

  it('should have a list size of 10', function() {
    assert.equal(deck.size, 10);
  });

  it('should have 7 forests', function() {
    assert.equal(deck.deck.getIn(['forest', 'size']), 7);
  });

  it('should have 3 rocks', function() {
    assert.equal(deck.deck.getIn(['rock', 'size']), 3);
  });

  it('should have no water', function() {
    assert.equal(deck.deck.getIn(['water', 'size']), undefined);
  });
});

describe('Deck with even distribution', function() {
  const size = 10;
  const types = [
    { type: 'forest', dist: 1 },
    { type: 'rock', dist: 1 },
    { type: 'water', dist: 1 }
  ];
  const deck = new Deck(size, types);

  it('should have 3 forests', function() {
    assert.equal(deck.deck.getIn(['forest', 'size']), 3);
  });

  it('should have 3 rocks', function() {
    assert.equal(deck.deck.getIn(['rock', 'size']), 3);
  });

  it('should have 4 waters', function() {
    assert.equal(deck.deck.getIn(['water', 'size']), 4);
  });
});

describe('Generate distributions', function() {
  const cases = 10;
  const deckSize = 100;

  function randomNumber(max) {
    return Math.floor((Math.random() * max) + 1);
  }

  Range(0, cases).forEach(i => {
    const distMax = 15;
    const f = randomNumber(distMax);
    const r = randomNumber(distMax);
    const w = randomNumber(distMax);
    const s = randomNumber(distMax);

    describe(`Distribution ${i + 1}, f: ${f}, r: ${r}, w: ${w}, s: ${s}`, function() {
      const size = randomNumber(deckSize);
      const types = [
        { type: 'forest', dist: f },
        { type: 'rock', dist: r },
        { type: 'water', dist: w },
        { type: 'sand', dist: s }
      ];
      const deck = new Deck(size, types);

      it(`should have a size of ${size}`, function() {
        assert.equal(deck.size, size);
      });
    });
  });
});
