
@import "modules/test.js"


const tunes = {
	async init() {
		// init all sub-objects
		Object.keys(this)
			.filter(i => typeof this[i].init === "function")
			.map(i => this[i].init());

		// DEV-ONLY-START
		Test.init(this);
		// DEV-ONLY-END
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
	},
	sidebar: @import "modules/sidebar.js",
};

window.exports = tunes;
