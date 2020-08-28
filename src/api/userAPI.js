const connection = require("../database/connetcion");
const jwt = require("jsonwebtoken");
const { request } = require("express");
import userController from "../controllers/userController";
const user = new userController();

module.exports = {
    index(request, response) {
        try {
            const data = user.getAll();
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    getUser(request, response) {
        const id = request.id;
        try {
            const usr = user.getUserByID(id);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.status(200).json(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    get(request, response) {
        const { id } = request.params;
        try {
            const usr = user.getUserByID(id);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.status(200).json(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    update(request, response) {
        const data = request.body;
        const id = request.id;

        try {
            const usr = user.updateUser(id, data);
            if (usr === false) {
                response.sendStatus(404);
            } else {
                response.sendStatus(200);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    create(request, response) {
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
            const usr = user.createUser(data);
            if (usr === false) {
                response.status(500).send("User already exist");
            } else {
                response.status(200).send(usr);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    delete(request, response) {
        const { id } = request.params;
        try {
            const usr = user.deleteUser(id);
            if (usr) {
                response.sendStatus(200);
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    remFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;

        try {
            const usr = user.removeFollower(id, other_id);
            if (usr) {
                response.sendStatus(200);
            } else {
                response.sendStatus(404);
            }
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    getFollowers(request, response) {
        const { id } = request.params;
        try {
            const usr = user.getFollowers(id);
            response.status(200).json(usr);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    getFeed(request, response) {
        const id = request.id;
        try {
            const usr = user.getFeed(id);
            response.status(200).json(usr);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    login(request, response) {
        const { password, login } = request.body;
        console.log("Try logging: ", login, password);
        connection("usuario")
            .where({ nome_usuario: login, senha: password })
            .orWhere({ email: login, senha: password })
            .then(res => {
                const usr = res[0];
                if (usr == undefined) response.sendStatus(404);
                else {
                    let token = jwt.sign({ id: usr.id }, "teste");
                    response
                        .status(200)
                        .json({ token, user: { login, password } });
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    addFolower(request, response) {
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
    getFollowing(request, response) {
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
