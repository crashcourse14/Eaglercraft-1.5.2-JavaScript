// BiomeGenBase.js
import { Block } from './Block.js';
import { MathHelper } from './MathHelper.js';
import { ColorizerGrass } from './ColorizerGrass.js';
import { ColorizerFoliage } from './ColorizerFoliage.js';
import { EnumCreatureType } from './EnumCreatureType.js';

export class BiomeGenBase {
  /** An array of all biomes, indexed by biome id */
  static biomeList = new Array(256).fill(null);

  // --- Static biome instances ---

  static ocean              = new BiomeGenBase(0).setColor(112).setBiomeName('Ocean').setMinMaxHeight(-1.0, 0.4);
  static plains             = new BiomeGenBase(1).setColor(9286496).setBiomeName('Plains').setTemperatureRainfall(0.8, 0.4);
  static desert             = new BiomeGenBase(2).setColor(16421912).setBiomeName('Desert').setDisableRain().setTemperatureRainfall(2.0, 0.0).setMinMaxHeight(0.1, 0.2);
  static extremeHills       = new BiomeGenBase(3).setColor(6316128).setBiomeName('Extreme Hills').setMinMaxHeight(0.3, 1.5).setTemperatureRainfall(0.2, 0.3);
  static forest             = new BiomeGenBase(4).setColor(353825).setBiomeName('Forest').setFoliageColor(5159473).setTemperatureRainfall(0.7, 0.8);
  static taiga              = new BiomeGenBase(5).setColor(747097).setBiomeName('Taiga').setFoliageColor(5159473).setEnableSnow().setTemperatureRainfall(0.05, 0.8).setMinMaxHeight(0.1, 0.4);
  static swampland          = new BiomeGenBase(6).setColor(522674).setBiomeName('Swampland').setFoliageColor(9154376).setMinMaxHeight(-0.2, 0.1).setTemperatureRainfall(0.8, 0.9);
  static river              = new BiomeGenBase(7).setColor(255).setBiomeName('River').setMinMaxHeight(-0.5, 0.0);
  static hell               = new BiomeGenBase(8).setColor(16711680).setBiomeName('Hell').setDisableRain().setTemperatureRainfall(2.0, 0.0);
  /** Biome used for sky world */
  static sky                = new BiomeGenBase(9).setColor(8421631).setBiomeName('Sky').setDisableRain();
  static frozenOcean        = new BiomeGenBase(10).setColor(9474208).setBiomeName('FrozenOcean').setEnableSnow().setMinMaxHeight(-1.0, 0.5).setTemperatureRainfall(0.0, 0.5);
  static frozenRiver        = new BiomeGenBase(11).setColor(10526975).setBiomeName('FrozenRiver').setEnableSnow().setMinMaxHeight(-0.5, 0.0).setTemperatureRainfall(0.0, 0.5);
  static icePlains          = new BiomeGenBase(12).setColor(16777215).setBiomeName('Ice Plains').setEnableSnow().setTemperatureRainfall(0.0, 0.5);
  static iceMountains       = new BiomeGenBase(13).setColor(10526880).setBiomeName('Ice Mountains').setEnableSnow().setMinMaxHeight(0.3, 1.3).setTemperatureRainfall(0.0, 0.5);
  static mushroomIsland     = new BiomeGenBase(14).setColor(16711935).setBiomeName('MushroomIsland').setTemperatureRainfall(0.9, 1.0).setMinMaxHeight(0.2, 1.0);
  static mushroomIslandShore= new BiomeGenBase(15).setColor(10486015).setBiomeName('MushroomIslandShore').setTemperatureRainfall(0.9, 1.0).setMinMaxHeight(-1.0, 0.1);
  /** Beach biome */
  static beach              = new BiomeGenBase(16).setColor(16440917).setBiomeName('Beach').setTemperatureRainfall(0.8, 0.4).setMinMaxHeight(0.0, 0.1);
  /** Desert Hills biome */
  static desertHills        = new BiomeGenBase(17).setColor(13786898).setBiomeName('DesertHills').setDisableRain().setTemperatureRainfall(2.0, 0.0).setMinMaxHeight(0.3, 0.8);
  /** Forest Hills biome */
  static forestHills        = new BiomeGenBase(18).setColor(2250012).setBiomeName('ForestHills').setFoliageColor(5159473).setTemperatureRainfall(0.7, 0.8).setMinMaxHeight(0.3, 0.7);
  /** Taiga Hills biome */
  static taigaHills         = new BiomeGenBase(19).setColor(1456435).setBiomeName('TaigaHills').setEnableSnow().setFoliageColor(5159473).setTemperatureRainfall(0.05, 0.8).setMinMaxHeight(0.3, 0.8);
  /** Extreme Hills Edge biome */
  static extremeHillsEdge   = new BiomeGenBase(20).setColor(7501978).setBiomeName('Extreme Hills Edge').setMinMaxHeight(0.2, 0.8).setTemperatureRainfall(0.2, 0.3);
  /** Jungle biome */
  static jungle             = new BiomeGenBase(21).setColor(5470985).setBiomeName('Jungle').setFoliageColor(5470985).setTemperatureRainfall(1.2, 0.9).setMinMaxHeight(0.2, 0.4);
  static jungleHills        = new BiomeGenBase(22).setColor(2900485).setBiomeName('JungleHills').setFoliageColor(5470985).setTemperatureRainfall(1.2, 0.9).setMinMaxHeight(1.8, 0.5);

  // --- Instance fields ---

  biomeName = '';
  color = 0;
  /** Block expected on top of this biome */
  topBlock;
  /** Block used to fill below the top */
  fillerBlock;
  /** Foliage color override (formerly field_76754_C) */
  foliageColor = 5169201;
  /** Minimum height. Default 0.1 */
  minHeight = 0.1;
  /** Maximum height. Default 0.3 */
  maxHeight = 0.3;
  /** Temperature of this biome */
  temperature = 0.5;
  /** Rainfall of this biome */
  rainfall = 0.5;
  /** Color tint applied to water */
  waterColorMultiplier = 16777215;
  /** Hostile mobs that can spawn here */
  spawnableMonsterList = [];
  /** Friendly creatures that can spawn here */
  spawnableCreatureList = [];
  /** Aquatic creatures that can spawn here */
  spawnableWaterCreatureList = [];
  spawnableCaveCreatureList = [];
  /** The id and biomeList index of this biome */
  biomeID;

  #enableSnow = false;
  #enableRain = true;

  constructor(id) {
    this.biomeID      = id;
    this.topBlock     = Block.grass.blockID;
    this.fillerBlock  = Block.dirt.blockID;
    BiomeGenBase.biomeList[id] = this;
  }

  // --- Builder methods ---

  /** Sets temperature and rainfall; throws if temperature is in the snow-edge range 0.1–0.2 */
  setTemperatureRainfall(temp, rain) {
    if (temp > 0.1 && temp < 0.2) {
      throw new Error('Please avoid temperatures in the range 0.1 - 0.2 because of snow');
    }
    this.temperature = temp;
    this.rainfall    = rain;
    return this;
  }

  /** Sets the minimum and maximum terrain height for this biome */
  setMinMaxHeight(min, max) {
    this.minHeight = min;
    this.maxHeight = max;
    return this;
  }

  /** Disables rain for this biome */
  setDisableRain() {
    this.#enableRain = false;
    return this;
  }

  /** Enables snowfall for this biome */
  setEnableSnow() {
    this.#enableSnow = true;
    return this;
  }

  setBiomeName(name) {
    this.biomeName = name;
    return this;
  }

  /** Sets the foliage color override (formerly func_76733_a) */
  setFoliageColor(color) {
    this.foliageColor = color;
    return this;
  }

  setColor(color) {
    this.color = color;
    return this;
  }

  // --- Colour helpers ---

  /** Derives the sky color from the biome temperature */
  getSkyColorByTemp(temp) {
    temp = Math.max(-1.0, Math.min(1.0, temp / 3.0));
    return BiomeGenBase.HSBtoRGB(0.62222224 - temp * 0.05, 0.5 + temp * 0.1, 1.0);
  }

  /** Converts HSB color values to a packed 0xAARRGGBB integer */
  static HSBtoRGB(hue, saturation, brightness) {
    let r = 0, g = 0, b = 0;
    const toByte = v => Math.trunc(v * 255.0 + 0.5);

    if (saturation === 0) {
      r = g = b = toByte(brightness);
    } else {
      const h = (hue - Math.floor(hue)) * 6.0;
      const f = h - Math.floor(h);
      const p = brightness * (1.0 - saturation);
      const q = brightness * (1.0 - saturation * f);
      const t = brightness * (1.0 - saturation * (1.0 - f));
      switch (Math.trunc(h)) {
        case 0: r = toByte(brightness); g = toByte(t); b = toByte(p); break;
        case 1: r = toByte(q); g = toByte(brightness); b = toByte(p); break;
        case 2: r = toByte(p); g = toByte(brightness); b = toByte(t); break;
        case 3: r = toByte(p); g = toByte(q); b = toByte(brightness); break;
        case 4: r = toByte(t); g = toByte(p); b = toByte(brightness); break;
        case 5: r = toByte(brightness); g = toByte(p); b = toByte(q); break;
      }
    }
    return (0xff000000 | (r << 16) | (g << 8) | b) >>> 0;
  }

  // --- Spawn lists ---

  /** Returns the spawn list for the given creature type */
  getSpawnableList(creatureType) {
    switch (creatureType) {
      case EnumCreatureType.monster:       return this.spawnableMonsterList;
      case EnumCreatureType.creature:      return this.spawnableCreatureList;
      case EnumCreatureType.waterCreature: return this.spawnableWaterCreatureList;
      case EnumCreatureType.ambient:       return this.spawnableCaveCreatureList;
      default:                             return null;
    }
  }

  // --- Queries ---

  /** Returns true if this biome has snowfall instead of rain */
  getEnableSnow() { return this.#enableSnow; }

  /** Returns true if lightning can spawn here (requires rain, not snow) */
  canSpawnLightningBolt() { return !this.#enableSnow && this.#enableRain; }

  /** Returns true if the biome's rainfall is extremely high */
  isHighHumidity() { return this.rainfall > 0.85; }

  /** Returns the base chance for creature spawning */
  getSpawningChance() { return 0.1; }

  /** Returns rainfall as a fixed-point integer (scaled by 65536) */
  getIntRainfall() { return Math.trunc(this.rainfall * 65536.0); }

  /** Returns temperature as a fixed-point integer (scaled by 65536) */
  getIntTemperature() { return Math.trunc(this.temperature * 65536.0); }

  getFloatRainfall()    { return this.rainfall; }
  getFloatTemperature() { return this.temperature; }

  /** Returns the grass color based on temperature and rainfall */
  getBiomeGrassColor() {
    if (this.biomeID === 6) return 6975545;
    const t = MathHelper.clamp_float(this.getFloatTemperature(), 0.0, 1.0);
    const r = MathHelper.clamp_float(this.getFloatRainfall(),    0.0, 1.0);
    return ColorizerGrass.getGrassColor(t, r);
  }

  /** Returns the foliage color based on temperature and rainfall */
  getBiomeFoliageColor() {
    if (this.biomeID === 6) return 6975545;
    const t = MathHelper.clamp_float(this.getFloatTemperature(), 0.0, 1.0);
    const r = MathHelper.clamp_float(this.getFloatRainfall(),    0.0, 1.0);
    return ColorizerFoliage.getFoliageColor(t, r);
  }
}