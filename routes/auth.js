/* 
    Path: '/api/login'
*/
const { Router } = require('express');

const { login, googleSingIn, renewToken } = require('../controllers/auth');

const { check } = require('express-validator');

const { validarCampos } = require('../middlewares/validar-campos');

const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post('/', 
    [
        check('email', 'El email es requerido').isEmail(),
        check('password', 'El password es requerido').not().isEmpty(),
        validarCampos
    ],
login
)

router.post( '/google',
    [check('token', 'El token de Google es requerido').not().isEmpty()],
    googleSingIn
)

router.get( '/renew', 
    validarJWT,
    renewToken
)

module.exports = router;