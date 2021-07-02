"use strict";
const { src, dest, watch, series, parallel } = require("gulp");
const config = require("./config.js");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const cssnano = require("cssnano");
const htmlreplace = require("gulp-html-replace");
const template = require("gulp-template-html");
const autoprefixer = require("autoprefixer");
const terser = require("gulp-terser");
const cleanCSS = require("gulp-clean-css");

// Task HTML
function htmlTask() {
  return src(`${config.paths.src.base}/**/*.html`)
    .pipe(template("template.html"))
    .pipe(
      htmlreplace({
        js: `js/${config.files.js}`,
        css: `css/${config.files.css}`,
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest(config.paths.dist.base));
}

// Task SCSS
function sassTask() {
  return src(`${config.paths.src.css}/**/*.scss`)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(postcss([cssnano(), autoprefixer()]))
    .pipe(dest(config.paths.dist.css));
}

// Task Javascript
function jsTask() {
  return src([`${config.paths.src.js}/**/*.js`])
    .pipe(terser())
    .pipe(dest(config.paths.dist.js));
}

// Remove Images
function removeImages() {
  return del([config.paths.dist.images]);
}

// Taks Images
function imagesTask() {
  return src(
    `${config.paths.src.images}/**/*.{jpg,jpeg,png,gif,tiff,svg}`
  ).pipe(dest(config.paths.dist.images));
}

// Remove Fonts
function removeTask() {
  return del([config.paths.dist.fonts]);
}

// Task Fonts
function fontsTask() {
  return src(`${config.paths.src.fonts}/**/*.{woff,woff2,eot,ttf,svg}`).pipe(
    dest(config.paths.dist.fonts)
  );
}

// Clean destination build
function destClean() {
  return del([config.paths.dist.base]);
}

// Browser Sync Configuration
function syncServer(callback) {
  browserSync.init({
    server: {
      baseDir: config.paths.dist.base,
    },
    port: config.server.port || 8080,
  });
  callback();
}

// Reload the files
function reload(callback) {
  browserSync.reload();
  callback();
}

function syncWatch() {
  watch(`${config.paths.src.base}/**/*.html`, series(htmlTask, reload));
  watch(`${config.paths.src.css}/**/*.scss`, series(sassTask, reload));
  watch(`${config.paths.src.js}/**/*.js`, series(jsTask, reload));
  watch(
    `${config.paths.src.images}/**/*.{jpg,jpeg,png,gif,tiff,svg}`,
    series(removeImages, imagesTask, reload)
  );
  watch(
    `${config.paths.src.fonts}/**/*.{woff,woff2,eot,ttf,svg}`,
    series(removeTask, fontsTask, reload)
  );
}

exports.default = series(
  destClean,
  parallel(sassTask, fontsTask, imagesTask, jsTask, htmlTask),
  syncServer,
  syncWatch
);
