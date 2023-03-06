# Moderne publish action

This action publishes the LST files into the [Moderne](https://www.moderne.io/) Platform. 

This allows you can apply automatic code refactors across all your repositories using [OpenRewrite](https://docs.openrewrite.org/) recipes. 

## Usage

### Basic Usage

```yaml
- uses: moderneinc/moderne-publish-action@v0.0.25
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
- uses: moderneinc/moderne-publish-action@v0.0.25
  with:
    
    # Moderne CLI version. By default, 'latest'. Required.
    version: 'v0.0.14'
    
    # Artifact Manager URL to publish the -ast.jar files. Required
    publishUrl: 'https://artifactory.acme.com/artifactory/moderne-ingest'
    
    # username for the artifact manager. Required
    publishUser: ${{ secrets.AST_PUBLISH_USERNAME }}
    
    # password for the artifact manager.Required
    publishPwd: ${{ secrets.AST_PUBLISH_PASSWORD }}
    
    # Only for Java projects, where preliminary Maven goals or Gradle tasks that are required before running moderneAST. Optional
    buildAction: ${{ github.event.client_payload.buildAction }}
    
    # The folder that will be processed. By default is ".". Optional
    path: "."
    
    #OpenRewrite formating style for fixes. Optional
    activeStyle: ""
    
    #Moderne Maven plugin version. By default is going to use the LATEST. Optional
    mvnPluginVersion: ""
    
    #Moderne Gradle plugin version. By default is going to use  the latest.integration. Optional
    gradlePluginVersion
    
    # Maven settings XML location with the credentials to download dependencies. Optional
    mvnSettingsXML: ""
    
    # OpenRewrite formating style for fixes. Optional
    activeStyle: ""
```
    
    
   
