
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
			xnode,
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
					match: event.xpath,
					template: "content-list",
					target: Self.els.el,
				});
				break;
			case "play-song":
				row = event.el.parents(".row").addClass("track-playing");
				xpath = `//i[@id="${row.data("id")}"]`;
				xnode = window.bluePrint.selectSingleNode(xpath);

				APP.toolbar.dispatch({
					type: "reset-display",
					base: xnode.getAttribute("name"),
					path: xnode.getAttribute("path"),
					autoplay: true,
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
