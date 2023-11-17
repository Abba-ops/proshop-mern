import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useRegisterMutation } from "../features/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { setCredentials } from "../features/authSlice";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";

export default function RegisterScreen() {
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validated, setValidated] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [register, { isLoading }] = useRegisterMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!password || !email || !firstName || !lastName || !confirmPassword) {
      toast.error("Please fill in all required fields");
    } else if (password !== confirmPassword) {
      toast.error("Passwords don't match");
    } else {
      try {
        const res = await register({
          email,
          password,
          lastName,
          firstName,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success(`Welcome aboard, ${res.firstName}!`);
        navigate(redirect);
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
    setValidated(true);
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const toggleConfirmationVisibility = () => {
    setShowConfirmPassword((prev) => !prev);
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  return (
    <FormContainer>
      <Card className="border-0 mt-4 p-3">
        <Card.Body>
          <Card.Title>Create a New Account</Card.Title>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    required
                    id="firstName"
                    type="text"
                    value={firstName}
                    placeholder="First Name"
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid first name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="Last Name"
                    onChange={(e) => setLastName(e.target.value)}
                    value={lastName}
                    id="lastName"
                  />
                  <Form.Control.Feedback type="invalid">
                    Please provide a valid last name.
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                type="email"
                value={email}
                placeholder="Email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="password">Create a Password</Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      required
                      id="password"
                      value={password}
                      type={showPassword ? "text" : "password"}
                      className="pe-5"
                      placeholder="Password"
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid password.
                    </Form.Control.Feedback>
                    <div
                      onClick={togglePasswordVisibility}
                      className={`position-absolute top-50 start-100 translate-middle fs-4 pe-5 ${
                        validated ? "d-none" : ""
                      }`}>
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </div>
                  </div>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label htmlFor="confirmPassword">
                    Confirm Password
                  </Form.Label>
                  <div className="position-relative">
                    <Form.Control
                      required
                      id="confirmPassword"
                      className="pe-5"
                      value={confirmPassword}
                      placeholder="Confirm password"
                      type={showConfirmPassword ? "text" : "password"}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    <div
                      onClick={toggleConfirmationVisibility}
                      className={`position-absolute top-50 start-100 translate-middle fs-4 pe-5 ${
                        validated ? "d-none" : ""
                      }`}>
                      {showConfirmPassword ? (
                        <AiFillEyeInvisible />
                      ) : (
                        <AiFillEye />
                      )}
                    </div>
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid confirmation password.
                    </Form.Control.Feedback>
                  </div>
                </Form.Group>
              </Col>
              <Form.Text id="passwordHelpBlock" muted>
                Password should be at least 8 characters long and include
                uppercase, lowercase, and numbers.
              </Form.Text>
            </Row>
            <div className="mb-3">
              <Button
                type="submit"
                className="w-100 btn__secondary"
                disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Register"}
              </Button>
            </div>
            <Row>
              <Col>
                Already have an account?{" "}
                <Link to={redirect ? `/login?redirect=${redirect}` : "/login"}>
                  Log In
                </Link>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </FormContainer>
  );
}
