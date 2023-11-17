import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { MdShoppingCart, MdShoppingCartCheckout } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  Row,
  Col,
  ListGroup,
  Image,
  Form,
  Button,
  Card,
} from "react-bootstrap";
import { addToCart, removeFromCart } from "../features/cartSlice";

export default function CartScreen() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const addToCartHandler = (product, quantity) => {
    dispatch(addToCart({ ...product, qty: quantity }));
  };

  const removeFromCartHandler = (id) => {
    dispatch(removeFromCart(id));
  };

  const goToCheckout = () => {
    navigate("/login?redirect=/shipping");
  };

  return (
    <Row>
      <Col md={8}>
        {cartItems.length === 0 ? (
          <div className="d-flex my-4 text-center justify-content-center flex-column align-items-center">
            <div className="rounded-pill bg-white px-4 py-3 display-1">
              <MdShoppingCart className="text-secondary" />
            </div>
            <h3>Your Cart is Empty!</h3>
            <p>Explore our categories and discover amazing deals!</p>
            <Link to={"/"}>
              <Button size="lg" className="btn__secondary">
                Start Shopping
              </Button>
            </Link>
          </div>
        ) : (
          <Card className="border-0 mt-4">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="text-uppercase">Cart Overview</h4>
                </ListGroup.Item>
                {cartItems.map((item) => (
                  <ListGroup.Item key={item._id}>
                    <Row className="justify-content-between align-items-center gap-3">
                      <Col md={2}>
                        <div className="position-relative">
                          <Image
                            fluid
                            rounded
                            alt={item.name}
                            src={item.image}
                          />
                          <div className="position-absolute top-0 end-0 d-block p-2 d-sm-none">
                            <Button
                              type="button"
                              className="btn__secondary"
                              onClick={() => removeFromCartHandler(item._id)}>
                              <FaTrash />
                            </Button>
                          </div>
                        </div>
                      </Col>
                      <Col md={3}>
                        <Link to={`/product/${item._id}`}>{item.name}</Link>
                      </Col>
                      <Col md={2}>${item.price}</Col>
                      <Col md={2}>
                        <Form.Select
                          value={item.qty}
                          onChange={(e) =>
                            addToCartHandler(item, Number(e.target.value))
                          }>
                          {[...Array(item.countInStock).keys()].map((x) => (
                            <option value={x + 1} key={x + 1}>
                              {x + 1}
                            </option>
                          ))}
                        </Form.Select>
                      </Col>
                      <Col md={2} className="d-none d-sm-block">
                        <Button
                          type="button"
                          className="btn__secondary"
                          onClick={() => removeFromCartHandler(item._id)}>
                          <FaTrash />
                        </Button>
                      </Col>
                    </Row>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        )}
      </Col>
      <Col>
        <Card className="border-0 mt-4">
          <Card.Body>
            <ListGroup variant="flush">
              <ListGroup.Item>
                <h4 className="text-uppercase">Cart Summary</h4>
              </ListGroup.Item>
              <ListGroup.Item className="py-4">
                <Row>
                  <Col>
                    <strong>Items in Cart</strong>
                  </Col>
                  <Col>
                    {cartItems.reduce((acc, item) => acc + item.qty, 0)}{" "}
                    {cartItems.reduce((acc, item) => acc + item.qty, 0) === 1
                      ? "item"
                      : "items"}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-4">
                <Row>
                  <Col>
                    <strong>Subtotal</strong>
                  </Col>{" "}
                  <Col>
                    $
                    {cartItems
                      .reduce((acc, item) => acc + item.qty * item.price, 0)
                      .toFixed(2)}
                  </Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="py-4">
                <Button
                  onClick={goToCheckout}
                  className="w-100 rounded-0 d-flex align-items-center btn__secondary text-uppercase"
                  disabled={cartItems.length === 0}>
                  <MdShoppingCartCheckout className="me-auto" />
                  Proceed to Checkout
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card.Body>
        </Card>
      </Col>
    </Row>
  );
}
