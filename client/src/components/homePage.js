import { useState } from "react";
import { NumElements, getFormattedDate } from "./helpers";
import axios from 'axios';
import Welcome from './welcome';

export default function HomePage({newModel, setNewModel, askQ, isVisible, 
	questionClick, curQuestion, setCurQuestion, searchQuery, filterType, setFilterType, user, setUserState,
	registerUserClick, loginClick}) {

	filterBy(newModel, setNewModel, filterType);
	let [questions, setQuestions] = useState(newModel.data.questions);
	if (searchQuery !== "") {
		questions = searchQuestions(newModel, searchQuery);
	} else if (filterType !== 'unanswered') {
		questions = newModel.data.questions;
	}

	let [questionPageIndex, setQuestionPageIndex] = useState(0);

	function goPrevious() {
		if (questionPageIndex > 0) {
			questionPageIndex -= 5;
			setQuestionPageIndex(questionPageIndex);
		}
	}
	function goNext() {
		if (questionPageIndex + 5 < questions.length) {
			questionPageIndex += 5;
			setQuestionPageIndex(questionPageIndex);
		} else {
			questionPageIndex = 0;
			setQuestionPageIndex(questionPageIndex);
		}
	}

	if (!user) {

		return (
			<div id="main" className="main" style={{display: isVisible === 'homepage' ? 'block' : 'none'}}>
				<Welcome user={user} setUser={setUserState} registerUserClick={registerUserClick} loginClick={loginClick} />
			</div>
		)
	}

    return (
		<div id="main" className="main" style={{display: isVisible === 'homepage' ? 'block' : 'none'}}>
			<QuestionsHeader 
				askQ={askQ} 
				searchQuery={searchQuery} 
				filterType={filterType}
				user={user}
			/>
			<QuestionsSubheader 
				numQuestions={questions.length} 
				questions={questions}
				setQuestions={setQuestions}
				model={newModel} 
				setNewModel={setNewModel}
				filterType={filterType}
				setFilterType={setFilterType}
			/>
			<Questions 
				model={newModel.data} 
				questions={questions}
				questionClick={questionClick} 
				curQuestion={curQuestion}
				setCurQuestion={setCurQuestion}
				questionPageIndex={questionPageIndex}
			/>
			<button onClick={() => goPrevious()}>Previous</button>
			<button onClick={() => goNext()}>Next</button>
		</div>
  );
}

function QuestionsHeader({askQ, searchQuery, filterType, user}) {

	if (user == "guest") {
		if (filterType === 'unanswered') {
			return (
				<div id="questions-header">
					<h2>Unanswered questions</h2>
				</div>
			)
		} else if (searchQuery === "") {
			return (
				<div id="questions-header">
					<h2>All Questions</h2>
				</div>
			)
		} else {
			return (
				<div id="questions-header">
					<h2>Search results</h2>
				</div>
			)
		}
	}

	if (filterType === 'unanswered') {
		return (
			<div id="questions-header">
				<h2>Unanswered questions</h2>
				<button className="btn-ask-q" onClick={() => askQ()}>
					Ask Question
				</button>
			</div>
		)
	} else if (searchQuery === "") {
		return (
			<div id="questions-header">
				<h2>All Questions</h2>
				<button className="btn-ask-q" onClick={() => askQ()}>
					Ask Question
				</button>
			</div>
		)
	} else {
		return (
			<div id="questions-header">
				<h2>Search results</h2>
				<button className="btn-ask-q" onClick={() => askQ()}>
					Ask Question
				</button>
			</div>
		)
	}
	
}

function QuestionsSubheader({numQuestions, questions, setQuestions, 
	model, setNewModel, filterType, setFilterType}) {
	function handleClick(type) {
		filterType = type;
		setFilterType(filterType);
		if (type === 'unanswered') {
			questions = filterBy(model, setNewModel, type);
		} else {
			filterBy(model, setNewModel, type);
			questions = model;
		}
		setNewModel(model);
		setQuestions(questions);
	}

	return (
		<div id="questions-subheader">
			<NumElements numElements={numQuestions} type='question' />
			<div>
				<button type="button" id="newest" onClick={() => handleClick('newest')}>Newest</button>
				<button type="button" id="active" onClick={() => handleClick('active')}>Active</button>
				<button type="button" id="unanswered" onClick={() => handleClick('unanswered')}>Unanswered</button>
			</div>
		</div>
	)
}

function Questions({model, questions, questionClick, curQuestion, setCurQuestion, questionPageIndex}) {
	return (
		<>
			<div id="questions">
				{questions.length === 0 && "No questions found"}
				{questions.slice(questionPageIndex, questionPageIndex+5).map(ques => {
					return (
						<QuestionItem 
							key={ques._id} 
							question={ques} 
							model={model} 
							questionClick={questionClick}
							curQuestion={curQuestion}
							setCurQuestion={setCurQuestion}
						/>
					);
				})}
			</div>
		</>
	)
}

function QuestionItem({question, model, questionClick, curQuestion, setCurQuestion}) {
	function setQuestion() {
		curQuestion = question;
    	curQuestion.views++;
		setCurQuestion(curQuestion);

		axios.put("http://localhost:8000/question/" + curQuestion._id, 
			{
				title: curQuestion.title,
				summary: curQuestion.summary,
				text: curQuestion.text,
				tags: curQuestion.tags,
				answers: curQuestion.answers,
				asked_by: curQuestion.asked_by,
				ask_date_time: curQuestion.ask_date_time,
				views: curQuestion.views
			},
			{
				headers: {
				'Content-Type': 'application/x-www-form-urlencoded'
				}
			})
			.catch(err => {
				console.log(err);
			})

		questionClick();
	}

	return (
		<div className="question">
			<div className="col1">
				<NumElements numElements={question.answers.length} type='answer' />
				<NumElements numElements={question.views} type='view' />
			</div>
			<div className='col2'>
				<a href='#' onClick={() => setQuestion()}>
					{question.title}
				</a>
				<p><em>{question.summary}</em></p>
				<div className='question-tags'>
					{question.tags.map(tag => {
						return <p key={tag.tid}>{tag.name}</p>
					})}
				</div>
			</div>
			<div className="col3">
        <p><div className="author">{question.asked_by}</div> asked <div className="askDate">{getFormattedDate(question.ask_date_time)}</div></p>
      </div>
		</div>
	)
}

function filterBy(model, setNewModel, filter) {
  filterAnswers(model, setNewModel);
  //setNewModel(model);
  
  if (filter === "newest") {
    model.data.questions.sort((a, b) => Date.parse(b.ask_date_time) - Date.parse(a.ask_date_time));
  }
  if (filter === "active") {
    model.data.questions.sort(function(a, b) {
      let a_date, b_date;
      for (let ans of model.data.answers) {
        for (let ans2 of a.answers) {
          if (ans._id === ans2._id && (Date.parse(ans.ans_date_time) > a_date || !a_date)) {
            a_date = Date.parse(ans.ans_date_time);
          }
        }
        for (let ans2 of b.answers) {
          if (ans._id === ans2._id && (Date.parse(ans.ans_date_time) > b_date || !b_date)) {
            b_date = Date.parse(ans.ans_date_time);
          }
        }
      }
      if (a_date > b_date || (a_date && !b_date)) {
        return -1;
      } 
      return 1;
    });
  } 
  setNewModel(model);
  if (filter === "unanswered") {
    return model.data.questions.filter(ques => ques.answers.length === 0);
  }
}
function filterAnswers(model, setNewModel){
  model.data.answers.sort((a, b) => Date.parse(b.ans_date_time) - Date.parse(a.ans_date_time));
  for (let q of model.data.questions) {
	q.answers.sort((a, b) => Date.parse(b.ans_date_time) - Date.parse(a.ans_date_time));
  }
  setNewModel(model);
}

function searchQuestions(newModel, input) {
  let inputArray = input.split(" ");
  let tagsArray = [];
  let textArray = [];
  for (let el of inputArray) {
    if (el[0] === "[" && el[el.length-1] === "]") {
      tagsArray.push(el.slice(1, el.length-1));
    } else {
      textArray.push(el);
    }
  }

  let questions = [];
  for (let ques of newModel.data.questions) {
    for (let text of textArray) {
      if ((ques.title.toLowerCase().includes(text.toLowerCase()) || 
          ques.text.toLowerCase().includes(text.toLowerCase())) &&
          !questions.includes(ques)) {
        questions.push(ques);
      }
    }
    for (let tag of tagsArray) {
      for (let tag2 of ques.tags) {
		if (tag.toLowerCase() === tag2.name.toLowerCase() &&
		!questions.includes(ques)) {
		questions.push(ques);
		}
      }
    }
  }
  return questions;
}