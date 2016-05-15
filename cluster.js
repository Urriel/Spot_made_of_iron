/**
 * Created by Urriel.
 */
var os        = require('os');
var recluster = require('recluster');
var path      = require('path');
var fs        = require('fs');

var numCPU = os.cpus().length;

var cluster = recluster(path.join(__dirname, 'main.js'), {
  workers : numCPU
});

cluster.run(); // starting cluster

fs.watchFile('package.json', function () {
  console.info('New version pushed, reloading...');
  cluster.reload();
});

console.info('Cluster running');

