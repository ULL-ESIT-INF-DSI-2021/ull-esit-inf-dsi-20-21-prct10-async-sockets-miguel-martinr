"use strict";
exports.__esModule = true;
var yargs = require("yargs");
yargs
    .scriptName('client.js')
    .usage('$0 <cmd> [args]')
    .command({
    command: 'add',
    describe: 'Opens a session on server',
    builder: {
        user: {
            describe: 'Username',
            demandOption: true,
            type: 'string'
        },
        port: {
            describe: 'Port to connect',
            demandOption: true,
            type: 'number'
        }
    },
    handler: function (argv) {
        if (typeof argv.path === 'string') {
        }
    }
});
