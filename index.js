// inicializando modulos
const express = require("express");
const session = require("express-session");
const flash = require("connect-flash");
const { engine } = require("express-handlebars");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const mongoose = require("mongoose");
const admin = require("./routes/admin"); // importando rotas criadas na pasta routes

//config
//session
app.use(session({
    secret: "#2325",
    resave: true,
    saveUninitialized: true
}));
app.use(flash());
// midleware para usar sessions
app.use((req, res, next) => {
    res.locals.success_msg = req.flash("success_msg"); // mensagem de sucesso 
    res.locals.error_msg = req.flash("error_msg");  // mensagem de erro
    next(); // parametro next necessario para nao parar o programa
});

//bodyparser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Handlebars
app.engine("handlebars", engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

//mongoose
mongoose.Promisse = global.Promise;
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("conectado ao mongo")
}).catch((err) => {
    console.log("Erro ao se conectar: " + err)
});


// public
app.use(express.static(path.join(__dirname, "public"))); // importando bootstrap para o projeto 

//rotas
app.use("/admin", admin); // usando rotas da pastas routes atribuida a variavel "admin"

// outros
const port = 3000
app.listen(port, () => { console.log("Servidor On-line!") });