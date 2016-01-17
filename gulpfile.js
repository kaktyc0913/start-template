"use strict";
var gulp       = require("gulp"),
  sass         = require("gulp-sass"),
  plumber      = require("gulp-plumber"),
  postcss      = require("gulp-postcss"),
  autoprefixer = require("autoprefixer"),
  rename       = require("gulp-rename"),
  minifyCss    = require("gulp-minify-css"),
  minifyJs     = require("gulp-uglify"),
  minifyHtml   = require("gulp-minify-html"),
  imagemin     = require("gulp-imagemin"),
  concat       = require('gulp-concat');

//главные папки
var bases = {
  source: "source/",
  build: "build/"
};

// файлы проекта
var paths = {
  styles: ["sass/**/*.{sass,scss}"],
  style: ["sass/style.{sass,scss}"],
  images: ["img/*.{jpg,png,svg}"],
  scripts: ["js/*.js"],
  html: ["*.html"]
};

gulp.task("start", function() {
  gulp.watch("source/sass/**/*.{sass,scss}");
});

// работаем с сss
gulp.task("style", function() {
  return gulp.src(paths.style, {cwd: bases.source})
    .pipe(plumber())
    .pipe(sass())
    .pipe(postcss([
      autoprefixer({browsers: "last 2 versions"})
    ]))
    .pipe(minifyCss())
    .pipe(rename(function(path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest(bases.build + "css"))
    ;
});

// переносим и сжимаем картинки
gulp.task("imagemin", function() {
  gulp.src(paths.images, {cwd: bases.source})
    .pipe(imagemin({
      optimizationLevel: 3,
      progressive: true,
      interlaced: true
    }))
    .pipe(gulp.dest(bases.build + "img"));
});

// переносим и минифицируем скрипты
gulp.task("scripts", function() {
  gulp.src(paths.scripts, {cwd: bases.source})
    .pipe(plumber())
    .pipe(minifyJs())
    .pipe(concat('app.js'))
    .pipe(rename(function(path) {
      path.basename += ".min";
      return path;
    }))
    .pipe(gulp.dest(bases.build + "js"));
});

// переносим html
gulp.task("html", function() {
  gulp.src(paths.html, {cwd: bases.source})
    .pipe(plumber())
    .pipe(gulp.dest(bases.build));
});


// изменение файлов в лайве
gulp.task("watch", function() {
  gulp.start("style", "start", "imagemin", "scripts", "html");

  gulp.watch(paths.style, {cwd: bases.source}, function() {
    gulp.start("style");
  });
  gulp.watch(paths.style, {cwd: bases.source}, function() {
    gulp.start("start");
  });
  gulp.watch(paths.images, {cwd: bases.source}, function() {
    gulp.start("imagemin");
  });
  gulp.watch(paths.scripts, {cwd: bases.source}, function() {
    gulp.start("scripts");
  });
  gulp.watch(paths.html, {cwd: bases.source}, function() {
    gulp.start("html");
  });
});

