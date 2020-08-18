const models = require('../models');
const { Op } = require('sequelize');
const Todos = models.todo;

module.exports = {
  get: async (req, res) => {
    console.log(req.params)
    if (req.session.userId) {
      if (req.params.yearMonth) {
        console.log('hasparams');
        await Todos.findAll({
          where: {
            userId: req.session.userId,
            startDate: { [Op.startsWith]: req.params.yearMonth },
          },
        })
          .then((data) => console.log(data)) //res.status(200).send(data)
          .catch(() => res.status(404).send({ error: '404 Not Found' }));
      } else {
        await Todos.findAll({ where: { userId: req.session.userId } })
          .then((data) => res.status(200).send(data))
          .catch(() => res.status(404).send({ error: '404 Not Found' }));
      }
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  post: async (req, res) => {
    console.log('req.session', req.session);
    console.log('req.body', req.body);
    if (req.session.userId) {
      await Todos.create({
        userId: req.session.userId,
        title: req.body.title,
        body: req.body.body,
        startDate: req.body.startDate,
        endDate: req.body.endDate,
      })
        .then((data) => res.status(201).send(data))
        .catch(() => res.status(400).send({ error: '여기400 Bad Request' }));
    } else {
      console.log('hi');
      res.status(400).send({ error: '저기400 Bad Request' });
    }
  },
  update: async (req, res) => {
    console.log(req.params);
    if (req.session.userId) {
      await Todos.update(
        {
          title: req.body.title,
          body: req.body.body,
          startDate: req.body.startDate,
          endDate: req.body.endDate,
        },
        {
          where: {
            userId: req.session.userId,
            id: req.params.id
          }
        }
      )

      await Todos.findOne({
        where: {
          userId: req.session.userId,
          id: req.params.id
        }
      }).then((data) => res.status(200).send(data))
        .catch(() => res.status(404).send({ error: '404 Not Found' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  delete: (req, res) => {
    if (req.session.userId) {
      Todos.destroy({
        where: {
          userId: req.session.userId,
          id: req.params.id
        }
      })
        .then(() => res.status(200).send({ result: 'Success' }))
        .catch(() => res.status(400).send({ error: '400 Bad Request' }));
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
};
