
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
			offset, x, y,
			options = {},
			title,
			xnode,
			xpath,
			isOn,
			str,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "drop-playlist-outside":
			case "drop-playlist-before":
			case "drop-playlist-after":
			case "drop-playlist-in-folder":
				// console.log(event.el.data("_id"), event.type.split("-")[2]);
				// clean up
				Self.els.dnd.html("");
				// reset zones
				window.find(`[data-drop-zone-before], [data-drop-zone-after], [data-drop-zone], [drop-outside]`)
					.removeAttr("data-drop-zone-before data-drop-zone-after data-drop-zone data-drop-outside");
				// click element if no drag'n drop
				if (!event.hasMoved && Self.dragOrigin) Self.dragOrigin.trigger("click");
				// reset reference to dragged element
				Self.dragOrigin.removeClass("dragged");
				delete Self.dragOrigin;
				break;

			case "check-playlist-drag":
				offset = event.el.offset("content");
				y = offset.top + event.offsetY - 12;
				x = offset.left + event.offsetX - 30;
				el = $(event.target);
				if (!el.hasClass("leaf")) el = el.parents(".leaf:first");
				title = el.find(".name").text();

				// for correct event proxying
				Self.els.dnd.data({ area: "sidebar" });
				// tag dragged item
				Self.dragOrigin = el.addClass("dragged");
				// tag "drop zones"
				Self.els.el.find(".user-list li:not(.dragged) > .leaf")
					.data({
						"drop-zone-before": "drop-playlist-before",
						"drop-zone-after": "drop-playlist-after",
						"drop-zone": "drop-playlist-in-folder",
						"drop-outside": "drop-playlist-outside",
					});
				// copy of dragable element
				str = `<div class="dragged-playlist drag-clone" style="top: ${y}px; left: ${x}px;"><span>${title}</span></div>`;
				return Self.els.dnd.append(str);

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
			case "toggle-block":
				el = event.el.parent().nextAll(".list-wrapper:first");
				el.toggleClass("collapsed", el.hasClass("collapsed"));
				// toggle "button" text
				str = event.el.html();
				event.el.html(event.el.attr("toggle-text"));
				event.el.attr("toggle-text", str);
				break;
			case "toggle-folder":
				isOn = event.el.hasClass("down");
				event.el.toggleClass("down", isOn);

				el = event.el.parents("li:first");
				if (el.hasClass("has-children") && !el.hasClass("expanded")) {
					if (!el.find("> .children > *").length) {
						// console.log( window.bluePrint.selectSingleNode(`//Data//*[@_id="${el.data("_id")}"]`).xml );
						window.render({
							template: "render-sidebar-leaf",
							match: `//Data//*[@_id="${el.data("_id")}"]`,
							target: el.find("> .children"),
						});
						// console.log( el.find("> .children").length );
					}
					el.addClass("expanded");
				} else {
					el.removeClass("expanded");
				}
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
