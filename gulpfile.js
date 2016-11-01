// dependencies
var gulp = require('gulp');
var git = require('gulp-git');
var bump = require('gulp-bump');
var filter = require('gulp-filter');
var tag_version = require('gulp-tag-version');
var tslint = require("gulp-tslint");
var runSequence = require('run-sequence');
var wrap = require("gulp-wrap");
var gutil = require('gulp-util');
var serve = require('gulp-serve');
var karma = require('gulp-karma');
var files = require('./files.conf');
var testFiles = [].concat(files.libs, files.src, files.test);

var port = 8082;

gulp.task('bump-version', function () {
	return gulp.src(['./bower.json', './package.json'])
		.pipe(bump({type: "patch"}).on('error', gutil.log))
		.pipe(gulp.dest('./'));
});

gulp.task('commit-changes', ['test'], function () {
	return gulp.src('.')
		.pipe(git.commit('Bumped version number', {args: '-a'}));
});

gulp.task('tag-version', function() {
	return gulp.src('package.json')
		.pipe(tag_version());
});

gulp.task('push-changes', function (cb) {
	git.push('origin', 'master', cb);
});

gulp.task('release', ['ts-compile', 'test'], function (callback) {
	runSequence(
		'bump-version',
		'build',
		'commit-changes',
		'tag-version',
		function (error) {
			if (error) {
				console.log(error.message);
			} else {
				console.log('RELEASE FINISHED SUCCESSFULLY');
			}
			callback(error);
		});
});

gulp.task('tag-version', function() {
	return gulp.src('./package.json')
		.pipe(tag_version());
});

gulp.task('build', ['ts-compile'], function() {
	return gulp.src("src/angular-ui-router-title.js")
		.pipe(wrap({ src: './build.txt' }, { info: require('./package.json') }))
		.pipe(gulp.dest('.'));
});

gulp.task('ts-compile', function() {
	var ts = require('gulp-typescript');
	var tsProject = ts.createProject('tsconfig.json');
	return tsProject.src(['src/**/*.ts', 'test/**/*.ts'])
		.pipe(tsProject()).js
		.pipe(gulp.dest('.'));
});

gulp.task('serve', serve({
	root: __dirname,
	port: port,
	middleware: function(req, resp, next) {
		console.log(req.originalUrl);
		if(req.originalUrl == '/') {
			resp.statusCode = 302;
			resp.setHeader('Location', '/sample/');
			resp.setHeader('Content-Length', '0');
			resp.end();
		} else {
			next();
		}
	}
}));

gulp.task('demo', ['serve'], function() {
	require('open')('http://localhost:' + port);
});

gulp.task('test', function() {
	// Be sure to return the stream
	return gulp.src(testFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'run'
		}))
		.on('error', function(err) {
			// Make sure failed tests cause gulp to exit non-zero
			throw err;
		});
});

gulp.task('watch', function() {
	gulp.src(testFiles)
		.pipe(karma({
			configFile: 'karma.conf.js',
			action: 'watch'
		}));
});

gulp.task('lint', function () {
	return gulp.src([
		"./src/**/*.ts",
		"./test/**/*.ts"
	])
		.pipe(tslint({
			formatter: "verbose"
		}))
		.pipe(tslint.report());
});
