import jwt from 'jsonwebtoken'
import {Usuario} from '../models/index.js'

const protegerRuta = async(req, res, next) => {
    const {_token} = req.cookies

    if(!_token){
        return res.redirect('/auth/login')
    }

    try {
        const decoded = jwt.verify(_token, process.env.JWT_SECRETO)
        const usuario = await Usuario.scope('eliminarPassword').findOne({where: {id: decoded.id}})

        if(usuario){
            req.usuario = usuario
            next()
        }else{
            return res.redirect('/auth/login')
        }
    } catch (error) {
        return res.clearCookie('_token').redirect('/auth/login')
    }
}

export{
    protegerRuta
}