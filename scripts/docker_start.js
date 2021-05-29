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
var containerPort = process.env.CONTAINER_PORT || '5000';

var buildCMD = util.format('docker build --tag %s -f %s .', imageName, dockerFile);

console.log('build container command: ', buildCMD);

exec(buildCMD, (err, stdout, stderr) => {
  if (err) {
    // node couldn't execute the command
    console.error('!! Failed to build image', err);
    return;
  }

  // the *entire* stdout and stderr (buffered)
  console.log(`stdout: ${stdout}`);
  console.log(`stderr: ${stderr || 'NONE'}`);
  console.log('');
  console.log('');


  var pwd = OS === 'windows' ? '%cd%' : '$(pwd)';
  var createContainerCMD = util.format('docker container create --rm --name %s -v %s:/server -p %s:5000/tcp %s', containerName, pwd, containerPort, imageName);

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
      rl.question('** Try to start existing container [y/n]?', resp => {
        if (resp === 'y' || resp.toLowerCase() === 'yes') {
          const startContainerCMD = 'docker container start ' + containerName;
          exec(startContainerCMD, (err, stdout, stderr) => {
            if (err) { }

            // the *entire* stdout and stderr (buffered)
            console.log(`stdout: ${stdout}`);
            console.log(`stderr: ${stderr || 'NONE'}`);
            console.log('');
            console.log('');
          });
        } else {
          console.log('Bye!~');
        }
        rl.close();
      });
    }
  });
});
