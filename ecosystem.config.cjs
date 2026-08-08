module.exports = {
  apps: [
    {
      name: "hamyar-keshavarz",
      cwd: __dirname,
      script: "scripts/next-with-env-port.mjs",
      args: "start",
      interpreter: "node",

      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",

      env: {
        PORT: "3075",
        NODE_ENV: "production",
        DATABASE_URL: "file:./dev.db",
        ADMIN_PASSWORD: "یک-رمز-قوی",
        SESSION_SECRET: "یک-session-secret-تصادفی-و-طولانی",
        NEXT_PUBLIC_SITE_URL: "https://hamyarkeshavarz.com",
      },
    },
  ],
};