
// tunes.toolbar

{
	init() {
		// fast references
		this.els = {
			doc: $(document),
			content: window.find(`content`),
			display: window.find(`.display .toolbar-field_`),
			btnPlay: window.find(`.toolbar-tool_[data-click="play-toggle"]`),
			btnPrev: window.find(`.toolbar-tool_[data-click="play-prev"]`),
			btnNext: window.find(`.toolbar-tool_[data-click="play-next"]`),
			iconRandom: window.find(`.toolbar-group_ .icon-random`),
			iconRepeat: window.find(`.toolbar-group_ .icon-repeat`),
			songTitle: window.find(`.toolbar-group_ .song-name`),
			timePlayed: window.find(`.toolbar-group_ .time-played`),
			timeTotal: window.find(`.toolbar-group_ .time-total`),
			progLoad: window.find(`.progress-loaded`),
			progPlayed: window.find(`.progress-played`),
			progTrack: window.find(`.progress-track`),
			progKnob: window.find(`.progress-track .knob`),
			volumeRange: window.find(`.tools-right input[name="volume"]`),
			audio: window.find("audio"),
		};
		// defaults
		this.playTrack = null;
		this.playIndex = 0;
		this.playList = [];
		// direct access to audio element
		this.player = this.els.audio[0];
		// random & repeat buttons
		this.els.iconRandom.toggleClass("active", !tunes.settings.Random);
		this.els.iconRepeat.toggleClass("active", !tunes.settings.Repeat);
		// set volume
		this.player.volume = tunes.settings.Volume;
		this.els.volumeRange.val(tunes.settings.Volume * 100 | 0);
		// bind event handlers
		this.els.audio
			.on("timeupdate", this.dispatch.bind(this))
			.on("canplaythrough", this.dispatch.bind(this))
			.on("progress", this.dispatch.bind(this));
		// display seeker
		this.els.progTrack.on("mousedown", this.doSeeker);
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.toolbar,
			xpath,
			xnode,
			name,
			value,
			time,
			seconds,
			minutes,
			percentage,
			left,
			el;
		// console.log(event);
		switch (event.type) {
			// player events
			case "timeupdate":
				// if drag'n drop seeker
				if (Self.drag) return;
				// calculate display ui update
				time = Math.round(Self.player.currentTime);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timePlayed.html(`${minutes}:${seconds}`);
				// progress bar update
				percentage = Self.player.currentTime / Self.player.duration;
				if (percentage === 1) return Self.dispatch({ type: "play-next" });
				left = +Self.els.progTrack.prop("offsetWidth") * percentage;
				Self.els.progKnob.css({ left });
				Self.els.progPlayed.css({ width: left });
				break;
			case "canplaythrough":
				time = Math.round(Self.player.duration);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timeTotal.html(`${minutes}:${seconds}`);
				// update song duration
				APP.content.dispatch({
					type: "update-song-duration",
					id: Self.playTrack,
					time: `${minutes}:${seconds}`,
					duration: time * 1e3,
				});

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
				Self.els.progLoad.css({ width: percentage + "%" });
				break;
			// custom events
			case "reset-display":
				Self.els.display.toggleClass("blank-display", !!event.name);
				Self.els.songTitle.html(event.name);
				Self.els.timePlayed.html(`0:00`);
				Self.els.timeTotal.html(`0:00`);
				Self.els.progLoad.css({ width: 0 });
				Self.els.progPlayed.css({ width: 0 });
				// if it is only "reset"
				if (!event.path) return APP.content.dispatch({ type: "no-active" });
				// start loading file
				Self.els.audio.attr({ src: event.path });

				if (event.autoplay) {
					Self.dispatch({ type: "play-toggle", play: true })
				}
				break;
			case "toggle-sidebar":
				return APP.sidebar.dispatch(event);
			case "play-list":
				Self.playIndex = event.index || 0;
				Self.playList = event.list || APP.content.dispatch({ type: "get-song-list" });
				Self.playTrack = Self.playList[Self.playIndex];
				
				xpath = `//AllFiles//i[@id="${Self.playTrack}"]`;
				Self.playNode = window.bluePrint.selectSingleNode(xpath);

				Self.dispatch({
					type: "reset-display",
					name: Self.playNode.getAttribute("name"),
					path: Self.playNode.getAttribute("path"),
					autoplay: true,
				});
				break;
			case "play-toggle":
				el = Self.els.btnPlay;
				// get track, if not set
				if (!Self.playTrack) return Self.dispatch({ type: "play-list" });
				
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
				APP.content.dispatch({
					type: "update-active",
					id: Self.playTrack,
					playing: el.hasClass("playing"),
				});
				break;
			case "play-prev":
				Self.dispatch({ type: "play-list", index: Self.playIndex - 1 });
				break;
			case "play-next":
				if (Self.playIndex + 1 < Self.playList.length) {
					Self.dispatch({ type: "play-list", index: Self.playIndex + 1 });
				} else if (APP.settings.Repeat) {
					Self.dispatch({ type: "play-list", index: 0 });
				} else {
					Self.dispatch({ type: "reset-display" });
				}
				break;
			case "play-random":
				value = event.el.hasClass("active");
				event.el.toggleClass("active", value);
				// update settings
				APP.settings.Random = !value;
				break;
			case "play-repeat":
				value = event.el.hasClass("active");
				event.el.toggleClass("active", value);
				// update settings
				APP.settings.Repeat = !value;
				break;
			case "set-volume":
				// set volume of player
				Self.player.volume = event.value / 100;
				// auto update settings
				APP.settings.Volume = Self.player.volume;
				break;
		}
	},
	doSeeker(event) {
		let APP = tunes,
			Self = APP.toolbar,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				let el  = $(event.target);
				if (el.hasClass("progress-track")) el = el.find(".knob");

				let rEl = Self.els.progTrack.parent(),
					pEl = Self.els.progPlayed,
					clickX = event.clientX - +el.prop("offsetLeft"),
					minX = 0,
					maxX = +rEl.prop("offsetWidth"),
					min_ = Math.min,
					max_ = Math.max,
					invLerp_ = Math.invLerp;

				Self.drag = { el, pEl, rEl, clickX, minX, maxX, min_, max_, invLerp_ };

				// "hover" even if mouse go away
				rEl.addClass("hover");
				// cover app
				window.el.addClass("ant-window-cover_");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doSeeker);
				break;
			case "mousemove":
				let left = Drag.min_(Drag.max_(event.clientX - Drag.clickX, Drag.minX), Drag.maxX);
				Drag.el.css({ left });
				Drag.pEl.css({ width: left });
				// save percentage
				Drag.percentage = Drag.invLerp_(Drag.minX, Drag.maxX, left);
				break;
			case "mouseup":
				// seek to "time"
				Self.player.currentTime = Self.player.duration * Drag.percentage;
				// reset progress-track
				Drag.rEl.removeClass("hover");
				// clean up
				delete Self.drag;
				// cover app
				window.el.removeClass("ant-window-cover_");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doSeeker);
				break;
		}
	}
}
