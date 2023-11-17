import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import Loader from "../../components/Loader";
import { FaTimes, FaTrash, FaEdit, FaCheck } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";
import {
  useDeleteUserMutation,
  useGetUsersQuery,
} from "../../features/usersApiSlice";
import { toast } from "react-toastify";

export default function UserListScreen() {
  const { data: users, isLoading, refetch } = useGetUsersQuery();

  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(id).unwrap();
        refetch();
        toast.success("User deleted successfully");
      } catch (error) {
        console.error(error);
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      {isDeleting && <Loader />}
      {isLoading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : (
        <Card className="border-0 mt-4">
          <Card.Body>
            <Card.Title>Manage Users</Card.Title>
            <Table striped hover size="sm" responsive>
              <thead>
                <tr align="center">
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
                  <th>Email</th>
                  <th>Admin</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} align="center">
                    <td>{user._id}</td>
                    <td>{user.firstName}</td>
                    <td>{user.lastName}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "green" }} />
                      ) : (
                        <FaTimes style={{ color: "red" }} />
                      )}
                    </td>
                    <td>
                      <LinkContainer to={`/admin/user/${user._id}/edit`}>
                        <Button className="btn__primary" size="sm">
                          <FaEdit />
                        </Button>
                      </LinkContainer>
                      <Button
                        size="sm"
                        className="btn__secondary"
                        onClick={() => deleteHandler(user._id)}>
                        <FaTrash />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}
    </>
  );
}
