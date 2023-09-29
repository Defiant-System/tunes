
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
		}
	}
}
