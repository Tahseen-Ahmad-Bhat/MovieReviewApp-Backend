const { isValidObjectId } = require("mongoose");
const Movie = require("../models/movie");
const Review = require("../models/review");

const { sendError, getAverageRatings } = require("../util/helper");

exports.addReview = async (req, res) => {
  const { movieId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  // check whether user is verified or not
  if (!req.user.isVerified)
    return sendError(res, "Please verify your email first!");

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid Movie!");

  const movie = await Movie.findOne({ _id: movieId, status: "public" });
  if (!movie) return sendError(res, "Movie not found!", 404);
  // console.log("I am here!");
  const isAlreadyReviewed = await Review.findOne({
    owner: userId,
    parentMovie: movie._id,
  });
  console.log(isAlreadyReviewed);
  if (isAlreadyReviewed)
    return sendError(
      res,
      "Sorry! you have already registered a review for this movie."
    );

  // console.log("I am there!");

  // Create and update review
  const newReview = new Review({
    owner: userId,
    parentMovie: movie._id,
    content,
    rating,
  });

  // updating reviews of the given movie
  movie.reviews.push(newReview._id);
  await movie.save();

  // saving new review
  await newReview.save();

  const reviews = await getAverageRatings(movie._id);

  // console.log("reviews:", reviews);
  res.json({ message: "Your review has been added!", reviews });
};

exports.updateReview = async (req, res) => {
  const { reviewId } = req.params;
  const { content, rating } = req.body;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review Id!");

  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Review not found!", 404);

  review.content = content;
  review.rating = rating;

  await review.save();

  res.json({ message: "Your review has been updated!" });
};

exports.removeReview = async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user._id;

  if (!isValidObjectId(reviewId)) return sendError(res, "Invalid review Id!");

  const review = await Review.findOne({ owner: userId, _id: reviewId });
  if (!review) return sendError(res, "Invalid request, review not found!");

  const movie = await Movie.findById(review.parentMovie).select("reviews");
  if (!movie) return sendError(res, "Invalid request, movie not found!");

  movie.reviews = movie.reviews.filter((rId) => rId.toString() !== reviewId);

  //   save back movie to DB
  await movie.save();

  //   removing review from DB
  await Review.findByIdAndDelete(reviewId);

  res.json({ message: "Review removed successfully!" });
};

exports.getReviewsByMovie = async (req, res) => {
  const { movieId } = req.params;

  if (!isValidObjectId(movieId)) return sendError(res, "Invalid movie Id!");

  const movie = await Movie.findById(movieId)
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
        select: "name",
      },
    })
    .select("reviews title");
  if (!movie) return sendError(res, "Sorry! we are unable to find the movie!");

  const reviews = movie.reviews.map((r) => {
    const { owner, content, rating, _id: reviewId } = r;
    const { name, _id: ownerId } = owner;

    return {
      id: reviewId,
      owner: {
        id: ownerId,
        name,
      },
      content,
      rating,
    };
  });

  res.json({ movie: { title: movie.title, reviews } });
};
