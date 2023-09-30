
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
						xNode = window.bluePrint.selectSingleNode(`//Data//*[@id="${id}"]`);
					if (xNode) {
						let name = file.name.endsWith(".mp3") ? file.name.slice(0,-4) : file.name;
						if (name.includes(" - ")) {
							let [artist, title] = name.split(" - ");
							xNode.setAttribute("artist", artist);
							xNode.setAttribute("title", title);
						}
						xNode.setAttribute("name", name);
					}
					// console.log(file);
				});
				break;
		}
	}
}
