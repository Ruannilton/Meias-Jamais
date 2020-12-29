const interessesController = require("../controllers/interessesController");


module.exports = {
    create(request, response) {
        const { userId, postId } = request.params;
        try {
            const data = await interessesController.create(userId, postId);
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
    getByUser(request, response) {
        const { id } = request.params;

        try {
            const data = await interessesController.getByUser(id);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
    getByPost(request, response) {
        const { id } = request.params;
        try {
            const data = await interessesController.getByPost(id);
            response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
    remove(request, response) {
        const { userId, postId } = request.params;
        try {
            const data = await interessesController.remove(userId, postId);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
    removeByPost(request, response) {
        const { postId } = request.params;
        try {
            const data = await interessesController.removeByPost(postId);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
    removeByUser(request, response) {
        const { userId } = request.params;
        try {
            const data = await interessesController.removeByPost(userId);
            if (data === null) response.sendStatus(404);
            else response.status(200).json(data);
        } catch (error) {
            response.status(500).send(error.toString());
        }
    },
};
