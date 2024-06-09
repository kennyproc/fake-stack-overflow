const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];


export function NumElements({numElements, type}) {
	if (numElements === 1)
		return <p>{numElements} {type}</p>
	return <p>{numElements} {type}s</p>;
}


export function getFormattedDate(date) {
	if (date === undefined) {
		return;
	}
	date = new Date(date);
	let tempDate = "";
	let currentDate = new Date();
	if (Math.abs(currentDate - date) < (1000*60)) {
	  tempDate = `${Math.floor(Math.abs(currentDate - date) / 1000)} seconds ago`;
	} else if (Math.abs(currentDate - date) < (1000*60*60)) {
	  tempDate = `${Math.floor(Math.abs(currentDate - date) / 1000 / 60)} minutes ago`;
	} else if ((Math.abs(currentDate - date) < (1000*60*60*24))) {
	  tempDate = `${Math.floor(Math.abs(currentDate - date) / 1000 / 60 / 60)} hours ago`;
	} else if (Math.abs(currentDate - date) < (1000*60*60*24*365)) {
	  tempDate = `${months[date.getMonth()]} ${date.getDate()} at ${date.toJSON().slice(12,16)}`;
	} else {
	  tempDate = `${months[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()} at `;
	  if (date.getHours() < 10) {
		tempDate += '0' + date.getHours() + ':';
	  } else {
		tempDate += date.getHours() + ':';
	  }
  
	  if (date.getMinutes() < 10) {
		tempDate += '0' + date.getMinutes();
	  } else {
		tempDate += date.getMinutes();
	  }
	}
	return tempDate;
  }