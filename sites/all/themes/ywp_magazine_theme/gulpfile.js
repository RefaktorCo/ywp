'use strict';

var gulp = require('gulp'),
    watch = require('gulp-watch'),
    rigger = require('gulp-rigger'),
    sass = require('gulp-sass'),
    sourceMap = require('gulp-sourcemaps'),
    bulkSass = require('gulp-sass-glob-import'),
    cleanCSS = require('gulp-clean-css');

var path = {
    bootstrap :{
        build: 'assets/js/',
        src: 'src/js/bootstrap.js'
    },
    js :{
        build: 'assets/js/',
        src: 'src/js/script.js',
        watch: 'src/js/**/*.js'
    },
    css: {
        build: 'assets/css/',
        src: 'src/scss/style.scss',
        watch: 'src/scss/**/*.scss'
    }
};

function build_bootstrap(done) {
    gulp.src(path.bootstrap.src)
        .pipe(sourceMap.init())
        .pipe(rigger())
        .pipe(sourceMap.write('./'))
        .pipe(gulp.dest(path.bootstrap.build));

    done();
}

function build_js(done) {
    gulp.src(path.js.src)
        .pipe(sourceMap.init())
        .pipe(rigger())
        .pipe(sourceMap.write('./'))
        .pipe(gulp.dest(path.js.build));

    done();
}

function build_css(done) {
    gulp.src(path.css.src)
        .pipe(sourceMap.init())
        .pipe(bulkSass())
        .pipe(sass())
        .pipe(cleanCSS({compatibility: 'ie8'}))
        .pipe(sourceMap.write('./'))
        .pipe(gulp.dest(path.css.build));

    done();
}

gulp.task('build', gulp.parallel(build_bootstrap, build_js, build_css));

gulp.task('watch', function () {
    gulp.watch(path.js.watch, build_js);
    gulp.watch(path.css.watch, build_css);
});

gulp.task('default', gulp.series('build', 'watch'));
