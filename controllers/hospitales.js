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

const actualizarHospitales = (req, res = response) => {
    
}

const borrarHospital = (req, res = response) => {
    
}

module.exports = {
    getHospitales,
    crearHospital,
    actualizarHospitales,
    borrarHospital
}