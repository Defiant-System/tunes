
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
			table,
			cells,
			title,
			xnode,
			xpath,
			isOn,
			str,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "check-folder-drop":
			case "check-sidebar-drop":
			case "check-content-drop":
				// clean up
				Self.els.dnd.html("");
				// reset original element
				APP.content.els.el.find(".dragged").removeClass("dragged");
				Self.els.el.find(".dragged").removeClass("dragged");
				// click element if no drag'n drop
				if (!event.hasMoved && Self.dragOrigin) Self.dragOrigin.trigger("click");
				// reset reference to dragged element
				delete Self.dragOrigin;
				break;
			case "check-playlist-drag":
				offset = event.el.offset("content");
				y = offset.top + event.offsetY - 12;
				x = offset.left + event.offsetX - 30;
				title = event.el.find(".name").text();
				// tag dragged item
				Self.dragOrigin = event.el.addClass("dragged");
				// tag "drop zones"
				Self.els.el.find(".user-list li:not(.dragged)").data({ "drop-zone": "check-folder-drop" });
				// copy of dragable element
				str = `<div class="dragged-playlist drag-clone" style="top: ${y}px; left: ${x}px;"><span>${title}</span></div>`;
				return Self.els.dnd.append(str);
			case "check-track-drag":
				table = event.el.parents(".table:first");
				offset = event.el.offset("content");
				y = offset.top + event.offsetY - 12;
				x = offset.left + event.offsetX - 30;
				// "build" name shown in dragged tooltip
				cells = event.el.find(".cell");
				title = cells.get(1).text();
				if (cells.get(2).text()) title += " &#183; "+ cells.get(2).text();

				// tag dragged item
				Self.dragOrigin = event.el.addClass("dragged");
				// tag "drop zones"
				Self.els.el.find(".user-list li:not(.dragged)").data({ "drop-zone": "check-folder-drop" });
				// track not draggable if it is a "system list"
				if (!table.hasClass("enum")) {
					APP.content.els.el.find(".table .row:not(.head, .dragged)").data({ "drop-zone": "check-content-drop" });
				}
				// copy of dragable element
				str = `<div class="dragged-song drag-clone" style="top: ${y}px; left: ${x}px;"><span>${title}</span></div>`;
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
