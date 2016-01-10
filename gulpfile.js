var gulp = require('gulp');
var stylus = require('gulp-stylus');
var concat = require('gulp-concat');
var nodemon = require('gulp-nodemon');
var notify = require('gulp-notify');
var uglify = require('gulp-uglify');
var cssmin = require('gulp-cssmin');
var cssnano = require('gulp-cssnano');
var sourcemaps = require('gulp-sourcemaps');
var rename = require('gulp-rename');
var nib = require('nib');

var stylesPath = 'app/assets/styles/*.{styl,css}';
var scriptsPath = 'app/assets/scripts/*.js';


gulp.task('styles', function () {
    return gulp
        .src(stylesPath)
        .pipe(stylus({ use: nib(),  import: ['nib']}))
        .pipe(concat('bundle.css'))
        //.pipe(cssmin())
        .pipe(sourcemaps.init())
        .pipe(cssnano())
        .pipe(rename({suffix: '.min'}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('./public/styles'));
        //.pipe(notify('Done!'));
});

gulp.task('scripts', function() {
    return gulp
        .src(scriptsPath)
        .pipe(concat('bundle.js'))
        //.pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('./public/scripts'));
});

gulp.task('watch', function () {
    gulp.watch('app/assets/**/*.{styl,css}', ['styles']);
    gulp.watch(scriptsPath, ['scripts']);
});

gulp.task('startServer', function () {
    nodemon({
        script: 'server.js',
        ext: 'html js'
    })
    .on('restart', function () {
        console.log('restarted!')
    })
});

gulp.task('default', ['styles', 'scripts', 'startServer', 'watch']);
