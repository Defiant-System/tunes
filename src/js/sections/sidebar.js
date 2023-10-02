
// tunes.sidebar

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("sidebar .wrapper"),
		};
		// render tree view
		window.render({
			template: "sidebar",
			match: `//Data`,
			target: this.els.el
		});
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.sidebar,
			options = {},
			title,
			xnode,
			xpath,
			isOn,
			el;
		// console.log(event);
		switch (event.type) {
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

				options = {
					changePath: `//xsl:for-each`,
					changeSelect: `./*`,
					sortNodeXpath: `//xsl:for-each/xsl:sort`,
					sortSelect: `@lp`,
					sortOrder: `ascending`,
					sortType: `text`,
				};

				xnode = window.bluePrint.selectSingleNode(`//*[@_id="${el.data("_id")}"]`);
				Object.keys(options).map(k => {
					if (xnode.getAttribute(k)) options[k] = xnode.getAttribute(k);
				});

				title = el.find(".name").html();
				xpath = el.data("xpath") || `//*[@name = "${el.find(".name").text()}"]`;
				APP.content.dispatch({ type: "render-playlist", xpath, title, options });
				break;
		}
	}
}
