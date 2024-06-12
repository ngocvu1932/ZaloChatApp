import chatController from "../controllers/chat.controller";
import userMiddleware from "../middleware/user.middleware";

const InitRoutesChat = (router) => {
  router
    .route("/access")
    .post(userMiddleware.checkJWT, chatController.accessChat)
    .get(userMiddleware.checkJWT, chatController.getAccessChat);
  router
    .route("/private")
    .get(userMiddleware.checkJWT, chatController.findOneByPrivate);

  router
    .route("/not-read")
    .get(userMiddleware.checkJWT, chatController.findNotReadChat);

  router
    .route("/pagination")
    .get(userMiddleware.checkJWT, chatController.findManyChatPagination);

  router.route("/seen").put(userMiddleware.checkJWT, chatController.seenChat);

  router.route("/pin").put(userMiddleware.checkJWT, chatController.pinChat);

  router
    .route("/total-together")
    .get(userMiddleware.checkJWT, chatController.getTotalTogether);

  router
    .route("/group")
    .post(userMiddleware.checkJWT, chatController.createGroupChat)
    .put(userMiddleware.checkJWT, chatController.updateGroupChat)
    .get(userMiddleware.checkJWT, chatController.findManyGroups);

  router
    .route("/delete")
    .delete(userMiddleware.checkJWT, chatController.deleteChat);

  router
    .route("/group/out")
    .put(userMiddleware.checkJWT, chatController.outGroupChat);

  router
    .route("/message")
    .post(userMiddleware.checkJWT, chatController.sendMessage);
  router
    .route("/message/pagination")
    .get(userMiddleware.checkJWT, chatController.findManyMessagePagination);

  router
    .route("/background/pagination")
    .get(userMiddleware.checkJWT, chatController.findManyBackgroundPagination);

  router
    .route("/background")
    .put(userMiddleware.checkJWT, chatController.setBackgroundForChat);

  router
    .route("/feeling", userMiddleware.checkJWT)
    .post(chatController.addFeeling)
    .put(chatController.clearReactions);
  router
    .route("/messages/total", userMiddleware.checkJWT)
    .get(chatController.getTotalMessages);
  router
    .route("/message/recall")
    .put(userMiddleware.checkJWT, chatController.recallMessage);
  router
    .route("/message/deleteMessage")
    .put(userMiddleware.checkJWT, chatController.deleteMessage);
  router
    .route("/message/pinMessage")
    .put(userMiddleware.checkJWT, chatController.pinMessage);
  router
    .route("/message/unPinMessage")
    .put(userMiddleware.checkJWT, chatController.unPinMessage);
  router
    .route("/addMembers")
    .put(userMiddleware.checkJWT, chatController.addMembers);
  router
    .route("/message/deleteMemer")
    .put(userMiddleware.checkJWT, chatController.deleteMember);
  router
    .route("/message/getAllPicture")
    .get(userMiddleware.checkJWT, chatController.findManyImagePagination);
  router
    .route("/message/getAllFile")
    .get(userMiddleware.checkJWT, chatController.findManyFilePagination);
  // disband by leader
  router
    .route("/grantGroupLeader")
    .put(userMiddleware.checkJWT, chatController.disbandByLeader);
  router
    .route("/getListGroupMember")
    .get(userMiddleware.checkJWT, chatController.getListGroupMember);

  router
    .route("/notify")
    .post(userMiddleware.checkJWT, chatController.notifyMessage);

  router
    .route("/group/grant")
    .put(userMiddleware.checkJWT, chatController.grantGroupChat);

  router
    .route("/group/dissolution")
    .post(userMiddleware.checkJWT, chatController.dissolutionGroupChat);

  return router;
};

module.exports = InitRoutesChat;
