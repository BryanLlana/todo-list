import express from 'express'
import { crearTarea, editarTarea, eliminarTarea, formularioEditar, mostrarTareas } from '../controllers/tareaController.js'
import { protegerRuta } from '../middlewares/protegerRuta.js'
const router = express.Router()

router.get('/tareas', protegerRuta, mostrarTareas)
router.post('/tareas', protegerRuta, crearTarea)

router.post('/tareas/eliminar/:id',protegerRuta, eliminarTarea)

router.get('/tareas/editar/:id', protegerRuta, formularioEditar)
router.post('/tareas/editar/:id', protegerRuta, editarTarea)

export default router