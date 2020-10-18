/* 
    Hospitales
    ruta: '/api/hospitales'
*/
const { Router } = require('express');

const { check } = require('express-validator');

const {getHospitales, crearHospital, actualizarHospitales, borrarHospital} = require('../controllers/hospitales');

const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', 
    [
        validarJWT
    ], 
getHospitales);

router.post( '/', 
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es requerido').not().isEmpty(),
        validarCampos
    ], 
crearHospital);

router.put( '/:id',
    [
        validarJWT,
        check('nombre', 'El nombre del hospital es requerido').not().isEmpty(),
        validarCampos
    ], 
actualizarHospitales);

router.delete( '/:id', 
    [
        validarJWT
    ], 
borrarHospital );

module.exports = router;