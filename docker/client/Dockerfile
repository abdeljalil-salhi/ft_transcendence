FROM        node:lts

RUN         apt-get update && \
            apt-get -y --no-install-recommends install tzdata && \
            ln -sf /usr/share/zoneinfo/Africa/Casablanca /etc/localtime && \
            echo "Africa/Casablanca" >/etc/timezone && \
            dpkg-reconfigure -f noninteractive tzdata && \
            apt-get autoremove -y && \
            apt-get clean && \
            rm -rf /var/lib/apt/lists/*

WORKDIR     /app

EXPOSE      3000

ENTRYPOINT  ["/bin/sh", "-c", "npm install && npm run start"]
