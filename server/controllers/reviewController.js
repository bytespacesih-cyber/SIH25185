import { reviews } from "../models/Review.js";

export const getReviews = (req, res) => {
  const proposalReviews = reviews.filter(r => r.proposalId == req.params.proposalId);
  res.json(proposalReviews);
};

export const addReview = (req, res) => {
  const newReview = { id: Date.now(), ...req.body };
  reviews.push(newReview);

  res.json({ message: "Review added", review: newReview });
};
