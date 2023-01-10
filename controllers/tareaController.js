import {check, validationResult} from 'express-validator'
import { formatearFecha } from '../helpers/index.js'
import {Tarea} from '../models/index.js'

const mostrarTareas = async(req, res) => {
    try {
        const {id: usuarioId} = req.usuario
        const tareas = await Tarea.findAll({where: {usuarioId}})

        res.render('tareas/main', {
            pagina: 'Mis Tareas',
            tareas,
            formatearFecha,
            usuario: req.usuario
        })
    } catch (error) {
        console.log(error)
    }
}

const crearTarea = async(req, res) => {
    await check('nombre').notEmpty().withMessage('La tarea esta vacía').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        const {id: usuarioId} = req.usuario
        const tareas = await Tarea.findAll({where: {usuarioId}})

        return res.render('tareas/main', {
            pagina: 'Mis Tareas',
            errores: resultado.array(),
            tareas,
            formatearFecha,
            usuario: req.usuario
        })
    }

    const {nombre} = req.body
    const {id: usuarioId} = req.usuario

    try {
        await Tarea.create({nombre, usuarioId})
        res.redirect('/tareas')
    } catch (error) {
        console.log(error)
    }
}

const formularioEditar = async(req, res) => {
    const {id: usuarioId} = req.usuario
    const {id} = req.params
    const [tareas, tarea] = await Promise.all([Tarea.findAll({where: {usuarioId}}), Tarea.findOne({where: {id}})])

    if(!tarea){
        return res.redirect('/tareas')
    }

    if(usuarioId !== tarea.usuarioId){
        return res.redirect('/tareas')
    }

    res.render('tareas/editar', {
        pagina: 'Mis Tareas',
        tareas,
        formatearFecha,
        tarea,
        usuario: req.usuario
    })
}

const editarTarea = async(req, res) => {
    await check('nombre').notEmpty().withMessage('La tarea esta vacía').run(req)

    const resultado = validationResult(req)

    if(!resultado.isEmpty()){
        const {id: usuarioId} = req.usuario
        const tareas = await Tarea.findAll({where: {usuarioId}})

        return res.render('tareas/main', {
            pagina: 'Mis Tareas',
            errores: resultado.array(),
            tareas,
            formatearFecha,
            usuario: req.usuario
        })
    }

    const {id} = req.params
    const tarea = await Tarea.findOne({where: {id}})

    if(!tarea){
        return res.redirect('/tareas')
    }

    if(tarea.usuarioId !== req.usuario.id){
        return res.redirect('/tareas')
    }

    const {nombre} = req.body

    await tarea.set({nombre})
    await tarea.save()

    res.redirect('/tareas')
}

const eliminarTarea = async(req, res) => {
    const {id} = req.params
    const tarea = await Tarea.findOne({where: {id}})

    if(!tarea){
        return res.redirect('/tareas')
    }

    if(tarea.usuarioId !== req.usuario.id){
        return res.redirect('/tareas')
    }

    await tarea.destroy()
    res.redirect('/tareas')
}

export{
    mostrarTareas,
    crearTarea,
    eliminarTarea,
    formularioEditar,
    editarTarea
}