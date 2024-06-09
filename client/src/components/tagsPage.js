import { NumElements } from "./helpers";
import axios from 'axios';

export default function TagsPage({newModel, askQ, isVisible, searchQuery, setSearchQuery, showHomePage, user}) {
	return (
		<div id="alltags" style={{display: isVisible === 'tagspage' ? 'block' : 'none'}}>
			<TagsHeader numTags={newModel.data.tags.length} askQ={askQ} user={user} />
			<div id="display-tags">
				<div className="tag">
					{newModel.data.tags.map(tag => {
						return <TagItem 
									key={tag._id} 
									tag={tag} 
									model={newModel.data} 
									searchQuery={searchQuery}
									setSearchQuery={setSearchQuery}
									showHomePage={showHomePage}
								/>
					})}
				</div>
			</div>
		</div>
	);
}

function TagsHeader({numTags, askQ, user}) {
	if (user == "guest") {
		return (
			<div id="tags-header">
				<h2><NumElements numElements={numTags} type='tag' /></h2>
				<h2>All Tags</h2>
			</div>
		)
	}
	return (
		<div id="tags-header">
			<h2><NumElements numElements={numTags} type='tag' /></h2>
			<h2>All Tags</h2>
			<button className="btn-ask-q" onClick={() => askQ()}>
				Ask Question
			</button>
		</div>
	)
}

function TagItem({tag, model, searchQuery, setSearchQuery, showHomePage}) {
	let numQuestions = getNumQuestions(tag, model);

	function handleClick() {
		searchQuery = "[" + tag.name + "]";
		setSearchQuery(searchQuery);
		showHomePage();
	}

	return (
		<div className="tag-container">
			<div className="tag-data">
				<a href="#" onClick={() => handleClick()}>{tag.name}</a>
				<NumElements numElements={numQuestions} type='question' />
			</div>
		</div>
	)
}

function getNumQuestions(tag, model) {
	let i = 0;
	for (let ques of model.questions) {
		for (let t of ques.tags) {
			if (t.name === tag.name) {
				i++;
			}
		}
	}
	return i;
}