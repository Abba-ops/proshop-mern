import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useUpdateProductMutation,
  useUploadProductImageMutation,
} from "../../features/productsApiSlice";
import { FaArrowLeft } from "react-icons/fa6";
import FormContainer from "../../components/FormContainer";
import { Button, Card, Form } from "react-bootstrap";
import Loader from "../../components/Loader";
import { toast } from "react-toastify";

export default function ProductEditScreen() {
  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [countInStock, setCountInStock] = useState(0);
  const [description, setDescription] = useState("");

  const { data: product, isLoading } = useGetProductDetailsQuery(productId);

  const [updateProduct, { isLoading: loadingUpdate }] =
    useUpdateProductMutation();

  const navigate = useNavigate();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setImage(product.image);
      setBrand(product.brand);
      setPrice(product.price);
      setCategory(product.category);
      setDescription(product.description);
      setCountInStock(product.countInStock);
    }
  }, [product]);

  const [uploadProductImage, { isLoading: loadingUpload }] =
    useUploadProductImageMutation();

  const submitHandler = async (e) => {
    e.preventDefault();
    const updatedProduct = {
      productId,
      name,
      brand,
      category,
      countInStock,
      description,
      price,
      image,
    };
    const result = await updateProduct(updatedProduct);
    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Product updated successfully");
      navigate("/admin/productlist");
    }
  };

  const uploadFileHandler = async (e) => {
    const formData = new FormData();
    formData.append("image", e.target.files[0]);
    try {
      const res = await uploadProductImage(formData).unwrap();
      toast.success(res.message);
      setImage(res.image);
    } catch (error) {
      toast.error(error?.data?.message || error.error);
    }
  };

  return (
    <>
      <Link to={"/admin/productlist"} className="my-3">
        <Button className="my-3 btn__secondary">
          <FaArrowLeft /> Go Back
        </Button>
      </Link>
      <FormContainer>
        {loadingUpload && <Loader />}
        {loadingUpdate && <Loader />}
        <Card className="border-0 p-3 mt-4">
          <Card.Body>
            <Card.Title>Edit Product Information</Card.Title>
            {isLoading ? (
              <Loader />
            ) : (
              <Form onSubmit={submitHandler}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Price</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter product price"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group controlId="image" className="my-2">
                  <Form.Label>Product Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product image URL"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}></Form.Control>
                  <Form.Control type="file" onChange={uploadFileHandler} />{" "}
                </Form.Group>
                {loadingUpdate && <Loader />}
                <Form.Group controlId="brand" className="mb-3">
                  <Form.Label>Product Brand</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product brand"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Count in Stock</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter product count in stock"
                    value={countInStock}
                    onChange={(e) =>
                      setCountInStock(e.target.value)
                    }></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Category</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product category"
                    value={category}
                    onChange={(e) =>
                      setCategory(e.target.value)
                    }></Form.Control>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Product Description</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter product description"
                    value={description}
                    onChange={(e) =>
                      setDescription(e.target.value)
                    }></Form.Control>
                </Form.Group>
                <Button type="submit" className="my-2 btn__secondary">
                  {loadingUpdate ? "Updating..." : "Update Product"}
                </Button>
              </Form>
            )}
          </Card.Body>
        </Card>
      </FormContainer>
    </>
  );
}
