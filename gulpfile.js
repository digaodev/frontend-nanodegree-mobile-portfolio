// Based on the following discussions and articles:
// https://markgoodyear.com/2014/01/getting-started-with-gulp/
// https://www.smashingmagazine.com/2015/06/efficient-image-resizing-with-imagemagick/
// https://discussions.udacity.com/t/gulp-and-setting-up-a-gulp-workflow-intermediate/24359/3

//npm install --save-dev gulp gulp-autoprefixer gulp-rename gulp-cssnano gulp-notify gulp-concat gulp-uglify gulp-imagemin gulp-changed gulp-livereload del psi ngrok run-sequence gulp-exit

// Manually load the plugins
var gulp = require('gulp'),
    autoprefixer = require('gulp-autoprefixer'), // https://www.npmjs.com/package/gulp-autoprefixer
    rename = require('gulp-rename'),       // https://www.npmjs.com/package/gulp-rename
    cssnano = require('gulp-cssnano'),      // https://www.npmjs.com/package/gulp-cssnano
    notify = require('gulp-notify'),       // https://www.npmjs.com/package/gulp-notify
    concat = require('gulp-concat'),       // https://www.npmjs.com/package/gulp-concat
    uglify = require('gulp-uglify'),       // https://www.npmjs.com/package/gulp-uglify
    imagemin = require('gulp-imagemin'),     // https://www.npmjs.com/package/image-min
    livereload = require('gulp-livereload'),   // https://www.npmjs.com/package/gulp-livereload
    del = require('del'),               // https://www.npmjs.com/package/del
    ngrok = require('ngrok'), // https://www.npmjs.com/package/ngrok
    psi = require('psi'), // https://www.npmjs.com/package/psi
    sequence = require('run-sequence'); // https://www.npmjs.com/package/run-sequence
browserSync = require('browser-sync'); // https://www.npmjs.com/package/browser-sync

var port = 3000;
var site = '';

gulp.task('html', function () {
    // Copy the html files to dist path
    // From '*.html' to 'dist/';
    gulp.src('*.html')
        .pipe(gulp.dest('dist/'));
});

gulp.task('styles', function () {
    // Process CSS styles from root path with autoprefixer and cssnano;
    // From 'css/*.css' to 'dist/css';
    // Rename to .min;
    gulp.src('css/*.css')
        .pipe(autoprefixer()) //Browserslist will use defaults: > 1%, last 2 versions, Firefox ESR.
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/css'));

    // Process CSS styles from view path with autoprefixer and cssnano;
    // From 'views/css/*.css' to 'dist/views/css';
    // Rename to .min;
    gulp.src('views/css/*.css')
        .pipe(autoprefixer()) //Browserslist will use defaults: > 1%, last 2 versions, Firefox ESR.
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/views/css'))
        .pipe(notify({
            message: 'Styles task complete'
        }));
});

gulp.task('scripts', function () {
    // Process JS scripts from root path with concat and uglify;
    // From 'js/*.js' to 'dist/js';
    // Concatenate to main.js;
    // Rename to .min;
    gulp.src('js/*.js')
        .pipe(concat('main.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/js'));

    // Process JS scripts from view path with concat and uglify;
    // From 'views/js/*.js' to 'dist/views/js';
    // Concatenate to main.js;
    // Rename to .min;
    gulp.src('views/js/*.js')
        .pipe(concat('main.js'))
        .pipe(rename({
            suffix: '.min'
        }))
        .pipe(uglify())
        .pipe(gulp.dest('dist/views/js'))
        .pipe(notify({
            message: 'Scripts task complete'
        }));
});

// Process image files from root path with imagemin and imagemagick;
// Setup all the args for imagemagick;
// From 'img/*' to 'dist/img';
// Optimize the images;

gulp.task('images', function () {
    gulp.src('img/*')
        .pipe(changed('dist/img'))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/img'));

    // Process image files from views path with imagemin and imagemagick;
    // Setup all the args for imagemagick;
    // From 'views/images/*' to 'dist/views/images';
    // Optimize the images;

    gulp.src('views/images/*')
        .pipe(changed('dist/views/images'))
        .pipe(imagemin({
            optimizationLevel: 5,
            progressive: true,
            interlaced: true
        }))
        .pipe(gulp.dest('dist/views/images'))
        .pipe(notify({
            message: 'Images task complete'
        }));
});

// Clean up the destination folders and rebuild the files in case any have been removed from the source and are left hanging out in the destination folder
gulp.task('clean', function () {
    return del(['dist/css', 'dist/js', 'dist/img', 'dist/views/css', 'dist/views/js', 'dist/views/images']);
});

browserSync = require('browser-sync').create();
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: "./dist"
        }
    });
});

gulp.task('ngrok-connect', function (callback) {
    return ngrok.connect(port, function (err, url) {
        site = url;
        console.log('serving your tunnel from: ' + site);
        callback();
    });
});

gulp.task('psi-mobile', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'mobile',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
        console.log('Usability score: ' + data.ruleGroups.USABILITY.score);
    });
});

gulp.task('psi-desktop', function () {
    return psi(site, {
        nokey: 'true',
        strategy: 'desktop',
    }).then(function (data) {
        console.log('Speed score: ' + data.ruleGroups.SPEED.score);
    });
});

gulp.task('psi-sequence', function (callback) {
    return sequence(
        'browser-sync',
        'ngrok-connect',
        // 'psi-desktop',
        // 'psi-mobile',
        callback
    );
});

gulp.task('build', ['clean'], function () {
    gulp.start('html', 'styles', 'scripts', 'images');
});

gulp.task('psi', ['psi-sequence'], function () {
    console.log('psi task complete');
    // process.exit();
});





