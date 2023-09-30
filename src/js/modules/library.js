
// tunes.library

{
	init() {
		karaqu.shell(`fs -k mp3`)
			.then(res => {
				console.log(res);
			});
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.library,
			el;
		// console.log(event);
		switch (event.type) {
			case "init":
				
				break;
		}
	}
}
