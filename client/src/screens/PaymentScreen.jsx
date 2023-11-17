import React, { useEffect, useState } from "react";
import { Card, Form, Col, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import { savePaymentMethod } from "../features/cartSlice";

export default function PaymentScreen() {
  const [paymentMethod, setPaymentMethod] = useState("PayPal");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const handlePaymentMethodChange = (e) => setPaymentMethod(e.target.value);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(savePaymentMethod(paymentMethod));
    navigate("/placeorder");
  };

  useEffect(() => {
    if (!shippingAddress) {
      navigate("/shipping");
    }
  }, [shippingAddress, navigate]);

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 step3 />
      <Card className="border-0 p-3 mt-4">
        <Card.Body>
          <Card.Title>Payment Method</Card.Title>
          <Form onSubmit={submitHandler}>
            <Form.Group as={Col}>
              <Form.Check
                id="PayPal"
                type="radio"
                className="my-3"
                name="paymentMethod"
                value={paymentMethod}
                label="PayPal or Credit Card"
                onChange={handlePaymentMethodChange}
                checked
              />
            </Form.Group>
            <Button className="btn__secondary" type="submit">
              Continue
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </FormContainer>
  );
}
