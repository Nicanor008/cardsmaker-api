const User = require("./users_models");

// all users
exports.fetchAllUsers = (req, res) => {
  res.setHeader("Content-Type", "application/json");
  User.find()
    .then((users) => {
      if (users.length === 0) {
        return res.status(404).json({ message: "No users available" });
      }
      return res.status(200).json({ message: "All users", data: users });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Something went happen. Try again", error });
    });
};

// get single user
exports.getSingleUser = (req, res) => {
  User.findById({ _id: req.params.id })
    .then((response) => {
      if (!response) {
        return res.status(404).json({ message: "User does not exist" });
      }
      return res
        .status(200)
        .json({ message: "User Fetched successfully", data: response });
    })
    .catch((error) => {
      return res.status(500).json({ error });
    });
};

// update user account
exports.updateUserAccount = (req, res) => {
  if (req.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "Unathorised, you can only update your account" });
  }
  User.findOneAndUpdate({ _id: req.params.id }, req.body)
    .then((update) => {
      if (!update) {
        return res.status(404).json({ message: "User Does not exists" });
      }
      User.findOne({ _id: req.params.id }).then((response) => {
        return res
          .status(200)
          .json({ message: "user updated successfully", data: response });
      });
    })
    .catch(() => {
      res
        .status(500)
        .json({ message: "Something unexpected happened. Try again" });
    });
};

// soft delete account
exports.softDeleteUserAccount = (req, res) => {
  if (req.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "Unathorised, you can't delete someone's account" });
  }
  User.findByIdAndUpdate({ _id: req.params.id }, { active: false })
    .then((response) => {
      if (!response) {
        return res.status(404).json({ message: "User Does not exists" });
      }
      res.status(200).json({ message: "Account has been deactivated" });
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ message: "Something went wrong. Try again", error });
    });
};

// hard delete account
exports.deleteUserAccount = (req, res) => {
  if (req.id !== req.params.id) {
    return res
      .status(403)
      .json({ message: "Unathorised, you can't delete someone's account" });
  }
  User.findByIdAndDelete({ _id: req.params.id })
    .then(() => {
      res.status(200).json({ message: "Account has been deleted" });
    })
    .catch((error) => {
      res.status(500).json({ message: "Something Went Wrong. Try again" });
    });
};

// filter all authors
// search users as per users name or role
// exports.fetchOnlyAuthors = (req, res) => {
//   //   User.find({ role: { '$regex': name }})
//   const { name } = req.params;
//   User.aggregate([
//     {
//       $match: {
//         $or: [{ role: { $regex: name } }, { name: { $regex: name } }],
//       },
//     },
//   ])
//     .then((users) => {
//       if (users.length === 0) {
//         res
//           .status(statusCode.NOT_FOUND)
//           .json({ message: "No users available" });
//       }
//       return res.status(statusCode.OK).json({
//         message: `${users.length} users with ${req.params.name}`,
//         data: users,
//       });
//     })
//     .catch((error) => {
//       return res
//         .status(statusCode.SERVICE_UNAVAILABLE)
//         .json({ message: "Something went happen. Try again", error });
//     });
// };
