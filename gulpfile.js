var gulp = require("gulp");
var slim = require("gulp-slim");

gulp.task('slim', function(){
  gulp.src("./src/*.slim")
      .pipe(slim({
              pretty: true
            }))
      .pipe(gulp.dest("./"));
});

gulp.task('default', ['slim']);
