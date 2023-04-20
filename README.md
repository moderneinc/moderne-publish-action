# Moderne publish action

This action publishes the LST files into the [Moderne](https://www.moderne.io/) Platform. 

This allows you can apply automatic code refactors across all your repositories using [OpenRewrite](https://docs.openrewrite.org/) recipes. 

## Usage

### Basic Usage

```yaml

- uses: moderneinc/moderne-publish-action@v0.1.1
  with:
    # Artifact Manager URL to publish the -ast.jar files. Required
    publishUrl: 'https://artifactory.acme.com/artifactory/moderne-ingest'
    
    # username for the artifact manager. Required
    publishUser: ${{ secrets.AST_PUBLISH_USERNAME }}
    
    # password for the artifact manager.Required
    publishPwd: ${{ secrets.AST_PUBLISH_PASSWORD }}
```

### All the options

```yaml
- uses: moderneinc/moderne-publish-action@v0.1.1
  with:
    
    # Moderne CLI version. A version higher than 'v0.0.55' is required. Required.
    version: 'v0.0.56'
    
    # Artifact Manager URL to publish the -ast.jar files. Required
    publishUrl: 'https://artifactory.acme.com/artifactory/moderne-ingest'
    
    # username for the artifact manager. Required
    publishUser: ${{ secrets.AST_PUBLISH_USERNAME }}
    
    # password for the artifact manager.Required
    publishPwd: ${{ secrets.AST_PUBLISH_PASSWORD }}
    
    # Only for Java projects, where preliminary Maven goals or Gradle tasks that are required before running moderneAST. Optional
    additionalBuildArgs: ""
    
    # The folder that will be processed. By default, it is ".". Optional
    path: "."
    
    #OpenRewrite formating style for fixes. Optional
    desiredStyle: ""
    
    #Moderne Maven plugin version. By default, it is going to use the LATEST. Optional
    mvnPluginVersion: ""
    
    #Moderne Gradle plugin version. By default, it is going to use  the latest.integration. Optional
    gradlePluginVersion: ""
    
    # Maven settings XML location with the credentials to download dependencies. Optional
    mvnSettingsXML: ""
```
    
    
   
