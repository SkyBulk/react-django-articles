import React, { useState, useEffect } from "react";
import axios from "axios";

const ArticleList = () => {
  const [articles, setArticles] = useState([]);

  useEffect(async () => {
    const { data } = await axios.get("/api");
    setArticles(data);
  }, []);

  return (
    <div>
      {articles.map((article, i) => (
        <div key={i} style={{ margin: "2em" }}>
          <h3>{article.title}</h3>
          <p>{article.content}</p>
        </div>
      ))}
    </div>
  );
};

export default ArticleList;