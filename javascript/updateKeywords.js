import { config } from './data.js'
import { displayMaterial } from './materials.js'

export default function updateKeywords () {
  const displayKeywords = []
  if (config.SHADING) { displayKeywords.push('SHADING') }
  if (config.BLOOM) { displayKeywords.push('BLOOM') }
  if (config.SUNRAYS) { displayKeywords.push('SUNRAYS') }
  if (config.Obs_present) {displayKeywords.push('Obs_present')}
  displayMaterial.setKeywords(displayKeywords)
}
