import * as React from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "react-bootstrap";
import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";

import * as Utils from "../util/APIUtils";

import "../styles/ManageBooks.css";

export default class ManageTest extends React.Component {
  state = {
    data: [],
    data1: [],
    options: Object(),
    options1: Object(),
    selectRowProp: Object(),
    title: "",
    duration: "",
    number: ""
  };

  getMeta = (getBooksRequest) => {
    this.props.switchDone(true);
    Utils.getMeta(getBooksRequest).then(response => {
      this.setState({
        title: response.name,
        duration: response.duration,
        number: response.numberOfQuestions
      });
    });
  };

  componentDidMount = () => {
    if(!localStorage.getItem("selectedTest")) {
      this.props.history.push("/addTest");
    }
    else {
      if (this.props.testID != null) {
        this.getData({testID: this.props.testID});
        this.getMeta({testID: this.props.testID});
        this.getResults({testID: this.props.testID});
      }
      this.setState({
        data: [],
        selectRowProp: {
          mode: "checkbox"
        },
        options: {
          onRowClick: this.onRowClick,
          afterDeleteRow: this.onAfterDeleteRow,
          deleteBtn: this.createCustomDeleteButton
        },
        options1: {
          onRowClick: this.onRowClick1,
          afterDeleteRow: this.onAfterDeleteRow1,
          deleteBtn: this.createCustomDeleteButton1
        }
      });
    }
  };

  componentWillReceiveProps = (nextProps) => {
    if (nextProps.testID != null && nextProps.testID !== this.props.testID) {
      this.getData({ testID: nextProps.testID });
      this.getMeta({ testID: nextProps.testID });
      this.getResults({ testID: nextProps.testID });
    }
  };

  createCustomDeleteButton = (onClick) => {
    return (
      <button className="delete-books-button" onClick={onClick}>
        <Button>Удалить вопрос</Button>
      </button>
    );
  };

  createCustomDeleteButton1 = (onClick) => {
    return (
      <button className="delete-books-button" onClick={onClick}>
        <Button>Удалить результат</Button>
      </button>
    );
  };

  getData = (getBooksRequest) => {
    this.props.switchDone(true);
    Utils.getQuestions(getBooksRequest).then(response => {
      this.props.switchDone(false);
      this.setState({ data: response });
    });
  };

  getResults = (getBooksRequest) => {
    this.props.switchDone(true);
    Utils.getResults(getBooksRequest).then(response => {
      this.props.switchDone(false);
      this.setState({ data1: response });
    });
  };

  onAfterDeleteRow = (rowKeys) => {
    if(this.state.data1.length !== 0) {
      alert("Сначала вы должны удалить результаты студентов");
      this.props.switchDone(true);
      this.getData({ testID: this.props.testID });
    }
    else {
      this.props.switchDone(true);
      for (let i = 0; i < this.state.data.length; i++) {
        for (let j = 0; j < rowKeys.length; j++) {
          if (rowKeys[j] === this.state.data[i].name) {
            Utils.deleteQuestion({
              id: this.state.data[i].id
            }).then(() => {
              this.getData({testID: this.props.testID});
            });
          }
        }
      }
    }
  };

  onAfterDeleteRow1 = (rowKeys) => {
    this.props.switchDone(true);
    for (let i = 0; i < this.state.data1.length; i++) {
      for (let j = 0; j < rowKeys.length; j++) {
        if (rowKeys[j] === this.state.data1[i].name) {
          Utils.deleteResult({
            id: this.state.data1[i].id
          }).then(() => {
            this.getResults({ testID: this.props.testID });
          });
        }
      }
    }
  };

  handleChange = (event) => {
    const target = event.target;
    this.setState(current => ({ ...current, [target.id]: target.value }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.switchDone(true);
    Utils.addTest({
      id: this.props.testID,
      name: this.state.title,
      duration: this.state.duration,
      numberOfQuestions: this.state.number
    }).then(() => {
      this.props.switchDone(false);
      this.props.updateLeftMenu();
    });
  };

  onRowClick = (row) => {
    this.props.openQuestion(row.id);
  };

  onRowClick1 = (row) => {
    this.props.openResults(row.id);
  };

  onDeleteTest() {
      this.props.switchDone(true);
      Utils.deleteTest({
        id: this.props.testID
      }).then(() => {
        localStorage.removeItem("selectedTest");
        this.props.switchDone(false);
        this.props.updateLeftMenu();
      });
  }

  render() {
    return (
      <div className="manage-books-table">
        <Form onSubmit={this.handleSubmit} autoComplete="off" noValidate>
          <Form.Label className="text-center book-label" column={true}>
            Настройки теста
          </Form.Label>

          <Form.Group controlId="title">
            <Form.Label column={false}>Название</Form.Label>
            <Form.Control
              type="text"
              value={this.state.title}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="number">
            <Form.Label column={false}>Количество вопросов</Form.Label>
            <Form.Control
              type="text"
              value={this.state.number}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Form.Group controlId="duration">
            <Form.Label column={false}>Продолжительность теста</Form.Label>
            <Form.Control
              type="text"
              value={this.state.duration}
              onChange={this.handleChange}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Изменить
          </Button>
          <Button
            id={"register"}
            variant="primary"
            type="button"
            onClick={this.onDeleteTest.bind(this)}
          >
            Удалить тест
          </Button>
        </Form>

        <Link to="/addQuestion">
          <div className="add-question">
            <Button>Добавить вопрос</Button>
          </div>
        </Link>

        <BootstrapTable
          ref="table"
          data={this.state.data}
          selectRow={this.state.selectRowProp}
          deleteRow={true}
          options={this.state.options}
        >
          <TableHeaderColumn headerAlign="center" dataField="name" isKey={true}>
            Вопросы теста
          </TableHeaderColumn>
        </BootstrapTable>

        <BootstrapTable
          ref="table"
          data={this.state.data1}
          selectRow={this.state.selectRowProp}
          deleteRow={true}
          options={this.state.options1}
        >
          <TableHeaderColumn headerAlign="center" dataField="name" isKey={true}>
            Студент
          </TableHeaderColumn>
          <TableHeaderColumn
            headerAlign="center"
            dataField="score"
            isKey={false}
          >
            Результат
          </TableHeaderColumn>
          <TableHeaderColumn
            headerAlign="center"
            dataField="duration"
            isKey={false}
          >
            Время
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}
