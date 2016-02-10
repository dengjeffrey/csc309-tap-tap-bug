const HEIGHT = 50;
const HEAD_PROPORTION = 0.35;
const BODY_PROPORTION = 0.3;
const END_PROPORTION = 0.4;
// Where each portion of the body begins in percentage of the height of the last body part
const BODY_CONNECTION_PROPORTION_INSET = 0.3;
// Distance between the two bottom endpoints of the atennas 
const ATENNA_STEEPNESS = 3;
const PINCER_SPACING = 3;
const PINCER_HEIGHT = 5;
// Legs
// Where the leg starts n proportion to the height of the middle proportion
const FIRST_LEG_START_PROPORTION = 0.46;
const SECOND_LEG_START_PROPORTION = 0.75;
const LAST_LEG_START_PROPORTION = 0.65;
// Where the limb starts n proportion to the height of the whole ant
const FIRST_LEG_LIMB_PROPORTION = 0.45;
const SECOND_LEG_LIMB_PROPORTION = 0.58;
const LAST_LEG_LIMB_PROPORTION = 0.75;
const FIRST_LEG_END_PROPORTION = 0.50;
const SECOND_LEG_END_PROPORTION = 0.70;
const LAST_LEG_END_PROPORTION = 0.94;
const FIRST_LEG_END_WIDTH_PROPORTION = 0.12;
const SECOND_LEG_END_WIDTH_PROPORTION = 0.14;
const LAST_LEG_END_WIDTH_PROPORTION = 0.08;

// Painting one bug with x, y being left top corner
function makeBug(ctx, colour, visibility, x, y) {
	const WIDTH = HEIGHT * 0.65;
	var xCenter = WIDTH / 2 + x;
	var yBottom = HEIGHT + y;
	var headRadius = (HEIGHT * HEAD_PROPORTION / 2);
	var middleRadius = (HEIGHT * BODY_PROPORTION / 2);
	var endRadius = (HEIGHT * END_PROPORTION / 2);

	ctx.globalAlpha = 1;
	// Bottom
	ctx.beginPath();
	var endBodyCenterY = yBottom - endRadius;
	var endBodyBottomY = endBodyCenterY + endRadius;
	ctx.arc(xCenter, endBodyCenterY, endRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = colour;
	ctx.fill();
	// Middle
	ctx.beginPath();
	var middleBodyBottomY = (endBodyCenterY - endRadius) + BODY_CONNECTION_PROPORTION_INSET * (endRadius * 2);
	var middleBodyCenterY = middleBodyBottomY - middleRadius;
	ctx.arc(xCenter, middleBodyCenterY, middleRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = colour;
	ctx.fill();
	// Head
	ctx.beginPath();
	var headBodyBottomY = (middleBodyCenterY - middleRadius) + BODY_CONNECTION_PROPORTION_INSET * (middleRadius * 2);
	var headBodyCenterY = headBodyBottomY - headRadius;
	ctx.arc(xCenter, headBodyCenterY, headRadius, 0, 2 * Math.PI, false);
	ctx.fillStyle = colour;
	ctx.fill();
	// Atennas
	ctx.beginPath();
	ctx.strokeStyle = colour;
	ctx.lineWidth = 1;
	ctx.moveTo(xCenter - endRadius, y);
	ctx.lineTo(xCenter - ATENNA_STEEPNESS / 2, headBodyCenterY);
	ctx.stroke();
	ctx.moveTo(xCenter + endRadius, y);
	ctx.lineTo(xCenter + ATENNA_STEEPNESS / 2, headBodyCenterY);
	ctx.stroke();
	// Pincers
	// Left
	ctx.beginPath();
	ctx.fillStyle = colour;
	ctx.moveTo(xCenter - PINCER_SPACING / 2, headBodyCenterY - headRadius - PINCER_HEIGHT);
	ctx.lineTo(xCenter - headRadius, headBodyCenterY);
	ctx.lineTo(xCenter - PINCER_SPACING / 2, headBodyCenterY);
	ctx.fill();
	// Right
	ctx.beginPath();
	ctx.fillStyle = colour;
	ctx.moveTo(xCenter + PINCER_SPACING / 2, headBodyCenterY - headRadius - PINCER_HEIGHT);
	ctx.lineTo(xCenter + headRadius, headBodyCenterY);
	ctx.lineTo(xCenter + PINCER_SPACING / 2, headBodyCenterY);
	ctx.fill();
	// Legs
	// Left
	var firstLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - FIRST_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, firstLegStartingY);
	ctx.lineTo(x + WIDTH * FIRST_LEG_END_WIDTH_PROPORTION, y + HEIGHT * FIRST_LEG_LIMB_PROPORTION);
	ctx.lineTo(x, y + HEIGHT * FIRST_LEG_END_PROPORTION);
	ctx.stroke();
	var secondLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - SECOND_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, secondLegStartingY);
	ctx.lineTo(x + WIDTH * SECOND_LEG_END_WIDTH_PROPORTION, y + HEIGHT * SECOND_LEG_LIMB_PROPORTION);
	ctx.lineTo(x, y + HEIGHT * SECOND_LEG_END_PROPORTION);
	ctx.stroke();
	var thirdLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - LAST_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, thirdLegStartingY);
	ctx.lineTo(x + WIDTH * LAST_LEG_END_WIDTH_PROPORTION, y + HEIGHT * LAST_LEG_LIMB_PROPORTION);
	ctx.lineTo(x, y + HEIGHT * LAST_LEG_END_PROPORTION);
	ctx.stroke();
	// Legs
	// Right
	var firstLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - FIRST_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, firstLegStartingY);
	ctx.lineTo((x + WIDTH) - WIDTH * FIRST_LEG_END_WIDTH_PROPORTION, y + HEIGHT * FIRST_LEG_LIMB_PROPORTION);
	ctx.lineTo((x + WIDTH), y + HEIGHT * FIRST_LEG_END_PROPORTION);
	ctx.stroke();
	var secondLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - SECOND_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, secondLegStartingY);
	ctx.lineTo((x + WIDTH) - WIDTH * SECOND_LEG_END_WIDTH_PROPORTION, y + HEIGHT * SECOND_LEG_LIMB_PROPORTION);
	ctx.lineTo(x + WIDTH, y + HEIGHT * SECOND_LEG_END_PROPORTION);
	ctx.stroke();
	var thirdLegStartingY = middleBodyBottomY - (middleRadius * 2) * (1 - LAST_LEG_START_PROPORTION);
	ctx.beginPath();
	ctx.moveTo(xCenter, thirdLegStartingY);
	ctx.lineTo((x + WIDTH) - WIDTH * LAST_LEG_END_WIDTH_PROPORTION, y + HEIGHT * LAST_LEG_LIMB_PROPORTION);
	ctx.lineTo(x + WIDTH, y + HEIGHT * LAST_LEG_END_PROPORTION);
	ctx.stroke();
	// White overlay
	ctx.beginPath();
	ctx.globalAlpha = visibility;
	ctx.fillStyle = "white"
	ctx.fillRect(x, y, WIDTH, HEIGHT);
}