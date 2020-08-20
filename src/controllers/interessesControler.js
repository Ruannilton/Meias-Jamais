const connection = require("./../database/connetcion");

module.exports = {
    create(request, response) {
        const { userId, postId } = request.params;
        connection("interesses")
            .insert({ usuario_id: userId, post_id: postId })
            .then(res => {
                const [id] = res;
                response.status(200).send(id);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
    getByUser(request, response) {
        const { id } = request.params;

        connection("usuario")
            .where("id", id)
            .then(res => {
                if (res.length === 0) {
                    response.sendStatus(404);
                } else {
                    connection("interesses")
                        .where("usuario_id", id)
                        .select("post_id")
                        .then(res => {
                            response.status(200).json(res);
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
    getByPost(request, response) {
        connection("interesses")
            .where("post_id", id)
            .select("usuario_id")
            .then(res => {
                response.json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
    remove(request, response) {
        const { userId, postId } = request.params;
        connection("interesses")
            .where({ usuario_id: userId, post_id: postId })
            .del()
            .then(res => {
                if (res === 0) {
                    response.sendStatus(404);
                } else response.status(200).json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
    removeByPost(request, response) {
        const { postId } = request.params;
        connection("interesses")
            .where({ post_id: postId })
            .del()
            .then(res => {
                if (res === 0) {
                    response.sendStatus(404);
                } else response.status(200).json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
    removeByUser(request, response) {
        const { userId } = request.params;
        connection("interesses")
            .where({ usuario_id: userId })
            .del()
            .then(res => {
                if (res === 0) {
                    response.sendStatus(404);
                } else response.status(200).json(res);
            })
            .catch(error => {
                response.status(500).send(error.toString());
            });
    },
};
