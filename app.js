import cookieParser from 'cookie-parser'
import express from 'express'
import usuarioRoutes from './routes/usuarioRoutes.js'
import tareaRoutes from './routes/todoRoutes.js'
import db from './config/db.js'

const app = express()

//Habilitar lectura de formularios
app.use(express.urlencoded({extended: true}))

//Habilitar cookies 
app.use(cookieParser())

//Conectar BD
try {
    await db.authenticate()
    db.sync()
    console.log('Conexión correcta')
} catch (error) {
    console.log(error)
}

//Habilitar pug
app.set('view engine', 'pug')
app.set('views', './views')

//Habilitar carpeta publica
app.use(express.static('public'))

app.use('/auth', usuarioRoutes)
app.use('/', tareaRoutes)

const PORT = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log(`Servidor corriendo en puerto ${PORT}`)
})