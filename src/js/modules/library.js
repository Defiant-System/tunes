
// tunes.library

{
	init() {
		// auto tag all nodes with id's
		let now = Date.now();
		window.bluePrint.selectNodes(`//*[not(@_id)]`).map((x, i) => x.setAttribute("_id", now + i));
		window.bluePrint.selectNodes(`//*[@ref][not(@dur)]`).map(x => {
			let node = window.bluePrint.selectSingleNode(`//*[@id="${x.getAttribute("ref")}"]`);
			if (node) x.setAttribute("dur", node.getAttribute("dur"));
		})
		// get all mp3 files from filesystem
		karaqu.shell(`fs -k mp3`)
			.then(res => this.dispatch({ type: "parse-music-files", list: res.result }));
	},
	dispatch(event) {
		let APP = tunes,
			Self = APP.library,
			xRoot,
			xNode,
			el;
		// console.log(event);
		switch (event.type) {
			case "parse-music-files":
				xRoot = window.bluePrint.selectSingleNode(`//AllFiles`);
				// loop all files
				event.list.map(file => {
					let id = file.path.sha1(),
						xNode = xRoot.selectNodes(`//*[@id="${id}"]`);
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
					} else {
						// new file
						xNode = $.nodeFromString(`<i id="${id}" name="${file.name}" path="${file.path}"/>`);
						xNode = xRoot.appendChild(xNode);
					}
				});
				// check if old nodes needs to be purged
				xRoot.selectNodes(`.//*[not(@path)]`).map(x => x.parentNode.removeChild(x));
				// console.log( window.bluePrint.selectSingleNode(`//AllFiles`) );

				window.bluePrint.selectNodes(`//Cdn/*`).map(x => {
					let [name, artist] = x.getAttribute("title").split(" - ");
					x.setAttribute("artist", artist);
					x.setAttribute("name", name);
				});
				// console.log( window.bluePrint.selectSingleNode(`//Cdn`) );
				break;
			case "parse-single-node":
				
				break;
			case "create-new-playlist":
				xRoot = window.bluePrint.selectSingleNode(`//Playlists`);
				xNode = $.nodeFromString(`<i _id="${Date.now()}" owner="me" name="New Playlist"/>`);
				return xRoot.appendChild(xNode);
			case "clean-allfiles-nodes":
				xRoot = window.bluePrint.selectSingleNode(`//AllFiles`);
				xRoot.selectNodes(`.//*[@id]`).map(xNode =>
					[...xNode.attributes].map(x =>
						["id", "lp", "fav", "dur"].includes(x.name) ? null : xNode.removeAttribute(x.name)));
				// console.log(xRoot.xml);
				break;
		}
	}
}
