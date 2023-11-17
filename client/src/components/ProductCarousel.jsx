import { Carousel, Image } from "react-bootstrap";
import { useGetTopProductsQuery } from "../features/productsApiSlice";
import { Link } from "react-router-dom";

export default function ProductCarousel() {
  const { data: products, isLoading } = useGetTopProductsQuery();

  return (
    !isLoading && (
      <Carousel
        pause="hover"
        controls={false}
        indicators={false}
        className="mb-3 bg-secondary"
        touch={true}>
        {products.map((product) => (
          <Carousel.Item key={product._id}>
            <Link
              to={`/product/${product._id}`}
              className="text-decoration-none">
              <Image src={product.image} alt={product.name} fluid />
              <Carousel.Caption className="carousel__caption d-block d-xxl-none">
                <h3>{product.name}</h3>
                <p className="text-truncate px-2">{product.description}</p>
              </Carousel.Caption>
              <div className="position-absolute top-50 end-0 translate-middle-y text-white p-5 w-50 d-none d-xxl-block">
                <h1 class="display-6">{product.name}</h1>
                <p className="lead">{product.description}</p>
              </div>
            </Link>
          </Carousel.Item>
        ))}
      </Carousel>
    )
  );
}
