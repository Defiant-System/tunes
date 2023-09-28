
// tunes.sidebar

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("sidebar .wrapper"),
		};
		// temp
		this.dispatch({ type: "init-render" });
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.sidebar,
			el;
		// console.log(event);
		switch (event.type) {
			case "init-render":
				// render tree view
				window.render({
					template: "sidebar",
					match: `//Data`,
					target: Self.els.el
				});
				break;
		}
	}
}
