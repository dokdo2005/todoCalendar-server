const models = require('../models');
const Users = models.user;
const crypto = require('crypto');


module.exports = {
  login: (req, res) => {
    Users.findOne({
      where: { email: req.body.email },
    })
      .then((user) => {
        let salt = user.dataValues.salt;
        let hashPassword = crypto.createHash("sha512").update(req.body.password + salt).digest("hex");
        if (user.dataValues.password === hashPassword) {
          req.session.userId = user.id;
          res.status(200).send({
            id: user.id,
            email: user.email,
            username: user.userName,
          });
        } else {
          res.status(401).send({ error: '401 Unauthorized' });
        }
      })
      .catch(() => res.status(401).send({ error: '401 Unauthorized' }));
  },
  logout: (req, res) => {
    if (req.session.userId) {
      req.session.destroy((err) => {
        if (err) {
          console.log('err', err);
          res.status(400).send({ error: '400 Bad Request' });
        } else {
          res.status(200).send({ result: 'Success' });
        }
      });
    } else {
      res.status(400).send({ error: '400 Bad Request' });
    }
  },
  signup: (req, res) => {
    let salt = Math.round((new Date().valueOf() * Math.random())) + '';
    let hashPassword = crypto.createHash("sha512").update(req.body.password + salt).digest("hex");

    Users.findOne({ where: { email: req.body.email } })
      .then((user) => {
        if (user) {
          res.status(409).send({ error: '409 Conflict' });
        } else {
          Users.create({
            userName: req.body.username,
            email: req.body.email,
            password: hashPassword,
            salt: salt
          }).then((data) => {
            res.status(200).send({
              id: data.id,
              email: data.email,
              username: data.userName

            });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({ error: '400 Bad Request' })
      });
  },
};
