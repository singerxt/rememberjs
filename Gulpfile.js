var gulp = require('gulp'),
    gutil = require('gulp-util'),
    jshint = require('gulp-jshint'),
    browserify = require('browserify'),
    source = require('vinyl-source-stream'),
    concat = require('gulp-concat'),
    sass = require('gulp-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    minifycss = require('gulp-minify-css'),
    rename = require('gulp-rename'),
    rimraf = require('gulp-rimraf'),
    open = require("gulp-open"),
    uglify = require('gulp-uglify');
    

// Modules for webserver and livereload
var embedlr = require('gulp-embedlr'),
    refresh = require('gulp-livereload'),
    lrserver = require('tiny-lr')(),
    express = require('express'),
    livereload = require('connect-livereload'),
    livereloadport = 35729,
    serverport = 8080;


// Set up an express server (not starting it yet)
var server = express();
// Add live reload
server.use(livereload({port: livereloadport}));
// Use our 'dist' folder as rootfolder
server.use(express.static('./dist'));
// redirects all requests back to our index.html
server.all('/*', function(req, res) {
  res.sendfile('index.html', { root: 'dist' });
});

// Dev task
gulp.task('dev', ['clean'], function() {
  gulp.start(['views', 'images', 'styles', 'lint', 'browserify','url']);
  server.listen(serverport);
  // Start live reload
  refresh.listen(livereloadport);
  gulp.start('watch');
});

// JSHint task
gulp.task('lint', function() {
  gulp.src('app/scripts/**/*.js')
  // Pass in our jshint rules
  .pipe(jshint('.jshintrc'))
  // Set our jshint reporter - using jshint-stylish
  .pipe(jshint.reporter('jshint-stylish'))
  .pipe(notify({message: 'JSLint task complete', onLast: true}));
});

// Styles task
gulp.task('styles', function() {
  gulp.src('app/styles/*.scss')
  // The onerror handler prevents Gulp from crashing when you make a mistake in your SASS
  .pipe(sass({onError: function(e) { console.log(e); } }))
  // Add autoprefixer
  .pipe(autoprefixer("last 2 versions", "> 1%", "ie 8"))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/css/'))
  // Create a minified css file
  .pipe(rename({ suffix: '.min' }))
  .pipe(minifycss())
  // Output it to our dist folder
  .pipe(gulp.dest('dist/css/'))
  .pipe(notify({message: 'Styles task complete', onLast: true}))
  .pipe(refresh());
});

// Browserify task
gulp.task('browserify', function() {
  // Single point of entry (make sure not to src ALL your files, browserify will figure it out)
  return browserify('./app/scripts/main.js')
  .bundle({debug: true})
  .on('error', gutil.log)
  // Bundle to a single file
  .pipe(source('bundle.js'))
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'))
  // Create a minified bundle file
  .pipe(notify({message: 'Browserify task complete', onLast: true}))
  .pipe(refresh());
});

// Uglify task
gulp.task('uglify', function() {
  gulp.src('dist/js/bundle.js')
  .pipe(rename({ suffix: '.min' }))
  .pipe(uglify())
  // Output it to our dist folder
  .pipe(gulp.dest('dist/js'))
  .pipe(notify({message: 'Uglify task complete', onLast: true}))
});

// Views task
gulp.task('views', function() {
    // Get our index.html
    gulp.src('app/index.html')
    // And put it in the dist folder
    .pipe(gulp.dest('dist/'))
    .pipe(refresh());
    // Any other view files from app/views
    gulp.src('app/views/**/*')
    // Will be put in the dist/views folder
    .pipe(gulp.dest('dist/views/'))
    .pipe(notify({message: 'Views task complete', onLast: true}))
    .pipe(refresh());
});

// Images task
gulp.task('images', function() {
  return gulp.src('app/images/**/*')
    // optimize images
    .pipe(cache(imagemin({ optimizationLevel: 3, progressive: true, interlaced: true })))
    // Will be put in the dist/images folder
    .pipe(gulp.dest('dist/images'))
    .pipe(notify({message: 'Images task complete', onLast: true}))
    .pipe(refresh());
});

// Clean task
gulp.task('clean', function() {
  return gulp.src('dist/*', { read: false })
    // Remove dist folder and contents
    .pipe(rimraf({ force: true }))
    .pipe(notify({message: 'Clean task complete', onLast: true}));
    
});

// Url task
gulp.task("url", function(){
  var options = {
    url: "http://127.0.0.1:8080"
  };
  // auto open localhost in new browser window
  gulp.src("app/index.html")
  .pipe(open("", options));
});


gulp.task('watch', function() {
  // Watch our scripts, and when they change run lint and browserify
  gulp.watch(['app/scripts/*.js', 'app/scripts/**/*.js'],[
    'lint',
    'browserify'
  ]);
  // Watch our sass files
  gulp.watch(['app/styles/**/*.scss'], [
    'styles'
  ]);
  // Watch our html files
  gulp.watch(['app/**/*.html'], [
    'views'
  ]);
  // Watch our image files
  gulp.watch(['app/images/**/*'], [
    'images'
  ]);
});
