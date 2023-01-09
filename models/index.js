import Usuario from './Usuario.js'
import Tarea from './Tarea.js'

Tarea.belongsTo(Usuario)

export{
    Usuario,
    Tarea
}

