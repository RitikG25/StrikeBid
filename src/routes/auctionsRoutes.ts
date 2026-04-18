import Express from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
import {
  createAuction,
  deleteAuction,
  getAuctionDetails,
  getAuctionList,
  updateAuction,
} from "../controllers/auctions.js";
import {
  addAuctionMember,
  removeAuctionMember,
} from "../controllers/auctionMembers.js";
import { getAuctionBids } from "../controllers/auctionBid.js";
const AuctionRouter = Express.Router();

AuctionRouter.route("/")
  .get(AuthMiddleware, getAuctionList)
  .post(AuthMiddleware, createAuction);
AuctionRouter.route("/:id")
  .get(AuthMiddleware, getAuctionDetails)
  .patch(AuthMiddleware, updateAuction);
AuctionRouter.route("/:id/cancel").patch(AuthMiddleware, deleteAuction);

AuctionRouter.route("/:id/members").get(AuthMiddleware, getAuctionDetails);
AuctionRouter.route("/:id/members/watch").post(
  AuthMiddleware,
  addAuctionMember,
);
AuctionRouter.route("/:id/members/unwatch").post(
  AuthMiddleware,
  removeAuctionMember,
);

AuctionRouter.route("/:id/bids").get(AuthMiddleware, getAuctionBids);

export default AuctionRouter;
