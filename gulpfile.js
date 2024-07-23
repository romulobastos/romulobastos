// Packages
import gulp from "gulp";
import * as _sass from 'sass'
// import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass( _sass );
import pug from 'gulp-pug';
import imagemin, {gifsicle, mozjpeg, optipng, svgo} from 'gulp-imagemin';
import uglify from 'gulp-uglify';
import concat from 'gulp-concat';
// const watch = require('gulp-watch');
import {deleteAsync} from 'del';
// import rename from 'gulp-rename';
import browsersync from 'browser-sync';
browsersync.create();

// path
var path = {
	source:		'./src/',
	pug:		'./src/pug/**/*.pug',
	pugpages:	'./src/pug/_pages/**/*.pug',
	pugpartials:'./src/pug/_partials/**/*.pug',
	styles: 	'./src/sass/**/*{.sass,.scss,.css}',
	// cssvendor: 	'./src/sass/vendor/**/*{.sass,.scss,.css}',
	// scripts: 	'./src/js/*.js',
	// jsvendor:	'./src/js/vendor/*.js',
	images: 	'./src/images/**/*{.jpg,.gif,.png,.svg,.eot,.ttf,.woff,.woff2,.ico}'
}

// local
var local = {
	root:		'./',
	dest:		'./site',
	styles:		'./site/assets/css/',
	// scripts:	'./site/assets/js/',
	images:		'./site/assets/images/',
}

// BrowserSync
function browserSync(done) {
	browsersync.init({
		server: {
			baseDir: local.root
		},
		port: 3000
	});
	done();
}

// BrowserSync Reload
function browserSyncReload(done) {
	browsersync.reload();
	done();
}

// Clean assets
function clean() {
	return deleteAsync(local.dest);
}

// Optimize Images
function images() {
	return gulp
	.src(path.images)
	.pipe(imagemin([		
		gifsicle({interlaced: true}),
		mozjpeg({quality: 100, progressive: false}),
		optipng({optimizationLevel: 5}),
		svgo({
			plugins: [ 
				{ removeUselessDefs: false },
				{ cleanupIDs: false}
			]
		})
	]))
	.pipe(gulp.dest(local.images))
}

// CSS task
function css() {
	return gulp
	.src(path.styles)
	.pipe(sass({outputStyle: 'compressed'}))
	.on('error', function(err) { console.log('ERROR:', err.message); })
	.pipe(concat('styles.css'))
	.pipe(gulp.dest(local.styles))
	.pipe(browsersync.stream());
}

// JS task
function js() {
	return gulp
	.src(path.scripts)
	.pipe(concat('scripts.js'))
	// .pipe(uglify('scripts.js'))
	.pipe(gulp.dest(local.scripts))
	.pipe(browsersync.stream());
}

// HTML task
function html() {
	return gulp
	.src([path.pug, "!"+path.pugpages+"", "!"+path.pugpartials+""])
	.pipe(pug({
		// pretty: true
	}))
	.pipe(gulp.dest(local.root))
	.pipe(browsersync.stream());
}

// Watch files
function watchFiles() {
	gulp.watch(path.styles, css);
	// gulp.watch(path.scripts, js);
	gulp.watch(path.images, images);
	gulp.watch(path.pug, html);
}

// Complex tasks
const build = gulp.series(clean, gulp.parallel(css, images, js, html));
const watch = gulp.parallel(watchFiles, browserSyncReload, browserSync);

// Export tasks
export {images};
export {css};
export {js};
export {html};
export {clean};
export {build};
export {watch};
export default build;

// export const someName = {...cloudFunctions};
// export { cloudFunctions };