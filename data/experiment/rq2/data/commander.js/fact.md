Breaking: excess command-arguments cause an error by default, see migration tips

Excess command-arguments

It is now an error for the user to specify more command-arguments than are expected. (allowExcessArguments is now false by default.)

Old code:

program.option('-p, --port <number>', 'port number');
program.action((options) => {
  console.log(program.args);
});
Now shows an error:

$ node example.js a b c
error: too many arguments. Expected 0 arguments but got 3.
You can declare the expected arguments. The help will then be more accurate too. Note that declaring
new arguments will change what is passed to the action handler.

program.option('-p, --port <number>', 'port number');
program.argument('[args...]', 'remote command and arguments'); // expecting zero or more arguments
program.action((args, options) => {
  console.log(args);
});
Or you could suppress the error, useful for minimising changes in legacy code.

program.option('-p, --port', 'port number');
program.allowExcessArguments();
program.action((options) => {
  console.log(program.args);
});