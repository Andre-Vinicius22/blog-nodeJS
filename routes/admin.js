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

router.get("/categorias/edit/:id", (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editcategoria", { categoria: categoria });
    }).catch((err) => {
        req.flash("error_msg", "Categoria inexistente");
        res.redirect("/admin/categorias");
    });
});

router.post("/categorias/edit", (req, res) => {
    Categoria.findOne({ _id: req.body.id }).then((categoria) => {
        let erros = [];

        if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
            erros.push({ texto: "Nome invalido" });
        }
        if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
            erros.push({ texto: "Slug invalido" });
        }
        if (req.body.nome.length < 2) {
            erros.push({ texto: "Nome da categoria muito pequeno" });
        }
        if (erros.length > 0) {
            Categoria.findOne({ _id: req.body.id }).lean().then((categoria) => {
                res.render("admin/editcategorias", { categoria: categoria });
            }).catch((err) => {
                req.flash("error_msg", "Erro ao pegar os dados");
                res.redirect("admin/categorias");
            });

        } else {


            categoria.nome = req.body.nome
            categoria.slug = req.body.slug

            categoria.save().then(() => {
                req.flash("success_msg", "Categoria editada com sucesso!");
                res.redirect("/admin/categorias");
            }).catch((err) => {
                req.flash("error_msg", "Erro ao salvar a edição da categoria");
                res.redirect("admin/categorias");
            });

        }
    }).catch((err) => {
        req.flash("error_msg", "Erro ao editar a categoria")
        res.redirect("/admin/categorias")
    });
});

router.post("/categoarias/delete", (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria deletada com sucesso!");
        res.redirect("/admin/categorias");
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao deletar a categoria!");
        res.redirect("/admin/categorias");
    });
})

module.exports = router // exportando modulo de rotas