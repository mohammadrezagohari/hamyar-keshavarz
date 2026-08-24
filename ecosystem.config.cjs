module.exports = {
  apps: [
    {
      name: "hamyar-keshavarz",
      cwd: __dirname,

      script: "node_modules/next/dist/bin/next",
      args: "start -p 3075",

      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",

      env: {
        PORT: "3075",
        NODE_ENV: "production",
        DATABASE_URL: "file:./dev.db",
        ADMIN_PASSWORD: "admin!@0911",
        SESSION_SECRET: "1a79d460ec575fdced0302f01e72c94fe39b4823bbe5ec074730e5820db91438",
        NEXT_PUBLIC_SITE_URL: "https://hamyarkeshavarz.com",
      },
    },
  ],
};