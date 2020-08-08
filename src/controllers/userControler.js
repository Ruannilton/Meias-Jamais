const connection = require("./../database/connetcion");
const jwt = require("jsonwebtoken");
const { request } = require("express");

module.exports = {
    index(request, response) {
        connection("usuario")
            .select("*")
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
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
                if (usr == undefined) {
                    response.status(404).json({ msg: "user not found" });
                } else {
                    console.log(
                        "[userControler][login]:",
                        usr.nome_usuario,
                        usr.senha
                    );
                    let token = jwt.sign({ id: usr.id }, "teste");
                    response.json({ token, user: { login, password } });
                }
            })
            .catch(error => {
                console.log("deu ruim");
                response.json({ err: error, msg: error.toString() });
            });
    },

    getUser(request, response) {
        const id = request.id;

        connection("usuario")
            .where("id", id)
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response
                    .status(404)
                    .json({ err: error, msg: error.toString() });
            });
    },

    get(request, response) {
        const { id } = request.params;
        connection("usuario")
            .where("id", id)
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    update(request, response) {
        const { nome, descricao } = request.body;
        connection("usuario")
            .where("id", id)
            .update({
                nome,
                descricao,
            })
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
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
                console.log("nome_usuario: ", res[0]["count(*)"]);

                if (res[0]["count(*)"] > 0) {
                    response.json({
                        msg: "username already exist",
                    });
                    return;
                } else {
                    connection("usuario")
                        .where({ email })
                        .count()
                        .then(res => {
                            console.log("email: ", res[0]["count(*)"]);
                            if (res[0]["count(*)"] > 0) {
                                response.json({
                                    msg: "email already exist",
                                });
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
                                        return response.json({ id });
                                    })
                                    .catch(error => {
                                        response.status(404).json({
                                            err: error,
                                            msg: error.toString(),
                                        });
                                    });
                            }
                        })
                        .catch(error => {
                            response
                                .status(404)
                                .json({ err: error, msg: error.toString() });
                        });
                }
            })
            .catch(error => {
                response
                    .status(404)
                    .json({ err: error, msg: error.toString() });
            });
    },

    delete(request, response) {
        const { id } = request.params;
        connection("usuario")
            .where("id", id)
            .del()
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    addFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;

        connection("usuario_usuario")
            .insert({
                usuario_id: id,
                usuario_seguido_id: other_id,
                pendente: true,
            })
            .then(res => {
                const [id] = res;
                return response.json({ id });
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    remFolower(request, response) {
        const { other_id } = request.params;
        const id = request.id;

        connection("usuario_usuario")
            .where("usuario_id", id)
            .where("usuario_seguido_id", other_id)
            .del()
            .then(res => {
                return response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
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
                    r.push(i["usuario_id"]);
                }
                return response.json({ total: c, values: r });
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    getFollowing(request, response) {
        const { id } = request.params;
        connection("usuario_usuario")
            .where("usuario_id", id)
            .select("usuario_seguido_id")
            .as("usuario_id")
            .then(res => {
                let r = [];
                const c = res.length;
                for (const i of res) {
                    r.push(i["usuario_id"]);
                }
                return response.json({ total: c, values: r });
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    getFeed(request, response) {
        const id = request.id;

        connection("feed")
            .where("usuario_id", id)
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.sendStatus(404);
            });
    },
};
