
@import "ext/id3.js"
@import "modules/test.js"



let Pref = {
		"Sidebar": {
			"expanded": true,
			"active-li": 1,
		},
		"Random": false,
		"Repeat": false,
		"Volume": .65,
	};


const tunes = {
	async init() {
		// if "Playlists" root node already exists, remove first one
		let xSet = window.settings.getItem("playlists"),
			xDef = window.bluePrint.selectSingleNode(`.//Data/Playlists`);
		if (xSet) xDef.parentNode.replaceChild(xSet, xDef);
		// get settings, if any
		this.settings = window.settings.getItem("settings") || { ...Pref };
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
			xnode,
			name,
			value,
			pEl,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				//save playlists node
				xnode = window.bluePrint.selectSingleNode(`.//Playlists`);
				window.settings.setItem("playlists", xnode);
				// save settings
				window.settings.setItem("settings", Self.settings);
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
	library: @import "modules/library.js",
	toolbar: @import "sections/toolbar.js",
	content: @import "sections/content.js",
	sidebar: @import "sections/sidebar.js",
};

window.exports = tunes;
