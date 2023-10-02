
// tunes.library

{
	init() {
		karaqu.shell(`fs -k mp3`)
			.then(res => this.dispatch({ type: "parse-music-files", list: res.result }));
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.library,
			el;
		// console.log(event);
		switch (event.type) {
			case "parse-music-files":
				event.list.map(file => {
					let id = file.path.sha1(),
						xNode = window.bluePrint.selectNodes(`//AllFiles//*[@id="${id}"]`);
					if (xNode.length) {
						let name = file.name.endsWith(".mp3") ? file.name.slice(0,-4) : file.name;
						if (name.includes(" - ")) {
							let [artist, title] = name.split(" - ");
							xNode.map(x => {
								x.setAttribute("artist", artist);
								x.setAttribute("title", title);
							});
						}
						xNode.map(x => {
							x.setAttribute("name", name);
							x.setAttribute("path", file.path);
							x.setAttribute("date", file.isodate);
						});
					}
				});
				// console.log( window.bluePrint.selectSingleNode(`//AllFiles`) );
				break;
		}
	}
}
