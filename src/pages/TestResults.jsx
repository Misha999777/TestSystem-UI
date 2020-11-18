import * as React from "react";
import { Form } from "react-bootstrap";
import { withRouter } from "react-router";
import "../styles/Test.css";
import * as Utils from "../util/APIUtils";

import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import "katex/dist/katex.min.css";
import { InlineMath } from "react-katex";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import ResultsPaging from "../components/ResultsPaging";
import "../styles/Paging.css";

class TestResults extends React.Component {
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
    radio1: [],
    isMultipleChoice: false,
    currentQuestion: 0,
    data: null
  };

  componentDidMount = () => {
    this.getData({ testSession: this.props.testSessionId });
  };

  getData = (getBooksRequest) => {
    this.props.switchDone(true);
    Utils.getResultsData(getBooksRequest).then(response => {
      for (let i = 0; i < response.length; i++) {
        const item = response[i];
        let radio = [];
        for (let i = 0; i < item.answers.length; i++) {
          radio.push(item.answers[i].answer);
        }
        let radio1 = [];
        for (let i = 0; i < item.question.answers.length; i++) {
          radio1.push(item.question.answers[i].answer);
        }
        response[i].answers = radio;
        response[i].question.answers = radio1;
      }
      this.props.switchDone(false);
      const item = response[this.state.currentQuestion];
      if(item === undefined) {
        this.props.history.push("/admin");
        return;
      }
      this.setState({
        data: response,
        title: item.question.name,
        answer1: item.question.answerOption1,
        answer2: item.question.answerOption2,
        answer3: item.question.answerOption3,
        answer4: item.question.answerOption4,
        answer5: item.question.answerOption5,
        answer6: item.question.answerOption6,
        numberOfQuestions: response.size,
        radio: item.answers,
        radio1: item.question.answers
      });
    });
  };

  select = (selectedQuestion) => {
    this.setState({ currentQuestion: selectedQuestion });
    this.componentDidMount();
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

  getClass = (id, answer) => {
    if(this.state.radio1.includes(id)) {
      return <div className="answered">{answer}</div>;
    }
    else {
      return <div>{answer}</div>;
    }
  };

  render() {
    return (
      <div>
        <div className="Test">
          <Form autoComplete="off" noValidate>
            <Form.Label className="text-center" column={true}>
              <this.MarkdownRender source={this.state.title} />
            </Form.Label>
            <Form.Group controlId="answer">
              {this.state.answer1 != null && this.state.answer1 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer1}
                    label={this.getClass(1, this.state.answer1)}
                    disabled
                    checked={this.state.radio.includes(1)}
                  />
                </div>
              )}
              {this.state.answer2 != null && this.state.answer2 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer2}
                    label={this.getClass(2, this.state.answer2)}
                    disabled
                    checked={this.state.radio.includes(2)}
                  />
                </div>
              )}
              {this.state.answer3 != null && this.state.answer3 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer3}
                    label={this.getClass(3, this.state.answer3)}
                    disabled
                    checked={this.state.radio.includes(3)}
                  />
                </div>
              )}
              {this.state.answer4 != null && this.state.answer4 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer4}
                    label={this.getClass(4, this.state.answer4)}
                    disabled
                    checked={this.state.radio.includes(4)}
                  />
                </div>
              )}
              {this.state.answer5 != null && this.state.answer5 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer5}
                    label={this.getClass(5, this.state.answer5)}
                    disabled
                    checked={this.state.radio.includes(5)}
                  />
                </div>
              )}
              {this.state.answer6 != null && this.state.answer6 !== "" && (
                <div className="radio">
                  <Form.Check
                    type="radio"
                    id={this.state.answer6}
                    label={this.getClass(6, this.state.answer6)}
                    disabled
                    checked={this.state.radio.includes(6)}
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </div>
        <ResultsPaging data={this.state.data} selectQuestion={this.select} />
      </div>
    );
  }
}

export default withRouter(TestResults);
