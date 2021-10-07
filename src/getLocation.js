// import fs from 'fs'
import Tesseract from 'tesseract.js'
import screenshot from 'screenshot-desktop'
import sharp from 'sharp'

export default async function getLocation() {
  const displays = await screenshot.listDisplays()

  // console.log(displays[0])

  const image = await screenshot({
    screen: displays[0].id
  })

  const croppedImage = await sharp(image).extract({
    width: 360, height: 40, top: 0, left: 2200
  }).toBuffer()

  // fs.writeFile('test.png', croppedImage, (err) => {})

  const tess = await Tesseract.recognize(
    croppedImage,
    'eng',
    // { logger: m => console.log(m) }
  )

  const regexp = /\[(\d+.\d+), (\d+.\d+), (\d+.\d+)\]/
  const match = tess.data.text.match(regexp)

  try {
    return {
        x: match[1],
        y: match[2],
        z: match[3]
    }
  } catch (error) {
    return null
  }
}