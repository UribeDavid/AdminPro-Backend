const response = require('express');

const Hospital = require('../models/hospital');

const getHospitales = async (req, res = response) => {

    try {
        
        const hospitales = await Hospital.find()
                                         .populate('usuario', 'nombre')
        
        res.status(200).json({
            ok: true,
            hospitales
        });

    } catch (error) {
        
        console.log(error);

        res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }

}

const crearHospital = async (req, res = response) => {

    const uid = req.uid;
    
    const hospital = new Hospital( { ...req.body, usuario: uid } );

    try {

        const hospitalDB = await hospital.save();
        
        res.status(201).json({
            ok: true,
            hospital: hospitalDB
        });

    } catch (error) {

        console.log(error);

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const actualizarHospitales = async (req, res = response) => {

    const id = req.params.id;

    const uid = req.uid;
    
    try {

        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        // hospitalDB.nombre = req.body.nombre;
        const cambiosHospital = {
            ...req.body,
            usuario: uid
        }

        const hospitalActualizado = await Hospital.findByIdAndUpdate( id, cambiosHospital, { new: true });

        res.status(201).json({
            ok: true,
            hospital: hospitalActualizado
        });
        
    } catch (error) {

        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

const borrarHospital = async (req, res = response) => {

    const id = req.params.id;
    
    try {

        const hospitalDB = await Hospital.findById( id );

        if ( !hospitalDB ) {
            return res.status(404).json({
                ok: false,
                msg: 'Hospital no encontrado'
            });
        }

        await Hospital.findByIdAndRemove( id );

        res.status(201).json({
            ok: true,
            msg: 'Hospital eliminado correctamente',
            hospitalEliminado: hospitalDB
        });
        
    } catch (error) {
        
        return res.status(500).json({
            ok: false,
            msg: 'Error inesperado'
        });
    }
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospitales,
    borrarHospital
}