// Base Gulp File
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    cssnext = require('gulp-cssnext'),
    notify = require('gulp-notify'),
    inlinesource = require('gulp-inline-source'),
    browserSync = require('browser-sync'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    uglify = require('gulp-uglify'),
    runSequence = require('run-sequence');

// Task to compile CSS
gulp.task('css', function () {
  return gulp.src('./src/css/style.css')
  .pipe(cssnext({
    compress: false
  })
  .on('error', function(err) {
    this.emit('end');
  }))
  .on("error", notify.onError(function(error) {
    return "Failed to Compile CSS: " + error.message;
  }))
  .pipe(gulp.dest('./src/'))
  .pipe(gulp.dest('./dist/'))
  .pipe(browserSync.reload({
    stream: true
  }))
  .pipe(notify("CSS Compiled Successfully :)"));
});

// Task to Minify JS
gulp.task('jsmin', function() {
  return gulp.src('./src/js/**/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/js/'));
});

// Minify Images
gulp.task('imagemin', function (){
  return gulp.src('./src/img/**/*.+(png|jpg|jpeg|gif|svg)')
  // Caching images that ran through imagemin
  .pipe(cache(imagemin({
      interlaced: true
    })))
  .pipe(gulp.dest('./dist/img'));
});

// BrowserSync Task (Live reload)
gulp.task('browserSync', function() {
  browserSync({
    server: {
      baseDir: './src/'
    },
  })
});

// Gulp Inline Source Task
// Embed scripts, CSS or images inline (make sure to add an inline attribute to the linked files)
// Eg: <script src="default.js" inline></script>
// Will compile all inline within the html file (less http requests - woot!)
gulp.task('inlinesource', function () {
  return gulp.src('./src/**/*.html')
    .pipe(inlinesource())
    .pipe(gulp.dest('./dist/'));
});

// Gulp Watch Task
gulp.task('watch', ['browserSync'], function () {
   gulp.watch('./src/css/**/*', ['css']);
   gulp.watch('./src/**/*.html').on('change', browserSync.reload);
});

// Gulp Default Task
gulp.task('default', ['watch']);

// Gulp Build Task
gulp.task('build', function() {
  runSequence('css', 'imagemin', 'jsmin', 'inlinesource');
});