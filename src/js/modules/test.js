
let Test = {
	init(APP) {
		
		setTimeout(() => window.find(`sidebar li:nth(0)`).trigger("click"), 200);
		// setTimeout(() => window.find(`sidebar .icon.arrow:nth(5)`).addClass("down"), 500);

	}
};
