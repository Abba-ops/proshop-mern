import React from "react";
import { Button, Card, Table } from "react-bootstrap";
import { useGetOrdersQuery } from "../../features/orderApiSlice";
import Loader from "../../components/Loader";
import { FaTimes, FaEye } from "react-icons/fa";
import { LinkContainer } from "react-router-bootstrap";

export default function AdminOrderListScreen() {
  const { data: orders, isLoading } = useGetOrdersQuery();

  return (
    <>
      {isLoading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : (
        <Card className="border-0 mt-4">
          <Card.Body>
            <Card.Title>Orders List for Admin</Card.Title>
            <Table striped hover size="sm" responsive>
              <thead>
                <tr align="center">
                  <th>ID</th>
                  <th>First Name</th>
                  <th>Last Name</th>
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
                    <td>{order.user && order.user.firstName}</td>
                    <td>{order.user && order.user.lastName}</td>
                    <td>{order.createdAt.substring(0, 10)}</td>
                    <td>${order.totalPrice}</td>
                    <td>
                      {order.isPaid ? (
                        order.paidAt.substring(0, 10)
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
      )}
    </>
  );
}
