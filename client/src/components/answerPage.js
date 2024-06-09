import { useState } from "react";
import { NumElements, getFormattedDate } from "./helpers";

export default function AnswerPage({curQuestion, setCurQuestion, newModel, isVisible, 
	answerQuestionClick, askQ, user, setUserState, commentClick}) {

	let [answerPageIndex, setAnswerPageIndex] = useState(0);
	let [commentIndex, setCommentIndex] = useState(0);

	function goPrevious() {
		if (answerPageIndex > 0) {
			answerPageIndex -= 5;
			setAnswerPageIndex(answerPageIndex);
		}
	}
	function goNext() {
		if (answerPageIndex + 5 < curQuestion.answers.length) {
			answerPageIndex += 5;
			setAnswerPageIndex(answerPageIndex);
		} else {
			answerPageIndex = 0;
			setAnswerPageIndex(answerPageIndex);
		}
	}

	function prevComments() {
		if (commentIndex > 0) {
			commentIndex -= 3;
			setCommentIndex(commentIndex);
		}
	}

	function nextComments(element) {
		if (commentIndex + 3 < element.comments.length) {
			commentIndex += 5;
			setCommentIndex(commentIndex);
		} else {
			commentIndex = 0;
			setCommentIndex(commentIndex);
		}
	}

	if (user == 'guest') {
		return (
			<div id="answer-page" style={{display: isVisible === 'answerspage' ? 'block' : 'none'}}>
				<AnswerPageHeader curQuestion={curQuestion} askQ={askQ} user={user} />
				<QuestionInfo curQuestion={curQuestion} setCurQuestion={setCurQuestion} user={user} commentIndex={commentIndex} setCommentIndex={setCommentIndex} nextComments={nextComments} prevComments={prevComments} />
				<Answers curQuestion={curQuestion} newModel={newModel} />
				<button onClick={() => goPrevious()}>Previous</button>
				<button onClick={() => goNext()}>Next</button>
			</div>
		)
	}

	return (
		<div id="answer-page" style={{display: isVisible === 'answerspage' ? 'block' : 'none'}}>
			<AnswerPageHeader curQuestion={curQuestion} askQ={askQ} user={user} />
			<QuestionInfo curQuestion={curQuestion} setCurQuestion={setCurQuestion} commentClick={commentClick} user={user} commentIndex={commentIndex} setCommentIndex={setCommentIndex} nextComments={nextComments} prevComments={prevComments} />
			<Answers curQuestion={curQuestion} newModel={newModel} answerPageIndex={answerPageIndex} />
			<button onClick={() => goPrevious()}>Previous</button>
			<button onClick={() => goNext()}>Next</button>
			<br />
			<button id="btn-answer-q" onClick={() => answerQuestionClick()}>
				Answer Question
			</button>
		</div>
	)
}

function AnswerPageHeader({curQuestion, askQ, user}) {
	if (!curQuestion) {
		return;
	}
	if (user == 'guest') {
		return (
			<div id="answerpage-header">
				<h2><NumElements numElements={curQuestion.answers.length} type='answer' /></h2>
				<h2>{curQuestion.title}</h2>
				<p>{curQuestion.summary}</p>
			</div>
		)
	}
	return (
		<div id="answerpage-header">
			<h2><NumElements numElements={curQuestion.answers.length} type='answer' /></h2>
			<div id="answerpage-header-col">
				<h2>{curQuestion.title}</h2>
				<p><em>{curQuestion.summary}</em></p>
			</div>
			<button className="btn-ask-q" onClick={() => askQ()}>Ask Question</button>
		</div>
	)
}

function QuestionInfo({curQuestion, setCurQuestion, commentClick, user, commentIndex, setCommentIndex, nextComments, prevComments}) {
	if (!curQuestion) {
		return;
	}
	let textHTML = replaceLinks(curQuestion.text);

	if (user == "guest") {
		return (
			<>
				<div id="question">
					<h2><NumElements numElements={curQuestion.views} type='view' /></h2>
					<p dangerouslySetInnerHTML={{__html: textHTML}}></p>
					<p><span className="author">{curQuestion.asked_by}</span> asked <span className="askDate">{getFormattedDate(curQuestion.ask_date_time)}</span></p>
				</div>
				<div id="question-comments">
					<Comments element={curQuestion} commentIndex={commentIndex} />
					<button onClick={() => prevComments()}>Previous</button>
					<button onClick={() => nextComments(curQuestion)}>Next</button>
					<br />
				</div>
			</>
		)
	}
	return (
		<>
			<div id="question">
				<h2><NumElements numElements={curQuestion.views} type='view' /></h2>
				<p dangerouslySetInnerHTML={{__html: textHTML}}></p>
				<p><span className="author">{curQuestion.asked_by}</span> asked <span className="askDate">{getFormattedDate(curQuestion.ask_date_time)}</span></p>
			</div>
			<div id="question-comments">
				<Comments element={curQuestion} commentIndex={commentIndex} />
				<button onClick={() => prevComments()}>Previous</button>
				<button onClick={() => nextComments(curQuestion)}>Next</button>
				<br />
				<input type="text" name="q-comment" maxlength="140" />
				<button onClick={() => {
					curQuestion = commentClick('q', curQuestion, document.getElementsByName('q-comment')[0].value, user.username);
					setCurQuestion(curQuestion);
				} }>Comment</button>
			</div>
		</>
	)
}

function Comments({element, commentIndex}) {
	return (
		<div className="comments">
			{element.comments.slice(commentIndex, commentIndex+3).map(comment => {
				return <CommentItem key={comment._id} comment={comment} />
			})}
		</div>
	)
}

function CommentItem({comment}) {
	return (
		<div id="comment">
			<p>{comment.text} <em>by</em> {comment.comment_by} on {getFormattedDate(comment.comment_date_time)}</p>
		</div>
	)
}

function Answers({curQuestion, newModel, answerPageIndex}) {
	if (!curQuestion) {
		return;
	}
	return (
		<div id="answers">
			{curQuestion.answers.slice(answerPageIndex, answerPageIndex+5).map(ans => {
				return <AnswerItem 
							key={ans._id} 
							ans={ans} 
						/>
			})}
		</div>
	)
}

function AnswerItem({ans}) {
	let textHTML = replaceLinks(ans.text);
	return (
		<div className="ans">
			<p dangerouslySetInnerHTML={{__html: textHTML}}></p>
			<p>
				<span className="author">{ans.ans_by}</span> 
				<span>answered </span>
				<span className="askDate">{getFormattedDate(ans.ans_date_time)}</span>
			</p>
		</div>
	)
}



function replaceLinks(text) {
	let textHTML = text;
	let matches = textHTML.match(/\[.+\]\((http|https):\/\/.+\)/g);
	if (matches != null) {
		for (let match of matches) {
			let link = match.match(/\]\(.+\)/)[0];
			link = link.slice(2, link.length-1);
			let text = match.match(/^\[.+\]\(/)[0];
			text = text.slice(1, text.length-2);
			text = "<a target='_blank' href='" + link + "'>" + text + "</a>";
			textHTML = textHTML.replace(/\[.+\]\((http|https):\/\/.+\)/g, text);
		}
	}
	return textHTML;
}