const express = require("express"); // importando express
const router = express.Router(); // declarando modulo de rotas do express
const mongoose = require("mongoose"); // carregando mongoose
require("../models/Categoria"); // importando model
const Categoria = mongoose.model("categorias"); // criando uma constante para o model

//Rotas
router.get("/", (req, res) => {
    res.render("admin/index");
});

router.get("/posts", (req, res) => {
    res.send("pagina de post");
});

router.get("/categorias", (req, res) => {
    Categoria.find().lean().sort({ date: "desc" }).then((categorias) => {
        res.render("admin/categorias", { categorias: categorias });
    }).catch(() => {
        req.flash("error_msg", "Houve um Erro ao listar as categorias!");
        res.redirect("/admin");
    });
});

router.get("/categorias/add", (req, res) => {
    res.render("admin/addcategoria");
});

router.post("/categorias/nova", (req, res) => {
    // validacao de formulario
    var erros = [];

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ text: "Nome Invalido!!" });
    }

    if (req.body.nome.length < 4) {
        erros.push({ text: "Categorias precisam conter mais do que 4 caracteres!" });
    }

    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ text: "Slug invalido!!" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategoria", { erros: erros });
    } else {

        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }

        new Categoria(novaCategoria).save().then(() => {
            req.flash("success_msg", "Categoria criada com sucesso!");
            res.redirect("/admin/categorias");
        }).catch(() => {
            req.flash("error_msg", "Houve um erro ao criar a Categoria, tente novamente!");
            res.redirect("/admin");
        });
    }
});

module.exports = router // exportando modulo de rotas