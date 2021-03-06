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
livereload = require("gulp-livereload"),
runSequence = require("run-sequence"),
eslint = require("gulp-eslint"),
del = require("del"),
fs = require("fs");

// =====================================================
// CLEAN
// =====================================================
gulp.task("clean", function(){
    return gulp.src(["./dist", "./css", "js/app.js", "js/app.js.map"], {read: false})
    .pipe(clean());
});


// =====================================================
// WATCH
// =====================================================
gulp.task("watch",["serve"] , function(){
    livereload.listen();
    gulp.watch("js/**/*.js", ["concatScripts"]);
    gulp.watch("sass/**/*.scss", ["compileSass"]);

})


// =====================================================
// SCRIPTS
//   Tasks:
//    * concatenation
//    * minification
//    * source mapping
// =====================================================
    gulp.task("concatScripts", function(){
        return gulp.src(["js/**/*.js"])
        .pipe(maps.init())
        .pipe(concat("app.js"))
        .pipe(maps.write("./"))
        .pipe(gulp.dest("js"))
        .pipe(livereload());
    });

    //Waits for the concatscripts to run and does the rest of the total script task
    gulp.task("minifyScripts", ["concatScripts"], function() {
        gulp.src("js/app.js")
        .pipe(rename("all.min.js"))
        .pipe(uglify())
        .pipe(gulp.dest("dist/scripts"));
    });

gulp.task('scripts', function(callback) {
  runSequence('minifyScripts',
              callback);
});


// =====================================================
// STYLES
//   Tasks:
//    * concatenation
//    * minification
//    * source mapping
// =====================================================
gulp.task("compileSass", function(){
    // Since this is a dependency of 'minifyMapStyles', I initally return the value
    return gulp.src("sass/**/*.scss")
        // Create source mapping for the css file:
        .pipe(maps.init())
        // Compile Sass:
        .pipe(sass())
        // Let the source map file share folder with the primary css one:
        .pipe(maps.write("./"))
        // Put the compiled sass in the css folder:
        .pipe(gulp.dest("./css"))
        .pipe(livereload());
});

gulp.task("minifyMapStyles", ["compileSass"], function() {
    gulp.src("css/*.css")
        .pipe(rename("all.min.css"))
        .pipe(cleanCSS())
        .pipe(gulp.dest("./dist/styles"));
});

gulp.task('styles', function(callback) {
  runSequence('minifyMapStyles',
              callback);
});


// =====================================================
// IMAGES
//   Tasks:
//    * compression/minification
// =====================================================
gulp.task("images", function() {
    gulp.src(["images/*.jpg", "images/*.png"])
        .pipe(imagemin())
        .pipe(gulp.dest("./dist/content"))
});


// =====================================================
// BUILD
//   Tasks:
//      * running scripts needed to build site
// =====================================================
gulp.task("serve", function() {
    connect.server({
        port: 3000
    });
});


// =====================================================
// SERVE
//   Tasks:
//      * running scripts needed to build site
// =====================================================
gulp.task("build", function(callback) {
  runSequence("clean",
              ["scripts", "styles", "images"],
              callback);
});
gulp.task("default", ["build"]);
