import axios from 'axios';

export default function AnswerQuestion({model, setModel, curQuestion, setCurQuestion, isVisible, setVisibility, user}) {
	function handleSubmit(e) {
		e.preventDefault();

		let formData = new FormData(document.getElementById("answer-form"));
		let formDataObject = Object.fromEntries(formData);

		let invalid = false;
		document.getElementsByName('a-text')[0].setCustomValidity("");
		// checking for links
		let text = formDataObject['a-text'];
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
			curQuestion.answers.push(model.addAnswer(user.username, formDataObject['a-text']));
			setCurQuestion(curQuestion);
			setModel(model);

			axios.post("http://localhost:8000/answer", 
				{
					text: model.data.answers[model.data.answers.length-1].text,
					ans_by: model.data.answers[model.data.answers.length-1].ans_by,
					ans_date_time: model.data.answers[model.data.answers.length-1].ans_date_time,
					comments: model.data.answers[model.data.answers.length-1].comments
				}, 
				{
					headers: {
					'Content-Type': 'application/x-www-form-urlencoded'
					}
				})
				.catch(err => {
					console.log(err);
				})


			axios.put("http://localhost:8000/question/" + curQuestion._id, 
				{
					title: curQuestion.title,
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

			for (let field of document.getElementsByTagName('input')) {
				field.value = "";
			}
			for (let field of document.getElementsByTagName('textarea')) {
				field.value = "";
			}

			isVisible = 'answerspage';
			setVisibility(isVisible);
		}
	}
	
	return (
		<div id="answer-question" style={{display: isVisible === 'answerquestion' ? 'block' : 'none'}}>
			<form action="#" id="answer-form" onSubmit={handleSubmit}>
				
				<h2>Answer Text*</h2>
				<textarea id="" cols="30" rows="10" name="a-text" required></textarea>
				<br />

				<button>Post Answer</button>
				<p className="text-for-mandatory">* indicates mandatory fields</p>
			</form>
		</div>
	)
}