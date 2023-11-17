import { Button, Card, Col, Row, Table } from "react-bootstrap";
import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
} from "../../features/productsApiSlice";
import { FaEdit, FaTrash } from "react-icons/fa";
import Loader from "../../components/Loader";
import { LinkContainer } from "react-router-bootstrap";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";
import Paginate from "../../components/Paginate";

export default function ProductListScreen() {
  const { pageNumber } = useParams();
  const { data, isLoading, refetch } = useGetProductsQuery({ pageNumber });

  const [createProduct, { isLoading: loadingCreate }] =
    useCreateProductMutation();

  const [deleteProduct, { isLoading: loadingDelete }] =
    useDeleteProductMutation();

  const deleteHandler = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id);
        toast.success("Product deleted successfully");
        refetch();
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  const createProductHandler = async () => {
    if (window.confirm("Are you sure you want to create a new product?")) {
      try {
        await createProduct();
        refetch();
        toast.success("Sample product created");
      } catch (error) {
        toast.error(error?.data?.message || error.error);
      }
    }
  };

  return (
    <>
      <Row className="align-items-center">
        <Col className="text-end">
          <Button
            size="sm"
            onClick={createProductHandler}
            className="btn__secondary">
            Create Product
          </Button>
        </Col>
      </Row>
      {loadingCreate && <Loader />}
      {loadingDelete && <Loader />}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          <Card className="border-0 mt-4">
            <Card.Body>
              <Card.Title>Product List for Admin</Card.Title>
              <Table striped hover size="sm" responsive>
                <thead>
                  <tr align="center">
                    <th>ID</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Brand</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {data.products.map((product) => (
                    <tr key={product._id} align="center">
                      <td>{product._id}</td>
                      <td>{product.name}</td>
                      <td>${product.price}</td>
                      <td>{product.category}</td>
                      <td>{product.brand}</td>
                      <td>
                        <LinkContainer
                          to={`/admin/product/${product._id}/edit`}>
                          <Button className="btn__primary" size="sm">
                            <FaEdit />
                          </Button>
                        </LinkContainer>
                        <Button
                          size="sm"
                          className="btn__secondary"
                          onClick={() => deleteHandler(product._id)}>
                          <FaTrash />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
          <Paginate page={data.page} pages={data.pages} isAdmin={true} />
        </>
      )}
    </>
  );
}
