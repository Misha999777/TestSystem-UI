import * as React from "react";
import {Component} from "react";
import "../styles/Login.css";
import {beginTest} from "../util/APIUtils";
import {Alert} from "react-bootstrap";

export default class Begin extends Component {

    state = {
        starting: false,
        alreadyDone: false
    }

    componentDidMount = async () => {
        let search = window.location.search;
        let params = new URLSearchParams(search);
        let test = params.get("test");

        if (test) {
            localStorage.setItem("testToStart", test);
        } else {
            test = localStorage.getItem("testToStart");
        }
        await this.props.authService.loadUser();
        if (test && this.props.authService.isLoggedIn) {
            this.props.switchDone(true);
            this.setState({starting: true});
            beginTest(test)
                .then(response => {
                    this.props.switchDone(false);
                    localStorage.removeItem("testToStart");
                    localStorage.removeItem("testDone");
                    localStorage.setItem("testData", JSON.stringify(response));
                    let date = Date.now() + response.duration * 60000;
                    localStorage.setItem("dueTime", "" + date);
                    localStorage.setItem("selectedQuestion", "0");
                    this.props.history.push("/test");
                })
                .catch(() => {
                    this.setState({alreadyDone: true, starting: false});
                    this.props.switchDone(false);
                });
        }
    };

    render() {
        if (this.state.starting) {
            return (
                <div>
                    <Alert variant="success">
                        <Alert.Heading>Подожите</Alert.Heading>
                        <p>
                            Запуск теста...
                        </p>
                        <hr/>
                    </Alert>
                </div>
            );
        } else if (this.state.alreadyDone) {
            return (
                <div>
                    <Alert variant="danger">
                        <Alert.Heading>Ошибка</Alert.Heading>
                        <p>
                            Вы уже написали этот тест
                        </p>
                        <hr/>
                    </Alert>
                </div>
            );
        }
        else if(localStorage.getItem("testDone")) {
            return (
                <div>
                    <Alert variant="success">
                        <Alert.Heading>Спасибо</Alert.Heading>
                        <p>
                            Результат теста сохранен
                        </p>
                        <hr/>
                    </Alert>
                </div>
            );
        } else {
            return (
                <div>
                    <Alert variant="danger">
                        <Alert.Heading>Ошибка</Alert.Heading>
                        <p>
                            Вы не можете создать тест, так как не являетесь администратором, если вы хотите пройти тест,
                            попросите у преподавателя ссылку на него
                        </p>
                        <hr/>
                    </Alert>
                </div>
            );
        }
    }

}
