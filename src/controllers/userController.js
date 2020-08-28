const connection = require("../database/connetcion");

export default class userController {
    getAll() {
        return connection("usuario")
            .select("*")
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }
    getUserByUserName(name) {
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
    }
    getUserByEmail(email) {
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
    }
    getUserByID(id) {
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
    }
    updateUser(id = 0, data = {}) {
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
    }
    createUser(data = {}) {
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
    }
    deleteUser(id = 0) {
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
    }

    removeFollower(id, other_id) {
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
    }
    getFollowers(id) {
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
    }
    getFeed(id) {
        return connection("feed")
            .where("usuario_id", id)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }
    addFollower(id, other_id) {}
    getFollowing(id) {}
}
