import React from "react";
import { useGetProductsQuery } from "../features/productsApiSlice";
import Product from "../components/Product";
import Message from "../components/Message";
import { Button, Col, Row } from "react-bootstrap";
import Loader from "../components/Loader";
import { Link, useParams } from "react-router-dom";
import Paginate from "../components/Paginate";
import { FaArrowLeft } from "react-icons/fa6";
import ProductCarousel from "../components/ProductCarousel";
import Meta from "../components/Meta";

export default function HomeScreen() {
  const { pageNumber, keyword } = useParams();
  const { data, isLoading, error } = useGetProductsQuery({
    keyword,
    pageNumber,
  });

  return (
    <>
      {!keyword && <ProductCarousel />}
      {isLoading ? (
        <div className="mt-4">
          <Loader />
        </div>
      ) : error ? (
        <Message variant="danger">Failed to Load Products</Message>
      ) : (
        <>
          <Meta title={"Welcome to ProShop"} />
          <h2>Latest Products</h2>
          {keyword && (
            <Link to="/" className="my-3">
              <Button className="my-3 btn__secondary">
                <FaArrowLeft /> Back to Latest
              </Button>
            </Link>
          )}
          <Row>
            {data.products.map((product) => (
              <Col key={product._id} xs={12} sm={12} md={6} lg={4} xl={3}>
                <Product product={product} />
              </Col>
            ))}
          </Row>
          <Paginate
            pages={data.pages}
            page={data.page}
            keyword={keyword ? keyword : ""}
          />
        </>
      )}
    </>
  );
}
