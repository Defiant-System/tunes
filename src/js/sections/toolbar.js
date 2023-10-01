
// tunes.toolbar

{
	init() {
		// fast references
		this.els = {
			btnPlay: window.find(`.toolbar-tool_[data-click="play-toggle"]`),
			btnPrev: window.find(`.toolbar-tool_[data-click="play-prev"]`),
			btnNext: window.find(`.toolbar-tool_[data-click="play-next"]`),
			songTitle: window.find(`.toolbar-group_ .song-name`),
			timePlayed: window.find(`.toolbar-group_ .time-played`),
			timeTotal: window.find(`.toolbar-group_ .time-total`),
			progLoaded: window.find(".progress-loaded"),
			progPlayed: window.find(".progress-played"),
			audio: window.find("audio"),
		};
		// direct access to audio element
		this.player = this.els.audio[0];
		// bind event handlers
		this.els.audio
			.on("timeupdate", this.dispatch.bind(this))
			.on("canplaythrough", this.dispatch.bind(this))
			.on("progress", this.dispatch.bind(this));
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.toolbar,
			name,
			value,
			time,
			seconds,
			minutes,
			percentage,
			el;
		// console.log(event);
		switch (event.type) {
			// player events
			case "timeupdate":
				time = Math.round(Self.player.currentTime);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timePlayed.html(`${minutes}:${seconds}`);
				// progress bar update
				percentage = parseInt((Self.player.currentTime / Self.player.duration) * 100, 10);
				if (percentage === 100) {
					Self.dispatch({type: "toggle-play"});
					percentage = 0;
				}
				Self.els.progPlayed.css({ width: percentage + "%" });
				break;
			case "canplaythrough":
				time = Math.round(Self.player.duration);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timeTotal.html(`${minutes}:${seconds}`);

				if (Self.skipPlayThrough) return;
				// reset time played
				Self.els.timePlayed.html(`0:00`);
				break;
			case "progress":
				for (var i = 0; i < Self.player.buffered.length; i++) {
					if (Self.player.buffered.start(Self.player.buffered.length - 1 - i) < Self.player.currentTime) {
						percentage = parseInt((Self.player.buffered.end(Self.player.buffered.length - 1 - i) / Self.player.duration) * 100, 10);
						break;
					}
				}
				Self.els.progLoaded.css({ width: percentage + "%" });
				break;
			// custom events
			case "reset-display":
				Self.els.songTitle.html(event.base || "");
				Self.els.timePlayed.html(`0:00`);
				Self.els.timeTotal.html(`0:00`);
				Self.els.progLoaded.css({ width: 0 });
				Self.els.progPlayed.css({ width: 0 });
				// start loading file
				Self.els.audio.attr({ src: event.path });

				if (event.autoplay) {
					Self.dispatch({ type: "play-toggle", play: true })
				}
				break;
			case "toggle-sidebar":
				return APP.sidebar.dispatch(event);
			case "play-toggle":
				el = Self.els.btnPlay;
				if (!el.hasClass("playing") || event.play === true) {
					value = "icon-pause";
					el.addClass("playing");
					Self.player.play();
				} else {
					value = "icon-play";
					el.removeClass("playing");
					Self.player.pause();
				}
				// ui update
				el.find("> span").removeClass("icon-pause icon-play")
					.css({ "background-image": `url('~/icons/${value}.png')` })
					.addClass(value);
				// content list update
				APP.content.els.el.find(".track-playing").toggleClass("paused", el.hasClass("playing"));
				break;
			case "play-prev":
				break;
			case "play-next":
				break;
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
