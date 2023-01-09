import nodemailer from 'nodemailer';

const emailRegistro = async(datos) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { nombre, email, token } = datos;

    //Enviar el email
    await transport.sendMail({
        from: 'TodoList.com',
        to: email,
        subject: 'Confirma tu cuenta en TodoList.com',
        text: 'Confirma tu cuenta en TodoList.com',
        html: `
            <p>Hola ${nombre}, comprueba tu cuenta en TodoList.com</p>
            <p>Tu cuenta ya esta lista, solo debes confirmarla en el siguiente enlace: <a href= "${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirmar/${token}">Confirmar Cuenta</a></p>
            <p>Si tu no creaste la cuenta, puede ignorar el mensaje</p>
        `
    })
}

const emailOlvidePassword = datos => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const { email, nombre, token } = datos;

    transport.sendMail({
        from: 'TodoList.com',
        to: email,
        subject: 'Reestablece tu cuenta en TodoList.com',
        text: 'Reestablece tu cuenta en TodoList.com',
        html: `
            <p>Hola ${nombre}, reestablece tu cuenta en TodoList.com</p>
            <p>Para reestablecer tu cuenta, solo debes confirmarla en el siguiente enlace: <a href= "${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/comprobar/${token}">Reestablecer Cuenta</a></p>
            <p>Si tu no vas a restablecer tu cuenta, puede ignorar el mensaje</p>
        `
    })
}

export {
    emailRegistro,
    emailOlvidePassword
}