import { BASE_URL } from "../config";
import {AuthService} from "./AuthService";

const request = async (options) => {
  const headers = {};

  headers["Content-Type"] = "application/json";

  const authService = new AuthService();
  await authService.loadUser();
  headers["Authorization"] = "Bearer " + await authService.getToken();

  const defaults = { headers: headers };

  return fetch(options.url, { ...defaults, ...options}).then(response => {
        if (response.status === 401) {
          localStorage.clear();
          window.location.reload();
          return Promise.reject(response);
        }
        if (!(response.status === 200) && !(response.status === 201) && !(response.status === 202)) {
          return Promise.reject(response);
        }
        return response.json();
      })
  };


export function getTests() {
  return request({
    url: BASE_URL + "/test",
    method: "GET"
  });
}

export function getResultsData(req) {
  return request({
    url: BASE_URL + "/result/" + req.testSession + "/detail",
    method: "GET"
  });
}

export function getQuestions(req) {
  return request({
    url: BASE_URL + "/test/" + req.testID + "/question",
    method: "GET"
  });
}

export function getQuestion(req) {
  return request({
    url: BASE_URL + "/question/" + req.questionID,
    method: "GET"
  });
}

export function getResults(req) {
  return request({
    url: BASE_URL + "/test/" + req.testID + "/result",
    method: "GET"
  });
}

export function addTest(req) {
  return request({
    url: BASE_URL + "/test",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function deleteTest(req) {
  return request({
    url: BASE_URL + "/test/" + req.id,
    method: "DELETE",
    body: JSON.stringify(req)
  });
}

export function addQuestion(req) {
  return request({
    url: BASE_URL + "/question",
    method: "POST",
    body: JSON.stringify(req)
  });
}

export function deleteResult(req) {
  return request({
    url: BASE_URL + "/result/" + req.id,
    method: "DELETE",
    body: JSON.stringify(req)
  });
}

export function deleteQuestion(req) {
  return request({
    url: BASE_URL + "/question/" + req.id,
    method: "DELETE",
    body: JSON.stringify(req)
  });
}

export function getMeta(req) {
  return request({
    url: BASE_URL + "/test/" + req.testID,
    method: "GET"
  });
}

export function beginTest(req) {
  return request({
    url: BASE_URL + "/test/" + req + "/start",
    method: "POST"
  });
}

export function sendAnswers(req) {
  return request({
    url: BASE_URL + "/test/" + req.test + "/end",
    method: "POST",
    body: JSON.stringify(req)
  });
}
