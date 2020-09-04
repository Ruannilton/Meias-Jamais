const connection = require("../database/connetcion");
const jwt = require("jsonwebtoken");

module.exports = {
    async getAll() {

        return connection("usuario")
            .select("*")
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    async getUserByUserName(name) {
        return connection("usuario")
            .where("nome_usuario", name)
            .then(res => {
                if (res.length === 0) return false;
                for (let index = 0; index < res.length; index++) {
                    delete res[index]["senha"];
                }
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    async getUserByEmail(email) {
        return connection("usuario")
            .where("email", email)
            .then(res => {
                const usr = res[0];
                if (usr == undefined) return false;
                else {
                    delete usr["senha"];
                    return usr;
                }
            })
            .catch(error => {
                throw error;
            });
    },
    async getUserByID(id) {
        return connection("usuario")
            .where("id", id)
            .then(res => {
                const usr = res[0];
                if (usr == undefined) return false;
                else {
                    delete usr["senha"];
                    return usr;
                }
            })
            .catch(error => {
                throw error;
            });
    },
    async updateUser(id = 0, data = {}) {
        return connection("usuario")
            .where("id", id)
            .update(data)
            .then(res => {
                if (res === 0) return false;
                else return true;
            })
            .catch(error => {
                throw error;
            });
    },
    async createUser(data = {}) {
        if (
            this.getUserByEmail(data.email) === null &&
            this.getUserByUserName(data.nome_usuario) === null
        ) {
            return connection("usuario")
                .insert(data)
                .then(res => {
                    const [id] = res;
                    return res;
                })
                .catch(error => {
                    throw error;
                });
        } else {
            return false;
        }
    },
    async deleteUser(id = 0) {
        return connection("usuario")
            .where("id", id)
            .del()
            .then(res => {
                if (res === 0) return false;
                else return true;
            })
            .catch(error => {
                throw error;
            });
    },

    async removeFollower(id, other_id) {
        return connection("usuario_usuario")
            .where({ usuario_id: id, usuario_seguido_id: other_id })
            .del()
            .then(res => {
                if (res === 0) return false;
                else return true;
            })
            .catch(error => {
                throw error;
            });
    },
    async getFollowers(id) {
        return connection("usuario_usuario")
            .where("usuario_seguido_id", id)
            .select("usuario_id")
            .then(res => {
                let r = [];
                const c = res.length;
                for (const i of res) {
                    r.push(i.usuario_id);
                }
                return { total: c, values: r };
            })
            .catch(error => {
                throw error;
            });
    },
    async getFeed(id) {
        console.log("Feed")
        return connection("feed")
            .where("usuario_id", id)
            .then(res => {
                console.log("Feed: ", res)
                return res;
            })
            .catch(error => {
                throw error;
            });
    },
    async addFollower(id, other_id) {
        return connection("usuario")
            .where("id", other_id)
            .then(r => {
                if (r.length === 0) {
                    return null
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
                                        return { id };
                                    })
                                    .catch(error => {
                                        throw error
                                    });
                            } else {
                                return false
                            }
                        })
                        .catch(error => {
                            throw error
                        });
                }
            })
            .catch(error => {
                throw error
            });
    },
    async getFollowing(id) {
        return connection("usuario")
            .where("id", id)
            .then(async r => {
                if (r.length === 0) {
                    return null;
                } else {
                    return connection("usuario_usuario")
                        .where("usuario_id", id)
                        .select("usuario_seguido_id")
                        .then(res => {
                            let r = [];
                            const c = res.length;
                            for (const i of res) {
                                r.push(i.usuario_seguido_id);
                            }
                            const rs = { total: c, values: r };
                            return rs;
                        })
                        .catch(error => {
                            throw error;
                        });
                }
            })
            .catch(error => {
                throw error;
            });
    },
    async loginUser(login, password) {
        return connection("usuario")
            .where({ nome_usuario: login, senha: password })
            .orWhere({ email: login, senha: password })
            .then(res => {
                const usr = res[0];

                if (usr == undefined) {
                    return null;
                } else {
                    const token = jwt.sign({ id: usr.id }, "teste");
                    const res = { token, user: { login, password } };
                    return res;
                }
            })
            .catch(error => {
                throw error;
            });
    }
}
