
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
				if (row.hasClass("track-playing")) {
					// row.removeClass("track-playing");
					if (row.hasClass("paused")) {
						row.removeClass("paused");
						return APP.toolbar.dispatch({ type: "play-toggle" });
					}
					row.addClass("paused");
					return APP.toolbar.dispatch({ type: "play-toggle" });
				}
				// reset previous active row, if any
				Self.els.content.find(".track-playing, .active").removeClass("track-playing active");
				
				// prepare toolbar event
				row.addClass("track-playing active");
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
