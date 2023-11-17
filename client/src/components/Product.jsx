import React from "react";
import { Link } from "react-router-dom";
import { Card } from "react-bootstrap";
import Rating from "./Rating";

export default function Product({ product }) {
  const { _id, image, name, rating, numReviews, price } = product;

  return (
    <Link to={`/product/${_id}`} className="text-decoration-none">
      <Card className="my-3 border-0 product__card">
        <Card.Img variant="top" src={image} />
        <Card.Body>
          <Card.Text className="text-truncate">{name}</Card.Text>
          <Card.Text>
            <Rating value={rating} text={`${numReviews} reviews`} />
          </Card.Text>
          <Card.Text as="h4" className="fw-semibold">
            ${price.toFixed(2)}
          </Card.Text>
        </Card.Body>
      </Card>
    </Link>
  );
}
