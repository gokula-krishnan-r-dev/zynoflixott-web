module.exports = {
  apps: [
    {
      name: "app",
      script: "npm start",
    },
  ],

  // Deployment Configuration
  deploy: {
    production: {
      key: "key.pem",
      user: "ubuntu",
      host: ["13.235.134.156"],
      ref: "origin/main",
      repo: "git@github.com:etubeesdev/zynoflix-ott-web.git",
      path: "/home/ubuntu",
      "post-deploy":
        "source ~/.nvm/nvm.sh ; source ~/.profile ; npm install ; pm2 startOrRestart ecosystem.config.js",
      ssh_options: "ForwardAgent=yes",
    },
  },
};



