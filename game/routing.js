const { Router } = require('express')
const gameRouter = new Router()

const searchOffsets = [
  [0, -1],
  [-1, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
  [1, -1]
];
let matches = [];

module.exports = function routing (dispatch, bubbles) {
  return gameRouter.post('/shoot', (request, response) => {
    const { angle, shotBubbleColor } = request.body
    shootBubble(angle, shotBubbleColor, bubbles.table)
    pickNewBubbleColor(bubbles.bubbleToShoot)
    dispatch(bubbles)
    response.status(201).end()
  })
}

function shootBubble(angle, shotBubbleColor, bubbles){
  let prevRow;
  let prevColumn;

  const radians = angle * (Math.PI / 180);
  const columnStepSize = Math.sin(radians) / Math.cos(radians)
  let currentColumn = 5.5 + columnStepSize;
  const startingRow = 8;

  // Go through the rows and go a column to the left or right
  for(let row=startingRow; row>=0; row--){
    hexagonalCorrection = row % 2 * -0.5;
    currentColumn += columnStepSize;
    const roundedColumn = Math.floor(currentColumn + hexagonalCorrection)

    if(roundedColumn < 0 || roundedColumn > 10){
      removeNeighbors(shotBubbleColor, prevRow, prevColumn, bubbles);
      break; //if bubble gets out of the screen break from loop
    }

    console.log('row and column: ', row, currentColumn, roundedColumn)

    // Check if it hits a ball
    const hitBubble = bubbles[row][roundedColumn];
    const hitBubbleColor = hitBubble.color;

    if(hitBubbleColor !== null){
      removeNeighbors(shotBubbleColor, prevRow, prevColumn, bubbles);
      break;
    }
    if(row === 0 && hitBubbleColor === null){
      removeNeighbors(shotBubbleColor, row, roundedColumn, bubbles);
      break;
    }

    prevRow = row;
    prevColumn = roundedColumn;
  }
}

function compareNeighbors(shotColor, rowHit, columnHit, bubbles){
  searchOffsets.map(offset => {
    const [offsetRow, offsetColumn] = offset;
    const neighborRow = rowHit + offsetRow;
    const neighborColumn = columnHit + offsetColumn;
    if(neighborRow < 0 || neighborRow > 8 || neighborColumn < 0 || neighborColumn > 10){
      return;
    }

    const neighborColor = bubbles[neighborRow][neighborColumn].color;
    if(neighborColor === shotColor){
      const duplicate = matches.some(match => {
        return match[0] === neighborRow && match[1] === neighborColumn
      })
      if(!duplicate){
        matches.push([neighborRow, neighborColumn]);
        compareNeighbors(shotColor, neighborRow, neighborColumn, bubbles);
      }
    }
  })
  if(matches.length > 1){
    bubbles[rowHit][columnHit].color = null;
    matches.forEach(match => {
      bubbles[match[0]][match[1]].color = null;
    })
  }
}

function removeNeighbors(shotBubbleColor, row, column, bubbles){
  bubbles[row][column].color = shotBubbleColor;
  compareNeighbors(shotBubbleColor, row, column, bubbles);
  matches.length = 0;
}

function pickNewBubbleColor(bubble){
  const allColors = ['blue', 'red', 'purple', 'green'];
  const randomColor = allColors[Math.floor(Math.random() * 4)];
  bubble.color = randomColor;
}