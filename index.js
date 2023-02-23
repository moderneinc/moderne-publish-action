const core = require('@actions/core');
const github = require('@actions/github');
const http = require('http'); // or 'https' for https:// URLs
const fs = require('fs');

/**
 * Download a file to disk
 * @example downloadFile('https://orcascan.com', './barcode-tracking.html')
 * @param {string} fileUrl - url of file to download
 * @param {string} destPath - destination path
 * @returns {Promise} resolves once complete, otherwise rejects
 */
function downloadFile(fileUrl, destPath) {

    if (!fileUrl) return Promise.reject(new Error('Invalid fileUrl'));
    if (!destPath) return Promise.reject(new Error('Invalid destPath'));

    return new Promise(function(resolve, reject) {
      const file = fs.createWriteStream(destPath);
      const request = http.get(fileUrl, function(response) {
        response.pipe(file);
        file.on("finish", resolve);
        response.body.on('error', reject);
      });
    });
}

try {
  // `who-to-greet` input defined in action metadata file
  const version = core.getInput('version');
  const workspace = github.context.workspace; 

  const publishUrl = core.getInput('publishUrl');

  if (!publishUrl) {
    core.setFailed('The publishUrl should not be empty');
    return;
  }

  const publishUser = core.getInput('publishUser');

  if (!publishUser) {
    core.setFailed('The publishUser should not be empty');
    return;
  }

  const publishPwd = core.getInput('publishPwd');

  if (!publishPwd) {
    core.setFailed('The publishPwd should not be empty');
    return;
  }
  

  var moderneArgs = 'publish --path ' + workspace + ' --url ' + publishUrl + ' --user ' + publishUser + ' --password ' + publishPwd ;

  const mvnPluginVersion = core.getInput('mvnPluginVersion');

  if(mvnPluginVersion) {
    moderneArgs = moderneArgs + ' --mvnPluginVersion ' + mvnPluginVersion;
  }

  const gradlePluginVersion = core.getInput('gradlePluginVersion');

  if(gradlePluginVersion) {
    moderneArgs = moderneArgs + ' --gradlePluginVersion ' + gradlePluginVersion;
  }

  const mvnSettingsXML = core.getInput('mvnSettingsXML');

  if(mvnSettingsXML) {
    moderneArgs = moderneArgs + ' --mvnSettingsXml ' + mvnSettingsXML;
  }

  const activeStyle = core.getInput('activeStyle');

  if (activeStyle) {
    moderneArgs = moderneArgs + ' --activeStyle ' + activeStyle;
  }

  const buildAction = core.getInput('buildAction');

  if(buildAction) {
    moderneArgs = moderneArgs + ' --buildAction ' + buildAction;
  }

  var moderneFile = github.context.workspace + '/moderne-cli';
  
  if (github.runner.os.toLowerCase() != 'windows') {
    moderneFile = moderneFile + '.exe';
  }

  //downloads the CLI using Js to support windows, mac and linux
  downloadFile('https://pkgs.dev.azure.com/moderneinc'+
  '/moderne_public/_packaging/moderne/maven/v1/io/moderne/moderne-cli-'
  + github.runner.os.toLowerCase() + '/' + version + '/moderne-cli-' + github.runner.os.toLowerCase() + '-' + version, moderneFile)
  .then(
    result => function(result){
      if (github.runner.os.toLowerCase() != 'windows') {
        const chmodExecSync = require('child_process').execSync;
        chmodExecSync('chmod u+x ' + moderneFile, { encoding: 'utf-8' });
      }
    
      //runs the CLI
      const modExecSync = require('child_process').execSync;
      const output = modExecSync(moderneFile + ' ' + moderneArgs, { encoding: 'utf-8' });  // the default is 'buffer'
      console.log(output);
    },
    error => core.setFailed(error.message) );
  
 
} catch (error) {
  core.setFailed(error.message);
}
