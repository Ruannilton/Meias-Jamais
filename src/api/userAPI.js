const connection = require("../database/connetcion");
const jwt = require("jsonwebtoken");
const { request } = require("express");
const userController = require("../controllers/userController");

module.exports = {
    async index(request, response) {
        try {
            const data = await userController.getAll();
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async getUser(request, response) {
        const id = request.id;
        try {
            const usr = await userController.getUserByID(id);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.status(200).json(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async get(request, response) {
        const { id } = request.params;
        try {
            const usr = await userController.getUserByID(id);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.status(200).json(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async update(request, response) {
        const data = request.body;
        const id = request.id;

        try {
            const usr = await userController.updateUser(id, data);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.sendStatus(200);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async create(request, response) {
        const {
            nome,
            email,
            figura_publica,
            nome_usuario,
            descricao,
            dt_aniversario,
            image_link,
            senha,
        } = request.body;

        const data = {
            nome,
            nome_usuario,
            descricao,
            dt_criacao: Date.now().toString(),
            dt_aniversario: new Date(dt_aniversario),
            figura_publica,
            image_link,
            email,
            senha,
        };

        try {
            const usr = await userController.createUser(data);
            if (usr === false) {
                response.status(500).send("User already exist");
            } else {
                response.status(200).send(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async delete(request, response) {
        const { id } = request.params;
        try {
            const usr = await userController.deleteUser(id);
            if (usr) {
                response.sendStatus(200);
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async remFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;

        try {
            const usr = await userController.removeFollower(id, other_id);
            if (usr) {
                response.sendStatus(200);
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async getFollowers(request, response) {
        const { id } = request.params;
        try {
            const usr = await userController.getFollowers(id);
            response.status(200).json(usr);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async getFeed(request, response) {
        const id = request.id;
        console.log("GetFeed", id)
        try {
            const usr = await userController.getFeed(id);
            response.status(200).json(usr);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    async login(request, response) {
        const { password, login } = request.body;

        try {
            const r = await userController.loginUser(login, password);
            if (r == null) {
                response.sendStatus(404);
            } else {
                response.status(200).json(r);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }

    },

    async addFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;
        connection("usuario")
            .where("id", other_id)
            .then(r => {
                if (r.length === 0) {
                    response.status(404).send("usuario fornecido não existe");
                } else {
                    connection("usuario_usuario")
                        .where({
                            usuario_id: id,
                            usuario_seguido_id: other_id,
                        })
                        .then(res => {
                            if (res.length == 0) {
                                connection("usuario_usuario")
                                    .insert({
                                        usuario_id: id,
                                        usuario_seguido_id: other_id,
                                        pendente: true,
                                    })
                                    .then(res => {
                                        const [id] = res;
                                        return response
                                            .status(200)
                                            .json({ id });
                                    })
                                    .catch(error => {
                                        response
                                            .status(500)
                                            .send(error.toString());
                                    });
                            } else {
                                response
                                    .status(400)
                                    .send("usuario ja é seguido");
                            }
                        })
                        .catch(error => {
                            response.status(500).send(error.toString());
                        });
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
    async getFollowing(request, response) {
        const { id } = request.params;

        connection("usuario")
            .where("id", id)
            .then(r => {
                if (r.length === 0) {
                    response.status(404).send("usuario fornecido não existe");
                } else {
                    connection("usuario_usuario")
                        .where("usuario_id", id)
                        .select("usuario_seguido_id")
                        .then(res => {
                            let r = [];
                            console.log(res);
                            const c = res.length;
                            for (const i of res) {
                                r.push(i.usuario_seguido_id);
                            }
                            return response.json({ total: c, values: r });
                        })
                        .catch(error => {
                            response.status(500).send(error.toString());
                        });
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
};
