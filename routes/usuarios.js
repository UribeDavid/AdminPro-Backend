/* 
    Ruta: /api/usuarios
*/

const { Router } = require('express');
const { check } = require('express-validator');

const { getUsuarios, crearUsuario, actualizarUsuario, borrarUsuario } = require('../controllers/usuarios');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT, validarADMIN_ROLE } = require('../middlewares/validar-jwt');

const router = Router();

router.get( '/', validarJWT, getUsuarios);

router.post( '/', 
    [
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('password', 'La contraseña es requerida').not().isEmpty(),
        check('email', 'El email es requerido').isEmail(),
        validarCampos
    ], 
crearUsuario);

router.put( '/:id',
    [
        validarJWT,
        validarADMIN_ROLE,
        check('nombre', 'El nombre es requerido').not().isEmpty(),
        check('email', 'El email es requerido').isEmail(),
        validarCampos,
    ], 
actualizarUsuario);

router.delete( '/:id', 
    [
        validarJWT,
        validarADMIN_ROLE
    ], borrarUsuario );

module.exports = router;