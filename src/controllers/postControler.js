const connection = require("./../database/connetcion");

module.exports = {
    get(request, response) {
        const { id } = request.params;
        connection("posts")
            .where("id", id)
            .then(res => {
                if (res.length == 0) {
                    response.sendStatus(404);
                } else {
                    const post = res[0];
                    response.json(post);
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    create(request, response) {
        const usuario_id = request.id;
        const {
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
                        console.log(friends);

                        for (const friend of friends) {
                            connection("feed")
                                .insert({
                                    usuario_id: friend.usuario_id,
                                    post_id,
                                })
                                .then(res => {
                                    console.log("added in friend feed");
                                });
                        }
                    });
                response.json({ post_id });
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    remove(request, response) {
        const { id } = request.params;
        connection("posts")
            .where("id", id)
            .del()
            .then(res => {
                if (res !== 0) {
                    connection("feed").where("post_id", id).del();
                    response.sendStatus(200);
                } else {
                    response.sendStatus(404);
                }
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    update(request, response) {
        const { id } = request.params;
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
                produto_nome,
                produto_descricao,
                produto_image,
                produto_link,
                recebido,
            })
            .then(res => {
                if (res === 0) response.sendStatus(404);
                else response.json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },

    index(request, response) {
        connection("posts")
            .select("*")
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
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
                response.status(500).send(error.toString());
            });
    },
};
