import { DataTypes } from 'sequelize'
import db from '../config/db.js'

const Tarea = db.define('tareas', {
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    }
})

export default Tarea