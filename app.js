const express = require("express");
require("express-async-errors");
const morgan = require("morgan");
const { errorHandler } = require("./middlewares/error");
const cors = require("cors");
const PORT = process.env.PORT || 8000;

require("dotenv").config();
require("./db");
const { handlePageNotFound } = require("./util/helper");

const userRouter = require("./routes/user");
const actorRouter = require("./routes/actor");
const movieRouter = require("./routes/movie");
const reviewRouter = require("./routes/review");
const adminRouter = require("./routes/admin");

const app = express();

app.use(cors());

app.use(express.json());
app.use(morgan("dev"));

app.use("/api/user", userRouter);
app.use("/api/actor", actorRouter);
app.use("/api/movie", movieRouter);
app.use("/api/review", reviewRouter);
app.use("/api/admin", adminRouter);

app.use("/*", handlePageNotFound);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log("App is listening on port " + PORT);
});
