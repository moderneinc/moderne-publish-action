#!/bin/sh -l

export JAVA_HOME=/usr/lib/jvm/java-$8-openjdk

# shellcheck disable=SC2039

exec /usr/share/moderne/moderne-cli publish --url $1 --user $2 --password $3 --gradlePluginVersion $4 --mvnPluginVersion $5 --mvnSettingsXml $6  --activeStyle $7  --path /github/workspace

