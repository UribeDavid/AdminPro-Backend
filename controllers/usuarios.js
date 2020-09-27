const { response } = require('express');

const bcrypt = require('bcryptjs');

const Usuario = require('../models/usuario');

const { generarJWT } = require('../helpers/jwt');

const getUsuarios = async (req, res) => {

    const desde = Number(req.query.desde) || 0;

    // En el segundo parametro de tipo string se hace filtro de cada objeto 'usuario' en este caso
    /* const usuarios = await Usuario.find({}, 'nombre email role')
                                  .skip( desde )
                                  .limit( 5 ); */

    // const total = await Usuario.count();

    const [usuarios, total] = await Promise.all([
        Usuario.find({}, 'nombre email role img')
                                  .skip( desde )
                                  .limit( 5 ),
        Usuario.countDocuments()
    ])

    res.status(200).json({
        ok: true,
        usuarios,
        uid: req.uid,
        totalRegistros: total
    });
}

const crearUsuario = async (req, res = response) => {
    
    const { email, password } = req.body;

    try {

        const existeEmail = await Usuario.findOne({ email });

        if ( existeEmail ) {
            return res.status(400).json({
                ok: false,
                msg: 'El correo ya fue registrado'
            });
        }

        const usuario = new Usuario( req.body );

        // Encriptar password
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );
    
        // Guardar usuario
        await usuario.save();

        // Crear token
        const token = await generarJWT( usuario.id );
    
        res.json({
            ok: true,
            usuario,
            token
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const actualizarUsuario = async (req, res = response) => {
    
    // TODO: Validar token y comprobar si es el usuario correcto

    const uid = req.params.id;

    try {

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'No existe usuario con ese id'
            });
        }
        
        // Actualizar
        const { password, google, email, ...campos } = req.body;

        if ( usuarioDB.email !== email ) {

            const existeEmail = await Usuario.findOne({ email });

            if ( existeEmail ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'Ya existe un usuario registrado con ese email'
                });
            }
        }

        campos.email = email;

        const usuarioActualizado = await Usuario.findByIdAndUpdate( uid, campos, { new: true } );

        res.json({
            ok: true,
            usuarioActualizado
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        })
    }
}

const borrarUsuario = async (req, res, next) => {
    
    try {
    
        const uid = req.params.id;

        const usuarioDB = await Usuario.findById( uid );

        if ( !usuarioDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Usuario no encontrado'
            });
        }
    
        const usuarioAEliminar = await Usuario.findOneAndDelete( uid );

        res.status(201).json({
            ok: true,
            id: uid
        });
        
    } catch (error) {
        console.log(error);
        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getUsuarios,
    crearUsuario,
    actualizarUsuario,
    borrarUsuario
}