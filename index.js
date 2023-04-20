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
    console.log('The publishUrl should not be empty');
    core.setFailed('The publishUrl should not be empty');
    return;
  }

  const publishUser = core.getInput('publishUser');

  if (!publishUser) {
    console.log('The publishUser should not be empty');
    core.setFailed('The publishUser should not be empty');
    return;
  }

  const publishPwd = core.getInput('publishPwd');

  if (!publishPwd) {
    console.log('The publishPwd should not be empty');
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

  const desiredStyle = core.getInput('desiredStyle');

  if (desiredStyle) {
    moderneArgs = moderneArgs + ' --desiredStyle=' + desiredStyle;
  }

  const additionalBuildArgs = core.getInput('additionalBuildArgs');

  if(additionalBuildArgs) {
    moderneArgs = moderneArgs + ' --additionalBuildArgs="' + additionalBuildArgs + '"';
  }

  console.log("Moderne CLI args are valid");

  var moderneFile = 'moderne-cli';
  
    
  if (isWin) {
    moderneFile = moderneFile + '.exe';
  }
  
  const fileURL = 'https://pkgs.dev.azure.com/moderneinc/moderne_public/_packaging/moderne/maven/v1/io/moderne/moderne-cli-'
  + platform + '/' + version + '/moderne-cli-' + platform + '-' + version
  

  var downloadPath = null;

  console.log("Downloading Moderne CLI from " + fileURL);
  try {
    downloadPath = await tc.downloadTool(fileURL, moderneFile);
  } catch (error) {
    throw `Failed to download ModerneCLI: ${error}`;
  }
  
  console.log("Moderne CLI downloaded in " + downloadPath);
  
  if (!isWin) {
    console.log("chmod u+x " + moderneFile );
    await exec.exec('chmod', ['u+x', moderneFile]);
  }

  const options = {};
  console.log("Running Moderne CLI ");
  await exec.exec("./" + downloadPath + ' ' + moderneArgs, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

run();
