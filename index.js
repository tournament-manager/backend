
'use strict';

require('dotenv').config();
require('./lib/server').start();
console.log(process.env.PORT);