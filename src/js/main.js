
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
			// custom events
			case "progress":
				break;
			case "toggle-sidebar":
				return Self.sidebar.dispatch(event);
			default:
				if (event.el) {
					pEl = event.el.data("area") ? event.el : event.el.parents(`[data-area]`);
					if (pEl.length) {
						name = pEl.data("area");
						Self[name].dispatch(event);
					} else if (event.el.hasClass("toolbar-tool_")) {
						Self.toolbar.dispatch(event);
					}
				}
		}
	},
	toolbar: @import "sections/toolbar.js",
	sidebar: @import "sections/sidebar.js",
	content: @import "sections/content.js",
};

window.exports = tunes;
