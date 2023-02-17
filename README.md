# Moderne publish action

This action publishes the LST files into the Moderne Platform.

## Inputs

## publishUrl
**Required** Artifact Manager URL to publish the -ast.jar files.

## publishUser
**Required** username for the artifact manager

## publishPwd
**Required** password for the artifact manager

##  mvnPluginVersion
Moderne Maven plugin version. Default value ""
  
## gradlePluginVersion
Moderne Gradle plugin version. Default value ""
  
## mvnSettingsXML
Maven settings XML location with the credentials to download dependencies. Default value "" 
  
## activeStyle:
OpenRewrite formating style for fixes. Default value ""
  
## jdkVersion:
JDK version to build a Java repository. Default value 17


## Example usage
```
uses: moderneinc/moderne-publish-action@v0.0.1
with:
  publishUrl: 'https://artifactory.acme.com/artifactory/[REPO]'
  publishUser: ${{ secrets.ARTIFACTORY_USER }}
  publishPwd: ${{ secrets.ARTIFACTORY_PWD }}
```
