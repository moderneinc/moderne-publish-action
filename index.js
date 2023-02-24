const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const os = require("os");
const https = require('https'); // or 'https' for https:// URLs
const fs = require('fs');

/**
 * Download a file to disk
 * @example downloadFile('https://orcascan.com', './barcode-tracking.html')
 * @param {string} fileUrl - url of file to download
 * @param {string} destPath - destination path
 * @returns {Promise} resolves once complete, otherwise rejects
 */
async function downloadFile(fileUrl, destPath) {
    if (!fileUrl)  throw `Invalid URL. It is empty`;
    if (!destPath) throw `Invalid Path`;

    await new Promise(function(resolve, reject) {
      console.log("Downloading " + fileUrl);
      const file = fs.createWriteStream(destPath);
      const request = https.get(fileUrl, function(response) {
        response.pipe(file);
        file.on("finish", resolve);
        console.log("File downloaded ");
      });
      request.on('error', reject);
    });
}

async function run() {
  try {
    await runModerneCLI();
  } catch (error) {
    core.setFailed(error.message);
  }
}

export async function runModerneCLI() {
  
  const version = core.getInput('version');
  const workspace = process.env.GITHUB_WORKSPACE

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
  
  const isWin = os.platform() === "win32";
  const isMac = os.platform() === "darwin";

  var platform = "linux";

  if (isWin) {
    platform = "windows";
  } else if (isMac) {
    platform = "macos";
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

  var moderneFile = 'moderne-cli';
  
    
  if (isWin) {
    moderneFile = moderneFile + '.exe';
  }
  
  downloadFile('https://pkgs.dev.azure.com/moderneinc/moderne_public/_packaging/moderne/maven/v1/io/moderne/moderne-cli-'
  + platform + '/' + version + '/moderne-cli-' + platform + '-' + version, moderneFile);
  
  if (!isWin) {
    console.log("chmod u+x " + moderneFile );
    await exec.exec('chmod', ['u+x', moderneFile]);
  }

  const options = {};
  options.listeners = {
    stdout: (data) => {
      console.log(data.toString());
    },
    stderr: (data) => {
      console.log(data.toString());
    }
  };
  console.log("Running Moderne CLI ");
  await exec.exec(moderneFile + ' ' + moderneArgs, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

run();
