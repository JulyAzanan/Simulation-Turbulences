import { initFramebuffers } from './initBuffers.js'
import updateKeywords from './updateKeywords.js'
import captureScreenshot from './screenshot.js'
import { splatStack, config } from './data.js'
/* global dat */

export default function startGUI (webGLContext) {
  const gui = new dat.GUI({ width: 350 })
  gui.remember(config)

  gui.add(config, 'DYE_RESOLUTION', { high: 1024, medium: 512, low: 256, 'very low': 128 ,'Ultra High': 2048}).name('Qualité').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'SIM_RESOLUTION', { 'Ultra High': 2048, 32: 32, 64: 64, 128: 128, 256: 256 }).name('Résolution').onFinishChange(() => initFramebuffers(webGLContext))
  gui.add(config, 'DENSITY_DISSIPATION', 0, 4.0).name('Dissipation par densité')
  gui.add(config, 'VELOCITY_DISSIPATION', 0, 4.0).name('Dissipation de la vélocité')
  gui.add(config, 'PRESSURE', 0.0, 1.0).name('Pression')
  gui.add(config, 'CURL', 0, 50).name('Tourbillon').step(1)
  gui.add(config, 'SPLAT_RADIUS', 0.01, 1.0).name('Rayon éclaboussure')
  gui.add(config, 'SHADING').name('Ombres').onFinishChange(updateKeywords)
  gui.add(config, 'COLORFUL').name('Coloré')
  gui.add(config, 'PAUSED').name('Pause').listen()

  gui.add({
    fun: function () {
      splatStack.push(parseInt(Math.random() * 20) + 5)
    }
  }, 'fun').name('Eclaboussures aléatoires')

  const bloomFolder = gui.addFolder('Bloom')
  bloomFolder.add(config, 'BLOOM').name('enabled').onFinishChange(updateKeywords)
  bloomFolder.add(config, 'BLOOM_INTENSITY', 0.1, 2.0).name('intensity')
  bloomFolder.add(config, 'BLOOM_THRESHOLD', 0.0, 1.0).name('threshold')

  const VitesseInitiale = gui.addFolder('Vitesse du milieu')
  VitesseInitiale.add(config, 'x_vitesse', -2.0, 2.0).name('Selon x')
  VitesseInitiale.add(config, 'y_vitesse', -2.0, 2.0).name('Selon y')

  const Obstacle = gui.addFolder('Obstacle')
  const Rectangle = Obstacle.addFolder('Rectangle')
  Rectangle.add(config, 'Obs_present_rect').name('Placer obstacle').onFinishChange(updateKeywords)
  Rectangle.add(config, 'x_centre_rect', -1.0, 1.0).name('Abscisse du centre')
  Rectangle.add(config, 'y_centre_rect', -1.0, 1.0).name('Ordonnée du centre')
  Rectangle.add(config, 'x_long', 0.0, 1.0).name('Abscisse de la longueur')
  Rectangle.add(config, 'y_long', 0.0, 1.0).name('Ordonnée de la longueur')
  const Cercle = Obstacle.addFolder('Cercle')
  Cercle.add(config, 'Obs_present_cer').name('Placer obstacle').onFinishChange(updateKeywords)
  Cercle.add(config, 'x_centre_cer', 0.0, 1.0).name('Abscisse du centre')
  Cercle.add(config, 'y_centre_cer', 0.0, 1.0).name('Ordonnée du centre')
  Cercle.add(config, 'x_stretch', 0.0, 1.0).name('Abscisse de la longueur')
  Cercle.add(config, 'y_stretch', 0.0, 1.0).name('Ordonnée de la longueur')
  Cercle.add(config, 'rayon', 0.0, 1.0).name('Rayon')

  const sunraysFolder = gui.addFolder('Rayons')
  sunraysFolder.add(config, 'SUNRAYS').name('enabled').onFinishChange(updateKeywords)
  sunraysFolder.add(config, 'SUNRAYS_WEIGHT', 0.3, 1.0).name('weight')

  const captureFolder = gui.addFolder('Capture')
  captureFolder.addColor(config, 'BACK_COLOR').name('Couleur de fond')
  captureFolder.add(config, 'TRANSPARENT').name('Transparence')
  captureFolder.add({ fun: () => captureScreenshot(webGLContext, config) }, 'fun').name("Capture d'écran")

  if (isMobile()) { gui.close() }

  updateKeywords()
  initFramebuffers(webGLContext)
}

function isMobile () {
  return /Mobi|Android/i.test(navigator.userAgent)
}
