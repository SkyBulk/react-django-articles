import React from "react";
import { Router } from "@reach/router";

const App = () => (
  <Router>
    <ArticleList path="/" />
    <Article path="/:articleId" />
  </Router>
);

export default App;
