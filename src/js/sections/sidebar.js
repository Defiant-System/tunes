
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
			title,
			xpath,
			isOn,
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
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				return !isOn;
			case "toggle-folder":
				isOn = event.el.hasClass("down");
				event.el.toggleClass("down", isOn);
				break;
			case "select-playlist":
				Self.els.el.find(".active").removeClass("active");
				el = $(event.target).addClass("active");

				title = el.find(".name").html();
				xpath = el.data("xpath") || `//*[@name = "${el.find(".name").text()}"]`;
				APP.content.dispatch({ type: "render-playlist", xpath, title });
				break;
		}
	}
}
