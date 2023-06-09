const express = require("express");
const { isAuth } = require("../middlewares/auth");
const { validateRatings, validate } = require("../middlewares/validator");
const {
  addReview,
  updateReview,
  removeReview,
  getReviewsByMovie,
} = require("../controllers/review");
const router = express.Router();

router.post("/add/:movieId", isAuth, validateRatings, validate, addReview);
router.patch(
  "/update/:reviewId",
  isAuth,
  validateRatings,
  validate,
  updateReview
);
router.delete("/delete/:reviewId", isAuth, removeReview);
router.get("/get-reviews-by-movie/:movieId", getReviewsByMovie);

module.exports = router;
