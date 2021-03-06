// requires
var express = require('express');
var bcrypt = require('bcryptjs'); //plugin para encriptar contraseña
var jwt = require('jsonwebtoken'); //libreria para crear un token

var app = express();
var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');
const { model } = require('../models/usuario');


app.post('/',(req,res)=>{
    var body = req.body;

    Usuario.findOne({email:body.email},(err,usuarioDB)=>{
        if (err) {
            return res.status(500).json({
                ok: false,
                mensaje:'Error al buscar usuarios',
                errors: err
                
            });
        }
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                mensaje:'credenciales incorrectas - email',
                errors: err
                
            });
        }
        if (!bcrypt.compareSync(body.password,usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                mensaje:'credenciales incorrectas - contraseña',
                errors: err
                
            });
        }

        //crear un token
        usuarioDB.password=':)';
        var token = jwt.sign({usuario: usuarioDB},SEED,{expiresIn:14400});//4 horas

        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token:token,
            id: usuarioDB._id
        });
    })

   
});


module.exports = app;