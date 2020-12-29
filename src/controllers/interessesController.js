const connection = require("../database/connetcion");


module.exports = {
    async create(userId, postId) {
        return connection("interesses")
            .insert({ usuario_id: userId, post_id: postId })
            .then(res => {
                const [id] = res;
                return id;
            })
            .catch(error => {
                throw error;
            });
    },
    async getByUser(id) {
        return connection("usuario")
            .where("id", id)
            .then(res => {
                if (res.length === 0) {
                    return null;
                } else {
                    connection("interesses")
                        .where("usuario_id", id)
                        .select("post_id")
                        .then(res => {
                            return res;
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

    async getByPost() {
        return connection("interesses")
            .where("post_id", id)
            .select("usuario_id")
            .then(res => {
                return res;
            })
            .catch(error => {
                throw error;
            });
    },

    async remove(userId, postId) {
        return connection("interesses")
            .where({ usuario_id: userId, post_id: postId })
            .del()
            .then(res => {
                if (res === 0) {
                    return null;
                } else return res;
            })
            .catch(error => {
                throw error;
            });
    },

    async removeByPost(postId) {
        return connection("interesses")
            .where({ post_id: postId })
            .del()
            .then(res => {
                if (res === 0) {
                    return null;
                } else return res;
            })
            .catch(error => {
                throw error;
            });
    },

    async removeByUser(userId) {
        return connection("interesses")
            .where({ usuario_id: userId })
            .del()
            .then(res => {
                if (res === 0) {
                    return null;
                } else return res;
            })
            .catch(error => {
                throw error;
            });
    }

}