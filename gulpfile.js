//gulp 插件
const gulp = require("gulp");
//gulp 服务器插件；
const connect = require("gulp-connect");
//gulp 合并插件；
var concat = require('gulp-concat');
//gulp 压缩插件
var uglify = require("gulp-uglify");
//gulp babel
var babel = require("gulp-babel");
// 获取 cleancss 模块（用于压缩 CSS）
var cleanCSS = require('gulp-clean-css');
gulp.task('connect', function() {
    connect.server({
        port: 8888,
        root: "dist/",
        livereload: true,
        middleware: function(connect, opt) {
            var Proxy = require('gulp-connect-proxy');
            opt.route = '/proxy';
            var proxy = new Proxy(opt);
            return [proxy];
        }
    });
});
// 如何发起一个代理请求 : 
// localhost:8888/proxy/目标;
gulp.task("html", function() {
    return gulp.src("*.html").pipe(gulp.dest("dist/")).pipe(connect.reload());
})
gulp.task("watch", () => {
    gulp.watch("index.html", ["html"]);
})
gulp.task("default", ["watch", "connect"]);
gulp.task("script", () => {
        return gulp.src(["script/app/*.js", "script/module/*.js", "script/libs/*.js", "!script/libs/jquery.js"])
            .pipe(concat("main.js"))
            .pipe(uglify())
            .pipe(gulp.dest("dist/script"));
    })
    //编译？ es6 => es5
gulp.task("es6", () => {
        return gulp.src("script/es2015/es6.js")
            .pipe(babel({
                presets: ['@babel/env']
            }))
            .pipe(gulp.dest("dist/script"));
    })
    // 压缩 css 文件
    // 在命令行使用 gulp csscompress 启动此任务
gulp.task('css', () => {
    return gulp.src('style/*.css')
        .pipe(cleanCSS())
        .pipe(gulp.dest('dist/css'));
})