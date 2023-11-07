const core = require('@actions/core');
const github = require('@actions/github');
const exec = require('@actions/exec');
const tc = require('@actions/tool-cache');
const os = require("os");

async function run() {
  try {
    const staging = core.getInput('staging');

    if (staging === 'true') {
      await runModerneCLIStaging();
    } else {
      await runModerneCLI();
    }
  } catch (error) {
    console.log("Action failed with " + error.message);
    core.setFailed(error.message);
  }
}

async function runModerneCLI() {
  console.log("Action moderne CLI starts running");
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

  const verbose = core.getInput('verbose');

  if (verbose && verbose === 'true') {
    moderneArgs = moderneArgs + ' --verbose=true';
  }
  console.log("Moderne CLI args are valid");

  const downloadPath = await downloadCLI(false);

  const options = {};
  console.log("Running Moderne CLI ");
  await exec.exec("./" + downloadPath + ' ' + moderneArgs, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

async function runModerneCLIStaging() {
  const options = {};

  console.log("Action moderne CLI starts running");
  let workspace = core.getInput('path'); 

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

  const downloadPath = await downloadCLI(isStaging);

  console.log("Configuring Moderne CLI for publishing ");
  await exec.exec(`./${downloadPath} config artifacts edit --user=${publishUser} --password=${publishPwd} ${publishUrl}`, null, options);

  // #region Configure Maven and Gradle plugins
  const mvnPluginVersion = core.getInput('mvnPluginVersion');

  if (mvnPluginVersion) {
    console.log("Configuring Maven plugin version " + mvnPluginVersion);
    await exec.exec(`./${downloadPath} config maven plugin edit --version ${mavenPluginVersion}`, null, options);
  }

  const gradlePluginVersion = core.getInput('gradlePluginVersion');

  if(gradlePluginVersion) {
    console.log("Configuring Gradle plugin version " + mvnPluginVersion);
    await exec.exec(`./${downloadPath} config gradle plugin edit --version ${gradlePluginVersion}`, null, options);
  }

  const mvnSettingsXML = core.getInput('mvnSettingsXML');

  if (mvnSettingsXML) {
    console.log("Configuring Maven settings xml " + mvnSettingsXML);
    await exec.exec(`./${downloadPath} config maven settings edit ${mvnSettingsXML}`, null, options);
  }
  // #endregion

  // #region Build Command
  let moderneBuildArgs = '';

  const activeStyles = core.getInput('activeStyles');

  if (activeStyles) {
    moderneBuildArgs = `${moderneBuildArgs} --active-styles=activeStyles`;
  }

  const additionalBuildArgs = core.getInput('additionalBuildArgs');

  if (additionalBuildArgs) {
    moderneBuildArgs = `${moderneBuildArgs} --additional-build-args="${additionalBuildArgs}"`;
  }

  console.log("Building with Moderne CLI")
  await exec.exec(`./${downloadPath} build ${workspace} ${moderneArgs}`, null, options);
  // #endregion

  console.log("Publishing with Moderne CLI");
  await exec.exec(`./${downloadPath} publish ${workspace}`, null, options);
  console.log("Action completed: Moderne CLI process has finished");
}

async function downloadCLI() {
  let version = core.getInput('version');
  const isStaging = core.getInput('staging') === 'true';

  const isWin = os.platform() === "win32";
  const isMac = os.platform() === "darwin";

  let platform = "linux";

  if (isWin) {
    platform = "windows";
  } else if (isMac) {
    platform = "macos";
  }

  let moderneFile = 'moderne-cli';
    
  if (isWin) {
    moderneFile = moderneFile + '.exe';
  }
  
  const fileURL = 'https://pkgs.dev.azure.com/moderneinc/moderne_public/_packaging/'
  + (isStaging ? 'staging/' : '') + 'moderne/maven/v1/io/moderne/moderne-cli-'
  + platform + '/' + version + '/moderne-cli-' + platform + '-' + version

  let downloadPath = null;

  console.log("Downloading Moderne CLI from " + fileURL);
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

  return downloadPath;  
}

run();
