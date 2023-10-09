
// tunes.content

{
	init() {
		this.els = {
			layout: window.find("content"),
			el: window.find("list .wrapper"),
			swap: window.find(".ux-swap"),
		};
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.content,
			offset, x, y,
			table,
			cells,
			title,
			xpath,
			xnode,
			xSrc,
			list,
			row,
			str,
			pId,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "drop-track-before":
				// restructure nodes
				xSrc = window.bluePrint.selectSingleNode(`//*[@_id="${event.el.data("_id")}"]`);
				xnode = window.bluePrint.selectSingleNode(`//*[@_id="${event.target.data("_id")}"]`);
				xnode.parentNode.insertBefore(xSrc, xnode);

				// UI update / move dragged html element
				el = Self.els.el.find(`.row[data-_id="${event.el.data("_id")}"]`);
				event.target.before(el[0]);

				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-track-after":
				// restructure nodes
				xSrc = window.bluePrint.selectSingleNode(`//*[@_id="${event.el.data("_id")}"]`);
				xnode = window.bluePrint.selectSingleNode(`//*[@_id="${event.target.data("_id")}"]`);
				xnode.parentNode.insertBefore(xSrc, xnode.nextSibling);

				// UI update / move dragged html element
				el = Self.els.el.find(`.row[data-_id="${event.el.data("_id")}"]`);
				event.target.after(el[0]);

				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-track-in-folder":
				pId = event.target.parent().data("_id");
				if (event.el.data("_pId") !== pId) {
					xSrc = window.bluePrint.selectSingleNode(`//*[@_id="${event.el.data("_id")}"]`);
					xnode = window.bluePrint.selectSingleNode(`//*[@_id="${pId}"]`);
					xnode.appendChild(xSrc);
					// UI update / remove dragged html element
					Self.els.el.find(`.row[data-_id="${event.el.data("_id")}"]`).remove();
				}
				// reset drag / drop
				Self.dispatch({ type: "reset-drag-drop" });
				break;
			case "drop-track-outside":
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
				delete Self.dragOrigin.removeClass("dragged");
				break;

			case "check-track-drag":
				table = event.el.parents(".table:first");
				offset = event.el.offset("content");
				y = offset.top + event.offsetY - 12;
				x = offset.left + event.offsetX - 30;
				// "build" name shown in dragged tooltip
				cells = event.el.find(".cell");
				title = cells.get(1).text();
				if (cells.get(2).text()) title += " &#183; "+ cells.get(2).text();

				// for correct event proxying
				Self.els.swap.data({ area: "content" });
				// tag dragged item
				Self.dragOrigin = event.el.addClass("dragged");
				// tag "drop zones"
				APP.sidebar.els.el.find(".user-list li .leaf")
					.data({
						"drop-zone": "drop-track-in-folder",
						"drop-outside": "drop-track-outside",
					});
				// track not draggable if it is a "system list"
				if (!table.hasClass("enum")) {
					APP.content.els.el.find(".table .row:not(.head, .dragged)")
						.data({
							"drop-zone-before": "drop-track-before",
							"drop-zone-after": "drop-track-after",
							"drop-outside": "drop-track-outside",
						});
				}
				// copy of dragable element
				str = `<div class="dragged-track drag-clone" data-_id="${event.el.data("_id")}" data-_pId="${event.el.parent().data("_id")}" style="opacity: 0; top: ${y}px; left: ${x}px;"><span>${title}</span></div>`;
				return Self.els.swap.append(str);

			// custom events
			case "handle-dbl-click":
				console.log(event);
				break;
			case "render-playlist":
				// set limit value
				window.bluePrint.selectSingleNode(`//AllFiles`).setAttribute("limit", event.options.limit);
				// render list view
				window.render({
					match: event.xpath,
					template: "content-list",
					target: Self.els.el,
					...event.options,
				});
				// fix "title" if empty
				el = Self.els.el.find(`.playlist-info h2`);
				if (el.text().trim() === "-") el.html(event.title);
				break;
			case "select-track":
				event.el.find(".active").removeClass("active");
				$(event.target).addClass("active");
				break;
			case "no-active":
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				break;
			case "update-active":
				// ui update
				el = Self.els.el.find(`.row[data-_id="${event.id}"]`);
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				el.addClass("track-playing").toggleClass("paused", event.playing);
				break;
			case "update-song-duration":
				// ui update
				Self.els.el.find(`.row[data-_id="${event.id}"] .cell:nth(4)`).html(event.time);
				// update xml node
				APP.toolbar.playNode.setAttribute("dur", event.duration);
				break;
			case "get-song-list":
				return Self.els.el.find(".row[data-_id]").map(r => r.getAttribute("data-_id"));
			case "play-song":
				row = event.el.parents(".row");
				if (row.hasClass("track-playing")) {
					// row.removeClass("track-playing");
					if (row.hasClass("paused")) {
						row.removeClass("paused");
						return APP.toolbar.dispatch({ type: "play-toggle" });
					}
					row.addClass("paused");
					return APP.toolbar.dispatch({ type: "play-toggle" });
				}
				// reset previous active row, if any
				Self.els.el.find(".track-playing, .active").removeClass("track-playing active");
				
				// prepare toolbar event
				row.addClass("track-playing active");
				// create list and play songs
				APP.toolbar.dispatch({
					type: "play-list",
					list: Self.dispatch({ type: "get-song-list" }),
					index: row.index(),
				});
				break;
			case "toggle-heart":
				row = event.el.parents(".row");

				if (event.el.hasClass("icon-heart")) {
					event.el.prop({ className: "icon-heart-full" });
				} else {
					event.el.prop({ className: "icon-heart" });
				}
				break;
		}
	}
}
