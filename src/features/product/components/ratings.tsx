"use client";

import type { RatingProps } from "react-simple-star-rating";
import { Rating as SimpleRating } from "react-simple-star-rating";

export function Ratings(props: RatingProps) {
  return <SimpleRating {...props} />;
}
