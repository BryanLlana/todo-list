import jwt from 'jsonwebtoken';

const generarId = ()=>Math.random().toString(32).substring(2)+Date.now().toString(32);

const generarJWT = data => jwt.sign({
    id: data.id,
    nombre: data.nombre
}, process.env.JWT_SECRETO, {
    expiresIn: '1d'
})

export {
    generarId,
    generarJWT
}