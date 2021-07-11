import React from "react";
import PropTypes from "prop-types";

import { Card } from "antd";

const BestSeller = ({ bestseller }) => {
  return (
    <Card
      style={{ margin: 15 }}
      cover={<img alt="book cover" src={bestseller.book_image} />}
      title={`RANK ${bestseller.rank} : ${bestseller.title}`}
    >
      <b>Author</b>: {bestseller.author}
      <br />
      <b>Publisher</b>: {bestseller.publisher}
      <br />
      <b>Description</b>: {bestseller.description}
    </Card>
  );
};

BestSeller.propTypes = {
  bestseller: PropTypes.shape({
    title: PropTypes.string,
    author: PropTypes.string,
    book_image: PropTypes.string,
    description: PropTypes.string,
  }).isRequired,
};

export default BestSeller;
