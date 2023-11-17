import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { Button, Col, Image, ListGroup, Row, Card } from "react-bootstrap";
import { RiShoppingBag2Fill } from "react-icons/ri";
import { useCreateOrderMutation } from "../features/orderApiSlice";
import Message from "../components/Message";
import { clearCartItems } from "../features/cartSlice";
import { toast } from "react-toastify";
import CheckoutSteps from "../components/CheckoutSteps";

export default function PlaceOrderScreen() {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [createOrder, { isLoading, error }] = useCreateOrderMutation();

  const placeOrderHandler = async () => {
    try {
      const res = await createOrder({
        taxPrice: cart.taxPrice,
        orderItems: cart.cartItems,
        itemsPrice: cart.itemsPrice,
        totalPrice: cart.totalPrice,
        paymentMethod: cart.paymentMethod,
        shippingPrice: cart.shippingPrice,
        shippingAddress: cart.shippingAddress,
      }).unwrap();
      dispatch(clearCartItems());
      navigate(`/order/${res._id}`);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (!shippingAddress.address) {
      navigate("/shipping");
    } else if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [shippingAddress, cart.paymentMethod, navigate]);

  return (
    <div>
      <CheckoutSteps step1 step2 step3 step4 />

      <Row>
        <Col md={8}>
          <Card className="border-0">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>Shipping Address</h5>
                  <div>
                    <strong>Street Address:</strong>{" "}
                    {cart.shippingAddress.address}
                  </div>
                </ListGroup.Item>
                <ListGroup.Item className="py-3">
                  <h5>Payment Method</h5>
                  <strong>Selected Method:</strong> {cart.paymentMethod}
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <h5>Ordered Items</h5>
                  {cart.cartItems.length === 0 ? (
                    <Message variant="danger">Your Cart is Empty</Message>
                  ) : (
                    <ListGroup variant="flush">
                      {cart.cartItems.map((item, index) => (
                        <ListGroup.Item key={index}>
                          <Row className="align-items-center">
                            <Col md={2}>
                              <Image
                                src={item.image}
                                alt={item.name}
                                fluid
                                rounded
                              />
                            </Col>
                            <Col md={10}>
                              <Link to={`/product/${item._id}`}>
                                {item.name}
                              </Link>{" "}
                              <div>
                                {item.qty} x ${item.price} = $
                                {item.qty * item.price}
                              </div>
                            </Col>
                          </Row>
                        </ListGroup.Item>
                      ))}
                    </ListGroup>
                  )}
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        <Col md={4}>
          <Card className="border-0">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h4 className="text-uppercase">Order Summary</h4>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Subtotal</strong>
                    </Col>
                    <Col>${cart.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Shipping Cost</strong>
                    </Col>
                    <Col>${cart.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Tax Amount</strong>
                    </Col>
                    <Col>${cart.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Total Amount</strong>
                    </Col>
                    <Col>${cart.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {error && (
                  <ListGroup.Item>
                    <Message variant="danger">{error}</Message>
                  </ListGroup.Item>
                )}
                <ListGroup.Item className="py-4">
                  <Button
                    onClick={placeOrderHandler}
                    className="w-100 rounded-0 d-flex align-items-center btn__secondary text-uppercase"
                    disabled={cart.cartItems.length === 0}>
                    <RiShoppingBag2Fill className="me-auto" />
                    {isLoading ? "Processing..." : "Place Order"}
                  </Button>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
