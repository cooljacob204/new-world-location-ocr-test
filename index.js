import parseLocation from './src/getLocation.js'

var location

function mainLoop(){
  parseLocation('./image.png').then(results => {
    location = results || location
    mainLoop()
  })

  if (location)
    console.log(location);
}

mainLoop()