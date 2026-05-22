// AchievementMap.js
import { EaglerAdapter } from './EaglerAdapter.js';

class AchievementMap {
  /** Maps an achievement id to its unique GUID */
  #guidMap = new Map();

  constructor() {
    try {
      for (const line of EaglerAdapter.fileContentsLines('/achievement/map.txt')) {
        const [idStr, guid] = line.split(',');
        this.#guidMap.set(parseInt(idStr, 10), guid);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /** Returns the unique GUID for a given achievement id */
  static getGuid(id) {
    return AchievementMap.instance.#guidMap.get(id) ?? null;
  }
}

/** Singleton instance of AchievementMap */
AchievementMap.instance = new AchievementMap();

export { AchievementMap };