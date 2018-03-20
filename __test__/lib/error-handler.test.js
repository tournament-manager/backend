'use strict';

const error_handler = require('../../lib/error-handler'); 

describe('Error Handler unit testing', function() {  
  this.validation_err = new Error('Validation error: Cannot create note, subject or comment missing');
  this.path_err = new Error('ENOENT');
  this.misc_err = new Error('Internal Server Error');
  this.res = { status: function(stat){this.statusCode = stat; return this; }, send: function(msg){this.message  = msg; return this;}};
  it('should be return a status and message', () => {
    let errRes = error_handler(this.validation_err, this.res);
    expect(errRes.statusCode).toEqual(400);
    expect(errRes.message).toMatch(/Validation error/i);
  });

  it('should be return a status and message', () => {
    let errRes = error_handler(this.path_err, this.res);
    expect(errRes.statusCode).toEqual(404);
    expect(errRes.message).toMatch(/ENOENT/i);
  });

  it('should be return a status and message', () => {
    let errRes = error_handler(this.misc_err, this.res);
    expect(errRes.statusCode).toEqual(500);
    expect(errRes.message).toMatch(/Internal/i);
  });

  it('should be return a status and message', () => {
    let nwerr = new Error('casterror');
    let errRes = error_handler(nwerr, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should be return a status and message', () => {
    let nwerr = new Error('bad request');
    let errRes = error_handler(nwerr, this.res);
    expect(errRes.statusCode).toEqual(400);
  });
  it('should be return a status and message', () => {
    let nwerr = new Error('path error');
    let errRes = error_handler(nwerr, this.res);
    expect(errRes.statusCode).toEqual(404);
  });
  it('should be return a status and message for multi-part error', () => {
    let mpErr = new Error('multi-part');
    let mpRes = error_handler(mpErr, this.res);
    expect(mpRes.statusCode).toEqual(401);
  });
  it('should be return a status and message', () => {
    let nwerr = new Error('authorization');
    let errRes = error_handler(nwerr, this.res);
    expect(errRes.statusCode).toEqual(401);
  });
  it('should be return a status and message', () => {
    let nwerr = new Error('duplicate key error');
    let errRes = error_handler(nwerr, this.res);
    expect(errRes.statusCode).toEqual(409);
  });
  
});