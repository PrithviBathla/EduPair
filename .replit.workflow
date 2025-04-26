run = ["node", "start.js"]
hidden = [".config", ".git", "node_modules"]
persistent = true

[nix]
channel = "stable-24_05"

[env]
SESSION_SECRET = "edupair_secret_key"
NODE_ENV = "development"

[auth]
pageEnabled = true
buttonEnabled = true