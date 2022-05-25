export default async function ($element, layout, self, qlik, $) {

	// Get Qlik API
	let app = await qlik.currApp(self);

	//////////////////
	// Init
	/////////////////

	// get variiable name and value
	const variableName = layout.props.variableName
	let currentValue = layout.props.currentValue;

	// integer range or list of values
	let rangeType = parseInt(layout.props.rangeType)

	// range variables
	const rangeMax = layout.props.rangeMax
	const rangeMin = layout.props.rangeMin
	const rangeStep = layout.props.rangeStep

	// list variables
	const listOptionsObject = layout.props.listOptions

	// Styling
	const buttonSize = layout.props.buttonSize;
	const iconIndex = layout.props.icons;
	const inactiveBackgroundColor = layout.props.inactiveBackgroundColor.color;
	const inactiveIconColor = layout.props.inactiveIconColor.color;

	const nextBackgroundColor = layout.props.nextBackgroundColor.color;
	const nextIconColor = layout.props.nextIconColor.color;

	const previousBackgroundColor = layout.props.previousBackgroundColor.color
	const previousIconColor = layout.props.previousIconColor.color

	// get button selectors
	const nextButton = self.$element.find('.qsvd__btn__next');
	const previousButton = self.$element.find('.qsvd__btn__previous');

	const iconPairs = [
		{
			previous: 'fas fa-minus',
			next: 'fas fa-plus'
		},
		{
			previous: 'fas fa-minus-circle',
			next: 'fas fa-plus-circle'
		},
		{
			previous: 'fas fa-arrow-left',
			next: 'fas fa-arrow-right'
		},
		{
			previous: 'fas fa-chevron-left',
			next: 'fas fa-chevron-right'
		},
		{
			previous: 'fas fa-angle-double-left',
			next: 'fas fa-angle-double-right'
		}
	]

	//////////////////
	// UTILS
	/////////////////

	let atMaxValue;
	let atMinValue;
	function updateButtonColours() {
		if (atMaxValue) {
			nextButton.css({
				'background-color': inactiveBackgroundColor,
				color: inactiveIconColor,
			})
		} else {
			nextButton.css({
				'background-color': nextBackgroundColor,
				color: nextIconColor,
			})
		}

		if (atMinValue) {
			previousButton.css({
				'background-color': inactiveBackgroundColor,
				color: inactiveIconColor,
			})
		} else {
			previousButton.css({
				'background-color': previousBackgroundColor,
				color: previousIconColor,
			})
		}
	}


	// ERROR HANDLING
	let errorMessage;

	function errorCheck() {
		if (!variableName) {
			return 'No variable selected'
		}
		else if (!currentValue) {
			return 'Enter an expression that returns the current value of the selected variable'
		} else if (rangeType === 0 && !rangeMax) {
			return 'Enter a range maximum'
		} else if (rangeType === 0 && !rangeMin) {
			return 'Enter a range minimum'
		} else if (rangeType === 0 && rangeMax <= rangeMin) {
			return 'Range maximum must be larger than minimum'
		} else if (rangeType === 0 && !(rangeMin <= currentValue && currentValue <= rangeMax)) {
			return 'Current value must be inside range'
		} else if (rangeType === 1 && listOptionsObject.length < 2) {
			return 'Enter at least two possible list values'
		} else if (rangeType === 1 && listOptionsObject.filter(option => option.value === currentValue).length === 0) {
			return 'Current value must be a list option'
		}
	}

	errorMessage = errorCheck();

	if (errorMessage) {
		self.$element.find(".qsvd__buttons").addClass("qsvd__hidden")
		self.$element.find(".qsvd__errorMessage").removeClass("qsvd__hidden")
		self.$element.find(".qsvd__errorMessage").html(`<p>${errorMessage}</p>`)
		return
	} else {
		self.$element.find(".qsvd__errorMessage").addClass("qsvd__hidden");
		self.$element.find(".qsvd__buttons").removeClass("qsvd__hidden");

	}

	//////////////////
	// MAIN
	/////////////////

	// clear old event listeners
	nextButton.off('click')
	previousButton.off('click')


	// Integer Range
	if (rangeType === 0) {

		if (parseInt(currentValue)) {

			currentValue = parseInt(currentValue);

			async function next() {
				if (currentValue < rangeMax) {
					currentValue += rangeStep
					if (currentValue > rangeMax) {
						currentValue = rangeMax
					}
					await app.variable.setNumValue(variableName, currentValue)
						.catch(err => {
							// console.log(err)
						})
					atMaxValue = currentValue === rangeMax;
					atMinValue = currentValue === rangeMin;
					updateButtonColours()
				}
			}

			async function previous() {
				if (currentValue > rangeMin) {
					currentValue -= rangeStep;
					if (currentValue < rangeMin) {
						currentValue = rangeMin;
					}
					await app.variable.setNumValue(variableName, currentValue)
						.catch(err => {
							// console.log(err)
						})
					atMaxValue = currentValue === rangeMax;
					atMinValue = currentValue === rangeMin;
					updateButtonColours()

				}
			}


			// Set inactive class if on range limit
			atMaxValue = currentValue === rangeMax;
			atMinValue = currentValue === rangeMin;
			updateButtonColours()



			// Set up click new event listeners
			nextButton.on('click', next)
			previousButton.on('click', previous)

		}
	}

	// List
	if (rangeType === 1) {

		async function next() {
			if (currentIndex < maxIndex) {
				currentIndex++;
				await app.variable.setStringValue(variableName, listOptions[currentIndex])
					.catch(err => {
						// console.log(err)
					})
				// Is current value at either limit?
				atMaxValue = currentIndex === maxIndex;
				atMinValue = currentIndex === 0;
				updateButtonColours()
			}
		}

		async function previous() {
			if (currentIndex > 0) {
				currentIndex--;
				await app.variable.setStringValue(variableName, listOptions[currentIndex])
					.catch(err => {
						// console.log(err)
					})
				// Is current value at either limit?
				atMaxValue = currentIndex === maxIndex;
				atMinValue = currentIndex === 0;
				updateButtonColours()

			}
		}


		const listOptions = listOptionsObject.map(obj => obj.value)
		let currentIndex = listOptions.indexOf(currentValue);
		const maxIndex = listOptions.length - 1;


		// Check that currentvalue is a possible value
		if (currentIndex > -1) {

			// set up event listener
			nextButton.on('click', next)
			previousButton.on('click', previous)

			// Is current value at either limit?
			atMaxValue = currentIndex === maxIndex;
			atMinValue = currentIndex === 0;
			updateButtonColours()
		}
	}

	// Styles
	const buttonHeight = buttonSize;
	const buttonWidth = buttonHeight * 4 / 3;
	const iconFontSize = buttonHeight * 3 / 5;

	nextButton.css({
		height: buttonHeight + 'px',
		width: buttonWidth + 'px'
	})
	previousButton.css({
		height: buttonHeight + 'px',
		width: buttonWidth + 'px'
	})
	updateButtonColours();


	// Add icons
	previousButton.html(`<i style="font-size: ${iconFontSize}px;" class="${iconPairs[iconIndex].previous}"></i>`);
	nextButton.html(`<i style="font-size: ${iconFontSize}px;" class="${iconPairs[iconIndex].next}"></i>`);

}