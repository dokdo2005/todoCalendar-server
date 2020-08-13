const models = require("../models");
const { Op } = require("sequelize");
const Todos = models.todo;

module.exports = {
    get: (req, res) => {
        if (req.params.yearMonth) {
            Todos.findAll({ where: { userId: req.body.userId, startDate: { [Op.startsWith]: req.params.yearMonth }, endDate: { [Op.startsWith]: req.params.yearMonth } } })
                .then((data) => res.status(200).send(data))
                .catch(() => res.status(404).send({ "error": "404 Not Found" }));
        } else {
            Todos.findAll({ where: { userId: req.body.userId } })
                .then((data) => res.status(200).send(data))
                .catch(() => res.status(404).send({ "error": "404 Not Found" }));
        }
    },
    post: (req, res) => {
        Todos.create({ userId: req.body.userId, title: req.body.title, body: req.body.body, startDate: req.body.startDate, endDate: req.body.endDate })
            .then((data) => res.status(201).send(data))
            .catch(() => res.status(400).send({ "error": "400 Bad Request" }));
    },
    update: (req, res) => {
        Todos.update({ title: req.body.title, body: req.body.body, startDate: req.body.startDate, endDate: req.body.endDate }, { where: { id: req.body.id } })
            .then((data) => res.status(200).send(data))
            .catch(() => res.status(404).send({ "error": "404 Not Found" }));
    },
    delete: (req, res) => {
        Todos.destroy({ where: { id: req.body.id } })
            .then(() => res.status(200).send({ "id": req.body.id }))
            .catch(() => res.status(400).send({ "error": "400 Bad Request" }));
    }
}