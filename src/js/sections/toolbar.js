
// tunes.toolbar

{
	init() {
		// fast references
		this.els = {
			btnPlay: window.find(`.toolbar-tool_[data-click="play"]`),
			btnPrev: window.find(`.toolbar-tool_[data-click="prev"]`),
			btnNext: window.find(`.toolbar-tool_[data-click="next"]`),
			songTitle: window.find(`.toolbar-group_ .song-name`),
			timePlayed: window.find(`.toolbar-group_ .time-played`),
			timeTotal: window.find(`.toolbar-group_ .time-total`),
			progLoaded: window.find(".progress-loaded"),
			progPlayed: window.find(".progress-played"),
		};
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.toolbar,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "reset-display":
				Self.els.songTitle.html(event.title || "");
				Self.els.timePlayed.html("0:00");
				Self.els.timeTotal.html("0:00");
				Self.els.progLoaded.css({ width: 0 });
				Self.els.progPlayed.css({ width: 0 });
				break;
			case "toggle-sidebar":
				return APP.sidebar.dispatch(event);
			case "play-toggle":
				el = event.el.find("> span");
				value = el.hasClass("icon-play") ? "icon-pause" : "icon-play";
				el.removeClass("icon-pause icon-play")
					.css({ "background-image": `url('~/icons/${value}.png')` })
					.addClass(value);
				break;
			case "play-prev": break;
			case "play-toggle": break;
			case "play-next": break;
			case "play-random":
				value = event.el.hasClass("active");
				event.el.toggleClass("active", value);
				break;
			case "play-repeat":
				value = event.el.hasClass("active");
				event.el.toggleClass("active", value);
				break;
			case "set-volume":
				console.log(event.value);
				break;
		}
	}
}
