// Load plugins
var gulp = require('gulp'),
    sass = require('gulp-ruby-sass'),
    autoprefixer = require('gulp-autoprefixer'),
    cssnano = require('gulp-cssnano'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    rename = require('gulp-rename'),
    concat = require('gulp-concat'),
    notify = require('gulp-notify'),
    cache = require('gulp-cache'),
    livereload = require('gulp-livereload'),
    del = require('del');

// Styles
gulp.task('styles', function() {
    return sass('sass/master.scss', { style: 'expanded' })
        .pipe(autoprefixer('last 2 version'))
        .pipe(gulp.dest('public/css'))
        .pipe(rename({ suffix: '.min' }))
        .pipe(cssnano())
        .pipe(gulp.dest('public/css'))
        .pipe(notify({ message: 'Styles task complete' }));
});

// Clean
gulp.task('clean', function() {
    return del(['public/css']);
});

// Default task
gulp.task('default', ['clean'], function() {
    gulp.start('styles');
});

// Watch
gulp.task('watch', function() {

    // Watch .scss files
    gulp.watch('sass/**/*.scss', ['styles']);

    // Create LiveReload server
    livereload.listen();

    // Watch any files in dist/, reload on change
    //gulp.watch(['dist/**']).on('change', livereload.changed);

});
