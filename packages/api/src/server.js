const app = require('./app');
const config = require('./config');

// Initialize Cron Jobs
require('./cron/alertEngine');

app.listen(config.port, () => {
  // eslint-disable-next-line no-console
  console.log(`Apex Veritas API listening on port ${config.port} [${config.env}]`);
});
