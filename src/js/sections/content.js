
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
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				// render list view
				window.render({
					template: "content-list",
					match: `//i[@name = "Albums"]/i`,
					target: Self.els.el
				});
				break;
		}
	}
}
