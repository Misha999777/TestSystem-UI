import * as React from "react";
import { Pagination } from "react-bootstrap";
import "../styles/Paging.css";

export default class ResultsPaging extends React.Component {
  state = {
    radio: [],
    radio1: [],
    selectedQuestion: 0
  };

  handleMenuClick = (id) => {
    this.props.selectQuestion(id);
    this.setState({ selectedQuestion: id });
    this.forceUpdate();
  };

  getClass = (id) => {
    let checker = (arr, target) =>
      target.every((v) => arr.includes(v));
    const item = this.props.data[id];
    if (id === this.state.selectedQuestion) {
      return "selected";
    } else if (
      checker(item.answers, item.question.answers) &&
      checker(item.question.answers, item.answers)
    ) {
      return "answered";
    } else {
      return "wrong";
    }
  };

  render() {
    if (this.props.data === null) {
      return null;
    }
    const listItems = this.props.data.map((item) => (
      <Pagination.Item
        key={item.name}
        action
        onClick={() => this.handleMenuClick(this.props.data.indexOf(item))}
      >
        <div className={this.getClass(this.props.data.indexOf(item))}>
          {this.props.data.indexOf(item) + 1}
        </div>
      </Pagination.Item>
    ));

    return (
      <div className="Paging">
        <Pagination>{listItems}</Pagination>
      </div>
    );
  }
}
