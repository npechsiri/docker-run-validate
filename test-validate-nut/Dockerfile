FROM cypress/base:10

# Install cron
RUN apt-get update && apt-get install -y cron
WORKDIR /app
# Copy our test page and test files
COPY cypress.json ./
COPY package.json ./
COPY cypress ./cypress
# Install npm dependencies, can also use "npm ci"
RUN npm install
# Crontab
ADD cypress-run.sh cypress-run.sh
RUN chmod +x cypress-run.sh
COPY crontab /etc/cron.d/crontab
RUN chmod 0644 /etc/cron.d/crontab
RUN crontab /etc/cron.d/crontab

CMD cron && tail -f /dev/null