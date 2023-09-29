
// tunes.toolbar

{
	init() {
		
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.toolbar,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			case "play":
				el = event.el.find("> span");
				value = el.hasClass("icon-play") ? "icon-pause" : "icon-play";
				el.removeClass("icon-pause icon-play")
					.css({ "background-image": `url('~/icons/${value}.png')` })
					.addClass(value);
				break;
		}
	}
}
