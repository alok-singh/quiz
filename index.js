// by requiring `babel/register`, all of our successive `require`s will be Babel'd

require('babel-register')({
   presets: [ 'es2015' ]
});

require('./server');