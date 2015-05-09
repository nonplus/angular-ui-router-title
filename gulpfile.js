// dependencies
var gulp = require('gulp'),
	git = require('gulp-git'),
	bump = require('gulp-bump'),
	filter = require('gulp-filter'),
	tag_version = require('gulp-tag-version');

/**
 * Bumping version number and tagging the repository with it.
 * Please read http://semver.org/
 *
 * You can use the commands
 *
 *     gulp patch     # makes v0.1.0 → v0.1.1
 *     gulp feature   # makes v0.1.1 → v0.2.0
 *     gulp release   # makes v0.2.1 → v1.0.0
 *
 * To bump the version numbers accordingly after you did a patch,
 * introduced a feature or made a backwards-incompatible release.
 */

function inc(importance) {
	// get all the files to bump version in
	return gulp.src(['./package.json', './bower.json'])
		// bump the version number in those files
		.pipe(bump({type: importance}))
		// save it back to filesystem
		.pipe(gulp.dest('./'))
		// make release build
		.pipe(build)
		// commit the changed version number
		.pipe(git.commit('bumps package version'))

		// read only one file to get the version number
		.pipe(filter('package.json'))
		// **tag it in the repository**
		.pipe(tag_version());
}

gulp.task('patch', function() { return inc('patch'); });
gulp.task('feature', function() { return inc('minor'); });
gulp.task('release', function() { return inc('major'); });

gulp.task('build', build);

function build() {
	var wrap = require("gulp-wrap");
	return gulp.src("src/angular-ui-router-title.js")
		.pipe(wrap({ src: './build.txt' }, { info: require('./package.json') }))
		.pipe(gulp.dest('.'));
}

var serve = require('gulp-serve');
var port = 8082;

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

var karma = require('gulp-karma');
var files = require('./files.conf');
var testFiles = [].concat(files.libs, files.src, files.test);

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