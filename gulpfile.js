var gulp = require('gulp');

var jshint = require('gulp-jshint');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');
var uglify = require('gulp-uglify');
var connect = require('gulp-connect');
var rename = require('gulp-rename');
var minifycss = require('gulp-minify-css');

var js_sources = ['js/main.js', 'js/modules/**/*.js'];
var css_sources = ['css/**/*.css'];
var html_sources = ['*.html'];


var lintConfig = {
    sub: true,
    multistr:true,
    loopfunc: true
};

var reload = function(sources){
    return gulp.src(sources)
        .pipe(connect.reload());
};

gulp.task('connect', function(){
    connect.server({
        root: [__dirname],
        port: 5356,
        livereload: true
    });
});

gulp.task('lint', function() {
    return gulp.src(js_sources)
        .pipe(jshint(lintConfig))
        .pipe(jshint.reporter('default'))
});

gulp.task('scripts', function() {
    return gulp.src(js_sources)
        .pipe(jshint(lintConfig))
        .pipe(jshint.reporter('default'))
        .pipe(sourcemaps.init())
        .pipe(concat('simpleValidator.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task('min_scripts', function() {
    return gulp.src(js_sources)
        .pipe(jshint(lintConfig))
        .pipe(jshint.reporter('default'))
        .pipe(concat('simpleValidator.js'))
        .pipe(gulp.dest('dist/js'))
        .pipe(rename({suffix: '.min'}))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'))
        .pipe(connect.reload());
});

gulp.task('css', function() {
    return reload('v3/css/**/*.css');
});

gulp.task('min_css', function() {
    return gulp.src(css_sources)
        .pipe(rename({ suffix: '.min' }))
        .pipe(minifycss())
        .pipe(gulp.dest('css'))
        .pipe(connect.reload());
});

gulp.task('html', function() {
    return reload(html_sources);
});

gulp.task('watch', function() {
    gulp.watch(js_sources, ['scripts', 'lint']); //'lint',
    gulp.watch(css_sources, ['css']);
    gulp.watch(html_sources, ['html']);
});

gulp.task('watch_production', function() {
    gulp.watch(js_sources, ['min_scripts', 'lint']); //'lint',
    gulp.watch(css_sources, ['min_css']);
    gulp.watch(html_sources, ['html']);
});

gulp.task('dev', function(){
    gulp.start(['scripts', 'watch', 'connect']);
});

gulp.task('default', function(){
    gulp.start(['min_scripts', 'min_css', 'watch_production', 'connect']);
});

