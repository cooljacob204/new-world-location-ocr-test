import parseLocation from './src/getLocation.js'

var location

function mainLoop(){
  parseLocation().then(results => {
    // console.log(results)
    location = results || location
    mainLoop()
  })

  if (location)
    console.log(location);
}

mainLoop()