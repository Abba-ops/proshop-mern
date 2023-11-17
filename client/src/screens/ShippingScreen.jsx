import React, { useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { saveShippingAddress } from "../features/cartSlice";
import CheckoutSteps from "../components/CheckoutSteps";
import FormContainer from "../components/FormContainer";

export default function ShippingScreen() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress?.address || "");
  const [country, setCountry] = useState(shippingAddress?.country || "");
  const [city, setCity] = useState(shippingAddress?.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress?.postalCode || ""
  );

  const handleAddressChange = (e) => setAddress(e.target.value);
  const handleCityChange = (e) => setCity(e.target.value);
  const handlePostalCodeChange = (e) => setPostalCode(e.target.value);
  const handleCountryChange = (e) => setCountry(e.target.value);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, postalCode, city, country }));
    navigate("/payment");
  };

  return (
    <FormContainer>
      <CheckoutSteps step1 step2 />
      <Card className="border-0 p-3 mt-4">
        <Card.Body>
          <Card.Title>Shipping Information</Card.Title>
          <Form onSubmit={submitHandler}>
            <Form.Group controlId="address" className="mb-3">
              <Form.Label>Street Address</Form.Label>
              <Form.Control
                type="text"
                value={address}
                placeholder="Enter your street address"
                onChange={handleAddressChange}
              />
            </Form.Group>

            <Form.Group controlId="city" className="mb-3">
              <Form.Label>City</Form.Label>
              <Form.Control
                type="text"
                value={city}
                placeholder="Enter your city"
                onChange={handleCityChange}
              />
            </Form.Group>

            <Form.Group controlId="postalCode" className="mb-3">
              <Form.Label>Postal Code</Form.Label>
              <Form.Control
                type="text"
                value={postalCode}
                placeholder="Enter your postal code"
                onChange={handlePostalCodeChange}
              />
            </Form.Group>

            <Form.Group controlId="country" className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={country}
                placeholder="Enter your country"
                onChange={handleCountryChange}
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
