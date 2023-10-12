
// tunes.sample

{
	init() {
		this.els = {
			el: window.find("sample .wrapper"),
		};
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.sample,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "open-filesystem":
				console.log(event);
				break;
		}
	}
}
