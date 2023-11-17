import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, Row, Table } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { useProfileMutation } from "../features/usersApiSlice";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import { setCredentials } from "../features/authSlice";
import { useGetMyOrdersQuery } from "../features/orderApiSlice";
import { FaEye, FaTimes } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

export default function ProfileScreen() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [password, setPassword] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();
  const { userInfo } = useSelector((state) => state.auth);
  const [updateProfile, { isLoading: loadingUpdateProfile }] =
    useProfileMutation();
  const { data: orders, isLoading } = useGetMyOrdersQuery();

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
    } else {
      try {
        const res = await updateProfile({
          email,
          password,
          lastName,
          firstName,
          _id: userInfo._id,
        }).unwrap();
        dispatch(setCredentials({ ...res }));
        toast.success("Profile updated successfully");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFirstName(userInfo.firstName);
      setLastName(userInfo.lastName);
      setEmail(userInfo.email);
    }
  }, [userInfo]);

  return (
    <Row>
      <Col md={3}>
        <Card className="border-0 my-4">
          <Card.Body>
            <Card.Title>Edit Your Profile</Card.Title>
            <Form onSubmit={submitHandler}>
              <Form.Group controlId="firstName" className="mb-3">
                <Form.Label>First Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your first name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="lastName" className="mb-3">
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter your last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="email" className="mb-3">
                <Form.Label>Email Address</Form.Label>
                <Form.Control
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="password" className="mb-3">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  placeholder="Enter your new password"
                  value={password}
                  type={"password"}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group controlId="confirmPassword" className="mb-3">
                <Form.Label>Confirm New Password</Form.Label>
                <Form.Control
                  type={"password"}
                  placeholder="Confirm your new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" className="btn__secondary">
                {loadingUpdateProfile ? "Updating..." : "Update Profile"}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Col>
      <Col md={9}>
        {isLoading ? (
          <div className="mt-4">
            <Loader />
          </div>
        ) : orders.length === 0 ? (
          <div className="d-flex justify-content-center align-items-center h-100">
            <h3 className="display-6 text-uppercase">No Previous Orders</h3>
          </div>
        ) : (
          <>
            <Card className="border-0 mt-4">
              <Card.Body>
                <Card.Title>Order History</Card.Title>
                <Table striped responsive hover size="sm">
                  <thead>
                    <tr align="center">
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total Amount</th>
                      <th>Paid</th>
                      <th>Delivered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} align="center">
                        <td>{order._id}</td>
                        <td>{order.createdAt.substring(0, 10)}</td>
                        <td>${order.totalPrice}</td>
                        <td>
                          {order.isPaid ? (
                            order.createdAt.substring(0, 10)
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </td>
                        <td>
                          {order.isDelivered ? (
                            order.deliveredAt.substring(0, 10)
                          ) : (
                            <FaTimes style={{ color: "red" }} />
                          )}
                        </td>
                        <td>
                          <LinkContainer to={`/order/${order._id}`}>
                            <Button className="btn__primary" size="sm">
                              <FaEye />
                            </Button>
                          </LinkContainer>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </>
        )}
      </Col>
    </Row>
  );
}
