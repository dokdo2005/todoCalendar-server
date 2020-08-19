const models = require('../models');
const { Op } = require('sequelize');
const Todos = models.todo;

module.exports = {
  get: async (req, res) => {
    if (req.session.userId) {
      await Todos.findAll({ where: { userId: req.session.userId } })
        .then((data) => res.status(200).send(data))
        .catch(() => res.status(404).send({ error: '404 Not Found' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  post: async (req, res) => {
    if (req.session.userId) {
      await Todos.create({
        userId: req.session.userId,
        title: req.body.title,
        body: req.body.body,
        time: req.body.time
      })
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(400).send({ error: '400 Bad Request' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  update: async (req, res) => {
    if (req.session.userId && req.body.id) {
      await Todos.update(
        {
          title: req.body.title,
          body: req.body.body,
          time: req.body.time,
          isDone: req.body.isDone
        },
        {
          where: {
            userId: req.session.userId,
            id: req.body.id
          }
        }
      )
      await Todos.findOne({
        where: {
          userId: req.session.userId,
          id: req.body.id
        }
      }).then((data) => res.status(200).send(data))
        .catch(() => res.status(404).send({ error: '404 Not Found' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  delete: (req, res) => {
    if (req.session.userId && req.body.id) {
      Todos.destroy({
        where: {
          userId: req.session.userId,
          id: req.body.id
        }
      })
        .then(() => res.status(200).send({ result: 'Success' }))
        .catch(() => res.status(400).send({ error: '400 Bad Request' }));
    } else if (req.session.userId) {
      Todos.destroy({
        where: {
          userId: req.session.userId
        }
      })
        .then(() => res.status(200).send({ result: 'Success' }))
        .catch(() => res.status(400).send({ error: '400 Bad Request' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
};
