
// tunes.content

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("list .wrapper"),
		};
		// temp
		// this.dispatch({ type: "init-render" });
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.content,
			xpath,
			list,
			row,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				// pre-render name-pass
				xpath = `//i[@name = "Albums"]/i[position() = 2]`;
				window.bluePrint.selectNodes(xpath +"/*")
					.map(node => {
						let name = node.getAttribute("name");
						if (name.endsWith(".mp3")) {
							name = name.slice(0,-4);
						}
						if (name.includes(" - ")) {
							let [artist, title] = name.split(" - ");
							node.setAttribute("artist", artist);
							node.setAttribute("title", title);
						}
					});
				Self.dispatch({ type: "render-playlist", xpath });
				break;
			case "render-playlist":
				// render list view
				window.render({
					// sortNodeXpath
					// sortSelect
					// sortOrder,
					// sortType,
					changePath: `//xsl:for-each`,
					changeSelect: "./*[@fav]",
					match: event.xpath,
					template: "content-list",
					target: Self.els.el,
				});
				// fix "title" if empty
				el = Self.els.el.find(`.playlist-info h2`);
				if (el.text().trim() === "-") {
					el.html(event.title);
				}
				break;
			case "no-active":
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				break;
			case "update-active":
				el = Self.els.el.find(`.row[data-id="${event.id}"]`);
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				el.addClass("track-playing")
					.toggleClass("paused", event.playing);
				break;
			case "get-song-list":
				return Self.els.el.find(".row[data-id]").map(r => r.getAttribute("data-id"));
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
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				
				// prepare toolbar event
				row.addClass("track-playing active");
				// create list and play songs
				APP.toolbar.dispatch({
					type: "play-list",
					list: Self.dispatch({ type: "get-song-list" }),
					index: row.index(),
				});
				break;
			case "toggle-heart":
				row = event.el.parents(".row");

				if (event.el.hasClass("icon-heart")) {
					event.el.prop({ className: "icon-heart-full" });
				} else {
					event.el.prop({ className: "icon-heart" });
				}
				break;
		}
	}
}
