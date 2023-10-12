
// tunes.sample

{
	init() {
		this.els = {
			content: window.find("content .wrapper"),
		};
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.sample,
			row,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "open-filesystem":
				console.log(event);
				break;
			case "check-track-drag":
			case "select-track":
			case "handle-dbl-click":
			case "toggle-heart":
				console.log(event);
				break;
			case "play-song":
				row = event.el.parents(".row");
				// create list and play songs
				APP.toolbar.dispatch({
					type: "play-list",
					list: Self.dispatch({ type: "get-song-list" }),
					index: row.index(),
				});
				break;
			case "get-song-list":
				return Self.els.content.find(".sample-block .row[data-_id]").map(r =>
					r.getAttribute("data-_id"));
		}
	}
}
