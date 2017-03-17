'use strict';

var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var browserSync = require('browser-sync');
var reload = browserSync.reload;

var gutil = require("gulp-util");
var webpack = require("webpack");
var webpackConfig = require("./webpack.config.js");

gulp.task("webpack", function (callback) {
    var myConfig = Object.create(webpackConfig);
    // run webpack
    webpack(
        // configuration
        myConfig
        , function (err, stats) {
            if (err) throw new gutil.PluginError("webpack", err);
            gutil.log("[webpack]", stats.toString({
                //     // output options
            }));
            callback();
        });
});

// JavaScript 格式校验
gulp.task('jshint', function () {
    return gulp.src('static/js/**/*.js')
        .pipe(reload({stream: true, once: true}))
        .pipe($.jshint())
        .pipe($.jshint.reporter('jshint-stylish'))
        .pipe($.if(!browserSync.active, $.jshint.reporter('fail')))
        ;
});

// 拷贝相关资源
gulp.task('copy', function () {
    return gulp.src([
        // 'app/*',
        'static/*',
        '!static/*.html',
        '!static/js/*',
        '!static/css/*',
        'node_modules/jquery/dist/jquery.min.js'
    ], {
        dot: true
    })
    .pipe(gulp.dest(function (file) {
            if (file.path.indexOf('jquery') > -1) {
                return 'public/hb/js';
            }
            return 'public/hb';
        }))
    .pipe($.size({title: 'copy'}));
});

// 图片优化
gulp.task('images', function () {
    return gulp.src('static/images/**/*')
        .pipe($.cache($.imagemin({
            progressive: true,
            interlaced: true
        })))
        .pipe(gulp.dest('public/hb/images'))
        .pipe($.size({title: 'images'}));
});

gulp.task('minifycss', function() {
    return gulp.src('static/css/*.css')      //压缩的文件
        .pipe($.minifyCss())   //执行压缩
        .pipe(gulp.dest('public/hb/css'))  //输出文件夹
        .pipe($.rename({suffix: '.min'}))
        .pipe($.size({title: 'css'}));
});

gulp.task('clean', function (cb) {
    del(['public/hb/*', '!public/hb/fonts'], {dot: true}, cb);
});

// 监视源文件变化自动cd编译
gulp.task('watch', function () {
    // gulp.watch('app/**/*.html', ['html']);
    gulp.watch('static/css/**/*css', ['minifycss']);
    gulp.watch('static/images/**/*', ['images']);
    // 使用 watchify，不再需要使用 gulp 监视 JS 变化
    // gulp.watch('app/js/**/*', ['jshint']);
    gulp.watch('static/js/**/*.js', ['webpack']);
});

gulp.task('test', function () {
    return gulp
    .src('test/runner.html')
    .pipe($.mochaPhantomjs());
});

// 默认任务
gulp.task('default', function (cb) {
    runSequence('clean', ['minifycss', 'images', 'copy', 'webpack'], 'watch', cb);
});
