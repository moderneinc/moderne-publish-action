const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const os = require("os");


async function run() {
  try {
    await runModerneCLI();
  } catch (error) {
    core.setFailed(error.message);
  }
}

async function runModerneCLI() {
  
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
  
  var moderneArgs = 'publish --path=' + workspace + ' --url=' + publishUrl + ' --user=' + publishUser + ' --password=' + publishPwd ;

  const mvnPluginVersion = core.getInput('mvnPluginVersion');

  if(mvnPluginVersion) {
    moderneArgs = moderneArgs + ' --mvnPluginVersion=' + mvnPluginVersion;
  }

  const gradlePluginVersion = core.getInput('gradlePluginVersion');

  if(gradlePluginVersion) {
    moderneArgs = moderneArgs + ' --gradlePluginVersion=' + gradlePluginVersion;
  }

  const mvnSettingsXML = core.getInput('mvnSettingsXML');

  if(mvnSettingsXML) {
    moderneArgs = moderneArgs + ' --mvnSettingsXml=' + mvnSettingsXML;
  }

  const activeStyle = core.getInput('activeStyle');

  if (activeStyle) {
    moderneArgs = moderneArgs + ' --activeStyle=' + activeStyle;
  }

  const buildAction = core.getInput('buildAction');

  if(buildAction) {
    moderneArgs = moderneArgs + ' --buildAction="' + buildAction + '"';
  }

  var moderneFile = 'moderne-cli';
  
    
  if (isWin) {
    moderneFile = moderneFile + '.exe';
  }
  
  const fileURL = 'https://pkgs.dev.azure.com/moderneinc/moderne_public/_packaging/moderne/maven/v1/io/moderne/moderne-cli-'
  + platform + '/' + version + '/moderne-cli-' + platform + '-' + version
  

  var downloadPath = null;

  try {
    downloadPath = await tc.downloadTool(fileURL, moderneFile);
  } catch (error) {
    throw `Failed to download ModerneCLI: ${error}`;
  }
  
  if (!isWin) {
    console.log("chmod u+x " + downloadPath );
    await exec.exec('chmod', ['u+x', downloadPath]);
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
  await exec.exec("./" + downloadPath + ' ' + moderneArgs, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

run();
