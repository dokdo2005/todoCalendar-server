const models = require('../models');
const Users = models.user;

module.exports = {
    login: (req, res) => {
        Users.findOne({ where: { email: req.body.email, password: req.body.password } })
            .then((user) => {
                if (user) {
                    req.session.id = user.id;
                    res.status(200).send({
                        "id": user.id,
                        "email": user.email,
                        "username": user.userName
                    });
                } else {
                    res.status(401).send({ "error": "401 Unauthorized" });
                }
            })
            .catch(() => res.status(401).send({ "error": "401 Unauthorized" }));
    },
    logout: (req, res) => {
        req.session.destroy(() => {
            res.status(200).send({ "result": "Success" });
        })
            .catch(() => res.status(400).send({ "error": "400 Bad Request" }));
    },
    signup: (req, res) => {
        Users.findOne({ where: { email: req.body.email } })
            .then((user) => {
                if (user) {
                    res.status(409).send({ "error": "409 Conflict" });
                } else {
                    Users.create({ userName: req.body.userName, email: req.body.email, password: req.body.password })
                        .then((data) => {
                            res.status(200).send({
                                "id": data.id,
                                "email": data.email,
                                "username": data.userName
                            });
                        });
                }
            })
            .catch(() => res.status(400).send({ "error": "400 Bad Request" }));
    }
}