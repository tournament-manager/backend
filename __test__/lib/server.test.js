// 'use strict';

// const server = require('../../lib/server');
// require('jest');

// beforeEach(() => server.start());
// afterEach(() => server.stop());

// describe('Server test', () => {

//   it('should return an error if server is already on', () => {
//     server.start()
//       .catch(error => {
//         expect(error).toBeInstanceOf(Error);

//       });
//   });
//   it('should return an error if server is already off', () => {
//     server.stop()
//       .then(() => {
//         server.start()
//           .catch(error => {
//             expect(error).toBeInstanceOf(Error);
  
//           });

//       });
//   });
// });