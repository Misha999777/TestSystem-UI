import * as React from "react";
import { Navbar, Button } from "react-bootstrap";
import "../styles/LeftMenu.css";
import Countdown from "react-countdown-now";

export default class Timer extends React.Component {

  end = () => {
    this.props.endTest();
  };

  render() {
    return (
      <Navbar className="navbar-fixed-left flex-column float-left">
        <Countdown date={this.props.date} renderer={this.props.renderer} />
        <div className="manage-books-button">
          <Button onClick={this.end}>Закончить тест</Button>
        </div>
      </Navbar>
    );
  }
}
