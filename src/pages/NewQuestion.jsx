import * as React from "react";
import {Accordion, Button, Card, Form} from "react-bootstrap";
import { withRouter } from "react-router";
import ReactDOMServer from "react-dom/server";
import "../styles/NewBook.css";
import { addQuestion, getQuestion } from "../util/APIUtils";

import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import RemarkMathPlugin from "remark-math";

import SimpleMDE from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";

import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";

class NewQuestion extends React.Component {
  state = {
    title: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
    answer6: "",
    correct: [],
    markdown: null
  };

  componentDidMount = () => {
    if (this.props.questionID != null) {
      this.props.switchDone(true);
      getQuestion({ questionID: this.props.questionID }).then(response => {
        this.props.switchDone(false);
        this.setState({
          title: response.name,
          answer1: response.answerOption1,
          answer2: response.answerOption2,
          answer3: response.answerOption3,
          answer4: response.answerOption4,
          answer5: response.answerOption5,
          answer6: response.answerOption6,
          correct: response.answers,
          markdown: <NewQuestion.MarkdownRender source={response.name} />
        });

      });
    }
  };

  handleChange = (value) => {
    this.setState({ title: value });
  };

  handleChange1 = (event) => {
    const target = event.target;
    this.setState(current => ({ ...current, [target.id]: target.value }));
  };

  handleSubmit = (event) => {
    event.preventDefault();
    this.props.switchDone(true);
    addQuestion({
      id: this.props.questionID || "",
      name: this.state.title,
      test: this.props.testID,
      answerOption1: this.state.answer1.trim(),
      answerOption2: this.state.answer2.trim(),
      answerOption3: this.state.answer3.trim(),
      answerOption4: this.state.answer4.trim(),
      answerOption5: this.state.answer5.trim(),
      answerOption6: this.state.answer6.trim(),
      answers: this.state.correct
    }).then(() => {
      this.props.switchDone(false);
      this.props.history.push("/admin");
    });
  };

  onClick = (item) => {
    if (this.state.correct.includes(item)) {
      this.state.correct.splice(this.state.correct.indexOf(item), 1);
    } else {
      this.state.correct.push(item);
    }
    this.setState({});
  };

  static MarkdownRender = (props) => {
    const newProps = {
      ...props,
      plugins: [RemarkMathPlugin],
      renderers: {
        ...props.renderers,
        code: (props) => (
          <div className="Code">
            <SyntaxHighlighter language={props.language}>
              {props.value}
            </SyntaxHighlighter>
          </div>
        ),
        math: (props) => <InlineMath math={props.value} />,
        inlineMath: (props) => <InlineMath math={props.value} />
      }
    };
    return <ReactMarkdown {...newProps} />;
  };

  getClass = (id) => {
    if (this.state.correct.includes(id)) {
      return "answered";
    } else {
      return "";
    }
  };

  render() {
    return (
      <div className="newbook w-100">
        <Form onSubmit={this.handleSubmit} autoComplete="off" noValidate>
          <Form.Label className="text-center book-label" column={true}>
            Вопрос
          </Form.Label>

          <Form.Group controlId="title">
            <Form.Label column={false}>Текст</Form.Label>
            <SimpleMDE
              id="title"
              value={this.state.title}
              onChange={this.handleChange}
              options={{
                spellChecker: false,
                previewRender(text) {
                  return ReactDOMServer.renderToString(
                    <NewQuestion.MarkdownRender source={text} />
                  );
                }
              }}
            />
          </Form.Group>

          <Accordion>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="0">
                  <div className={this.getClass(1)}>
                    {(this.state.answer1 != null && this.state.answer1 !== "" && /\S/.test(this.state.answer1))  && (
                        <div>
                          {this.state.answer1}
                        </div>
                    )}
                    {(this.state.answer1 == null || this.state.answer1 === "" || !/\S/.test(this.state.answer1))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="0">
                <Card.Body>
                  <Form.Group controlId="answer1">
                    <Form.Label column={false}>Ответ 1</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={this.state.answer1}
                      onChange={this.handleChange1}
                      maxLength="254"
                    />
                    <Form.Check
                        id={this.state.answer1}
                        label={"Правильный"}
                        type="checkbox"
                        onChange={() => this.onClick(1)}
                        checked={this.state.correct.includes(1)}
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="1">
                  <div className={this.getClass(2)}>
                    {(this.state.answer2 != null && this.state.answer2 !== "" && /\S/.test(this.state.answer2))  && (
                        <div>
                          {this.state.answer2}
                        </div>
                    )}
                    {(this.state.answer2 == null || this.state.answer2 === "" || !/\S/.test(this.state.answer2))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="1">
                <Card.Body>
                  <Form.Group controlId="answer2">
                    <Form.Label column={false}>Ответ 2</Form.Label>
                    <Form.Control
                      as="textarea"
                      value={this.state.answer2}
                      onChange={this.handleChange1}
                      maxLength="254"
                    />
                    <Form.Check
                        id={this.state.answer2}
                        label={"Правильный"}
                        type="checkbox"
                        onChange={() => this.onClick(2)}
                        checked={this.state.correct.includes(2)}
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="2">
                  <div className={this.getClass(3)}>
                    {(this.state.answer3 != null && this.state.answer3 !== "" && /\S/.test(this.state.answer3))  && (
                        <div>
                          {this.state.answer3}
                        </div>
                    )}
                    {(this.state.answer3 == null || this.state.answer3 === "" || !/\S/.test(this.state.answer3))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="2">
                <Card.Body>
                  <Form.Group controlId="answer3">
                    <Form.Label column={false}>Ответ 3</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={this.state.answer3}
                        onChange={this.handleChange1}
                        maxLength="254"
                    />
                    <Form.Check
                        id={this.state.answer3}
                        label={"Правильный"}
                        type="checkbox"
                        onChange={() => this.onClick(3)}
                        checked={this.state.correct.includes(3)}
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="3">
                  <div className={this.getClass(4)}>
                    {(this.state.answer4 != null && this.state.answer4 !== "" && /\S/.test(this.state.answer4))  && (
                        <div>
                          {this.state.answer4}
                        </div>
                    )}
                    {(this.state.answer4 == null || this.state.answer4 === "" || !/\S/.test(this.state.answer4))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="3">
                <Card.Body>
                  <Form.Group controlId="answer4">
                  <Form.Label column={false}>Ответ 4</Form.Label>
                  <Form.Control
                      as="textarea"
                      value={this.state.answer4}
                      onChange={this.handleChange1}
                      maxLength="254"
                  />
                  <Form.Check
                      id={this.state.answer4}
                      label={"Правильный"}
                      type="checkbox"
                      onChange={() => this.onClick(4)}
                      checked={this.state.correct.includes(4)}
                  />
                </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="4">
                  <div className={this.getClass(5)}>
                    {(this.state.answer5 != null && this.state.answer5 !== "" && /\S/.test(this.state.answer5))  && (
                        <div>
                          {this.state.answer5}
                        </div>
                    )}
                    {(this.state.answer5 == null || this.state.answer5 === "" || !/\S/.test(this.state.answer5))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="4">
                <Card.Body>
                  <Form.Group controlId="answer5">
                    <Form.Label column={false}>Ответ 5</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={this.state.answer5}
                        onChange={this.handleChange1}
                        maxLength="254"
                    />
                    <Form.Check
                        id={this.state.answer5}
                        label={"Правильный"}
                        type="checkbox"
                        onChange={() => this.onClick(5)}
                        checked={this.state.correct.includes(5)}
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
            <Card>
              <Card.Header>
                <Accordion.Toggle as={Card.Header} eventKey="5">
                  <div className={this.getClass(6)}>
                    {(this.state.answer6 != null && this.state.answer6 !== "" && /\S/.test(this.state.answer6))  && (
                        <div>
                          {this.state.answer1}
                        </div>
                    )}
                    {(this.state.answer6 == null || this.state.answer6 === "" || !/\S/.test(this.state.answer6))  && (
                        <div>
                          Добавить вариант ответа
                        </div>
                    )}
                  </div>
                </Accordion.Toggle>
              </Card.Header>
              <Accordion.Collapse eventKey="5">
                <Card.Body>
                  <Form.Group controlId="answer6">
                    <Form.Label column={false}>Ответ 6</Form.Label>
                    <Form.Control
                        as="textarea"
                        value={this.state.answer6}
                        onChange={this.handleChange1}
                        maxLength="254"
                    />
                    <Form.Check
                        id={this.state.answer6}
                        label={"Правильный"}
                        type="checkbox"
                        onChange={() => this.onClick(6)}
                        checked={this.state.correct.includes(6)}
                    />
                  </Form.Group>
                </Card.Body>
              </Accordion.Collapse>
            </Card>
          </Accordion>
          <br/>
          <Button variant="primary" type="submit">
            Применить
          </Button>
        </Form>
      </div>
    );
  }
}

export default withRouter(NewQuestion);
