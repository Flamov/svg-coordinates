const Svg = require('svgutils').Svg;
const jsonfile = require('jsonfile');

const output = {
	'points': []
};

function parseGroup(group) {

	const children = {};

	for (var i = 0; i < group.childs.length; i++) {

		const target = group.childs[i];

		const point = {
			x: target.cx,
			y: target.cy
		};

		/*
			If the element has a name, construct an object
			with the key as the element name to append to
			the paraent group; otherwise, add the element
			object to the output 'points' array
		*/

		if (target.hasOwnProperty('name') === true && target.name !== '') {
			const name = String(target.name).toLowerCase();
			children[name] = point;
		}
		else {
			output.points.push(point);
		}

	}

	return {
		name: String(group.name).toLowerCase(),
		children: children
	};

}

Svg.fromSvgDocument('./tests/test-small.svg', function(error, svg) {

	for (var i = 0; i < svg.elements.length; i++) {

		const target = svg.elements[i];

		if (target.type === 'g') {

			/*
				Elements that are must be parsed for their children
			*/

			var group = parseGroup(target);

			/*
				If the returned group has no children, avoid adding
				an empty object to the output
			*/

			if (Object.keys(group.children).length > 0) {
				output[group.name] = group.children;
			}

		}
		else {

			/*
				If the element is not a group, then add an object
				with its coordinates to the output 'points' array
			*/

			output.points.push({
				x: target.cx,
				y: target.cy
			});

		}

	}

	jsonfile.writeFile('./output.json', output, {spaces: 2}, function (error) {
		console.error(error);
	});

});
