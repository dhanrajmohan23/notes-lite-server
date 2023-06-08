const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const NotesModel = require("../model/notesModal");
const UsersModel = require("../model/userModal");

router.post("/register", async (req, res) => {
  const { userName, password, email } = req.body;

  UsersModel.findOne({ userName: userName })
    .then((existingUser) => {
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists! try to Login",
        });
      }

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, (err, hash) => {
          console.log(hash, "hash val");
          if (err) {
            return res.status(500).json({ message: "Failed to register User" });
          }

          const newUser = new UsersModel({
            userName: userName,
            password: hash,
            email: email,
          });

          newUser
            .save()
            .then(() => {
              res
                .status(201)
                .json({ message: "User Registered Successfully!" });
            })
            .catch((err) => {
              res.status(500).json({ message: "Failed to Register user" });
            });
        });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to Register user" });
    });
});

router.post("/login", (req, res) => {
  const { password, email } = req.body;

  UsersModel.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "Authentication failed" });
      }

      bcrypt.compare(password, user.password, (err, result) => {
        if (err | !result) {
          return res.status(401).json({ message: "Authentication failed" });
        }

        // Generate JWT Token
        const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, {
          expiresIn: "1h",
        });

        res.json({ token, userId: user._id });
      });
    })
    .catch((err) => {
      res.status(500).json({ message: "Failed to authenticate user" });
    });
});

//Post method
router.post("/post", async (req, res) => {
  const data = new NotesModel({
    note: req.body.note,
    category: req.body.category,
    userId: req.body.userId,
  });

  try {
    const dataToSave = await data.save();
    res.status(200).json(dataToSave);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Protected Route
// router.post("/post", async (req, res) => {
//   const token = req.headers.authorization;

//   jwt.verify(token, process.env.SECRET_KEY, async (err, decoded) => {
//     if (err) {
//       return res.status(401).json({ message: "Authentication failed" });
//     } else {
//       const data = new NotesModel({
//         note: req.body.note,
//         category: req.body.category,
//       });

//       try {
//         const dataToSave = await data.save();
//         res.status(200).json(dataToSave);
//       } catch (error) {
//         res.status(400).json({ message: error.message });
//       }
//     }
//   });
// });

// Get all method
router.get("/getAll", async (req, res) => {
  try {
    const data = await NotesModel.find();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Get by ID Method
router.get("/getNotesById/:id", async (req, res) => {
  try {
    const data = await NotesModel.findById(req.params.id);
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

//Update by ID Method
router.patch("/update/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const options = { new: true };

    const result = await NotesModel.findByIdAndUpdate(id, updatedData, options);

    res.send(result);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

//Delete by ID Method
router.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const data = await NotesModel.findByIdAndDelete(id);
    res.send(`Document with ${data.name} has been deleted..`);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
