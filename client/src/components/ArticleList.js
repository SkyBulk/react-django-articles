import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "@reach/router";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(async () => {
    const { data } = await axios.get("http://127.0.0.1:8000/api");
    setArticles(data);
  }, []);

  return (
    <div>
      {articles.map((article, i) => (
        <div key={article.id} style={{ margin: "2em" }}>
          <Link to={`/${article.id}`}>
            <h3>{article.title}</h3>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;
