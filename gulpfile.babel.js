// import autoprefixer from 'autoprefixer'
import atImport from 'postcss-import'
import browserSync from 'browser-sync'
import CSSnano from 'cssnano'
import CSSnext from 'postcss-cssnext'
import CSSlint from 'stylelint'
import gulp from 'gulp'
import magician from 'postcss-font-magician'
import mqpacker from 'css-mqpacker'
import postcss from 'gulp-postcss'

const paths = {
  css: {
    src: 'src/**/*.css',
    dest: 'dist/'
  },
  html: {
    src: 'src/*.html',
    dest: 'dist/'
  }
}

// Servidor de desarrollo
export const serve = (done) => {
  browserSync.init({
    server: {
      baseDir: 'dist/'
    },
    port: 9000
  })
  done();
}

// Recarga del Navegador
export const reload = (done) => {
  browserSync.reload()
  done()
}

// Procesamiento de CSS
export const css = () => {
  const processors = [
    atImport({
      plugins: [
        CSSlint({
          "rules": {
            "block-no-empty": true
          }
        })
      ]
    }),
    magician({
      variants: {
        'Open Sans': {
          '300': [],
          '700': []
        }
      }
    }),
    CSSnext({
      features: {
        autoprefixer: {
          options: {
            browsers: [
              'last 2 versions'
            ]
          }
          // grid: true,
          // flexbox: false,
        },
        customProperties: false,
        calc: false,
      }
    }),
    mqpacker(),
    CSSnano()
  ]

  return (gulp
      .src(paths.css.src)
      .pipe(postcss(processors))
      .pipe(gulp.dest(paths.css.dest))
      .pipe(browserSync.stream()))
}

// Procesamiento de HTML
export const html = () => {
  return (gulp
      .src(paths.html.src)
      .pipe(gulp.dest(paths.html.dest)))
}

// Vigilar cambios
export const watch = () => {
  gulp.watch(paths.html.src, gulp.series(html, reload))
  gulp.watch(paths.css.src, gulp.series(css, reload))
}

// Tareas
gulp.task('default', gulp.parallel(watch, serve))