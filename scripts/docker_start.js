const { exec } = require('child_process');
const util = require('util');
const readline = require("readline");
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var OS = process.env.OS;
var dockerFile = process.env.DOCKER_FILE || 'Dockerfile';
var imageName = process.env.IMAGE_NAME || 'my_image';
var containerName = process.env.CONTAINER_NAME || 'my_container';
var containerPort = process.env.CONTAINER_PORT || '8080';
containerPort = containerPort + ':' + containerPort + '/tcp';

var buildCMD = util.format('docker build --tag %s -f %s .', imageName, dockerFile);

console.log('build container command: ', buildCMD);

exec(buildCMD, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    throw new Error('!! Failed to build image: ' + err);
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr || 'NONE'}`);
  console.log('');
  console.log('');


  var pwd = OS === 'windows' ? '%cd%' : '$(pwd)';
  var createContainerCMD = util.format('docker container create --rm --name %s -v %s:/server -p %s %s', containerName, pwd, containerPort, imageName);

  console.log('create container command: ', createContainerCMD);

  console.log('\n** create container');

  exec(createContainerCMD, (err, stdout, stderr) => {
    if (err) { }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr || 'NONE'}`);
    console.log('');
    console.log('');

    if (err && err.message.includes('already in use')) {
      rl.question('** Still try to start existing container [y/n]?', resp => {
        rl.close();
        if (resp === 'y' || resp.toLowerCase() === 'yes') {
          startContainer(true);
        } else {
          console.log('Bye!~');
          process.exit(0);
        }
      });
    } else {
      startContainer();
    }
  });
});

const startContainer = (restart = false) => {
  const action = restart ? 'restart' : 'start';
  const startContainerCMD = util.format('docker container %s %s', action, containerName);

  console.log(action + ' container command: ', startContainerCMD);
  console.log('\n** ' + action + ' container');

  exec(startContainerCMD, (err, stdout, stderr) => {
    if (err) { }

    // the *entire* stdout and stderr (buffered)
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr || 'NONE'}`);
    console.log('');
    console.log('');

    process.exit(0);
  });
};
