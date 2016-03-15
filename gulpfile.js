var gulp = require('gulp'),
    jade = require('gulp-jade'),
    browserSync = require('browser-sync'),
    watch = require('gulp-watch'),
    reload = browserSync.reload,
    sourcemaps = require('gulp-sourcemaps'),
    uglify = require('gulp-uglify'),
    uncss = require('gulp-uncss'),
    csso = require('gulp-csso'),
    replace = require('gulp-replace'),
    rename = require('gulp-rename')
    postcss = require('gulp-postcss'),
    autoprefixer = require('autoprefixer'),
    precss = require ('precss'),
    postcssExtend = require('postcss-extend'),
    lost = require('lost'),

    rimraf = require('rimraf'),
    rigger = require('gulp-rigger'),
    imagemin = require('gulp-imagemin'),
    pngquant = require('imagemin-pngquant'),
    svgStore = require('gulp-svgstore'),
    svgmin = require('gulp-svgmin'),
    cheerio = require('gulp-cheerio');



path = {
    src: {
        jade: 'src/*.jade',
        css: 'src/style.css',
        js: 'src/script.js',
        img: 'src/3_img/**/*.*',
        svg: 'src/4_svg/**/*.svg',
        fonts: 'src/fonts'
    },

    watch: {
        jade: 'src/**/*.jade',
        css: 'src/**/*.css',
        js: 'src/**/*.js',
        img: 'src/3_img/**/*.*',
        svg: 'src/4_svg/**/*.svg',
        fonts: 'src/fonts/'
    },

    bld: {
        jade: '../',
        css: '../',
        js: '../',
        img: '../img/',
        svg: 'src/4_svg/',
        fonts: '../fonts'
    },

    del: {
        jade: '../*.html',
        css: '../style.css',
        js: '../script.js',
        img: '../img/',
        svg: 'src/4_svg/svgSprite.html',
        fonts: '../fonts'
    }
};


//jade

gulp.task('jade', function(cb) {
    rimraf(path.del.jade, cb);
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
    rimraf(path.del.css, cb);
    gulp.src(path.src.css)
        .pipe(rigger())
        .pipe(postcss(processors))
        .pipe(gulp.dest(path.bld.css))
        .pipe(reload({stream: true}));
});

//js

gulp.task('js', function (cb) {
    rimraf(path.del.js, cb);
    gulp.src(path.src.js)
        .pipe(rigger())
        .pipe(gulp.dest(path.bld.js))
        .pipe(reload({stream: true}));
});

//jsBld

gulp.task('jsBld', function (cb) {
    rimraf(path.del.js, cb);
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
    rimraf(path.del.img, cb);
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

//svg

gulp.task('svg', function() {
    gulp.src(path.src.svg)
        .pipe(svgmin({
            js2svg: {
                pretty: true
            }
        }))
        .pipe(cheerio({
            run: function ($) {
                $('[fill]').removeAttr('fill');
                $('[style]').removeAttr('style');
            },
            parserOptions: { xmlMode: true }
        }))
        .pipe(replace('&gt;', '>'))
        .pipe(svgStore({
            inlineSvg: true
        }))
        .pipe(replace('svg xmlns="http://www.w3.org/2000/svg"',
            'svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="0" height="0" style="position:absolute"'))
        .pipe(rename('svgSprite.html'))
        .pipe(gulp.dest(path.bld.svg));
});

//dev

gulp.task('dev', ['jade', 'css', 'js', 'img', 'svg']);

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
    watch(path.watch.jade, function() {
        gulp.start('jade');
    });

    watch(path.watch.css, function() {
        gulp.start('css');
    });

    watch(path.watch.js, function() {
        gulp.start('js');
    });

    watch(path.watch.img, function() {
        gulp.start('img');
    });

    watch(path.watch.svg, function() {
        gulp.start('svg');
    });
});


//default

gulp.task('default', ['dev', 'serverLocal', 'watch']);

//share

gulp.task('share', ['dev', 'serverShare', 'watch']);

//bld

gulp.task('bld', ['jadeBld', 'cssBld', 'jsBld', 'img', 'serverLocal', 'watch']);
