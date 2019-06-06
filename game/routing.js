const { Router } = require('express')
const gameRouter = new Router()

// gameRouter.post('/shoot', function(req, res){
// })

module.exports = function routing (dispatch, bubbles) {
  return gameRouter.post('/shoot', (request, response) => {
    const { angle, shotBubbleColor } = request.body
    shootBubble(angle, shotBubbleColor, bubbles.table)
    pickNewBubbleColor(bubbles.bubbleToShoot)
    dispatch(bubbles)
    response.status(201).send(bubbles)
  })
}

function shootBubble(angle, shotBubbleColor, bubbles){
  let prevRow;
  let prevColumn;

  const columnStepSize = angle / 45;
  let currentColumn = 5.5 - columnStepSize;
  const startingRow = 8;

  // Go through the rows and go a column to the left or right
  for(let row=startingRow; row>=0; row--){
    currentColumn += columnStepSize;
    const roundedColumn = Math.floor(currentColumn)
    if(roundedColumn < 0 || roundedColumn > 10){
      break; //if bubble gets out of the screen break from loop
    }
    console.log('row and column: ', row, currentColumn, roundedColumn)

    // Check if it hits a ball
    const hitBubble = bubbles[row][roundedColumn];
    const hitBubbleColor = hitBubble.color;

    if(hitBubbleColor !== null){
      console.log(shotBubbleColor, 'hits: ', hitBubbleColor);
      compareColors(hitBubbleColor, shotBubbleColor, row, roundedColumn, bubbles, prevRow, prevColumn)
      break;
    }

    prevRow = row;
    prevColumn = roundedColumn;
  }
}

function compareColors(hitBubbleColor, shotBubbleColor, row, column, bubbles, prevRow, prevColumn){
  if(hitBubbleColor === shotBubbleColor){
    bubbles[row][column].color = null;
    // deleteNeightborColors(shotBubbleColor, row, column, bubbles);
  } else {
    if(prevRow === undefined || prevColumn === undefined){
      return;
    }
    bubbles[prevRow][prevColumn].color = shotBubbleColor;
  }
}

function pickNewBubbleColor(bubble){
  const allColors = ['blue', 'red', 'purple', 'green'];
  const randomColor = allColors[Math.floor(Math.random() * 4)];
  bubble.color = randomColor;
}

function deleteNeightborColors(shotBubbleColor, row, column, bubbles){
  for(let i=row; i>row; i++){

  }
}