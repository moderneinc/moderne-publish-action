#!/bin/sh -l

export MODERNE_PUBLISH_URL=$1
export MODERNE_PUBLISH_USER=$2
export MODERNE_PUBLISH_PWD=$3
export MODERNE_GRADLE_PLUGIN_VERSION=$4
export MODERNE_MVN_PLUGIN_VERSION=$5
export MODERNE_MVN_SETTINGS_XML=$6
export MODERNE_ACTIVE_STYLE=$7
export JAVA_HOME=/usr/lib/jvm/java-$8-openjdk
export MODERNE_BUILD_ACTION=$9
# shellcheck disable=SC2039

exec /usr/share/moderne/moderne-cli publish  --path /github/workspace

