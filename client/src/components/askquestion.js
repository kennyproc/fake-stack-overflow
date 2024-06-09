//testing branch
import React from 'react';
import axios from 'axios';

export default function AskQuestion({model, setModel, isVisible, showHomePage, user}) {
	function handleSubmit(e) {
		e.preventDefault();

		let formData = new FormData(document.getElementById("question-form"));
		let formDataObject = Object.fromEntries(formData);

		let invalid = false;
		document.getElementsByName('q-text')[0].setCustomValidity("");
		// checking for links
		let text = formDataObject['q-text'];
		let matches = text.match(/\[.*\]\(.*\)/g);
		if (matches) {
			for (let match of matches) {
				if (!/\[.+\]\((http|https):\/\/.+\)/g.test(match)) {
					invalid = true;
					alert("Invalid hyperlink");
				}
			}
		}

		if (!invalid) {

			model.addQuestion(formDataObject['q-title'], formDataObject['q-summary'], text, 
				formDataObject['q-tags'].split(' '), user.username);
			
			setModel(model);

			axios.post("http://localhost:8000/question", 
				{
					title: model.data.questions[model.data.questions.length-1].title,
					summary: model.data.questions[model.data.questions.length-1].summary,
					text: model.data.questions[model.data.questions.length-1].text,
					tags: model.data.questions[model.data.questions.length-1].tags,
					answers: model.data.questions[model.data.questions.length-1].answers,
					asked_by: model.data.questions[model.data.questions.length-1].asked_by,
					ask_date_time: model.data.questions[model.data.questions.length-1].ask_date_time,
					views: model.data.questions[model.data.questions.length-1].views,
					comments: model.data.questions[model.data.questions.length-1].comments
				}, 
				{
					headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.catch(err => {
					console.log(err);
				})

			for (let field of document.getElementsByTagName('input')) {
				field.value = "";
			}
			for (let field of document.getElementsByTagName('textarea')) {
				field.value = "";
			}
			showHomePage();
			
			window.location.reload();
		}
	}

	return (
		<div id="askquestion" style={{display: isVisible === 'askquestion' ? 'block' : 'none'}}>
			<form action="#" id="question-form" onSubmit={handleSubmit}>
				<h2>Question Title*</h2>
				<p><em>Limit title to 50 characters or less</em></p>
				<input type="text" name="q-title" maxLength="50" required />

				<h2>Question Summary*</h2>
				<p><em>Limit summary to 140 characters or less</em></p>
				<textarea id="" cols="30" rows="3" name="q-summary" maxlength="140" required></textarea>

				<h2>Question Text*</h2>
				<p><em>Add details</em></p>
				<textarea id="" cols="30" rows="10" name="q-text" required></textarea>

				<h2>Tags*</h2>
				<p><em>Add keywords separated by whitespace</em></p>
				<input type="text" name="q-tags" required />

				<br />
				<button type="submit">Post Question</button>
				<p className="text-for-mandatory">* indicates mandatory fields</p>
			</form>
		</div>
	)
}