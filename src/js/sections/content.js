
// tunes.content

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("list .wrapper"),
		};
		// temp
		this.dispatch({ type: "init-render" });
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.content,
			match,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				// pre-render name-pass
				match = `//i[@name = "Hiphop"]`;
				// match = `//i[@name = "Albums"]/i`,
				window.bluePrint.selectNodes(match +"/*")
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
						console.log( node.xml );
					});
				// render list view
				window.render({
					match,
					template: "content-list",
					target: Self.els.el
				});
				break;
		}
	}
}
