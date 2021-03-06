import React from "react";
import style from "../style";
import { LocaleMessage } from "../../internationalization/components";

interface ModalProps {
  shown?: boolean,
  titleId?: string,
  toggleShown?: () => void
}

export class Modal extends React.Component<ModalProps, any> {

  render() {
    const show = typeof this.props.shown == 'undefined' ? true : this.props.shown;

    return <div className={style("w3-modal")} style={{display: show ? "block" : "none"}}>
      <div className={style("w3-modal-content", "w3-card-4", "w3-animate-zoom")} style={{maxWidth: "600px"}}>
        <div className={style("w3-center", "w3-container")}>
          {this.props.toggleShown
            ? <span className={style("w3-button", "w3-xlarge", "w3-hover-red", "w3-display-topright")}
                    onClick={this.props.toggleShown}>&times;</span>
            : null}

          {this.props.titleId
            ? <h3>
              <LocaleMessage id={this.props.titleId}/>
            </h3>
            : null}

        </div>
        {this.props.children}
      </div>
    </div>;
  }
}

export class ModalBottom extends React.Component<any, any> {
  render() {
    return <div className={style("w3-container",
      "w3-cell-middle", "w3-border-top", "w3-padding", "w3-light-grey")}>
      {this.props.children}
    </div>;
  }
}
