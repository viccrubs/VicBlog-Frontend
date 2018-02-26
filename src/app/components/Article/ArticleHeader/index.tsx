import * as React from "react";
import { CSSProperties } from "react";
import { Article } from "../../../models";
import style from '../../style';
import { ArticleMeta } from "./ArticleMeta";

interface ArticleHeaderProps {
  article: Article
}

export class ArticleHeader extends React.Component<ArticleHeaderProps, any> {
  render() {
    const centerStyle: CSSProperties = {
      textAlign: "center"
    };

    return <div className={style("w3-container")}>
      <div style={centerStyle}>
        <h1>{this.props.article.title}</h1>
      </div>
      <div style={centerStyle}>
        <ArticleMeta article={this.props.article}/>
      </div>
    </div>;
  }
}