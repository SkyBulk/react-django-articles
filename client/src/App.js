import React from "react";
import { Router } from "@reach/router";

import ArticleList from "./components/ArticleList";
import ArticleDetail from "./components/ArticleDetail";

const App = () => (
  <Router>
    <ArticleList path="/" />
    <ArticleDetail path=":articleId" />
  </Router>
);

export default App;
