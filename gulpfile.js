const gulp = require('gulp');
const plugins = require('gulp-load-plugins')();

const path = require('path');
const gls = require('gulp-live-server');

const port = 8080;
const server = gls.static('dist', port);

/**************** Utility **********************/
function highlight(str) {
  return str.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<strong>$1</strong>')
    .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" target="_blank">$1</a>');
}

/******************* Jade to html ***********/
function getLocals(locale) {
  const resumeData = require(`./resume_${locale}.json`);
  const localePath = './i18n/' + resumeData.data_lang + '/dict.js';
  const locals = require(localePath);

  // remove cache
  delete require.cache[require.resolve(`./resume_${locale}.json`)];
  delete require.cache[require.resolve(localePath)];

  // integrate the context
  for (let item in resumeData) {
    locals[item] = resumeData[item];
  }

  locals.highlight = highlight;

  return locals;
}

gulp.task('jade_zh_CN',
  () => gulp.src('./src/jade/index.jade')
                .pipe(plugins.jade({locals: getLocals('zh-CN')}))
                .pipe(gulp.dest('./dist/zh'))
);

gulp.task('jade_en_US',
  () => gulp.src('./src/jade/index.jade')
                .pipe(plugins.jade({locals: getLocals('en-US')}))
                .pipe(gulp.dest('./dist/en'))
);

/************* less to css  ********************/
const lessPath = [
  path.join(__dirname, 'src', 'less', 'includes'),
  path.join(__dirname, 'src', 'less', 'components')
];

function less2css(srcPath, destPath, debug) {
  if(!debug) {
    return gulp.src(srcPath)
      .pipe(plugins.less({ paths: lessPath }))
      .pipe(plugins.minifyCss({ compatibility: 'ie9' }))
      .pipe(gulp.dest(destPath));
  } else {
    return gulp.src(srcPath)
      .pipe(plugins.sourcemaps.init())
      .pipe(plugins.less({ paths: lessPath }))
      .pipe(plugins.sourcemaps.write())
      .pipe(gulp.dest(destPath));
  }
}

gulp.task('less', () => {
  less2css('./src/less/questions.less', './dist/questions/');
  less2css('./src/less/index.less', './dist/');
});

gulp.task('less-debug', () => {
  less2css('./src/less/questions.less', './dist/questions/', true);
  less2css('./src/less/index.less', './dist/', true);
});

/************** Static assets **************/
gulp.task('static', () => gulp.src('./static/**/*', {base: 'static'}).pipe(gulp.dest('./dist/static/')));

/****************** Watch ****************/
gulp.task('watch', ['server'], () => {
  gulp.watch(['./src/**/*.jade', './resume*', './i18n/**/*.js'],
             ['jade_en_US', 'jade_zh_CN']);
  gulp.watch('./static/**/*', ['static']);
  gulp.watch('./src/**/*.less', ['less-debug']);
  gulp.watch('./dist/**/*', () => {
    server.notify.apply(server, arguments);
  });
});

/****************** Build ****************/
gulp.task('build', ['jade_en_US', 'jade_zh_CN', 'less-debug', 'static']);
gulp.task('build-for-deploy', ['jade_en_US', 'jade_zh_CN', 'less', 'static']);

/****************** Server ****************/
gulp.task('serve', ['build'], () => {
  server.start().then(() => {}, () => {}, () => {
      const open = process.platform === 'darwin' ? 'open' : (process.platform === 'win32' ? 'start' : 'xdg-open');
      // open default browser to visit
      require('child_process').exec(`${open} http://localhost:${port}/zh`);
  });
});

gulp.task('server', ['serve']);
gulp.task('preview', ['build-for-deploy', 'serve']);

/****************** Deploy ****************/
gulp.task('deploy', ['build-for-deploy'], () => gulp.src('./dist/**/*').pipe(plugins.ghPages()));

/****************** Default ****************/
gulp.task('default', ['server', 'watch']);
