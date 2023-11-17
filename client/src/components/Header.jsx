import React from "react";
import {
  Badge,
  Container,
  Nav,
  NavDropdown,
  Navbar,
  Stack,
} from "react-bootstrap";
import { FaUser } from "react-icons/fa";
import { MdShoppingCart } from "react-icons/md";
import { LinkContainer } from "react-router-bootstrap";
import logo from "../assets/logo.png";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearCredentials } from "../features/authSlice";
import { useLogoutMutation } from "../features/usersApiSlice";
import { toast } from "react-toastify";
import { clearCartItems, clearShippingAddress } from "../features/cartSlice";
import SearchBox from "./SearchBox";

const Header = () => {
  const { cartItems } = useSelector((state) => state.cart);
  const { userInfo } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logout] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logout().unwrap();
      dispatch(clearCartItems());
      dispatch(clearCredentials());
      dispatch(clearShippingAddress());
      toast.success("Happy Shopping! Goodbye!");
      navigate("/");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header>
      <Navbar
        expand="lg"
        data-bs-theme="dark"
        style={{ backgroundColor: "#4a90e2" }}
        collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>
              <img src={logo} alt="logo" />
              ProShop
            </Navbar.Brand>
          </LinkContainer>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto fs-6">
              <SearchBox />
              <LinkContainer to="/cart">
                <Nav.Link>
                  <Stack direction="horizontal" gap={2}>
                    <span>
                      <MdShoppingCart /> Cart
                    </span>
                    {cartItems.length > 0 && (
                      <Badge pill bg="secondary">
                        {cartItems.reduce((acc, item) => acc + item.qty, 0)}
                      </Badge>
                    )}
                  </Stack>
                </Nav.Link>
              </LinkContainer>
              {userInfo && !userInfo.isAdmin && (
                <>
                  <NavDropdown title={userInfo.firstName} id="username">
                    <LinkContainer to="/profile">
                      <NavDropdown.Item>Profile</NavDropdown.Item>
                    </LinkContainer>
                    <NavDropdown.Item onClick={logoutHandler}>
                      Logout
                    </NavDropdown.Item>
                  </NavDropdown>
                </>
              )}
              {!userInfo && (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo && userInfo.isAdmin && (
                <NavDropdown title="Admin">
                  <LinkContainer to="/admin/productlist">
                    <NavDropdown.Item>Products</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/userlist">
                    <NavDropdown.Item>Users</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/admin/orderlist">
                    <NavDropdown.Item>Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Item onClick={logoutHandler}>
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
