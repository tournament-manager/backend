'use strict';

const bodyParser = require('body-parser').json();
const bearerAuth = require('../lib/bearer-auth');
const errorHandler = require('../lib/error-handler');
const Tournament = require('../model/tournament-model');
const Division = require('../model/division-model');
const Games = require('../model/game-model');
const debug = require('debug')('http:tournament-route');

debug('tournament-route');

module.exports = function(router) {

  router.route('/tournament')
    .post(bearerAuth, bodyParser, (req, res) => {
      req.body.director = req.user._id;
      // debug('req.body', req.body);
      // debug('req.body.divisions[0]', req.body.divisions[0]);
      Tournament(req.body.tournament).save()
        .then(tournament => {
        // debug('tournament', tournament);
          let divisions = req.body.divisions.map(div => {
            div.tournament = tournament._id;
            return div; 
          });
          if (!tournament) return Promise.reject(new Error('Bad request: '));
          return Division.insertMany(divisions);
        })
        .then(divisions => {
          let games = [];
          divisions.forEach(div => {
            [...Array(31)].forEach((val, i) => {
              games.push(
                {
                  gamenumber: i + 1,
                  tournamentId: div.tournament,
                  divisionId: div._id,
                }
              );
            });
          });
          return Games.insertMany(games);
        })
        .then(games => {
          let groups =  games.reduce((acc, cur) => {
            if(!acc[cur.divisionId]) acc[cur.divisionId] = {};
            let group = 'final';
            if (cur.gamenumber < 25){
              let groupLetter = String.fromCharCode(Math.ceil((cur.gamenumber / 24) * 4 ) + 64);
              group = `group${groupLetter}`;
            }
            if (cur.gamenumber > 24 && cur.gamenumber < 29 ) group = 'consolidation';
            if (cur.gamenumber > 28 && cur.gamenumber < 31 ) group = 'semiFinal';
            if(!acc[cur.divisionId][group]) acc[cur.divisionId][group] = [];
            acc[cur.divisionId][group].push(cur._id);
            return acc;
          }, {});
          debug('groups', groups);
          let bulkUpdate = Object.keys(groups).reduce((acc, cur) => {
            acc.push(
              { 
                updateOne: {
                  filter: {_id: cur},
                  update: groups[cur],
                },
              });
            return acc;
          },[]);
          debug('bulkUpdate', bulkUpdate);
          return Division.bulkWrite(bulkUpdate);
        })
        .then(bulk => debug('bulk', bulk))
        .then(tournament => res.status(201).json(tournament) 
        )
        .catch(err => errorHandler(err, res));
    });

};
