FROM moderne/moderne-cli:v0.0.2

RUN mkdir -p /github

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]






