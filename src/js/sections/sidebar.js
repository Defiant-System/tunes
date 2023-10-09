
// tunes.sidebar

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("sidebar .wrapper"),
			swap: window.find(".ux-swap"),
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
			xSrc,
			xnode,
			xpath,
			isOn,
			str,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "drop-playlist-before":
				// restructure nodes
				xSrc = window.bluePrint.selectSingleNode(`.//*[@_id="${event.el.data("_id")}"]`);
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${event.target.parent().data("_id")}"]`);
				xnode.parentNode.insertBefore(xSrc, xnode);
				// console.log( "before", window.bluePrint.selectSingleNode(`//Playlists`).xml );

				// UI update / move dragged html element
				el = Self.els.el.find(`li[data-_id="${event.el.data("_id")}"]`);
				event.target.parent().before(el[0]);

				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-playlist-after":
				// restructure nodes
				xSrc = window.bluePrint.selectSingleNode(`.//*[@_id="${event.el.data("_id")}"]`);
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${event.target.parent().data("_id")}"]`);
				xnode.parentNode.insertBefore(xSrc, xnode.nextSibling);

				// UI update / move dragged html element
				el = Self.els.el.find(`li[data-_id="${event.el.data("_id")}"]`);
				event.target.parent().after(el[0]);

				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-playlist-in-folder":
				// restructure nodes
				xSrc = window.bluePrint.selectSingleNode(`.//*[@_id="${event.el.data("_id")}"]`);
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${event.target.parent().data("_id")}"]`);
				// move dragged node in to drop target
				xnode.appendChild(xSrc);
				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-playlist-outside":
				/* falls through */
			case "reset-drag-drop":
				// clean up
				Self.els.swap.html("");
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
				Self.els.swap.data({ area: "sidebar" });
				// tag dragged item
				Self.dragOrigin = el.addClass("dragged");
				// tag "drop zones"
				Self.els.el.find(".user-list li > .leaf:not(.dragged)")
					.data({
						"drop-zone-before": "drop-playlist-before",
						"drop-zone-after": "drop-playlist-after",
						"drop-zone": "drop-playlist-in-folder",
						"drop-outside": "drop-playlist-outside",
					});
				// copy of dragable element
				str = `<div class="dragged-playlist drag-clone" data-_id="${el.parent().data("_id")}" style="opacity: 0; top: ${y}px; left: ${x}px;"><span>${title}</span></div>`;
				return Self.els.swap.append(str);

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
				if (event.button === 2) return;

				el = $(event.target);
				if (el.nodeName() !== "li") el = el.parents("li:first");
				if (el.hasClass("has-children")) {
					return el.find("> .leaf .icon-arrow").trigger("click");
				}

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
			// menu events
			case "play-playlist":
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${event.origin.el.data("_id")}"]`);
				// create list and play songs
				APP.toolbar.dispatch({
					type: "play-list",
					list: xnode.selectNodes(`.//*[@_id]`).map(x => x.getAttribute("_id")),
					index: 0,
				});
				break;
			case "rename-playlist":
				el = event.origin.el;
				offset = el.offset("sidebar");
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${el.data("_id")}"]`);
				
				title = event.origin.el.find(`> .leaf .name`).text();
				str = `<div class="rename-field"><input type="text" name="playlist-rename" value="${title}"/></div>`;
				Self.els.swap.append(str).css(offset);
				break;
			case "delete-playlist":
				// remove from XML data
				xnode = window.bluePrint.selectSingleNode(`.//*[@_id="${event.origin.el.data("_id")}"]`);
				xnode.parentNode.removeChild(xnode);
				// UI remove
				event.origin.el.remove();
				break;
		}
	}
}
