import React, {useState} from 'react';
import axios from 'axios';
import HomePage from './homePage.js';
import {Header, Sidenav} from './staticComponents';
import TagsPage from './tagsPage.js';
import RegisterUser from './registerUser.js';
import AskQuestion from './askquestion.js';
import AnswerPage from './answerPage.js';
import AnswerQuestion from './answerQuestion.js';
import Login from './loginPage.js';

axios.defaults.withCredentials = true;

export default function FakeStackOverflow({model, rendered, user, setUser}) {
  let [newModel, setNewModel] = useState(model);
  let [isVisible, setVisibility] = useState('homepage');
  let [curQuestion, setCurQuestion] = useState(newModel.data.questions[0]);
  let [searchQuery, setSearchQuery] = useState('');
  let [questions, setQuestions] = useState(newModel.data.questions);
  let [filterType, setFilterType] = useState('newest');

  function showHomePage() {
    if (isVisible !== 'homepage') DisplayNone();
    document.getElementById('tags-link').classList.remove('focus');
    document.getElementById('questions-link').classList.add('focus');
		setNewModel(newModel);
    filterType = 'newest';
    setFilterType(filterType);
    isVisible = 'homepage';
    setVisibility(isVisible);
  }

  function questionsClick() {
    showHomePage();
    searchQuery = "";
    setSearchQuery(searchQuery);
    clearInputs();
  }
  function tagsClick() {
    if (isVisible !== 'tagspage') DisplayNone();
    document.getElementById('questions-link').classList.remove('focus');
    document.getElementById('tags-link').classList.add('focus');
		setNewModel(newModel);
    isVisible = 'tagspage';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
    clearInputs();
  }
  function askQuestionClick() {
    DisplayNone();
    isVisible = 'askquestion';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
  }
  function registerUserClick() {
    DisplayNone();
    isVisible = 'registeruser';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
  }
  function loginClick() {
    DisplayNone();
    isVisible = 'login';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
  }
  function logoutClick() {
    axios.post("http://localhost:8000/logout")

    window.location.reload();
  }
  function questionClick() {
    DisplayNone();
    isVisible = 'answerspage';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
  }
  function answerQuestionClick() {
    DisplayNone();
    isVisible = 'answerquestion';
    setVisibility(isVisible);
    searchQuery = "";
    setSearchQuery(searchQuery);
  }
  function commentClick(type, element, text, username) {
    console.log(type, element.comments, text, username);
    element.comments.unshift(newModel.addComment(text, username));
    setNewModel(newModel);

    axios.post("http://localhost:8000/comment", 
      {
        text: model.data.comments[model.data.comments.length-1].text,
        comment_by: model.data.comments[model.data.comments.length-1].comment_by,
        comment_date_time: model.data.comments[model.data.comments.length-1].comment_date_time
      }, 
      {
        headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .catch(err => {
        console.log(err);
      })
      .then(res => {
        if (type == 'q') {
          axios.put("http://localhost:8000/question/" + element._id, 
            {
              comments: element.comments
            }, 
            {
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .catch(err => {
              console.log(err);
            })
        } else if (type == 'a') {
          axios.put("http://localhost:8000/answer/" + element._id,
            {
              comments: model.data.answers.find({_id: element._id}).comments.concat(res.data)
            }, 
            {
              headers: {
              'Content-Type': 'application/x-www-form-urlencoded'
              }
            })
            .catch(err => {
              console.log(err);
            }
          )
        }
      })
      for (let field of document.getElementsByTagName('input')) {
				field.value = "";
			}
			for (let field of document.getElementsByTagName('textarea')) {
				field.value = "";
			}
      return curQuestion;

  }

  if (!rendered) {
    return <></>
  } else {
    if (curQuestion && !curQuestion.answers) {
      curQuestion = newModel.data.questions[0];
      setCurQuestion(curQuestion);
    }
    return (
      <>
        <Header 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showHomePage={showHomePage}
          registerUserClick={registerUserClick}
          loginClick={loginClick}
          user={user}
          setUserState={setUser}
          logoutClick={logoutClick}
        />
        <Sidenav 
          questionsClick={questionsClick} 
          tagsClick={tagsClick} 
          user={user}
        />
        <HomePage 
          newModel={newModel} 
          setNewModel={setNewModel}
          askQ={askQuestionClick} 
          isVisible={isVisible} 
          questionClick={questionClick} 
          curQuestion={curQuestion}
          setCurQuestion={setCurQuestion}
          searchQuery={searchQuery}
          questions={questions}
          setQuestions={setQuestions}
          filterType={filterType}
          setFilterType={setFilterType}
          user={user}
          setUserState={setUser}
          registerUserClick={registerUserClick}
          loginClick={loginClick}
        />
        <TagsPage 
          newModel={newModel} 
          askQ={askQuestionClick} 
          isVisible={isVisible} 
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          showHomePage={showHomePage}
          user={user}
        />
        <RegisterUser
          isVisible={isVisible} 
          showHomePage={showHomePage}
          user={user}
          setUserState={setUser}
        />
        <Login
          isVisible={isVisible} 
          showHomePage={showHomePage}
          user={user}
          setUserState={setUser}
        />
        <AskQuestion 
          model={newModel} 
          setModel={setNewModel} 
          isVisible={isVisible} 
          showHomePage={showHomePage}
          user={user}
        />
        <AnswerPage
          curQuestion={curQuestion}
          setCurQuestion={setCurQuestion}
          newModel={newModel}
          isVisible={isVisible} 
          answerQuestionClick={answerQuestionClick}
          askQ={askQuestionClick} 
          user={user}
          setUserState={setUser}
          commentClick={commentClick}
        />
        <AnswerQuestion
          model={newModel} 
          setModel={setNewModel} 
          curQuestion={curQuestion}
          setCurQuestion={setCurQuestion}
          isVisible={isVisible} 
          setVisibility={setVisibility}
          user={user}
        />
      </>
    )
  }
}

export function DisplayNone() {
	document.getElementById('askquestion').style.display = "none";
	document.getElementById('alltags').style.display = "none";
	document.getElementById('answer-page').style.display = "none";
	// document.getElementById('answer-question').style.display = "none";
	// document.getElementById('noquestions').style.display = "none";
	// for (let field of document.getElementsByTagName('input')) {
	//   field.value = "";
	// }
	// for (let field of document.getElementsByTagName('textarea')) {
	//   field.value = "";
	// }
	document.getElementById('main').style.display = "none";
}

function clearInputs() {
  for (let field of document.getElementsByTagName('input')) {
    field.value = "";
  }
  for (let field of document.getElementsByTagName('textarea')) {
    field.value = "";
  }
}