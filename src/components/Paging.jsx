import * as React from "react";
import { Pagination } from "react-bootstrap";
import "../styles/Paging.css";

export default class Paging extends React.Component {
  state = {
    data: []
  };

  handleMenuClick = (id) => {
    localStorage.setItem("selectedQuestion", id.toLocaleString());
    this.props.selectQuestion();
    this.forceUpdate();
  };

  getClass = (id) => {
    let testData = JSON.parse(localStorage.getItem("testData") || "");
    let answers = testData.questions[id].answers;
    if (id === localStorage.getItem("selectedQuestion")) {
      return "selected";
    } else if (answers.length !== 0) {
      return "answered";
    } else {
      return "wrong";
    }
  };

  componentDidMount() {
    let testData = JSON.parse(localStorage.getItem("testData") || "");
    this.setState({ data: testData.questions });
  }

  render() {
    const listItems = this.state.data.map(item => (
      <Pagination.Item
        key={item.name}
        action
        onClick={() => this.handleMenuClick(this.state.data.indexOf(item))}
      >
        <div className={this.getClass(this.state.data.indexOf(item))}>
          {this.state.data.indexOf(item) + 1}
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
