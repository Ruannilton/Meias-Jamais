const connection = require("../database/connetcion");
const postController = require("../controllers/postController");


module.exports = {
    get(request, response) {
        try {
            const data = await postController.get(request.id);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    create(request, response) {
        request.body['usuario_id'] = request.id;
        const post = {
            produto_nome,
            produto_descricao,
            categoria,
            produto_image,
            produto_link,
            recebido,
            usuario_id
        } = request.body;

        try {
            const data = await postController.create(post);
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    remove(request, response) {
        const { id } = request.params;
        try {
            const data = await postController.remove(id);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    update(request, response) {
        const { id } = request.params;

        const post = {
            produto_nome,
            produto_descricao,
            produto_image,
            produto_link,
            recebido,
        } = request.body;

        try {
            const data = await postController.update(id, post);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    index(request, response) {
        try {
            const data = await postController.index();
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },

    indexUser(request, response) {
        const { id } = request.params;
        try {
            const data = await postController.indexUser(id);
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
};
