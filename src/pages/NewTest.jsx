import * as React from "react";
import { Button, Form } from "react-bootstrap";
import { withRouter } from "react-router";
import "../styles/NewBook.css";
import { addTest } from "../util/APIUtils";

class NewApp extends React.Component {
  state = {
    title: "",
    duration: "",
    number: ""
  };

  componentDidMount = () => {
    this.props.switchDone(false);
  };

  handleChange = (event) => {
    const target = event.target;
    this.setState(current => ({ ...current, [target.id]: target.value }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.switchDone(true);
    addTest({
      name: this.state.title,
      duration: this.state.duration,
      numberOfQuestions: this.state.number
    }).then(() => {
      localStorage.removeItem("selectedTest");
      this.props.switchDone(false);
      this.props.updateLeftMenu();
    });
  };

  render() {
    return (
      <div className="newbook w-100">
        <Form onSubmit={this.handleSubmit} autoComplete="off" noValidate>
          <Form.Label className="text-center book-label" column={true}>
            Новый тест
          </Form.Label>

          <Form.Group controlId="title">
            <Form.Label column={false}>Название</Form.Label>
            <Form.Control type="text" onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="number">
            <Form.Label column={false}>Количество вопросов</Form.Label>
            <Form.Control type="text" onChange={this.handleChange} />
          </Form.Group>

          <Form.Group controlId="duration">
            <Form.Label column={false}>Продолжительность теста</Form.Label>
            <Form.Control type="text" onChange={this.handleChange} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Создать
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(NewApp);
