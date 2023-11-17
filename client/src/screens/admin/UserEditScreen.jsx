import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Card, Form } from "react-bootstrap";
import FormContainer from "../../components/FormContainer";
import Loader from "../../components/Loader";
import { FaArrowLeft } from "react-icons/fa6";
import { toast } from "react-toastify";
import {
  useGetUserDetailsQuery,
  useUpdateUserMutation,
} from "../../features/usersApiSlice";
import { useSelector } from "react-redux";

export default function UserEditScreen() {
  const { id: userId } = useParams();
  const navigate = useNavigate();
  const { userInfo } = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    isAdmin: false,
  });

  const { data: user, refetch, isLoading } = useGetUserDetailsQuery(userId);
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();

  useEffect(() => {
    if (user) {
      const { email, isAdmin, lastName, firstName } = user;
      setUserData({ email, isAdmin, lastName, firstName });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setUserData((prevUserData) => ({ ...prevUserData, [name]: checked }));
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (userInfo._id === userId) {
      toast.error("Cannot update admin user");
      return;
    }

    try {
      await updateUser({ userId, ...userData });
      toast.success("User updated successfully");
      refetch();
      navigate("/admin/userlist");
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to="/admin/userlist" className="my-3">
        <Button className="my-3 btn__secondary">
          <FaArrowLeft /> Go Back
        </Button>
      </Link>
      <FormContainer>
        <Card className="border-0 p-3 mt-4">
          <Card.Body>
            <Card.Title>Edit User Information</Card.Title>
            {isLoading ? (
              <Loader />
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter first name"
                    name="firstName"
                    value={userData.firstName}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter last name"
                    name="lastName"
                    value={userData.lastName}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={userData.email}
                    onChange={handleInputChange}
                  />
                </Form.Group>

                <Form.Group>
                  <Form.Check
                    type="checkbox"
                    label="Is Admin"
                    name="isAdmin"
                    checked={userData.isAdmin}
                    onChange={handleCheckboxChange}
                  />
                </Form.Group>

                <Button
                  type="submit"
                  className="my-2 btn__secondary"
                  disabled={isUpdating}>
                  {isUpdating ? "Updating..." : "Update"}
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </FormContainer>
    </>
  );
}
