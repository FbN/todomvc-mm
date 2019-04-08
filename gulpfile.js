'use strict'
const gulp = require('gulp')
const sourcemaps = require('gulp-sourcemaps')
const browserSync = require('browser-sync').create()
const del = require('del')
const rollup = require('rollup-stream')
const builtins = require('rollup-plugin-node-builtins')
const nodeResolve = require('rollup-plugin-node-resolve')
const commonjs = require('rollup-plugin-commonjs')
const globals = require('rollup-plugin-node-globals')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const babel = require('gulp-babel')
const config = require('./package.json')
const path = require('path')

gulp.task('clean', del.bind(null, ['.tmp', 'dist']))

let cache

gulp.task('vendor', () => {
    return rollup({
        input: 'vendor.mjs',
        name: 'main',
        format: 'es',
        sourcemap: true,
        cache: cache,
        plugins: [
            nodeResolve({
                browser: true,
                preferBuiltins: true
            }),
            commonjs({ include: 'node_modules/**' }),
            builtins(),
            globals()
        ]
    })
        .on('bundle', function (bundle) {
            cache = bundle
        })

        .pipe(source('vendor.mjs'))

        .pipe(buffer())

        .pipe(sourcemaps.init({ loadMaps: true }))

        .pipe(sourcemaps.write('.'))

        .pipe(gulp.dest('.tmp/js'))

        .pipe(
            browserSync.reload({
                stream: true
            })
        )
})

gulp.task(
    'serve',
    gulp.series('clean', gulp.parallel('vendor'), () => {
        browserSync.init({
            notify: false,
            port: 9000,
            server: {
                baseDir: ['.tmp', 'app']
            }
        })

        gulp.watch(['app/*.html', 'app/images/**/*', 'app/scripts/**/*']).on(
            'change',
            browserSync.reload
        )
    })
)
