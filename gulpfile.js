const { src, dest, watch, parallel } = require("gulp");//Hay que llamar las funciones del gulp

//Dependencias de CSS
const sass = require("gulp-sass")(require('sass'));//Sirve para exportar el sass y poder utilizarlo
//const sass es la función que se crea y se manda a llamar con la función .pipe(sass())
//el segundo require sirve para que busque en las dependencias que se tienen la dependencia de sass que se requiere
const plumber = require('gulp-plumber'); //se importa plumber //(Es la dependencia gulp-plumber) 

//Dependencias de imágenes
const cache = require('gulp-cache');//Función para importar la dependencia de cache
const imagemin = require('gulp-imagemin');//Función para importar la dependencia de imagemin
const webp = require('gulp-webp');//Función para importar la dependencia de webp
const avif = require('gulp-avif');//Función para importar la dependencia de avif

function css(done) {
    src('src/scss/**/*.scss')//Identificar el archivo de SASS
        .pipe(plumber())//Debe estar primero para poderse importar y en caso de errores
        .pipe(sass())//Compilarlo o comprimirlo
        .pipe(dest('build/webp')) //Dest es una función para almacenar en el disco duro //pueden haber multiples pipes

    done(); //Callback que avisa cuando llegamos al final
}

function imagenes(done) {
    const opciones = {
        optimizationLevel: 3 //Las imagenes se optimizan en un nivel de 3, utilizando imagemin
    }
    src('src/img/**/*.{png,jpg}')//Identificar
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))//Aquí se almacenan esas imágenes

    done();
}

function versionWebp(done) {
    const opciones = {//Opciones que se agregan para la calidad de la foto, en este caso, 50/100.
        quality: 50
    };
    //No debe ir espacio entre {png,jpg} sino no toma los jpg, sólo los png.
    src('src/img/**/*.{png,jpg}')//identifica el archivo. Es para colocar los dos tipos de formato que se puede encontrar
        .pipe(webp(opciones))//Para que ahora las imágenes se conviertan en webp
        .pipe(dest('build/img'))//Y se van a almacenar en estas carpetas
    done();//Callback que avisa cuando llegamos al final
}

function versionAvif(done) {
    const opciones = {//Opciones que se agregan para la calidad de la foto, en este caso, 50/100.
        quality: 50
    };
    //No debe ir espacio entre {png,jpg} sino no toma los jpg, sólo los png.
    src('src/img/**/*.{png,jpg}')//identifica el archivo. Es para colocar los dos tipos de formato que se puede encontrar
        .pipe(avif(opciones))//Para que ahora las imágenes se conviertan en webp
        .pipe(dest('build/img'))//Y se van a almacenar en estas carpetas
    done();//Callback que avisa cuando llegamos al final
}

function javascript(done) {
    src('src/js/**/*.js')
        .pipe(dest('build/js'));

    done();
}

function dev(done) { //dev es una función para tener varias funciones dentro
    watch('src/scss/**/*.scss', css);//se llama la función css
    watch('src/js/**/*.js', javascript);//se llama la función javascript
    done();
}

exports.css = css; //Para mandar a llamar la función de css y que se pueda ejecutar el código
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionWebp = versionWebp; //Para mandar a llamar la función de webp
exports.versionAvif = versionAvif;
exports.dev = parallel(imagenes, versionWebp, versionAvif, javascript, dev);
