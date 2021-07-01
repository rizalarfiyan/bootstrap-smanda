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
      fonts: "./dist/fonts",
    },
  },
  files: {
    js: "script.js",
    css: "style.css",
  },
};
