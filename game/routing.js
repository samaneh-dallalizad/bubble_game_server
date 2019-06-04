const { Router } = require('express')
const gameRouter = new Router()

// gameRouter.post('/shoot', function(req, res){
// })

module.exports = function routing (dispatch, bubbles) {
  return gameRouter.post('/shoot', (request, response) => {
    const { angle, shotBubbleColor } = request.body
    shootBubble(angle, shotBubbleColor, bubbles)
    dispatch(bubbles)
    response.status(201).send(bubbles)
  })
}

function shootBubble(angle, shotBubbleColor, bubbles){
  const columnStepSize = angle / 45;
  let currentColumn = 5 + columnStepSize; 
  const startingRow = 8;

  // Go through the rows and go a column to the left or right
  for(let row=startingRow; row>=0; row--){
    currentColumn += columnStepSize;
    const roundedColumn = Math.floor(currentColumn + (angle < 0))
    if(roundedColumn < 0 || roundedColumn > 10){
      break; //if bubble gets out of the screen break from loop
    }
    console.log('row and column: ', row, roundedColumn)

    // Check if it hits a ball
    const hitBubble = bubbles[row][roundedColumn];
    const hitBubbleColor = hitBubble.color;

    if(hitBubbleColor !== null){
      console.log('hits: ', hitBubbleColor);
      compareColors(hitBubbleColor, shotBubbleColor, row, roundedColumn, bubbles)
      break;
    }
  }
}

function compareColors(hitBubbleColor, shotBubbleColor, row, column, bubbles){
  if(hitBubbleColor === shotBubbleColor){
    bubbles[row][column].color = null;
  }
}