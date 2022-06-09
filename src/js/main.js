
const tunes = {
	async init() {
		// fast references
		this.els = {
			content: window.find("content"),
			btnPlay: window.find(".btn-play"),
			btnPrev: window.find(".btn-prev"),
			btnNext: window.find(".btn-next"),
			btnRandom: window.find(".btn-random"),
			btnRepeat: window.find(".btn-repeat"),
			songTitle: window.find(".title-bar"),
			timePlayed: window.find(".time-played"),
			timeTotal: window.find(".time-total"),
			progressLoaded: window.find(".progress-loaded"),
			progressPlayed: window.find(".progress-played"),
			audio: window.find("audio"),
		};

		this.music = this.els.audio[0];

		// bind event handlers
		this.els.audio
			.on("timeupdate", this.dispatch.bind(this))
			.on("canplaythrough", this.dispatch.bind(this))
			.on("progress", this.dispatch.bind(this));

		//this.audio.attr({src: "/fs/usr/mp3/Eclectek_-_02_-_We_Are_Going_To_Eclecfunk_Your_Ass.mp3"});
		//this.dispatch({type: "window.maximize"});
	},
	async dispatch(event) {
		let Self = tunes,
			isOn,
			time,
			seconds,
			minutes,
			percentage,
			value;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.close":
				if (Self.els.btnPlay.hasClass("playing")) Self.dispatch({type: "toggle-play"});
				break;
			case "open.file":
				if (Self.els.btnPlay.hasClass("playing")) Self.dispatch({type: "toggle-play"});
				Self.els.songTitle.html(event.base);
				Self.els.audio.attr({src: event.path});
				Self.dispatch({type: "toggle-play"});
				break;
			case "window.restore":
				Self.els.content.removeClass("extended");
				return false;
			case "window.maximize":
				window.height = "auto";
				Self.els.content.addClass("extended");
				return false;
			// custom events
			case "progress":
				for (var i = 0; i < Self.music.buffered.length; i++) {
					if (Self.music.buffered.start(Self.music.buffered.length - 1 - i) < Self.music.currentTime) {
						percentage = parseInt((Self.music.buffered.end(Self.music.buffered.length - 1 - i) / Self.music.duration) * 100, 10);
						break;
					}
				}
				Self.els.progressLoaded.css({width: percentage + "%"});
				break;
			case "timeupdate":
				time = Math.round(Self.music.currentTime);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timePlayed.html(`${minutes}:${seconds}`);
				// progress bar update
				percentage = parseInt((Self.music.currentTime / Self.music.duration) * 100, 10);
				if (percentage === 100) {
					Self.dispatch({type: "toggle-play"});
					percentage = 0;
				}
				Self.els.progressPlayed.css({width: percentage + "%"});
				break;
			case "canplaythrough":
				time = Math.round(Self.music.duration);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				Self.els.timeTotal.html(`${minutes}:${seconds}`);

				if (Self.skipPlayThrough) return;
				// reset time played
				Self.els.timePlayed.html(`0:00`);
				break;
			case "progress-seek":
				let rect = event.el[0].getBoundingClientRect(),
					left = event.clientX - rect.left;

				Self.skipPlayThrough = true;
				time = Self.music.duration * (left / event.el.width());
				Self.music.currentTime = time;

				setTimeout(() => tunes.skipPlayThrough = false, 10);
				break;
			case "play-prev":
				break;
			case "toggle-play":
				if (Self.els.btnPlay.hasClass("playing")) {
					Self.music.pause();
					Self.els.btnPlay.removeClass("playing");
				} else {
					Self.music.play();
					Self.els.btnPlay.addClass("playing");
				}
				break;
			case "play-next":
				break;
			case "play-random":
				isOn = Self.els.btnRandom.hasClass("active");
				Self.els.btnRandom.toggleClass("active", isOn);
				return !isOn;
			case "play-repeat":
				isOn = Self.els.btnRepeat.hasClass("active");
				Self.els.btnRepeat.toggleClass("active", isOn);
				return !isOn;
		}
	}
};

window.exports = tunes;
