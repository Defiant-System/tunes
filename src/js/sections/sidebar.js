
// tunes.sidebar

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("sidebar .wrapper"),
			dnd: window.find(".dnd-ux"),
		};
		// render tree view
		window.render({
			template: "sidebar",
			match: `//Data`,
			target: this.els.el
		});
		// "auto click" item saved in settings
		this.dispatch({ type: "apply-settings" });
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.sidebar,
			dragable = false,
			options = {},
			title,
			xnode,
			xpath,
			isOn,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "check-folder-drop":
			case "check-void-drop":
				console.log(event);
				break;
			case "check-playlist-drag":
				let offset = event.el.offset("content"),
					y = offset.top,
					x = offset.left + event.offsetX - 30,
					name = event.el.find(".name").text();

				Self.els.el.find(".list-wrapper li").data({ "drop-zone": "check-folder-drop" });

				// copy of dragable element
				dragable = Self.els.dnd.append(`<div class="dragged-playlist" style="top: ${y}px; left: ${x}px;">
													<span>${name}</span></div>`);
				return dragable;
			case "check-track-drag":
				dragable = Self.els.dnd.append(`<div class="dragged-song">
													<span>Ayben &#183; Rap Benim</span>
												</div>`);
				return dragable;
			// custom events
			case "apply-settings":
				if (APP.settings.Sidebar["expanded"]) {
					window.find(`.toolbar-tool_[data-click="toggle-sidebar"]`).trigger("click");
				}
				setTimeout(() => {
					Self.els.el.find(`li:nth(${APP.settings.Sidebar["active-li"]})`).trigger("click")
				});
				break;
			case "toggle-sidebar":
				isOn = Self.els.layout.hasClass("show-sidebar");
				Self.els.layout.toggleClass("show-sidebar", isOn);
				// save to settings
				APP.settings.Sidebar["expanded"] = !isOn;

				return !isOn;
			case "toggle-folder":
				isOn = event.el.hasClass("down");
				event.el.toggleClass("down", isOn);
				break;
			case "select-playlist":
				el = $(event.target);
				if (el.nodeName() !== "li") return;

				Self.els.el.find(".active").removeClass("active");
				el.addClass("active");
				// save to settings
				APP.settings.Sidebar["active-li"] = el.index();

				options = {
					changePath: `//xsl:for-each`,
					changeSelect: `./*`,
					sortNodeXpath: `//xsl:for-each/xsl:sort`,
					sortSelect: `@lp`,
					sortOrder: `ascending`,
					sortType: `text`,
					limit: 999,
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
