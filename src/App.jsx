import React, { Component } from "react";
import { Route, Switch } from "react-router";
import { withRouter } from "react-router-dom";
import ReactLoading from "react-loading";
import LoadingOverlay from "react-loading-overlay";

import "./styles/App.css";

import AppHeader from "./components/AppHeader";
import LeftMenu from "./components/LeftMenu";
import ManageTest from "./pages/ManageTest";
import NewQuestion from "./pages/NewQuestion";
import Begin from "./pages/Begin";
import NewTest from "./pages/NewTest";
import Test from "./pages/Test";
import TestResults from "./pages/TestResults";
import {AuthService} from "./util/AuthService";

class App extends Component {
  state = {
    testID: null,
    questionID: null,
    resultsID: null,
    inProgress: false,
    isAdmin: false
  };

  constructor(props) {
    super(props);
    this.child = React.createRef();
    this.authService = new AuthService();
  }

  componentDidMount() {
    this.authService.loadUser().then(() => {
      if (this.authService.isLoggingIn) {
        this.authService.completeLogin().then(() => {
          this.checkLogin();
        });
      } else if (this.authService.isLoggingOut) {
        this.authService.completeLogout().then(() => {
          this.checkLogin();
        });
      } else {
        this.checkLogin();
      }
    })
  };

  checkLogin() {
    if (this.authService.isLoggedIn) {
      if (localStorage.getItem("testData")) {
        this.props.history.push("/test");
      }
      else if(this.authService.hasRole("ROLE_ADMIN")){
        this.setState({isAdmin: true});
        this.props.history.push("/admin");
      }
      else {
        this.props.history.push("/begin");
      }
    } else {
      this.authService.login();
    }
  }

  updateLeftMenu = () => {
    this.child.current.componentDidMount();
  };

  updateTestID = () => {
    this.setState({ testID: localStorage.getItem("selectedTest") });
    this.props.history.push("/admin");
  };

  setQuestionID = (questionID) => {
    this.setState({ questionID: questionID });
    this.props.history.push("/editQuestion");
  };

  setResultsID = (questionID) => {
    this.setState({ resultsID: questionID });
    this.props.history.push("/results");
  };

  switchDone = (d) => {
    this.setState({ inProgress: d });
  };

  handleLogout() {
    this.authService.logout();
  }

  render() {
    return (
      <LoadingOverlay
        styles={{
          overlay: (base) => ({
            ...base,
            background: "rgba(0, 0, 0, 0)"
          })
        }}
        active={this.state.inProgress}
        spinner={
          <div className="loader">
            <ReactLoading type={"bars"} color={"black"} />
          </div>
        }
      >
        <div className={"app-container"}>
          <AppHeader
            handleLogout={this.handleLogout.bind(this)}
          />
          <div className="d-flex">
            {this.state.isAdmin &&
                <LeftMenu
                    ref={this.child}
                    updateTestID={this.updateTestID}
                    switchDone={this.switchDone}
                    {...this.props}
                />

            }
            <div className="w-100">
              <Switch>
                <Route
                  path="/begin"
                  exact
                  render={(props) => (
                    <Begin switchDone={this.switchDone} authService={this.authService} {...props} />
                  )}
                />
                <Route
                  path="/admin"
                  exact
                  render={(props) => (
                    <ManageTest
                      updateLeftMenu={this.updateLeftMenu}
                      switchDone={this.switchDone}
                      testID={this.state.testID}
                      openQuestion={this.setQuestionID}
                      openResults={this.setResultsID}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/addQuestion"
                  exact
                  render={(props) => (
                    <NewQuestion
                      switchDone={this.switchDone}
                      {...props}
                      testID={this.state.testID}
                      questionID={null}
                    />
                  )}
                />
                <Route
                  path="/editQuestion"
                  exact
                  render={(props) => (
                    <NewQuestion
                      switchDone={this.switchDone}
                      {...props}
                      testID={this.state.testID}
                      questionID={this.state.questionID}
                    />
                  )}
                />
                <Route
                  path="/addTest"
                  exact
                  render={(props) => (
                    <NewTest
                      updateLeftMenu={this.updateLeftMenu}
                      switchDone={this.switchDone}
                      {...props}
                    />
                  )}
                />
                <Route
                  path="/test"
                  exact
                  render={(props) => (
                    <Test switchDone={this.switchDone} {...props} />
                  )}
                />
                <Route
                  path="/results"
                  exact
                  render={(props) => (
                    <TestResults
                      testSessionId={this.state.resultsID}
                      switchDone={this.switchDone}
                      {...props}
                    />
                  )}
                />
              </Switch>
            </div>
          </div>
        </div>
      </LoadingOverlay>
    );
  }
}
export default withRouter(App);
