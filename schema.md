User: id, name, email(UNIQUE), password, created_at

Item: id, name,description, belong_to(FK User), added_at

Auction: id, auction_name, start_date, end_time, duration_seconds,
         start_bid, reserve_price,
         state(SCHEDULED/ACTIVE/CLOSING/CLOSED/SETTLED/CANCELLED),
         auction_item(FK Item), owner(FK User), created_at, updated_at

AuctionWatchlist: auction_id(FK), user_id(FK), joined_at, left_at(nullable)
                  PK(auction_id, user_id)

AuctionBids: id, auction_id(FK), user_id(FK), amount, created_at
             INDEX on auction_id

AuctionResult: id, auction_id(FK), winner_id(FK User),
               highest_bid(FK AuctionBids), final_amount,
               reserve_met(BOOLEAN), settled_at



Auth:
  POST   /auth/register
  POST   /auth/login
  POST   /auth/logout

User:
  GET    /user
  PATCH  /user
  DELETE /user

Item:
  GET    /items
  POST   /items
  PATCH  /items/:id
  DELETE /items/:id

Auction:
  GET    /auctions              (query params: state, owner)    GET /auctions?state=active
                                                                GET /auctions?state=upcoming
                                                                GET /auctions?owner=me
  POST   /auctions
  PATCH  /auctions/:id
  PATCH  /auctions/:id/cancel
  GET    /auctions/:id

Watchlist:
  POST   /auctions/:id/watch
  DELETE /auctions/:id/unwatch

Bids:
  POST   /auctions/:id/bids
  GET    /auctions/:id/bids

Result:
  GET    /auctions/:id/result
