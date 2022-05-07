const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please Provide review Title"],
  },

  comment: {
    type: String,
  },
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: [true, "Please provide rating"],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    req: true,
  },
  movie: {
    type: mongoose.Schema.ObjectId,
    ref: "Movies",
    req: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// this thing is done so that one user can have only one review in each product
reviewSchema.index({ user: 1, movie: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (movieId) {
  const result = await this.aggregate([
    { $match: { movie: movieId } },
    {
      $group: {
        _id: null,
        ratings: { $avg: "$rating" },
        numOfReviews: { $sum: 1 },
      },
    },
  ]);
  try {
      await this.model('Movies').findOneAndUpdate({_id:movieId},{
          ratings:Math.ceil(result[0]?.ratings || 0),
          numOfReviews:result[0]?.numOfReviews || 0,
      })
  } catch (error) {
      console.log(error)
  }
};

reviewSchema.post("save", async function () {
  await this.constructor.calculateAverageRating(this.movie);
});

reviewSchema.post("remove", async function () {
  await this.constructor.calculateAverageRating(this.movie);
});

module.exports = mongoose.model("Reviews", reviewSchema);
