import * as React from "react";
import { Form, Button } from "react-bootstrap";
import { withRouter } from "react-router";
import "../styles/Test.css";
import { sendAnswers } from "../util/APIUtils";
import Timer from "../components/Timer";
import Paging from "../components/Paging";

import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";

class Test extends React.Component {
  state = {
    title: "",
    answer1: "",
    answer2: "",
    answer3: "",
    answer4: "",
    answer5: "",
    answer6: "",
    numberOfQuestions: "",
    radio: [],
    ended: false,
    isMultipleChoice: false,
    mustShowNextButton: true
  };

  componentDidMount = () => {
    if (localStorage.getItem("testData")) {
        let testData = JSON.parse(localStorage.getItem("testData") || "");
        let question =
            testData.questions[localStorage.getItem("selectedQuestion") || 0];
        if (
            !(
                Number(testData.numberOfQuestions) >
                Number(localStorage.getItem("selectedQuestion") || 0) + 1
            )
        ) {
          this.setState({
            mustShowNextButton: false
          });
        } else {
          this.setState({
            mustShowNextButton: true
          });
        }
        this.setState({
          title: question.name,
          answer1: question.answerOption1,
          answer2: question.answerOption2,
          answer3: question.answerOption3,
          answer4: question.answerOption4,
          answer5: question.answerOption5,
          answer6: question.answerOption6,
          numberOfQuestions: testData.numberOfQuestions,
          radio: question.answers,
          isMultipleChoice: question.multipleChoice
        });
    }
  };

  onClick = (item) => {
    if (this.state.isMultipleChoice) {
      if (this.state.radio.includes(item.currentTarget.id)) {
        this.state.radio.splice(this.state.radio.indexOf(item.currentTarget.id), 1);
      } else {
        this.state.radio.push(item.currentTarget.id);
      }
    } else {
      if(this.state.radio.length === 0) {
        this.state.radio.push(item.currentTarget.id);
      }
      else {
        let radio = this.state.radio;
        radio[0] = (item.currentTarget.id);
        this.setState({radio: radio});
      }
    }
    let testData = JSON.parse(localStorage.getItem("testData") || "");
    testData.questions[
    localStorage.getItem("selectedQuestion") || 0
        ].answers = this.state.radio;
    localStorage.setItem("testData", JSON.stringify(testData));
    this.componentDidMount();
  };

  getState = (id) => {
    return this.state.radio.includes(id);
  };

  sendData = () => {
    this.props.switchDone(true);
    let testData = JSON.parse(localStorage.getItem("testData") || "");
    sendAnswers({ test: testData.test, questions: testData.questions, token: localStorage.getItem("startToken")})
      .then(() => {
        localStorage.clear();
        localStorage.setItem("testDone", "true");
        this.props.switchDone(false);
        this.props.history.push("/begin");
      })
      .catch(() => {
        alert("Something went wrong");
        this.props.history.push("/begin");
      });
  };

  handleSubmit = (event) => {
    event.preventDefault();
    let testData = JSON.parse(localStorage.getItem("testData") || "");
    if (
      Number(testData.numberOfQuestions) >
      Number(localStorage.getItem("selectedQuestion") || 0) + 1
    ) {
      localStorage.setItem(
        "selectedQuestion",
        (+(localStorage.getItem("selectedQuestion") || 0) + 1).toLocaleString()
      );
    }
    this.componentDidMount();
  };

  renderer = (props) => {
    if (props.completed) {
      if (!this.state.ended) {
        this.setState({ended: true});
        this.sendData();
      }
      return <span/>;
    } else {
      let seconds;
      if (props.seconds <= 9) {
        seconds = "0" + props.seconds;
      } else {
        seconds = props.seconds.toString();
      }
      return (
        <span>
          {props.minutes}:{seconds}
        </span>
      );
    }
  };

  MarkdownRender = (props) => {
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

  render() {
    const dueDate = new Date(+(localStorage.getItem("dueTime") || ""));
    return (
      <div>
        {localStorage.getItem("dueTime")  && (
        <Timer
          endTest={this.sendData}
          date={dueDate}
          renderer={this.renderer}
        />
        )}
        <div className="Test">
          <Form onSubmit={this.handleSubmit} autoComplete="off" noValidate>
            <Form.Label className="text-center" column={true}>
              <this.MarkdownRender source={this.state.title} />
            </Form.Label>
            <Form.Group controlId="answer">
              {this.state.answer1 != null && this.state.answer1 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={1}
                    key={1}
                    label={this.state.answer1}
                    onChange={this.onClick}
                    checked={this.getState("1")}
                  />
                </div>
              )}
              {this.state.answer2 != null && this.state.answer2 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={2}
                    key={2}
                    label={this.state.answer2}
                    onChange={this.onClick}
                    checked={this.getState("2")}
                  />
                </div>
              )}
              {this.state.answer3 != null && this.state.answer3 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={3}
                    key={3}
                    label={this.state.answer3}
                    onChange={this.onClick}
                    checked={this.getState("3")}
                  />
                </div>
              )}
              {this.state.answer4 != null &&  this.state.answer4 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={4}
                    key={4}
                    label={this.state.answer4}
                    onChange={this.onClick}
                    checked={this.getState("4")}
                  />
                </div>
              )}
              {this.state.answer5 != null && this.state.answer5 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={5}
                    key={5}
                    label={this.state.answer5}
                    onChange={this.onClick}
                    checked={this.getState("5")}
                  />
                </div>
              )}
              {this.state.answer6 != null && this.state.answer6 !== "" && (
                <div className="radio">
                  <Form.Check
                    type={this.state.isMultipleChoice ? "checkbox" : "radio"}
                    id={6}
                    key={6}
                    label={this.state.answer6}
                    onChange={this.onClick}
                    checked={this.getState("6")}
                  />
                </div>
              )}
            </Form.Group>
            {this.state.mustShowNextButton && (
              <div className="radio">
                <Button variant="primary" type="submit">
                  Следующий вопрос
                </Button>
              </div>
            )}
          </Form>
        </div>
        {localStorage.getItem("testData")  && (
          <Paging selectQuestion={this.componentDidMount} />
        )}
      </div>
    );
  }
}

export default withRouter(Test);
