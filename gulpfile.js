var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),

    minifyCss = require('gulp-minify-css'),
    cssbeautify = require('gulp-cssbeautify'),
    concatCss = require('gulp-concat-css'),
    uncss = require('gulp-uncss'),
    csso = require('gulp-csso'),

    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    precss = require ('precss');



path = {
    src: {
        jade: 'src/*.jade',
        css: 'src/**/*.css',
        js: 'src/js',
        img: 'src/img',
        fonts: 'src/fonts'
    },

    watch: {
        jade: 'src/**/*.jade',
        css: 'src/**/*.css',
        js: 'src/js',
        img: 'src/img',
        fonts: 'src/fonts'
    },

    dev: {
        html: './dev',
        css: 'dev/css',
        js: 'dev/js',
        img: 'dev/img',
        fonts: 'dev/fonts'
    }


},

    config = {
        server: {
            baseDir: "./dev"
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "dev"
    };


//jade

gulp.task('jade', function() {
    gulp.src(path.src.jade)
        .pipe(jade({pretty: true}))

        .pipe(gulp.dest(path.dev.html))
        .pipe(reload({stream: true}));
});

//css

gulp.task('css', function () {
    var processors = [
        autoprefixer,
        precss
    ];

    gulp.src(path.src.css)

        //.pipe(minifyCss({
        //    keepSpecialComments: '0'
        //}))
        .pipe(concatCss('style.css'))
        //.pipe(uncss({html: ['dev/**/*.html']}))
        .pipe(postcss(processors))
        .pipe(cssbeautify())

        .pipe(gulp.dest('dev/'))
        .pipe(reload({stream: true}));
});

//js

//gulp.task('js', function () {
//    gulp.src(path.src.js)
//});

//dev

gulp.task('dev', ['jade', 'css']);

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
});


//default

gulp.task('default', ['dev', 'server', 'watch']);