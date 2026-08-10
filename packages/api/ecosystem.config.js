module.exports = {
  apps: [
    {
      name: 'apex-veritas-api',
      script: 'src/server.js',
      instances: 'max', // Uses all available CPU cores
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 4000
        // NOTE: Other environment variables (DATABASE_URL, JWT_ACCESS_SECRET, etc.) 
        // should be provided via a .env file in the packages/api directory on the server, 
        // or set directly in the AWS EC2 instance environment.
      }
    }
  ]
};
