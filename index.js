/*
const express = require("express");
const app = express();
const { config } = require("./config/config");
const port = config.port;

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];
  if (token === null) return res.sendStatus(401);
  console.log(token);
  jwt.verify(token, config.secretKey, async (error, user) => {
    if (error) return res.sendStatus(403);
    req.user = user;
    next();
  });
};

const { models } = require("./libs/sequelize");
const { QueryTypes } = require("@sequelize/core");

// generate data categories
async function generateCategories(categories) {
  for (let index = 0; index < categories.length; index++) {
    const category = categories[index];
    const dataForCategory = {
      name: category,
    };
    await models.Category.create(dataForCategory);
  }
}

async function generateNoteCategory(notesCategories) {
  for (let index = 0; index < notesCategories.length; index++) {
    const noteCategory = notesCategories[index];
    const { noteId, categories } = noteCategory;
    for (let indexj = 0; indexj < categories.length; indexj++) {
      const category = categories[indexj];
      const dataForNoteCategory = {
        noteId,
        categoryId: category,
      };
      await models.NoteCategory.create(dataForNoteCategory);
    }
  }
}
// const categories = ["Informatica", "Programacion", "Application software"];
// generateCategories(categories);

// const notesCategories = [{ noteId: 2, categories: [2, 3] }];
// generateNoteCategory(notesCategories);

function getDataForQuery(dataForFilter) {
  let query = 'SELECT * FROM public."user" WHERE ';
  const keysDataFilter = Object.keys(dataForFilter);
  for (let index = 0; index < keysDataFilter.length; index++) {
    query += `${keysDataFilter[index]} LIKE :${keysDataFilter[index]}`;
    if (index < keysDataFilter.length - 1) query += " OR ";
  }
  return {
    query,
    replacements: dataForFilter,
  };
}

app.get("/api/v1/users", async (req, res, next) => {
  try {
    // const users = await models.User.findAll({
    //   include: [{ model: models.Note, as: "notes" }],
    // });

    // const users = await models.User.sequelize.query(
    //   'SELECT * FROM public."user"',
    //   {
    //     model: models.User,
    //     mapToModel: true,
    //   }
    // );

    // const users = await models.User.sequelize.query(
    //   'SELECT * FROM public."user" WHERE username = :username',
    //   {
    //     replacements: { username: "juanlopezaranzazu" },
    //     type: QueryTypes.SELECT,
    //   }
    // );

    // const { User } = models;
    // const { sequelize } = User;

    // const users = await sequelize.query(
    //   'SELECT * FROM public."user" WHERE fullname LIKE :searchName',
    //   {
    //     replacements: { searchName: "%Esteban%" },
    //     type: QueryTypes.SELECT,
    //   }
    // );

    const dataForFilter = { fullname: "%Juan%", username: "%lopez%" };
    const dataQuery = getDataForQuery(dataForFilter);
    const { query, replacements } = dataQuery;
    console.log(dataQuery);

    const users = await models.User.sequelize.query(query, {
      replacements,
      type: QueryTypes.SELECT,
    });

    console.log(users);
    res.json(users);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/users", async (req, res, next) => {
  try {
    const { body } = req;
    const { fullname, username, password } = body;
    console.log(body);
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const dataForUser = {
      fullname,
      username,
      password: passwordHash,
    };
    const savedUser = await models.User.create(dataForUser);
    console.log(savedUser);
    res.status(201).json(savedUser);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/notes", verifyToken, async (req, res, next) => {
  try {
    const notes = await models.Note.findAll({
      include: [
        { model: models.User, as: "user" },
        { model: models.Category, as: "categories" },
      ],
    });
    console.log(notes);
    res.json(notes);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/notes/:id", verifyToken, async (req, res, next) => {
  try {
    const { params } = req;
    const { id } = params;
    const note = await models.Note.findOne({
      where: { id },
      include: [
        { model: models.User, as: "user" },
        { model: models.Category, as: "categories" },
      ],
    });
    console.log(note);
    res.json(note);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/notes", verifyToken, async (req, res, next) => {
  try {
    const { body, user } = req;
    const { title, url } = body;
    console.log(body);
    const dataForNote = {
      title,
      url,
      userId: user.id,
    };
    const savedNote = await models.Note.create(dataForNote);
    console.log(savedNote);
    res.status(201).json(savedNote);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/auth", async (req, res, next) => {
  try {
    const { body } = req;
    const { username, password } = body;
    console.log(body);

    const user = await models.User.findOne({ where: { username } });
    console.log("entro", user);

    const passwordCorrect =
      user === null ? false : await bcrypt.compare(password, user.password);

    if (!(user && passwordCorrect)) {
      res.status(401).json({
        error: "invalid user or password",
      });
    }

    const userForToken = {
      id: user.id,
      username: user.username,
    };
    console.log(userForToken);

    const token = jwt.sign(userForToken, config.secretKey, {
      expiresIn: "1h",
    });

    res.send({
      fullname: user.fullname,
      username: user.username,
      token,
    });
  } catch (error) {
    next(error);
  }
});

// middlewares
app.use((err, req, res, next) => {
  console.log("logErrors");
  console.error(err);
  next(err);
});

app.use((err, req, res, next) => {
  console.log("errorHandler");
  res.status(500).json({
    message: err.message,
    stack: err.stack,
  });
});

app.listen(port, () => console.log(`Server running in port ${port}`));
*/

const express = require("express");
const app = express();
const { config } = require("./config/config");
const port = config.port;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const routes = require("./routes/index");
routes(app);

const {
  errorHandler,
  boomErrorHandler,
  logErrors,
} = require("./middlewares/errorHandler");
app.use(logErrors);
app.use(boomErrorHandler);
app.use(errorHandler);

app.listen(port, () => console.log(`Server running in port ${port}`));
