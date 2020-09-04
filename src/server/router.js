const express = require("express");
const routes = express.Router();
const tokenVerifier = require("./tokenVerifier");
const userAPI = require("./../api/userAPI");
const postControler = require("./../api/postAPI");
const curtidasControler = require("./../api/curtidasAPI");
const comentatiosControler = require("./../api/comentariosAPI");
const interesseControler = require("./../api/interessesAPI");
const uploadImage = require("./../api/uploadImagenAPI");

//#region USER

// OBRIGADO RICCARDO POR ASJUDAR NESSSA MERDAAAAA
// DETESTEO ISSO AQUI NA MORAL

//login
routes.post("/user/login", userAPI.login);

// retorna todos os usuarios
routes.get("/user/index", tokenVerifier, userAPI.index);

// retonar o usuario logado
routes.get("/user/getCurrentUser", tokenVerifier, userAPI.getUser);

// retorna um usuário específico
routes.get("/user/:id", tokenVerifier, userAPI.get);

// retorna o feed de um usuario
routes.post("/user/feed", tokenVerifier, userAPI.getFeed);

// retorna os seguidores de um usuário
routes.get("/user/getFollowers/:id", tokenVerifier, userAPI.getFollowers);

// retorna os usuários que este usuário segue
routes.get("/user/getFollowing/:id", tokenVerifier, userAPI.getFollowing);

// delete um usuário
routes.delete("/user/remove/:id", tokenVerifier, userAPI.delete);

//atualiza os dados de um usuario
routes.put("/user/update", tokenVerifier, userAPI.update);

// para de seguir um usuário
routes.delete(
    "/user/remFollower/:other_id",
    tokenVerifier,
    userAPI.remFolower
);

//passa a seguir um usuário
routes.post(
    "/user/addFollower/:other_id",
    tokenVerifier,
    userAPI.addFolower
);

routes.post("/user/create", userAPI.create);
/*
cria um novo usuário
{
   "nome":"Ruan",
   "nome_usuario":"rn",
   "descricao":"nice guy",
   "dt_aniversario":"2000-03-16"
}
*/

//#endregion

//#region POST
routes.get("/post/:id", tokenVerifier, postControler.get);

routes.post("/post/create", tokenVerifier, postControler.create);

routes.delete("/post/remove/:id", tokenVerifier, postControler.remove);

routes.put("/post/update/:id", tokenVerifier, postControler.update);

routes.get("/post/index/:id", tokenVerifier, postControler.indexUser);
//#endregion

//#region COMENTARIO

routes.get("/comentarios", tokenVerifier, comentatiosControler.index);
routes.get(
    "/comentarios/posts/:id",
    tokenVerifier,
    comentatiosControler.getByPost
);
routes.get(
    "/comentarios/user/:id",
    tokenVerifier,
    comentatiosControler.getByUser
);
routes.delete(
    "/comentarios/remove",
    tokenVerifier,
    comentatiosControler.remove
);
routes.put("/comentarios/update", tokenVerifier, comentatiosControler.update);
routes.post("/comentarios/create", tokenVerifier, comentatiosControler.create);

//buscar comentarios do usuario
routes.get(
    "/comentarios/user/:id",
    tokenVerifier,
    comentatiosControler.getByUser
);

//#endregion

//#region CURTIDAS

routes.get("/curtidas/index", tokenVerifier, curtidasControler.index);

//buscar uma curtida pelo id do post
routes.get("/curtidas/posts/:id", tokenVerifier, curtidasControler.getByPost);

//curte um post
routes.post("/curtidas/create", tokenVerifier, curtidasControler.create);

//remove a curtida de um post
routes.delete("curtidas/remove", tokenVerifier, curtidasControler.remove);

//buscar curtidas do usuario
routes.get("/curtidas/user/:id", tokenVerifier, curtidasControler.getByUser);

//#endregion

//#region IMAGENS
//routes.post("/upload/image", tokenVerifier, ImageUpload.single("file"));

//#endregion

//#region INTERESSES

//busca os interesses de um usuario
routes.get("/interesses/user/:id", tokenVerifier, interesseControler.getByUser);

//busca os usuarios interessados em um post
routes.get("/interesses/post/:id", tokenVerifier, interesseControler.getByPost);

//adiciona um usuario na lista de interessados
routes.post("/interesses/create", tokenVerifier, interesseControler.create);

//remove um usuario da lista de interessados
routes.delete("/interesses/remove", tokenVerifier, interesseControler.remove);

//remove todos os interessados de um post
routes.delete(
    "/interesses/post/remove/:postId",
    tokenVerifier,
    interesseControler.removeByPost
);

//remove todos os interesses de um usuario
routes.delete(
    "/interesses/user/remove/:postId",
    tokenVerifier,
    interesseControler.removeByUser
);
//#endregion

//#region ARQUIVOS

routes.post("/upload/image", uploadImage.single("file"), function (
    req,
    res,
    next
) {
    res.sendStatus(200).json();
});

//#endregion

module.exports = routes;
