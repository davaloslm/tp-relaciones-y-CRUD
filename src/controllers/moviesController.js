const path = require('path');
const db = require('../database/models');
const sequelize = db.sequelize;
const { Op } = require("sequelize");
const { validationResult } = require('express-validator');


//Aqui tienen una forma de llamar a cada uno de los modelos
// const {Movies,Genres,Actor} = require('../database/models');

//Aquí tienen otra forma de llamar a los modelos creados
const Movies = db.Movie;
const Genres = db.Genre;
const Actors = db.Actor;


const moviesController = {
    'list': (req, res) => {
        db.Movie.findAll()
            .then(movies => {
                res.render('moviesList.ejs', {movies})
            })
    },
    'detail': (req, res) => {
        db.Movie.findByPk(req.params.id)
            .then(movie => {
                res.render('moviesDetail.ejs', {movie});
            });
    },
    'new': (req, res) => {
        db.Movie.findAll({
            order : [
                ['release_date', 'DESC']
            ],
            limit: 5
        })
            .then(movies => {
                res.render('newestMovies', {movies});
            });
    },
    'recomended': (req, res) => {
        db.Movie.findAll({
            where: {
                rating: {[db.Sequelize.Op.gte] : 8}
            },
            order: [
                ['rating', 'DESC']
            ]
        })
            .then(movies => {
                res.render('recommendedMovies.ejs', {movies});
            });
    },
    //Aqui dispongo las rutas para trabajar con el CRUD
    add: function (req, res) {
        db.Genre.findAll()
        .then(generos=>{
            res.render("moviesAdd", {allGenres: generos})

        })
        .catch(error=>{
            console.log(error);
        })
        
    },
    create: function (req,res) {

        let createErrors = validationResult(req);

        if(createErrors.isEmpty()){

            const {title, rating, awards, release_date, length, genre_id} = req.body;

            db.Movie.create({
                title,
                rating: parseInt(rating),
                awards: parseInt(awards),
                release_date,
                length: parseInt(length),
                genre_id: parseInt(genre_id)
            })
            .then(movie=>{
                res.redirect("/movies/detail/"+movie.id)
            })
            .catch(error=>{
                console.log(error);
            })
        }else{

            db.Genre.findAll()
            .then(generos=>{
                res.render("moviesAdd", {allGenres:generos, errors: createErrors.mapped(), old:req.bopdy})

            })
            .catch(error=>{
                console.log(error);
            })
           
        }
        
    },
    edit: function(req,res) {
        db.Movie.findOne({
            where: {id: req.params.id},
            include: [
                {association:"genre"}
            ]
        })
        .then(Movie=>{

            db.Genre.findAll()
            .then(generos=>{
                res.render("moviesEdit", {Movie, allGenres: generos});

            })
            .catch(error=>{
                console.log(error);
            })
            
        })
        .catch(error=>{
            console.log(error);
        })
    },
    update: function (req,res) {
        
        const updateErrors = validationResult(req);

        if(updateErrors.isEmpty()){

            const id = req.params.id
            const {title, rating, awards, release_date, length, genre_id} = req.body;
            db.Movie.update({
                title,
                rating: parseInt(rating),
                awards: parseInt(awards),
                release_date,
                length: parseInt(length),
                genre_id: parseInt(genre_id)
            },
            {
                where: {id: req.params.id}
            })
            .then(() => {
                res.redirect("/movies/detail/"+id);
            })
            .catch(error=>{
                console.log(error);
            })

        }else{

            db.Movie.findOne({
                where: {id: req.params.id},
                include: [
                    {association:"genre"}
                ]
            })
            .then(Movie=>{
    
                db.Genre.findAll()
                .then(generos=>{
                    res.render("moviesEdit", {Movie, allGenres: generos, errors:updateErrors.mapped(), old:req.body});
    
                })
                .catch(error=>{
                    console.log(error);
                })
                
            })
            .catch(error=>{
                console.log(error);
            })
        }
        
    },
    delete: function (req,res) {
        db.Movie.findByPk(parseInt(req.params.id))
        .then(Movie=>{

            res.render("moviesDelete", {Movie});
        })
        .catch(error=>{
            console.log(error);
        })
    },
    destroy: function (req,res) {
        db.Movie.destroy({
            where: {id:req.params.id}
        })
        .then(()=>{
            res.redirect("/movies/")
        })
        .catch(error=>{
            console.log(error);
        })
    }
}

module.exports = moviesController;