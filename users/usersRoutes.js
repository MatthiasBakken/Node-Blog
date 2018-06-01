const express = require('express');
const usersDB = require('../data/helpers/userDb');
const router = express.Router();

const sendError = (status, message, res) => {
  res.status(status).json({ errorMessage: message });
};

router.post("/", (req, res) => {
  const { name } = req.body;
  if (name.length < 1 || name.length > 128) {
    sendError(400, "Please provide a name that is between 1 and 128 characters long.", res);
    return;
  }
  usersDB
    .insert({ name })
    .then(response => {
      res.status(201).json({ response });
      return;
    })
    .catch(error => {
      sendError(
        500,
        "There was an error while saving the user to the database.",
        res
      );
      return;
    });
});

router.get('/', (req, res) => {

  usersDB
    .get()
    .then(users => {
      res.json(users)
    })
    .catch(error => {
      sendError(
        500,
        "There was an error while retrieving the user from the database.",
        res
      );
    });
});

router.get('/:id', (req, res) => {
  const { id } = req.params;

  usersDB
    .get(id)
    .then(user => {
      if (user) {
        res.json(user);
      } else {
        sendError(
          404,
          `The user id of ${id} was not found.`,
          res
        );
        return;
      }
    })
    .catch(error => {
      sendError(500, "Something went terribly wrong!", res);
    });
});

router.get('/userposts/:id', (req, res) => {
  const { id } = req.params;

  usersDB
    .get(id)
    .then(user => {
      if (user) {
        usersDB.getUserPosts(id)
          .then(userPosts => {
            if (userPosts.length === 0) {
              sendError(404, "The user's posts could not be found.", res);
              return;
            } else {
              res.json(userPosts);
            }
          })
      } else {
        sendError(404, "This user could not be found.", res);
        return;
      }
    })
    .catch(error => {
      sendError(500, "Something went wrong with the server.", res);
    });
});

module.exports = router;