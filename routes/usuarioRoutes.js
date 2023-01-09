import { autenticar, comprobarToken, confirmar, formularioLogin, formularioOlvidePassword, formularioRegistro, nuevoPassword, reestablecerPassword, registrar } from '../controllers/usuarioController.js'
import express from 'express'
const router = express.Router()

router.get('/login', formularioLogin)
router.post('/login', autenticar)

router.get('/registro', formularioRegistro)
router.post('/registro', registrar)
router.get('/confirmar/:token', confirmar)

router.get('/olvide-password', formularioOlvidePassword)
router.post('/olvide-password', reestablecerPassword)
router.get('/comprobar/:token', comprobarToken)
router.post('/comprobar/:token', nuevoPassword)

export default router