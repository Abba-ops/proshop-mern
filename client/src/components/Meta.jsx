import React from "react";
import { Helmet } from "react-helmet-async";

export default function Meta({ title, description, keywords }) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
    </Helmet>
  );
}

Meta.defaultProps = {
  title: "ProShop - Your One-Stop Shop for Electronics and Gadgets",
  description:
    "Discover the latest and best-priced electronics and gadgets at ProShop.",
  keywords:
    "electronics, gadgets, online shopping, best prices, quality products",
};
