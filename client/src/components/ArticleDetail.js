import React, { useState, useEffect } from "react";
import axios from "axios";

const ArticleDetail = ({ articleId }) => {
  const [article, setArticle] = useState({});

  useEffect(async () => {
    const { data } = await axios.get(`http://127.0.0.1:8000/api/${articleId}`);
    console.log(data);
    setArticle(data);
  }, []);

  return (
    <div style={{ margin: "2em" }}>
      <h3>{article.title}</h3>
      <p>{article.content}</p>
    </div>
  );
};

export default ArticleDetail;
