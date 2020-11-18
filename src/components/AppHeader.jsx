import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import "../styles/AppHeader.css";

export default class AppHeader extends React.Component {
  state = {
    booksInCart: []
  };

  handleLogout = () => {
    this.props.handleLogout();
  };

  render() {
    return (
      <div className="app-header">
        <Navbar
          bg="dark"
          expand="lg"
          className="justify-content-between navbar"
        >
          <Navbar.Text>
            <h>Система тестирования</h>
          </Navbar.Text>
            <Button onClick={this.handleLogout}>Выйти</Button>
        </Navbar>
      </div>
    );
  }
}
