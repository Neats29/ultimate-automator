var gulp     = require('gulp'),
    watch    = require('gulp-watch'),
    sass     = require('gulp-sass'),
    cleanCSS = require('gulp-clean-css'),
    fs       = require('fs'),
    path     = require('path'),
    merge    = require('merge-stream'),
    uglify   = require('gulp-uglify'),
    concat   = require('gulp-concat'),
    rename   = require('gulp-rename'),
    htmlmin  = require('gulp-htmlmin'),
    del      = require('del'),
    sourcemaps = require('gulp-sourcemaps'),
    scriptsPath = 'src';


gulp.task('sass', function () {
  var runSass = function (ad_type) {
    return gulp.src(['src/**/*.scss', '!src/*.scss'])
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(gulp.dest('prod/' + ad_type));
  }
  runSass('GDN');
  runSass('DoubleClick');
});


gulp.task('html', function() {
  var runHtml = function (ad_type) {
    return gulp.src('src/**/*.html')
      .pipe(htmlmin({collapseWhitespace: true}))
      .pipe(gulp.dest('prod/' + ad_type));
  }
  runHtml('GDN');
  runHtml('DoubleClick');
});

function getFolders(dir) {
  return fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isDirectory();
  });
}

gulp.task('scripts', function() {
   var folder;
   var folders = getFolders(scriptsPath);

   var runTasks = function (ad_type) {
     var tasks = folders.map(function(folder) {

        return gulp.src([path.join(scriptsPath, folder, '/**/' + ad_type + '.js'), path.join(scriptsPath, folder, '/**/main.js')])
          .pipe(sourcemaps.init())
          .pipe(concat(folder + '.js'))
          .pipe(uglify())
          .pipe(rename('ad.js'))
          .pipe(sourcemaps.write())
          .pipe(gulp.dest('prod/' + ad_type + '/' + folder));
      });
   };

   runTasks('GDN');
   runTasks('DoubleClick');
});

gulp.task('delete', function () {
  return del([
    'src',
    'prod'
  ]);
});


gulp.task('watch', function () {
  gulp.watch('src/**/*.scss', ['sass']);
  gulp.watch('src/**/*.html', ['html']);
  gulp.watch('src/**/*.js', ['scripts']);
});

gulp.task('default', ['watch', 'html', 'sass', 'scripts']);
