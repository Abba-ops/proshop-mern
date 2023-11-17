import { useParams } from "react-router-dom";
import {
  useDeliverOrderMutation,
  useGetOrderDetailsQuery,
  useGetPayPalClientIdQuery,
  usePayOrderMutation,
} from "../features/orderApiSlice";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { Button, Col, Image, ListGroup, Row, Card } from "react-bootstrap";
import { PayPalButtons, usePayPalScriptReducer } from "@paypal/react-paypal-js";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { toast } from "react-toastify";
import moment from "moment";

export default function OrderDetailsPage() {
  const { id: orderId } = useParams();
  const { data: order, isLoading, refetch } = useGetOrderDetailsQuery(orderId);

  const [payOrder, { isLoading: loadingPay }] = usePayOrderMutation();
  const [{ isPending }, paypalDispatch] = usePayPalScriptReducer();

  const [deliverOrder, { isLoading: loadingDeliver }] =
    useDeliverOrderMutation();

  const {
    data: paypal,
    isLoading: loadingPayPal,
    error: errorPayPal,
  } = useGetPayPalClientIdQuery();

  const { userInfo } = useSelector((state) => state.auth);

  function onApprove(data, actions) {
    return actions.order.capture().then(async function (details) {
      try {
        await payOrder({ orderId, details });
        refetch();
        toast.success("Payment Successful");
      } catch (error) {
        toast.error(error?.data?.message || error.message);
      }
    });
  }

  function onError(error) {
    toast.error(error.message);
  }

  function createOrder(data, actions) {
    return actions.order
      .create({
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: order.totalPrice,
            },
          },
        ],
      })
      .then((orderId) => {
        return orderId;
      });
  }

  const deliverOrderHandler = async () => {
    try {
      await deliverOrder(orderId);
      refetch();
      toast.success("Order Delivered");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  useEffect(() => {
    if (!errorPayPal && !loadingPayPal && paypal.clientId) {
      const loadPayPalScript = async () => {
        paypalDispatch({
          type: "resetOptions",
          value: {
            "client-id": paypal.clientId,
            currency: "USD",
          },
        });
        paypalDispatch({
          type: "setLoadingStatus",
          value: "pending",
        });
      };
      if (order && !order.isPaid) {
        if (!window.paypal) {
          loadPayPalScript();
        }
      }
    }
  }, [order, paypal, paypalDispatch, loadingPayPal, errorPayPal]);

  return isLoading ? (
    <div className="mt-4">
      <Loader />
    </div>
  ) : (
    <>
      <Row>
        <Col md={8}>
          <Card className="border-0 mt-4">
            <Card.Body>
              <ListGroup variant="flush">
                <ListGroup.Item>
                  <h5>Shipping Information</h5>
                  <p>
                    <strong>Recipient's Name: </strong>
                    {order.user.firstName} {order.user.lastName}
                  </p>
                  <p>
                    <strong>Email: </strong>
                    {order.user.email}
                  </p>
                  <p>
                    <strong>Shipping Address: </strong>
                    {order.shippingAddress.address}
                  </p>
                  {order.isDelivered ? (
                    <Message variant="success">
                      Delivered on{" "}
                      {moment(order.deliveredAt)
                        .subtract(10, "days")
                        .calendar()}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Delivered</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5>Payment Method</h5>
                  <p>
                    <strong>Payment Method: </strong>
                    {order.paymentMethod}
                  </p>
                  {order.isPaid ? (
                    <Message variant="success">
                      Paid on{" "}
                      {moment(order.paidAt).subtract(10, "days").calendar()}
                    </Message>
                  ) : (
                    <Message variant="danger">Not Paid</Message>
                  )}
                </ListGroup.Item>
                <ListGroup.Item>
                  <h5>Ordered Items</h5>
                  <ListGroup variant="flush">
                    {order.orderItems.map((item) => (
                      <ListGroup.Item key={item._id}>
                        <Row>
                          <Col md={2}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col md={10}>
                            <p>
                              <strong>Product: </strong>
                              {item.name}
                            </p>
                            <p>
                              <strong>Price: </strong>${item.price}
                            </p>
                            <p>
                              <strong>Quantity: </strong>
                              {item.qty}
                            </p>
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                </ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="border-0 mt-4">
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
                    <Col>${order.itemsPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Shipping Cost</strong>
                    </Col>
                    <Col>${order.shippingPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Tax Amount</strong>
                    </Col>
                    <Col>${order.taxPrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="py-4">
                  <Row>
                    <Col>
                      <strong>Total Amount</strong>
                    </Col>
                    <Col>${order.totalPrice}</Col>
                  </Row>
                </ListGroup.Item>
                {!order.isPaid && (
                  <ListGroup.Item>
                    {loadingPay && <Loader />}
                    {isPending ? (
                      <Loader />
                    ) : (
                      <div>
                        <div>
                          <PayPalButtons
                            createOrder={createOrder}
                            onApprove={onApprove}
                            onError={onError}></PayPalButtons>
                        </div>
                      </div>
                    )}
                  </ListGroup.Item>
                )}
                {userInfo &&
                  userInfo.isAdmin &&
                  order.isPaid &&
                  !order.isDelivered && (
                    <ListGroup.Item className="py-4">
                      <Button
                        type="button"
                        onClick={deliverOrderHandler}
                        className="w-100 rounded-0 text-start btn__secondary text-uppercase">
                        {loadingDeliver ? "Loading..." : "Mark as Delivered"}
                      </Button>
                    </ListGroup.Item>
                  )}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}
