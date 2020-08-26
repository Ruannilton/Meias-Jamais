const connection = require("./../database/connetcion");
const jwt = require("jsonwebtoken");
const { request } = require("express");

module.exports = {
    index(request, response) {
        connection("usuario")
            .select("*")
            .then(res => {
                response.status(200).json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
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

    getUser(request, response) {
        const id = request.id;

        connection("usuario")
            .where("id", id)
            .then(res => {
                const usr = res[0];
                if (usr == undefined) response.sendStatus(404);
                else {
                    delete usr["senha"];
                    response.status(200).json(usr);
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    get(request, response) {
        const { id } = request.params;
        connection("usuario")
            .where("id", id)
            .then(res => {
                const usr = res[0];
                if (usr == undefined) response.sendStatus(404);
                else response.status(200).json(usr);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    update(request, response) {
        const { nome, descricao } = request.body;
        const id = request.id;
        console.log("User id: ", id);
        connection("usuario")
            .where("id", id)
            .update({
                nome,
                descricao,
            })
            .then(res => {
                if (res === 0) response.sendStatus(404);
                else response.sendStatus(200);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
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

        connection("usuario")
            .where({ nome_usuario })
            .count()
            .then(res => {
                if (res[0]["count(*)"] > 0) {
                    response.status(409).send("username already exist");
                    return;
                } else {
                    connection("usuario")
                        .where({ email })
                        .count()
                        .then(res => {
                            console.log("email: ", res[0]["count(*)"]);
                            if (res[0]["count(*)"] > 0) {
                                response.status(409)("email already exist");
                                return;
                            } else {
                                connection("usuario")
                                    .insert({
                                        nome,
                                        nome_usuario,
                                        descricao,
                                        dt_criacao: Date.now().toString(),
                                        dt_aniversario: new Date(
                                            dt_aniversario
                                        ),
                                        figura_publica,
                                        image_link,
                                        email,
                                        senha,
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

    delete(request, response) {
        const { id } = request.params;
        connection("usuario")
            .where("id", id)
            .del()
            .then(res => {
                if (res === 0) response.sendStatus(404);
                else response.sendStatus(200);
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

    remFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;

        connection("usuario_usuario")
            .where({ usuario_id: id, usuario_seguido_id: other_id })
            .del()
            .then(res => {
                if (res === 0) return response.sendStatus(404);
                else return response.sendStatus(200);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    getFollowers(request, response) {
        const { id } = request.params;
        connection("usuario_usuario")
            .where("usuario_seguido_id", id)
            .select("usuario_id")
            .then(res => {
                let r = [];
                const c = res.length;
                for (const i of res) {
                    r.push(i.usuario_id);
                }
                return response.status(200).json({ total: c, values: r });
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

    getFeed(request, response) {
        const id = request.id;
        console.log("getting feed", id);
        connection("feed")
            .where("usuario_id", id)
            .then(res => {
                response.status(200).json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
};
