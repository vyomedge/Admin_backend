// ecosystem.config.js
module.exports = {
  apps: [
    {
      name: 'admin-backend',
      script: 'index.js',
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 8080,
      },
    },
  ],
};
