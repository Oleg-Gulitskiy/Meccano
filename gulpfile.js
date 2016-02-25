var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    csso = require('gulp-csso'),


    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    precss = require ('precss'),
    postcssExtend = require('postcss-extend'),
    lost = require('lost'),

    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant');



path = {
    src: {
        jade: 'src/*.jade',
        css: 'src/style.css',
        js: 'src/script.js',
        img: 'src/3_img/**/*.*',
        fonts: 'src/fonts'
    },

    watch: {
        jade: 'src/**/*.jade',
        css: 'src/**/*.css',
        js: 'src/**/*.js',
        img: 'src/3_img/**/*.*',
        fonts: 'src/fonts/'
    },

    bld: {
        jade: '../',
        css: '../',
        js: '../',
        img: '../img/',
        fonts: '../fonts'
    }
};


//jade

gulp.task('jade', function(cb) {
    rimraf(path.bld.jade, cb);
    gulp.src(path.src.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.bld.jade))
        .pipe(reload({stream: true}));
});

//jadeBld

gulp.task('jadeBld', function(cb) {
    rimraf(path.bld.jade, cb);
    gulp.src(path.src.jade)
        .pipe(jade({pretty: true}))
        .pipe(gulp.dest(path.bld.jade))
        .pipe(reload({stream: true}));
});

//css

gulp.task('css', function (cb) {
    var processors = [
        postcssExtend,
        lost(),
        autoprefixer
    ];
    rimraf(path.bld.css, cb);
    gulp.src(path.src.css)
        .pipe(rigger())
        .pipe(postcss(processors))
        .pipe(gulp.dest(path.bld.css))
        .pipe(reload({stream: true}));
});

//cssBld

gulp.task('cssBld', function (cb) {
    var processors = [
        postcssExtend,
        lost(),
        autoprefixer
    ];
    rimraf(path.bld.css, cb);
    gulp.src(path.src.css)
        .pipe(rigger())
        .pipe(postcss(processors))
        .pipe(gulp.dest(path.bld.css))
        .pipe(reload({stream: true}));
});

//js

gulp.task('js', function (cb) {
    rimraf(path.bld.js, cb);
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.bld.js))
        .pipe(reload({stream: true}));
});


//jsBld

gulp.task('jsBld', function (cb) {
    rimraf(path.bld.js, cb);
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(sourcemaps.init())
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(path.bld.js))
        .pipe(reload({stream: true}));
});

//img

gulp.task('img', function (cb) {
    rimraf(path.bld.img, cb);
    gulp.src(path.src.img)
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true,
            use: [pngquant()]
            }))
        .pipe(gulp.dest(path.bld.img))
        .pipe(reload({stream: true}));
});

gulp.task('dev', ['jade', 'css', 'js', 'img']);

//serverLocal

gulp.task('serverLocal', function() {
    var config = {
        server: {
            baseDir: "../"
        },
        tunnel: false,
        host: 'localhost',
        port: 3000,
        logPrefix: "dev"
    };
    browserSync(config);
});

//serverShare

gulp.task('serverShare', function() {
    var config = {
        server: {
            baseDir: "../"
        },
        tunnel: true,
        host: 'localhost',
        port: 3000,
        logPrefix: "dev"
    };
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

    watch(path.watch.img, function(event, cb) {
        gulp.start('img');
    });
});


//default

gulp.task('default', ['dev', 'serverLocal', 'watch']);

//share

gulp.task('share', ['dev', 'serverShare', 'watch']);

//bld

gulp.task('bld', ['jadeBld', 'cssBld', 'jsBld', 'serverLocal', 'watch']);