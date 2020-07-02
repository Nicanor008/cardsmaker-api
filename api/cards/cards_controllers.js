const Card = require("./cards_models");
const mongoose = require("mongoose");
const IpAddress = require("./ipAddressModel");
const dns = require("dns");
const os = require("os");

exports.createCard = (req, res) => {
  let {
    name,
    message,
    backgroundColor,
    border,
    useTemplate,
    isPublic,
    tags, eventDate, eventTime
  } = req.body;
  name = name.toLowerCase();
  if (!name && !message) {
    return res
      .status(404)
      .json({ message: "Event Name and Message are required" });
  }

  // check user ip
  let ipCount = 0;
  dns.lookup(os.hostname(), function (err, ip, fam) {
    //   check if ip already exists
    IpAddress.findOne({ ip }).then((ipIfExists) => {
      if (!ipIfExists || ipIfExists === null) {
        // ip doesn't exists, create new ip
        const ipaddress = new IpAddress({ ip });
        ipaddress.save().then((insertedIp) => {
          ipCount = 1;
          return ipCount;
        });
      } else {
        ipCount += ipIfExists.cardCount;

        // if passed the limit, purchase
        if (ipCount >= 5) {
          return res
            .status(402)
            .json({ message: "You've passed the limit, kindly purchase" });
        }

        //   ip ipIfExists, update
        IpAddress.findOneAndUpdate({ ip }, { $inc: { cardCount: 1 } }).then(
          (updatedIp) => {
            ipCount = updatedIp + 1;
            return ipCount;
          }
        );

        //   save card
        const cards = new Card({
          name,
          message,
          backgroundColor,
          border,
          user: req.id,
          useTemplate,
          isPublic,
          tags, eventDate, eventTime
        });
        cards.save().then((card) => {
          return res
            .status(200)
            .json({ message: "Event has been created", data: card });
        });
      }
    });
  });
};
// fetch all events cards in the DB
exports.getAllEventsCards = (req, res) => {
  Card.aggregate([
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ]).then((cards) => {
    if (cards.length === 0) {
      return res.status(404).json({ message: "No Event Cards available" });
    }
    return res.status(200).json({
      message: `${cards.length > 1 ? `All Events Cards` : `Event Card`}`,
      data: cards,
    });
  });
};

// view all users cards
// single user
exports.getUserEventCards = (req, res) => {
  const userId = mongoose.Types.ObjectId(req.id);
  Card.aggregate([
    { $match: { user: userId } },
    {
      $sort: {
        createdAt: -1,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "user",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $unwind: "$user",
    },
  ])
    .then((cards) => {
      if (cards.length === 0) {
        return res
          .status(404)
          .json({ message: "You Haven't Created any Events yet." });
      }
      return res.status(200).json({
        message: `${
          cards.length > 1 ? `All User Events Cards` : `User Event Card`
        }`,
        data: cards,
      });
    })
    .catch((err) => {
      return res.status(500).json({ error: err });
    });
};

// get single events
exports.getSingleCard = (req, res) => {
  Card.findOne({ _id: req.params.id }).then((card) => {
    if (!card) {
      return res.status(404).json({ message: "No Events Cards Available" });
    }
    return res.status(200).json({ message: "Single Event Card", data: card });
  });
};

// view all cards tags
// e.g. all cards with tags WEDDING
exports.viewCardsTags = (req, res) => {
  const tag = req.params.tag;
  Card.find({ tags: { $regex: tag } })
    .sort()
    .then((cards) => {
      if (cards.length === 0) {
        return res
          .status(404)
          .json({ message: `No Events Cards with tag ${tag}` });
      }
      return res
        .status(200)
        .json({ message: `Event with tag ${tag}`, data: cards });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: `Server Error occurred. Try again`, error });
    });
};

// update card
exports.updateUserEvent = (req, res) => {
  const id = req.params.id;
  const userId = mongoose.Types.ObjectId(req.id);

  Card.updateOne({ _id: id, user: userId }, req.body).then((updatedCard) => {
    if (updatedCard.nModified === 0) {
      return res
        .status(404)
        .json({ message: `Event does not exists or your not the author` });
    }
    Card.findOne({ _id: id }).then((card) => {
      return res
        .status(200)
        .json({ message: `Event Card has been updated`, data: card });
    });
  });
};

// delete single user card
exports.deleteUserEvent = (req, res) => {
  const userId = mongoose.Types.ObjectId(req.id);
  const id = req.params.id;
  Card.deleteOne({ _id: id, user: userId }).then((deletedCard) => {
    if (deletedCard.nModified === 0) {
      return res
        .status(404)
        .json({ message: `Event does not exists or your not the author` });
    }
    return res.status(200).json({
      message: `Event Card has been Deleted Successfully`,
    });
  });
};

// delete all user cards
exports.deleteAllUserEventCards = (req, res) => {
  const user = mongoose.Types.ObjectId(req.id);
  Card.find({ user }).then((user) => {
    if (user.length === 0) {
      return res
        .status(404)
        .json({ message: `User Doesn't have any event cards` });
    }
    Card.deleteMany({ user }).then(() => {
      return res
        .status(200)
        .json({ message: "All User Events have been deleted" });
    });
  });
};

// search cards
exports.searchEventCard = (req, res) => {
  const { name } = req.params;
  //   const me = checkIp.createIpAddress()
  Card.find({ name: { $regex: name } })
    .then((card) => {
      if (card.length === 0) {
        return res
          .status(404)
          .json({ message: `No Event Card with the name ${name}` });
      }
      return res.status(200).json({
        message: `${card.length} ${card.length > 1 ? `Events` : `Event`} found`,
        data: card,
      });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Server Error Occurred. Try again", error });
    });
};
