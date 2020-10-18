const response = require('express');

const Medico = require('../models/medico');

const Hospital = require('../models/hospital');

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

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarMedico = async (req, res = response) => {

    const id = req.params.id;

    const uid = req.uid;

    try {

        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado'
            });
        }

        const cambios = {
            ...req.body,
            usuario: uid
        }

        const hospitalDB = await Hospital.findById( cambios.hospital );

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado, es requerido asociar un hospital al medico'
            });
        }

        const medicoActualizado = await Medico.findByIdAndUpdate( id, cambios, { new: true });

        res.status(201).json({
            ok: true,
            msg: 'Medico actualizado correctamente',
            medico: medicoActualizado
        });
        
    } catch (error) {
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarMedico = async (req, res = response) => {

    const id = req.params.id;

    try {

        const medicoDB = await Medico.findById( id );

        if ( !medicoDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Medico no encontrado'
            });
        }

        await Medico.findByIdAndRemove( id );

        res.status(201).json({
            ok: true,
            msg: 'Medico eliminado satisfactoriamente',
            medico: medicoDB
        });
        
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getMedicos,
    crearMedico,
    actualizarMedico,
    borrarMedico
}