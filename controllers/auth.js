const { response } = require('express');
const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');
const { generarJWT } = require('../helpers/jwt');
const { googleVerify } = require('../helpers/google-verify');
const { getMenuFrontEnd } = require('../helpers/menu-frontend');
const usuario = require('../models/usuario');

const login = async (req, res = response) => {

    const { email, password } = req.body;

    try {

        // Verificar email
        const usuarioDB = await Usuario.findOne({ email });

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Email invalido'
            });
        }

        // Verificar contraseña
        const validPassword = bcrypt.compareSync(password, usuarioDB.password);

        if ( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña invalida'
            });
        }

        // Generar token
        const token = await generarJWT( usuarioDB.id );

        res.status(200).json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuarioDB.role )
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Ocurrió un error'
        });
    }
}

const googleSingIn = async (req, res = response) => {

    try {

        const googleToken = req.body.token;
        
        const { name, email, picture } = await googleVerify( googleToken );

        const usuarioDB = await Usuario.findOne({ email });

        let usuario = null;

        if ( !usuarioDB ) {

            usuario = new Usuario({
                nombre: name,
                email,
                password: '@@@',
                img: picture,
                google: true
            });

        } else {

            usuario = usuarioDB;
            usuario.google = true;

        }

        await usuario.save();

        // Generar el token - JWT
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            token,
            menu: getMenuFrontEnd( usuario.role )
        });

    } catch (error) {
        console.log(error);

        res.status(401).json({
            ok: false,
            msg: 'Token no es correcto'
        });
        
    }

}

const renewToken = async ( req, res = response ) => {

    const uid = req.uid;

    const token = await generarJWT( uid );

    const usuarioDB = await Usuario.findById( uid );

    if ( !usuarioDB ) {
        return res.status(404).json({
            ok: false,
            msg: 'Usuario no encontrado'
        });
    }

    res.json({
        ok: true,
        token,
        usuario: usuarioDB,
        menu: getMenuFrontEnd( usuarioDB.role )
    });
}

module.exports = {
    login,
    googleSingIn,
    renewToken
}