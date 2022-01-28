const { check } = require('express-validator');

const movieValidator = [
    check('title')
        .notEmpty().withMessage('El campo título es obligatorio.').bail()
        .isLength({ min: 5, max: 30 }).withMessage('El título debe tener entre 5 y 30 caracteres.'),
    check('rating')
        .notEmpty().withMessage('El campo rating es obligatorio.').bail()
        .isInt().withMessage('El rating debe no puede tener comas ni puntos.'),
    check('awards')
        .notEmpty().withMessage('El campo premios es obligatorio.').bail()
        .isInt().withMessage('Los premios no pueden tener comas ni puntos.'),
    check('release_date')
        .notEmpty().withMessage('El campo fecha no puede estar vacío.').bail()
        .isDate().withMessage('Debe tener una fecha válida.'),
    check('length')
        .notEmpty().withMessage('El campo duración es obligatorio.').bail()
        .isInt().withMessage('La duración no puede tener comas ni puntos.')
]


module.exports = movieValidator;