import React, { useCallback } from "react";
import Link from "next/link";
import useInput from "../hooks/useInput";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import { Menu, Input, Row, Col } from "antd";
import styled from "styled-components";

import { createGlobalStyle } from "styled-components";

import UserProfile from "../components/UserProfile";
import LogInForm from "../components/LogInForm";
import Router from "next/router";

const Global = createGlobalStyle`
body {
  background-color: #EFEFEF !important;
  color:#0A1931  !important;
}
.ant-menu, .ant-menu a{
  background-color: #0A1931 !important;
  color: #EFEFEF !important;
}

.ant-menu #brand {
  font-weight:bold !important;
  color: #FFC947  !important;
}
.ant-row {
    margin-right: 0 !important;
    margin-left: 0 !important;
}

.ant-col:first-child {
    padding-left: 0 !important;
}


.ant-col:last-child {
    padding-right: 0 !important;
}

.ant-btn-primary { 
  background-color: #185ADB !important;
  border: none !important;
}

.ant-btn-primary:hover {
  background-color: #39A2DB !important;
}
`;

const SearchInput = styled(Input.Search)`
  vertical-align: middle;
`;

const Applayout = ({ children }) => {
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { me } = useSelector((state) => state.user);

  const [searchInput, onChangeSearchInput] = useInput("");

  const onSearch = useCallback(() => {
    Router.push(`/hashtag/${searchInput}`);
  }, [searchInput]);

  return (
    <div>
      <Global />
      <Menu mode="horizontal">
        <Menu.Item>
          <Link href="/">
            <a id="brand">WE:SOODA</a>
          </Link>
        </Menu.Item>
        <Menu.Item>
          <Link href="/profile">
            <a>Profile</a>
          </Link>
        </Menu.Item>

        <Menu.Item>
          <Link href="/book/popular">
            <a>BestSellers of the Week</a>
          </Link>
        </Menu.Item>

        <Menu.Item>
          <SearchInput
            style={{ verticalAlign: "middle" }}
            placeholder="Search #tags"
            enterButton
            value={searchInput}
            onChange={onChangeSearchInput}
            onSearch={onSearch}
          />
        </Menu.Item>
      </Menu>
      <Row gutter={8}>
        <Col xs={24} md={6}>
          {/* {isLoggedIn ? <UserProfile setIsLoggedIn = {setIsLoggedIn}/> : <LogInForm setIsLoggedIn={setIsLoggedIn}/>} */}
          {me ? <UserProfile /> : <LogInForm />}
        </Col>
        <Col xs={24} md={14}>
          {children}
        </Col>
        <Col xs={24} md={4}>
          <h3>Want to get more books? </h3>
          <ul>
            <li>
              <a
                href="https://amazon.com/books-used-books-textbooks"
                target="_blank"
                rel="noreferrer noopener"
              >
                Amazon
              </a>
            </li>
            <li>
              <a
                href="https://aladin.co.kr"
                target="_blank"
                rel="noreferrer noopener"
              >
                
                Aladin(Kor)
              </a>
            </li>
          </ul>
        </Col>
      </Row>
    </div>
  );
};

Applayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Applayout;
