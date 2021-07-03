const path = require("path");

module.exports = {
  server: {
    root: "./",
    port: 3000,
  },
  paths: {
    src: {
      base: "./src",
      css: "./src/assets/scss",
      js: "./src/assets/js",
      images: "./src/assets/images",
      fonts: "./src/assets/fonts",
    },
    dist: {
      base: "./dist",
      css: "./dist/css",
      js: "./dist/js",
      images: "./dist/images",
      fonts: "./dist/webfonts",
    },
  },
  files: {
    template: "template.html",
    js: "js/script.js",
    css: "css/style.css",
  },
  alias: {
    paths: {
      "~bootstrap": path.resolve(__dirname, './node_modules/bootstrap'),
    },
  },
};
