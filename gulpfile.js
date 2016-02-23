var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),

    minifyCss = require('gulp-minify-css'),
    cssbeautify = require('gulp-cssbeautify'),
    uncss = require('gulp-uncss'),
    csso = require('gulp-csso'),


    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    precss = require ('precss'),
    postcssExtend = require('postcss-extend'),
    lost = require('lost'),

    rigger = require('gulp-rigger');



path = {
    src: {
        jade: 'src/*.jade',
        css: 'src/style.css',
        js: 'src/script.js',
        img: 'src/img',
        fonts: 'src/fonts'
    },

    watch: {
        jade: 'src/**/*.jade',
        css: 'src/**/*.css',
        js: 'src/**/*.js',
        img: 'src/img',
        fonts: 'src/fonts'
    },

    bld: {
        html: '../',
        css: '../',
        js: '../',
        img: '../img',
        fonts: '../fonts'
    }
},

config = {
    server: {
        baseDir: "../"
    },
    tunnel: false,
    host: 'localhost',
    port: 3000,
    logPrefix: "dev"
};


//jade

gulp.task('jade', function() {
    gulp.src(path.src.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.bld.html))
        .pipe(reload({stream: true}));
});

//css

gulp.task('css', function () {
    var processors = [
        lost(),
        autoprefixer,
        postcssExtend
    ];

    gulp.src(path.src.css)

        .pipe(rigger())

        .pipe(postcss(processors))
        .pipe(cssbeautify())

        .pipe(gulp.dest(path.bld.css))
        .pipe(reload({stream: true}));
});

//js

gulp.task('js', function () {
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.bld.js))
        .pipe(reload({stream: true}));
});

//dev

gulp.task('dev', ['jade', 'css', 'js']);

//browser-sync

gulp.task('server', function() {
    browserSync(config);
});

//watch

gulp.task('watch', function() {
    watch(path.watch.jade, function(event, cb) {
        gulp.start('jade');
    });

    watch(path.watch.css, function(event, cb) {
        gulp.start('css');
    });

    watch(path.watch.js, function(event, cb) {
        gulp.start('js');
    });
});


//default

gulp.task('default', ['dev', 'server', 'watch']);