import React from "react";
import Head from "next/head";
import axios from "axios";
import useSWR from "swr";

import Applayout from "../../components/Applayout";
import { backUrl } from "../../config/config";
import BestSeller from "../../components/BestSeller";

const fetcher = (url) =>
  axios.get(url, { withCredentials: true }).then((result) => result.data); //configuration for SWR

const PopularBooks = () => {
  const { data: popularBooksData, error: popularBooksError } = useSWR(
    `${backUrl}/book/popular`,
    fetcher
  );
  if (popularBooksError) {
    console.error(popularBooksError);
    return "Error occured while fetching popular book data";
    //reminder
    //return cannot be placed above hooks
    //the same number of hooks must be ran every time
  }

  return (
    <>
      <Head>
        <meta charSet="utf-8" />
        <title>Bestsellers - WeSoodaa</title>
      </Head>
      <Applayout>
        <div style={{ margin: 15 }}>
          <h1>TOP 15 BESTSELLERS (in Fiction, this week)</h1>
          <h3>Source: New York Times</h3>
          {popularBooksData &&
            popularBooksData.map((book) => (
              <BestSeller bestseller={book} key={book.rank} />
            ))}
        </div>
      </Applayout>
    </>
  );
};

export default PopularBooks;
