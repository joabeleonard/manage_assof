var npm = require("npm");
npm.load({
    loaded: false
}, function (err) {
  // catch errors
  npm.commands.start([], function (er, data) {
    // log the error or data
  });
  npm.on("log", function (message) {
    // log the progress of the installation
    console.log(message);
  });
});