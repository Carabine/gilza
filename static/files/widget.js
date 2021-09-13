(function widgetGilza() {
	var config = GILZA_WIDGET_CONFIG;
	if (!config.delay || isNaN(config.delay) || !isFinite(config.delay)) config.delay = 0;

	createWidget()

	function createWidget() {
		appendStyles();
		createWidgetElements();
		fillWidgetContent();
	}

	function fillWidgetContent() {
		var button = document.querySelector('.gilza-widget-toggle button');
		if (button) {
			const iframe = document.createElement("iframe")
			iframe.setAttribute("src", `${config.frontendUrl}/projects/${config.projectId}/video`)

			const widgetToggle = document.createElement('div')
			widgetToggle.setAttribute("class", 'gilza-widget-toggle-video')
			widgetToggle.appendChild(iframe)
			
			const span = document.createElement('span')
			span.setAttribute("class", 'gilza-widget-caption')
			span.textContent = config.text

			const widgetHide = document.createElement('div')
			widgetHide.setAttribute("class", 'gilza-widget-hide')

			button.appendChild(widgetToggle)
			button.appendChild(span)
			button.appendChild(widgetHide)

			setTimeout(() => document.querySelector('.gilza-widget-toggle').classList.add('gilza-widget-ready'), 2000)
			
			document.querySelector('.gilza-widget-toggle .gilza-widget-hide').addEventListener('click', function (event) {
				event.stopPropagation();
				var el = document.querySelector('.gilza-widget-toggle');
				el.parentNode.removeChild(el);
			})
			button.addEventListener('click', showGilzaWidget);
		}
	}

	function showGilzaWidget() {
		var cont = document.querySelector('.gilza-widget-content');
		cont.classList.add('gilza-widget-active');
		cont.innerHTML = '<div class="gilza-widget-content-in">' +
			'<button type="button" class="gilza-widget-close"></button>' +
			`<iframe src="${config.frontendUrl}/public/${config.projectId}?embed" allow="camera; microphone; autoplay; encrypted-media;" width="100%" height="100%" />` +
			'</div>';
		document.querySelector('.gilza-widget-close').addEventListener('click', function () {
			var el = document.querySelector('.gilza-widget-content');
			el.classList.remove('gilza-widget-active');
			el.innerHTML = '';
		});
	}

	window.showGilzaWidget = showGilzaWidget;


	function appendStyles() {
		var el = document.createElement("link");
		el.rel = "stylesheet";
		el.href = `${config.backendUrl}/static/files/widget.css`;
		el.type = "text/css";
		document.querySelector('head').appendChild(el);
	}

	function createWidgetElements() {
		if (config.type != 'invisible') {
			var el = document.createElement('div');
			el.classList.add('gilza-widget-toggle');
			if (config.type) el.classList.add('gilza-widget-type-' + config.type);
			if (config.position) el.classList.add('gilza-widget-position-' + config.position);
			var button = document.createElement('button');
			button.type = 'button';
			el.appendChild(button);
			document.querySelector('body').appendChild(el);
		}

		el = document.createElement('div');
		el.classList.add('gilza-widget-content');
		if (config.position) el.classList.add('gilza-widget-position-' + config.position);
		document.querySelector('body').appendChild(el);
	}
})();

