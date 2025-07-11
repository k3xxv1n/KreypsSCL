const express = require("express")
const app = express()
const cors = require("cors")
const path = require("path")
const http = require("http")

const mongoose = require("mongoose")

const bcrypt = require("bcrypt")

const Users = require("./cogs/users")
const server = http.createServer(app)
require("dotenv").config()

const PORT = 3000

const mongodb = process.env.DB

app.use(cors());
app.use(express.json());
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}))




mongoose.connect(mongodb)

mongoose.connection.once('open', () => {
    console.log("Conectado a la base de datos (Mongo Db)")
})

mongoose.connection.once('error', (err) => {
    console.error("Error al conectar con la base de datos (Mongo Db):", err)
})

app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'register.html'))
})


app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'login.html'))
})

app.post('/register', async (req, res) => {
    const {username, email, password} = req.body

    try{
        const SafePass = await bcrypt.hash(password, 10)
        const NewUser = new Users({ username, email, password: SafePass})
        await NewUser.save()

        res.redirect('/login?register=true')
    }
    catch (err){
        console.error(err)
        res.status(500).send("Error al registar")
    }
})

app.post('/login', async (req, res) => {
    const { username, password } = req.body
    try{
        const user = await Users.findOne({username})

        if(!user){
           return res.status(401).send("Usuario no encontrado porfavor registrate")
        }

        const PassSafe = await bcrypt.compare(password, user.password)
        if(!PassSafe){
            return res.status(401).send('Contraseña incorrecta');
        }

        res.send("Te has logeado correctamente")
    }
    catch (err){
        console.error(err)
        res.status(500).send("Error en el servidor (Login)")
    }
})



server.listen(PORT, () => {
    console.log(`Servidor Listo http://localhost:${PORT}`)
})