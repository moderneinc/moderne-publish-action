FROM moderne/moderne-cli:v.0.0.2

RUN mkdir -p /github

COPY entrypoint.sh /entrypoint.sh

ENTRYPOINT ["/entrypoint.sh"]






