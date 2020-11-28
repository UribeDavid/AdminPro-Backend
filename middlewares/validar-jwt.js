const jwt = require('jsonwebtoken');

const Usuario = require('../models/usuario');

const validarJWT = ( req, res, next ) => {

    // Leer el token
    const token = req.header('token');
    
    if ( !token ) {
        return res.status(401).json({
            ok: false,
            msg: 'No hay token'
        });
    }

    try {

        const { uid } = jwt.verify( token, process.env.JWT_SECRET );

        req.uid = uid;
        
    } catch (error) {

        return res.status(401).json({
            ok: false,
            msg: 'Token invalido'
        });
    }

    next();
}

const validarADMIN_ROLE = async (req, res, next) => {

    const uid = req.uid;

    try {
        
        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no existe'
            });
        }

        if ( usuarioDB.role !== 'ADMIN_ROLE' && uid != req.params.id ) {
            return res.status(401).json({
                ok: false,
                msg: 'No tiene permiso para realizar esta acción'
            });
        }
        
        next();

    } catch (error) {
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

module.exports = {
    validarJWT,
    validarADMIN_ROLE
}