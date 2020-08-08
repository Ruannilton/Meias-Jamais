const connection = require("./../database/connetcion");

module.exports = {
    get(request, response) {
        const { id } = request.params;
        connection("posts")
            .where("id", id)
            .then(res => {
                const post = res[0];
                response.json(post);
            })
            .catch(error => {
                response
                    .status(404)
                    .json({ err: error, msg: error.toString() });
            });
    },

    create(request, response) {
        const {
            usuario_id,
            produto_nome,
            produto_descricao,
            categoria,
            produto_image,
            produto_link,
            recebido,
        } = request.body;
        connection("posts")
            .insert({
                usuario_id,
                produto_nome,
                produto_descricao,
                categoria,
                produto_image,
                produto_link,
                recebido,
            })
            .then(res => {
                const [post_id] = res;
                //TODO: catch
                connection("usuario_usuario")
                    .where("usuario_seguido_id", usuario_id)
                    .then(friends => {
                        friends.forEach(friend => {
                            connection("feed").insert({
                                usuario_id: friend.usuario_id,
                                post_id,
                            });
                        });
                    });
                response.json({ id });
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    remove(request, response) {
        const { id } = request.params;
        connection("posts")
            .where("id", id)
            .del()
            .then(res => {
                connection("feed").where(post_id, id).del();
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    update(request, response) {
        const {
            produto_nome,
            produto_descricao,
            produto_image,
            produto_link,
            recebido,
        } = request.body;
        connection("posts")
            .where("id", id)
            .update({
                usuario_id,
                produto_nome,
                produto_descricao,
                produto_image,
                produto_link,
                recebido,
            })
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    index(request, response) {
        connection("posts")
            .select("*")
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },

    indexUser(request, response) {
        const { id } = request.params;
        connection("posts")
            .where("usuario_id", id)
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.json({ err: error, msg: error.toString() });
            });
    },
};
