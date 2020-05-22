module.exports = {
  launch: {
    headless: process.env.CI === "true",
    // ignoreDefaultArgs: ["--disable-extensions"],
    // args: ["--no-sandbox"],
    // executablePath: "chrome.exe"
  },
  server: {
    command: "lerna run --stream start",
    port: 3000,
    launchTimeout: 180000
  }
}
