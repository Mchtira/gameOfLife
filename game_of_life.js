let game = [ 
0, 0, 0, 0, 0,
0, 0, 0, 0, 0,
0, 0, 0, 0, 0,
0, 0, 0, 0, 0,
0, 0, 0, 0, 0,
]


const canvas = document.getElementById("canvas")
const ctx = canvas.getContext('2d')
const height = canvas.height
const width = canvas.width
let size = Math.sqrt(game.length)
let squareSize = width / size
let play = false

document.getElementById('form').addEventListener('submit', (e) => {
  e.preventDefault()
  const arraySize = document.getElementById('arraySize').value
  game.length = Number(arraySize) * Number(arraySize)
  game = game.fill(0)
  size = Math.sqrt(game.length)
  squareSize = width / size
  drawCanvas()
  console.log(game)
})

document.getElementById('pause').addEventListener('click', () => {
  play = !play
  document.getElementById('pause').innerHTML === 'Pause'
  ? document.getElementById('pause').innerHTML = 'Play'
  : document.getElementById('pause').innerHTML = 'Pause'
  if (play) requestAnimationFrame(updateCanvas)
})

document.getElementById('canvas').addEventListener('click', (evt) => {
  play = false
  document.getElementById('pause').innerHTML = 'Play'

  let mouseX = evt.layerX
  let mouseY = evt.layerY
  if (mouseX > width) mouseX = width - 1
  if (mouseY > height) mouseY = height - 1
  if (mouseX < 0) mouseX = 1
  if (mouseY < 0) mouseY = 1
  console.log(size)

  const getIndex = () => {
    const roundMouseY = Math.floor(mouseY / squareSize) * squareSize 
    return Math.floor(mouseX / squareSize) + (size * roundMouseY / squareSize)
  }

  const index = getIndex()

  const modifyCell = (index) => {
    if (game[index] === 1) game[index] = 0
    else game[index] = 1
    drawCanvas()
  }

  modifyCell(index)

},false);

const getNeighbours = (i) => {
  let neighbours = 0
  let tests = [i - size - 1, i - size, i - size + 1, 
               i - 1,        /*Cell*/         i + 1,
               i + size - 1, i + size, i + size + 1]
  if (i % size === 0) {
    tests = [/*i - size - 1,*/ i - size, i - size + 1, 
             /*i - 1,*/        /*Cell*/         i + 1,
             /*i + size - 1,*/ i + size, i + size + 1]
  } else if ((i + 1) % size === 0) {
    tests = [i - size - 1, i - size, /*i - size + 1,*/ 
             i - 1,        /*Cell*/         /*i + 1,*/
             i + size - 1, i + size, /*i + size + 1*/]
  }

  tests.forEach(test => {
    if (game[test] === 1) neighbours++
  })

  return neighbours
}

const drawCell = (n, index) => {
  ctx.beginPath()
  if (n === 0) {
    ctx.fillStyle = "rgb(255,255,255)"
    ctx.fillRect(index % size * squareSize, Math.floor(index / size) * squareSize,
                 squareSize, squareSize)
  } else {
    ctx.fillStyle = "rgb(0,0,0)"
    ctx.fillRect(index % size * squareSize, Math.floor(index / size) * squareSize,
                 squareSize, squareSize)
  }
  ctx.closePath()
}

const drawGrid = () => {
  let i = 1
  ctx.beginPath()
  ctx.fillStyle = "rgb(0,0,0)"

  while (i < size) {
    ctx.fillRect(i * squareSize - 1, Math.floor(i / size) * squareSize - 1,
                 2, height)
    ctx.fillRect(Math.floor(i / size) * squareSize, i * squareSize, 
                 height, 2)
    i++
  }

  ctx.closePath()
}

const updateCanvas = () => {
  if (play) {
    game = game.map((elem, i) => {
      const neighbours = getNeighbours(i)
      if (neighbours < 2) {
        drawCell(0, i)
        return 0
      } else if (neighbours === 2) {
        drawCell(elem, i)
        return elem
      } else if (neighbours === 3)  {
        drawCell(1, i)
        return 1
      } else if (neighbours > 3) {
        drawCell(0, i) 
        return 0
      }
    })
    drawGrid()
    setTimeout(() => requestAnimationFrame(updateCanvas), 125)
  }
}

const drawCanvas = () => {
  game.forEach((square, i) => drawCell(square, i))
  drawGrid()
}

drawCanvas()
