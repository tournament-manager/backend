'use strict';

const gamePromo = require('../../src/game-promotion');
const server = require('../../lib/server');
const divisionId = "5ab1cc7c099bbc09e047971e";



require('jest');

describe('testing the game promotion unit', () => {
  
  // beforeAll(() => server.start());
  // afterAll(() => server.stop());

  describe('testing', () => {
    server.start();
    it('should return a list of games in division', () => {
      expect(gamePromo(divisionId)).toBe('');
    });
    server.stop();

  });


});

