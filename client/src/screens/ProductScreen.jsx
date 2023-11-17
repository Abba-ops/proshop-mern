import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  FloatingLabel,
  Form,
  Image,
  ListGroup,
  Row,
} from "react-bootstrap";
import ReactStars from "react-rating-stars-component";
import moment from "moment";
import {
  useCreateReviewMutation,
  useGetProductDetailsQuery,
} from "../features/productsApiSlice";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa6";
import { MdAddShoppingCart } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import { addToCart } from "../features/cartSlice";
import { toast } from "react-toastify";
import Meta from "../components/Meta";
import Message from "../components/Message";
import Rating from "../components/Rating";
import Loader from "../components/Loader";

const ReviewComponent = ({
  userInfo,
  product,
  submitHandler,
  ratingChanged,
  comment,
  setComment,
  isReviewing,
}) => {
  return (
    <>
      {product.reviews.length === 0 && (
        <div className="bg-white">
          <h2 className="display-6 fs-4 m-0 text-center py-3 text-uppercase">
            No Customer Reviews Yet
          </h2>
        </div>
      )}
      <Card className="border-0 rounded-0">
        <Card.Body>
          <Card.Title>Customer Reviews</Card.Title>
          <ListGroup variant="flush">
            {product.reviews.map((review) => (
              <ListGroup.Item key={review._id}>
                <strong>{review.firstName}</strong>
                <Rating value={review.rating} />
                <p>{moment(review.createdAt).fromNow()}</p>
                <p>{review.comment}</p>
              </ListGroup.Item>
            ))}
            <ListGroup.Item>
              <h3>Write a Review</h3>
              {userInfo ? (
                <Form onSubmit={submitHandler}>
                  <ReactStars
                    count={5}
                    size={45}
                    isHalf={true}
                    activeColor="#ffae42"
                    onChange={ratingChanged}
                  />
                  <FloatingLabel
                    controlId="comment"
                    label="Your Comments"
                    className="mb-3">
                    <Form.Control
                      as="textarea"
                      placeholder="Write your comments here"
                      style={{ height: "100px" }}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                  </FloatingLabel>
                  <Button
                    disabled={isReviewing}
                    type="submit"
                    className="btn__secondary">
                    {isReviewing ? "Submitting..." : "Submit Review"}
                  </Button>
                </Form>
              ) : (
                <div>
                  <p>
                    Please <Link to={"/login"}>login</Link> to leave a review
                  </p>
                </div>
              )}
            </ListGroup.Item>
          </ListGroup>
        </Card.Body>
      </Card>
    </>
  );
};

const ProductScreen = () => {
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);
  const [qty, setQty] = useState(1);

  const { id: productId } = useParams();
  const { userInfo } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    error,
    isLoading,
    data: product,
    refetch,
  } = useGetProductDetailsQuery(productId);

  const [createReview, { isLoading: isReviewing }] = useCreateReviewMutation();

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, qty }));
    navigate("/cart");
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      if (comment.length === 0 || rating === 0) {
        toast.error("Please provide review and rating");
      } else {
        await createReview({ productId, rating, comment }).unwrap();
        refetch();
        toast.success("Review submitted successfully");
        setComment("");
        setRating(0);
      }
    } catch (error) {
      toast.error("Review submission failed");
    }
  };

  const ratingChanged = (newRating) => {
    setRating(newRating);
  };

  return (
    <>
      <Link to="/" className="my-3">
        <Button className="my-3 btn__secondary">
          <FaArrowLeft /> Back to Products
        </Button>
      </Link>
      {isLoading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">Error loading product details</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <Row>
            <Col md={5} className="p-0">
              <Col>
                <Image src={product.image} alt={product.name} fluid />
              </Col>
              <Col className="d-none d-md-block">
                <ReviewComponent
                  comment={comment}
                  isReviewing={isReviewing}
                  product={product}
                  ratingChanged={ratingChanged}
                  setComment={setComment}
                  submitHandler={submitHandler}
                  userInfo={userInfo}
                />
              </Col>
            </Col>
            <Col md={7} className="p-0">
              <Card className="border-0 rounded-0">
                <Card.Body>
                  <ListGroup variant="flush">
                    <ListGroup.Item>
                      <h3 className="display-6 fs-2 primary__color">
                        {product.name}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <Rating
                        value={product.rating}
                        text={`${product.numReviews} Customer Reviews`}
                      />
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h3 className="fw-semibold primary__color">
                        ${product.price}
                      </h3>
                    </ListGroup.Item>
                    <ListGroup.Item>
                      <h6>Product Description</h6>
                      <p className="lead text__color">{product.description}</p>
                    </ListGroup.Item>
                    {product?.countInStock > 0 && (
                      <ListGroup.Item>
                        <Row>
                          <Col>
                            <strong>Quantity</strong>
                          </Col>
                          <Col>
                            <Form.Select
                              value={qty}
                              onChange={(e) => setQty(Number(e.target.value))}>
                              {[...Array(product.countInStock).keys()].map(
                                (x) => (
                                  <option value={x + 1} key={x + 1}>
                                    {x + 1}
                                  </option>
                                )
                              )}
                            </Form.Select>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    )}
                    <ListGroup.Item>
                      <Row>
                        <Col>
                          <strong>Availability</strong>
                        </Col>
                        <Col>
                          {product.countInStock > 0
                            ? "In Stock"
                            : "Out of Stock"}
                        </Col>
                      </Row>
                    </ListGroup.Item>
                    <ListGroup.Item className="py-4">
                      <Button
                        size="lg"
                        onClick={addToCartHandler}
                        className="w-100 d-flex align-items-center btn__secondary text-uppercase"
                        disabled={product.countInStock === 0}>
                        <MdAddShoppingCart className="me-auto" />
                        Add to Cart
                      </Button>
                    </ListGroup.Item>
                  </ListGroup>
                </Card.Body>
              </Card>
            </Col>
          </Row>
          <div className="d-block d-md-none mt-4">
            <ReviewComponent
              comment={comment}
              isReviewing={isReviewing}
              product={product}
              ratingChanged={ratingChanged}
              setComment={setComment}
              submitHandler={submitHandler}
              userInfo={userInfo}
            />
          </div>
        </>
      )}
    </>
  );
};

export default ProductScreen;
