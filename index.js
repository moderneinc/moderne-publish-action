const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const os = require("os");


async function run() {
  try {
    await runModerneCLI();
  } catch (error) {
    console.log("Action failed with " + error.message);
    core.setFailed(error.message);
  }
}

async function runModerneCLI() {
  console.log("Action moderne CLI starts running");
  const version = core.getInput('version');
  var workspace = core.getInput('path'); 

  if (!workspace) {
    workspace = process.env.GITHUB_WORKSPACE;
  }

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
  
  var moderneArgs = 'publish --path=' + workspace + ' --publishUrl=' + publishUrl + ' --publishUser=' + publishUser + ' --publishPwd=' + publishPwd ;

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

  const activeStyle = core.getInput('desiredStyle');

  if (activeStyle) {
    moderneArgs = moderneArgs + ' --desiredStyle=' + activeStyle;
  }

  const buildAction = core.getInput('additionalBuildArgs');

  if(buildAction) {
    moderneArgs = moderneArgs + ' --additionalBuildArgs=' + buildAction + '"';
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
  
  console.log("Moderne CLI downloaded in " + downloadPath);
  
  if (!isWin) {
    console.log("chmod u+x " + downloadPath );
    await exec.exec('chmod', ['u+x', downloadPath]);
  }

  const options = {};
  console.log("Running Moderne CLI ");
  await exec.exec("./" + downloadPath + ' ' + moderneArgs, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

run();
