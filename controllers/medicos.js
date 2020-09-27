const response = require('express');

const Medico = require('../models/medico');

const getMedicos = async (req, res = response) => {

    try {

        const medicos = await Medico.find()
                                    .populate('usuario', 'nombre')
                                    .populate('hospital', 'nombre');
        
        res.status(200).json({
            ok: true,
            medicos
        });
        
    } catch (error) {

        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const crearMedico = async (req, res = response) => {

    const uid = req.uid;

    const medico = new Medico({ ...req.body, usuario: uid });

    try {

        const medicoDB = await medico.save();

        res.status(201).json({
            ok: true,
            medico: medicoDB
        });
        
    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarMedico = (req, res = response) => {

}

const borrarMedico = (req, res = response) => {

}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}