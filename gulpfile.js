const gulp = require('gulp');
const del = require('del');

gulp.task('clean', () => {
  // Clean `build` directory
  return del([ 'build/*' ]);
});
