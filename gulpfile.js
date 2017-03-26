var gulp = require("gulp"),
concat = require("gulp-concat"),
uglify = require("gulp-uglify"),
cleanCSS = require("gulp-clean-css"),
rename = require("gulp-rename"),
sass = require("gulp-sass"),
maps = require("gulp-sourcemaps"),
clean = require("gulp-clean"),
imagemin = require("gulp-imagemin"),
connect = require("gulp-connect"),
livereload = require('gulp-livereload'),
runSequence = require('run-sequence'),
eslint = require("gulp-eslint"),
del = require('del'),
fs = require("fs");




// –––––––––––––––––––––––––––––––––––––––––––––––––––––
// CLEAN
// –––––––––––––––––––––––––––––––––––––––––––––––––––––
gulp.task("clean", function(){
    return gulp.src(["./dist"], {read: false})
    .pipe(clean());
});

// =====================================================
// SCRIPTS
//  * Concatenation
//  * Minification
// =====================================================

    gulp.task("scripts",["minifyScripts"] , function(){
        console.log("Minified Scripts");
    });

    gulp.task("concatScripts", function(){
        return gulp.src(["js/**/*.js"])
        .pipe(maps.init())
        .pipe(concat("app.js"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("js"));
    });

    //Waits for the concatscripts to run and does the rest of the total script task
    gulp.task("minifyScripts", ["concatScripts"], function() {
        gulp.src("js/app.js")
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/scripts"));
    });






gulp.task('scripts', function(callback) {
  runSequence('clean',
              'minifyScripts',
              callback);
});
