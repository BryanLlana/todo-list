import {check, validationResult} from 'express-validator'
import bcrypt from 'bcrypt'
import { emailOlvidePassword, emailRegistro } from '../helpers/emails.js'
import { generarId, generarJWT } from '../helpers/tokens.js'
import { Usuario } from '../models/index.js'

const formularioLogin = (req, res) => {
    res.render('auths/login', {
        pagina: 'Iniciar Sesión'
    })
}

const autenticar = async(req, res) => {
    await check('email').isEmail().withMessage('El Email no es válido').run(req)
    await check('password').notEmpty().withMessage('El password es obligatorio').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auths/login', {
            pagina: 'Iniciar Sesión',
            errores: resultado.array()
        })
    }

    const {email, password} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auths/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: 'El Email no ha sido registrado'}]
        })
    }

    if(!usuario.confirmado){
        return res.render('auths/login', {
            pagina: 'Iniciar Sesión',
            errores: [{msg: 'Tu Email no ha sido confirmado'}]
        })
    }

    if(!usuario.verificarPassword(password)){
        return res.render('auths/login',{
            pagina: 'Iniciar Sesión',
            errores: [{msg: 'El password es incorrecto'}]
        })
    }

    const token = generarJWT({nombre: usuario.nombre, id: usuario.id})

    return res.cookie('_token', token, {
        httpOnly: true
    }).redirect('/tareas')
}

const formularioRegistro = (req, res) => {
    res.render('auths/registro', {
        pagina: 'Crear Cuenta'
    })
}

const registrar = async (req, res) => {
    await check('nombre').notEmpty().withMessage('El nombre esta vacío').run(req)
    await check('email').isEmail().withMessage('El email no es válido').run(req)
    await check('password').isLength({min: 6}).withMessage('El password debe tener al menos 6 caracteres').run(req)
    await check('repetir_password').equals(req.body.password).withMessage('Los passwords no son iguales').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auths/registro', {
            pagina: 'Crear Cuenta',
            errores: resultado.array(),
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    const {nombre, email, password} = req.body

    const emailExiste = await Usuario.findOne({where: {email}})

    if(emailExiste){
        return res.render('auths/registro', {
            pagina: 'Crear Cuenta',
            errores: [{msg: 'Este email ya ha sido registrado anteriormente'}],
            usuario: {
                nombre: req.body.nombre,
                email: req.body.email
            }
        })
    }

    const usuario = await Usuario.create({nombre, email, password, token: generarId()})

    emailRegistro({nombre: usuario.nombre, email: usuario.email, token: usuario.token})

    res.render('templates/mensaje', {
        pagina: 'Cuenta Creada Correctamente',
        mensaje: 'Hemos enviado un Email de confirmación, presiona en el enlace'
    })
}

const confirmar = async(req, res) => {
    const {token} = req.params

    const usuario = await Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auths/confirmar-cuenta', {
            pagina: 'Error al Confirmar tu Cuenta',
            mensaje: 'Hubo un error al confirmar tu cuenta, intente de nuevo',
            error: true
        })
    }

    usuario.token = null
    usuario.confirmado = true
    await usuario.save()

    return res.render('auths/confirmar-cuenta', {
        pagina: 'Cuenta Confirmada',
        mensaje: 'La Cuenta se confirmó correctamente'
    })
}

const formularioOlvidePassword = (req, res) => {
    res.render('auths/olvide-password', {
        pagina: 'Recupera tu acceso a Bienes Raíces'
    })
}

const reestablecerPassword = async(req, res) => {
    await check('email').isEmail().withMessage('El email no es válido').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auths/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes Raíces',
            errores: resultado.array()
        })
    }

    const {email} = req.body

    const usuario = await Usuario.findOne({where: {email}})

    if(!usuario){
        return res.render('auths/olvide-password', {
            pagina: 'Recupera tu acceso a Bienes',
            errores: [{msg: 'Este email aún no ha sido registrado'}]
        })
    }

    usuario.token = generarId()
    await usuario.save()

    emailOlvidePassword({nombre: usuario.nombre, email: usuario.email, token: usuario.token})

    res.render('templates/mensaje', {
        pagina: 'Reestablece tu Password',
        mensaje: 'Hemos enviado un email con las intrucciones'
    })
}

const comprobarToken = async(req, res) => {
    const {token} = req.params

    const usuario = Usuario.findOne({where: {token}})

    if(!usuario){
        return res.render('auths/confirmar-cuenta', {
            pagina: 'Reestablece tu Password',
            mensaje: 'Hubo un error al validar tu información, intenta de nuevo',
            error: true
        })
    }

    res.render('auths/reset-password', {
        pagina: 'Reestablecer Password'
    })
}

const nuevoPassword = async(req, res) => {
    await check('password').isLength({min: 7}).withMessage('El password tiene que tener al menos 7 caracteres').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        return res.render('auths/reset-password', {
            pagina: 'Reestablecer Password',
            errores: resultado.array()
        })
    }

    const {token} = req.params
    const {password} = req.body

    const usuario = await Usuario.findOne({where: {token}})

    const salt = await bcrypt.genSalt(10)
    usuario.password = await bcrypt.hash(password, salt)
    await usuario.save()

    res.render('auths/confirmar-cuenta',{
        pagina: 'Password Reestablecido',
        mensaje: 'El password se guardó correctamente'
    })
}

export {
    formularioLogin,
    autenticar,
    formularioRegistro,
    registrar,
    confirmar,
    formularioOlvidePassword,
    reestablecerPassword,
    comprobarToken,
    nuevoPassword
}