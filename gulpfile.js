const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const minifyCss = require('gulp-clean-css');
const sourceMaps = require('gulp-sourcemaps');
 
const compile = () => {
    return gulp.src('./client/scss/**/*.scss')
    .pipe(sourceMaps.init())
    .pipe(sass())
    .pipe(minifyCss())
    .pipe(sourceMaps.write())
    .pipe(gulp.dest('./client/dist'));
};

const devWatch = () => {
    gulp.watch('./client/scss/**/*.scss', compile);
}

exports.compile = compile;
exports.devWatch = devWatch;