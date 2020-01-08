
const tunes = {
	async init() {
		// fast references
		this.content = window.find("content");
		this.btnPlay = this.content.find(".btn-play");
		this.btnPrev = this.content.find(".btn-prev");
		this.btnNext = this.content.find(".btn-next");
		this.btnRandom = this.content.find(".btn-random");
		this.btnRepeat = this.content.find(".btn-repeat");

		this.songTitle = this.content.find(".title-bar");
		this.timePlayed = this.content.find(".time-played");
		this.timeTotal = this.content.find(".time-total");

		this.progressLoaded = this.content.find(".progress-loaded");
		this.progressPlayed = this.content.find(".progress-played");

		this.audio = this.content.find("audio");
		this.music = this.audio[0];

		// bind event handlers
		this.audio
			.on("timeupdate", this.dispatch.bind(this))
			.on("canplaythrough", this.dispatch.bind(this))
			.on("progress", this.dispatch.bind(this));
	},
	async dispatch(event) {
		let isOn,
			time,
			seconds,
			minutes,
			percentage,
			value;
		//console.log(event);
		switch (event.type) {
			// native events
			case "progress":
				for (var i = 0; i < this.music.buffered.length; i++) {
					if (this.music.buffered.start(this.music.buffered.length - 1 - i) < this.music.currentTime) {
						percentage = parseInt((this.music.buffered.end(this.music.buffered.length - 1 - i) / this.music.duration) * 100, 10);
						break;
					}
				}
				this.progressLoaded.css({width: percentage + "%"});
				break;
			case "timeupdate":
				time = Math.round(this.music.currentTime);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				this.timePlayed.html(`${minutes}:${seconds}`);
				// progress bar update
				percentage = parseInt((this.music.currentTime / this.music.duration) * 100, 10);
				if (percentage === 100) {
					this.dispatch({type: "toggle-play"});
					percentage = 0;
				}
				this.progressPlayed.css({width: percentage + "%"});
				break;
			case "canplaythrough":
				time = Math.round(this.music.duration);
				seconds = (time % 60).toString().padStart(2, "0");
				minutes = parseInt(time / 60, 10);
				this.timeTotal.html(`${minutes}:${seconds}`);

				if (this.skipPlayThrough) return;
				// reset time played
				this.timePlayed.html(`0:00`);
				break;
			// custom events
			case "window.open":
				//this.audio.attr({src: "/fs/usr/mp3/Eclectek_-_02_-_We_Are_Going_To_Eclecfunk_Your_Ass.mp3"});
				//this.dispatch({type: "window.maximize"});
				break;
			case "window.close":
				if (this.btnPlay.hasClass("playing")) this.dispatch({type: "toggle-play"});
				break;
			case "open.file":
				if (this.btnPlay.hasClass("playing")) this.dispatch({type: "toggle-play"});
				this.songTitle.html(event.name.slice(0, event.name.lastIndexOf(".")));
				this.audio.attr({src: event.path});
				this.dispatch({type: "toggle-play"});
				break;
			case "window.restore":
				this.content.removeClass("extended");
				return false;
			case "window.maximize":
				window.height = "auto";
				this.content.addClass("extended");
				return false;
			// custom click events
			case "progress-seek":
				let rect = event.el[0].getBoundingClientRect(),
					left = event.clientX - rect.left;

				this.skipPlayThrough = true;
				time = this.music.duration * (left / event.el.width());
				this.music.currentTime = time;

				setTimeout(() => tunes.skipPlayThrough = false, 10);
				break;
			case "play-prev":
				break;
			case "toggle-play":
				if (this.btnPlay.hasClass("playing")) {
					this.music.pause();
					this.btnPlay.removeClass("playing");
				} else {
					this.music.play();
					this.btnPlay.addClass("playing");
				}
				break;
			case "play-next":
				break;
			case "play-random":
				isOn = this.btnRandom.hasClass("active");
				this.btnRandom.toggleClass("active", isOn);
				return !isOn;
			case "play-repeat":
				isOn = this.btnRepeat.hasClass("active");
				this.btnRepeat.toggleClass("active", isOn);
				return !isOn;
		}
	}
};

window.exports = tunes;
