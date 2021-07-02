"use strict";
const { src, dest, watch, series, parallel, task } = require("gulp");
const config = require("./config.js");
const browserSync = require("browser-sync").create();
const sass = require("gulp-sass");
const postcss = require("gulp-postcss");
const htmlmin = require("gulp-htmlmin");
const del = require("del");
const cssnano = require("cssnano");
const rename = require("gulp-rename");
const htmlreplace = require("gulp-html-replace");
const template = require("gulp-template-html");
const autoprefixer = require("autoprefixer");
const terser = require("gulp-terser");
const cleanCSS = require("gulp-clean-css");

// Task HTML
task("html", function() {
  return src(`${config.paths.src.base}/**/*.html`)
    .pipe(template(config.files.template))
    .pipe(
      htmlreplace({
        js: [config.files.js, "js/jquery.min.js", "js/popper.min.js", "js/bootstrap.min.js"],
        css: [config.files.css, "css/fontawesome.min.css"],
      })
    )
    .pipe(
      htmlmin({
        collapseWhitespace: true,
        removeComments: true,
      })
    )
    .pipe(dest(config.paths.dist.base));
})

// Task SCSS
task("sass", function() {
  return src(`${config.paths.src.css}/**/*.scss`)
    .pipe(sass().on("error", sass.logError))
    .pipe(cleanCSS())
    .pipe(postcss([cssnano(), autoprefixer()]))
    .pipe(dest(config.paths.dist.css));
})

// Task Javascript
task("js", function() {
  return src([`${config.paths.src.js}/**/*.js`])
    .pipe(terser())
    .pipe(dest(config.paths.dist.js));
})

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

task("images", series(removeImages, imagesTask))

// Remove Fonts
function removeFonts() {
  return del([config.paths.dist.fonts]);
}

// Task Fonts
function fontsTask() {
  return src(`${config.paths.src.fonts}/**/*.{woff,woff2,eot,ttf,svg}`).pipe(
    dest(config.paths.dist.fonts)
  );
}

task("fonts", series(removeFonts, fontsTask))

// Clean destination build
task("clean",  function() {
  return del([config.paths.dist.base]);
})

// Vendor Javascript
task("vendor:js", function () {
  return src([
    "./node_modules/jquery/dist/jquery.min.js",
    "./node_modules/popper.js/dist/umd/popper.min.js",
    "./node_modules/bootstrap/dist/js/bootstrap.min.js",
  ]).pipe(dest(config.paths.dist.js));
});

// Vendor Fonts
function vendorCssFonts() {
  return src([
    "./node_modules/@fortawesome/fontawesome-free/css/all.min.css",
  ])
  .pipe(rename("fontawesome.min.css"))
  .pipe(dest(config.paths.dist.css));
}

function vendorFonts() {
  return src([
    "./node_modules/@fortawesome/fontawesome-free/webfonts/*",
  ]).pipe(dest(config.paths.dist.fonts));
}

task("vendor:fonts", series(vendorFonts, vendorCssFonts))

// All Vendor
task("vendor", parallel("vendor:fonts", "vendor:js"));

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
  watch(`${config.paths.src.base}/**/*.html`, series("html", reload));
  watch(`${config.paths.src.css}/**/*.scss`, series("sass", reload));
  watch(`${config.paths.src.js}/**/*.js`, series("js", reload));
  watch(
    `${config.paths.src.images}/**/*.{jpg,jpeg,png,gif,tiff,svg}`,
    series("images", reload)
  );
  watch(
    `${config.paths.src.fonts}/**/*.{woff,woff2,eot,ttf,svg}`,
    series("fonts", reload)
  );
}

task(
  "build",
  series(
    "clean",
    "vendor",
    parallel("sass", fontsTask, imagesTask, "js", "html")
  )
);

task(
  "default",
  series(
    "clean",
    "vendor",
    parallel("sass", fontsTask, imagesTask, "js", "html"),
    syncServer,
    syncWatch
  )
);
