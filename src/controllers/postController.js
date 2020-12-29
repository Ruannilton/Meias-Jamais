const connection = require("../database/connetcion");

module.exports = {
    async get(id) {
        return connection("posts")
            .where("id", id)
            .then(res => {
                if (res.length == 0) {
                    return null;
                } else {
                    return res[0];
                }
            })
            .catch(error => {
                throw error;
            });
    },

    async addToFeed(usuario_id, post_id) {
        connection("usuario_usuario")
            .where("usuario_seguido_id", usuario_id)
            .then(friends => {
                for (const friend of friends) {
                    connection("feed")
                        .insert({
                            usuario_id: friend.usuario_id,
                            post_id,
                        }).catch(error => {
                            throw error;
                        });
                }
            });
    },
    async create(usuario) {
        const { usuario_id,
            produto_nome,
            produto_descricao,
            categoria,
            produto_image,
            produto_link,
            recebido } = usuario;

        return connection("posts")
            .insert({
                usuario_id,
                produto_nome,
                produto_descricao,
                categoria,
                produto_image,
                produto_link,
                recebido,
            }).then(res => {
                const [post_id] = res;
                await this.addToFeed(usuario_id, post_id);
                return post_id;
            }).catch(error => {
                throw error;
            });
    },
    async remove(id) {
        return connection("posts")
            .where("id", id)
            .del()
            .then(res => {
                if (res !== 0) {
                    connection("feed").where("post_id", id).del();
                    return true
                } else {
                    return null
                }
            })
            .catch(error => {
                throw error
            });
    },

    async update(id, produto) {

        const {
            produto_nome,
            produto_descricao,
            produto_image,
            produto_link,
            recebido,
        } = produto;

        return connection("posts")
            .where("id", id)
            .update({
                produto_nome,
                produto_descricao,
                produto_image,
                produto_link,
                recebido,
            })
            .then(res => {
                if (res === 0) return null;
                else return res;
            })
            .catch(error => {
                throw error;
            });
    },

    async index() {
        return connection("posts")
            .select("*")
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    async indexUser(id) {
        return connection("posts")
            .where("usuario_id", id)
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    }


}