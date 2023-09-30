
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
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				break;
			case "open.file":
				Self.toolbar.dispatch({ ...event, type: "reset-display" });
				break;
			// custom events
			case "show-playlist":
				el = window.find(`sidebar .name:contains("${event.name}")`);
				if (el.length) el.parent().trigger("click");
				break;
			default:
				if (event.el) {
					pEl = event.el.data("area") ? event.el : event.el.parents(`[data-area]`);
					if (pEl.length) {
						name = pEl.data("area");
						return Self[name].dispatch(event);
					}
				}
		}
	},
	toolbar: @import "sections/toolbar.js",
	sidebar: @import "sections/sidebar.js",
	content: @import "sections/content.js",
};

window.exports = tunes;
