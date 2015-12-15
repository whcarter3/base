// Base Gulp File
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    uglify = require('gulp-uglify'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    browserSync = require('browser-sync'),
    reload = browserSync.reload;

// PostCSS and Plugins 
var postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    cssnext = require('gulp-cssnext'),
    pixrem = require('gulp-pixrem');

gulp.task('css', function(){
  var processors = [
    pixrem,
    cssnext,
    autoprefixer({browsers: ['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4']})
  ];
  return gulp.src('./src/css/style.css')
    .pipe(cssnext({compress: false }))
    .pipe(postcss(processors))
    .on('error', function(err) {
      this.emit('end');
    })
    .on("error", notify.onError(function(error) {
      return "Failed to Compile CSS: " + error.message;
    }))
    .pipe(gulp.dest('./src'))
    .pipe(gulp.dest('./dist'))
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