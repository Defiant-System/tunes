
const tunes = {
	async init() {
		// fast references
		this.els = {
			content: window.find("content"),
		};
	},
	async dispatch(event) {
		let Self = tunes,
			value;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				break;
			// custom events
			case "progress":
				break;
		}
	}
};

window.exports = tunes;
