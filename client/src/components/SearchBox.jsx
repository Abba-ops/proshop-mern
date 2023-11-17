import { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

export default function SearchBox() {
  const navigate = useNavigate();
  const { keyword: urlKeyword } = useParams();
  const [keyword, setKeyword] = useState(urlKeyword || "");

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/search/${keyword}`);
      setKeyword("");
    } else {
      navigate("/");
    }
  };

  return (
    <Form onSubmit={submitHandler} className="d-flex">
      <Form.Control
        type="search"
        name="query"
        onChange={(e) => setKeyword(e.target.value)}
        value={keyword}
        placeholder="Search Products"
        className="mr-sm-2 ml-sm-5 bg-secondary border-0"
      />
      <Button type="submit" variant="secondary" className="p-2 mx-2">
        Search
      </Button>
    </Form>
  );
}
