import * as React from "react";
import { ListGroup, Navbar, Button } from "react-bootstrap";
import "../styles/LeftMenu.css";
import {getTests} from "../util/APIUtils";
import { Link } from "react-router-dom";
import {HOME_URL} from "../config";

export default class LeftMenu extends React.Component {
  state = {
    data: []
  };

  handleMenuClick = (id) => {
    localStorage.setItem("selectedTest", id);
    this.props.updateTestID();
  };

  componentDidMount = () => {
    getTests().then(response => {
      if (response[0] == null) {
        this.props.history.push("/addTest");
      } else {
        if (!localStorage.getItem("selectedTest")) {
          localStorage.setItem("selectedTest", response[response.length - 1].id);
        }
        this.props.updateTestID();
      }
      this.setState({ data: response });
    });
  };

  createLink = () => {
      const el = document.createElement('textarea');
      el.value = HOME_URL + "/begin?test=" + localStorage.getItem("selectedTest");
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      alert("Ссылка скопирована в буфер обмена")
  };

  render() {
    const listItems = this.state.data.map(item => (
      <ListGroup.Item
        className="text-center"
        key={item.name}
        action
        onClick={() => this.handleMenuClick(item.id)}
      >
        {item.name}
      </ListGroup.Item>
    ));
    if (this.props.location.pathname === "/admin" ||
        this.props.location.pathname === "/addTest" ||
        this.props.location.pathname === "/results" ||
        this.props.location.pathname === "/addQuestion" ||
        this.props.location.pathname === "/editQuestion") {
      return (
          <Navbar className="navbar-fixed-left flex-column float-left">
            <div className="manage-books-button">
              <Button onClick={this.createLink}>Создать ссылку</Button>
            </div>
            <Link to="/addTest">
              <div className="manage-books-button">
                <Button>Добавить тест</Button>
              </div>
            </Link>
            <ListGroup variant="flush" className="border">
              {listItems}
            </ListGroup>
          </Navbar>
      );
    }
    else {
      return null;
    }
  }
}
