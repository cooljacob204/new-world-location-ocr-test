import fs from 'fs'
import Tesseract from 'tesseract.js'
import screenshot from 'screenshot-desktop'
import sharp from 'sharp'

export default async function getLocation() {
  const displays = await screenshot.listDisplays()

  // console.log(displays[0])

  const image = await screenshot({
    screen: displays[0].id,
    format: 'png'
  })
  
  // fs.writeFile('display.png', image, (err) => { })

  const croppedImage = await sharp(image).extract({
    width: 260, height: 16, top: 19, left: 2295
  }).negate({ alpha: false }).blur().threshold(100).sharpen(10).toBuffer()

  // fs.writeFile('test.png', croppedImage, (err) => {})

  const tess = await Tesseract.recognize(
    croppedImage,
    'eng',
    // { logger: m => console.log(m) }
  )

  console.log(tess.data.text)

  const regexp = /(\d{1,4}\.\d{3}), (\d{1,4}\.\d{3}), (\d{1,4}\.\d{3})/
  const match = tess.data.text.match(regexp)

  try {
    return {
        x: parseFloat(match[1]),
        y: parseFloat(match[2]),
        z: parseFloat(match[3])
    }
  } catch (error) {
    return null
  }
}