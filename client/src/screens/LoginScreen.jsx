import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row } from "react-bootstrap";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useLoginMutation } from "../features/usersApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { setCredentials } from "../features/authSlice";
import { toast } from "react-toastify";
import FormContainer from "../components/FormContainer";

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [validated, setValidated] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { userInfo } = useSelector((state) => state.auth);

  const { search } = useLocation();
  const searchParams = new URLSearchParams(search);
  const redirect = searchParams.get("redirect") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all required fields");
    } else {
      try {
        const res = await login({ email, password }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success(`Welcome back, ${res.firstName}!`);
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

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [userInfo, redirect, navigate]);

  return (
    <FormContainer>
      <Card className="border-0 mt-4 p-3">
        <Card.Body>
          <Card.Title>Login to Your Account</Card.Title>
          <Form onSubmit={handleSubmit} noValidate validated={validated}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label>Email Address</Form.Label>
              <Form.Control
                required
                type="email"
                value={email}
                placeholder="Enter your email address"
                onChange={(e) => setEmail(e.target.value)}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email address.
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-3" controlId="password">
              <Form.Label>Password</Form.Label>
              <div className="position-relative">
                <Form.Control
                  required
                  className="pe-5"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  placeholder="Enter your password"
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={togglePasswordVisibility}
                  className={`position-absolute top-50 start-100 translate-middle fs-4 pe-5 ${
                    validated ? "d-none" : ""
                  }`}>
                  {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                </div>
                <Form.Control.Feedback type="invalid">
                  Please provide a valid password.
                </Form.Control.Feedback>
              </div>
            </Form.Group>
            <div className="mb-3">
              <Button
                type="submit"
                className="w-100 btn__secondary"
                disabled={isLoading}>
                {isLoading ? "Logging In..." : "Sign In"}
              </Button>
            </div>
            <Row>
              <Col>
                New to our store?{" "}
                <Link
                  to={
                    redirect ? `/register?redirect=${redirect}` : "/register"
                  }>
                  Create an Account
                </Link>
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </FormContainer>
  );
}
