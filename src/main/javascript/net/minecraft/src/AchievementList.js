// AchievementList.js
import { Achievement } from './Achievement.js';
import { Item } from './Item.js';
import { Block } from './Block.js';

export class AchievementList {
  /** Smallest column used to display an achievement on the GUI */
  static minDisplayColumn = 0;
  /** Smallest row used to display an achievement on the GUI */
  static minDisplayRow = 0;
  /** Biggest column used to display an achievement on the GUI */
  static maxDisplayColumn = 0;
  /** Biggest row used to display an achievement on the GUI */
  static maxDisplayRow = 0;

  /** All registered achievements */
  static achievementList = [];

  // --- Achievements ---

  /** 'Open Inventory' */
  static openInventory = new Achievement(0, 'openInventory', 0, 0, Item.book, null)
    .setIndependent().registerAchievement();

  /** 'Getting Wood' */
  static mineWood = new Achievement(1, 'mineWood', 2, 1, Block.wood, AchievementList.openInventory)
    .registerAchievement();

  /** 'Benchmarking' */
  static buildWorkBench = new Achievement(2, 'buildWorkBench', 4, -1, Block.workbench, AchievementList.mineWood)
    .registerAchievement();

  /** 'Time to Mine!' */
  static buildPickaxe = new Achievement(3, 'buildPickaxe', 4, 2, Item.pickaxeWood, AchievementList.buildWorkBench)
    .registerAchievement();

  /** 'Hot Topic' */
  static buildFurnace = new Achievement(4, 'buildFurnace', 3, 4, Block.furnaceIdle, AchievementList.buildPickaxe)
    .registerAchievement();

  /** 'Acquire Hardware' */
  static acquireIron = new Achievement(5, 'acquireIron', 1, 4, Item.ingotIron, AchievementList.buildFurnace)
    .registerAchievement();

  /** 'Time to Farm!' */
  static buildHoe = new Achievement(6, 'buildHoe', 2, -3, Item.hoeWood, AchievementList.buildWorkBench)
    .registerAchievement();

  /** 'Bake Bread' */
  static makeBread = new Achievement(7, 'makeBread', -1, -3, Item.bread, AchievementList.buildHoe)
    .registerAchievement();

  /** 'The Lie' */
  static bakeCake = new Achievement(8, 'bakeCake', 0, -5, Item.cake, AchievementList.buildHoe)
    .registerAchievement();

  /** 'Getting an Upgrade' */
  static buildBetterPickaxe = new Achievement(9, 'buildBetterPickaxe', 6, 2, Item.pickaxeStone, AchievementList.buildPickaxe)
    .registerAchievement();

  /** 'Delicious Fish' */
  static cookFish = new Achievement(10, 'cookFish', 2, 6, Item.fishCooked, AchievementList.buildFurnace)
    .registerAchievement();

  /** 'On a Rail' */
  static onARail = new Achievement(11, 'onARail', 2, 3, Block.rail, AchievementList.acquireIron)
    .setSpecial().registerAchievement();

  /** 'Time to Strike!' */
  static buildSword = new Achievement(12, 'buildSword', 6, -1, Item.swordWood, AchievementList.buildWorkBench)
    .registerAchievement();

  /** 'Monster Hunter' */
  static killEnemy = new Achievement(13, 'killEnemy', 8, -1, Item.bone, AchievementList.buildSword)
    .registerAchievement();

  /** 'Cow Tipper' */
  static killCow = new Achievement(14, 'killCow', 7, -3, Item.leather, AchievementList.buildSword)
    .registerAchievement();

  /** 'When Pigs Fly' */
  static flyPig = new Achievement(15, 'flyPig', 8, -4, Item.saddle, AchievementList.killCow)
    .setSpecial().registerAchievement();

  /** 'Sniper Duel' */
  static snipeSkeleton = new Achievement(16, 'snipeSkeleton', 7, 0, Item.bow, AchievementList.killEnemy)
    .setSpecial().registerAchievement();

  /** 'DIAMONDS!' */
  static diamonds = new Achievement(17, 'diamonds', -1, 5, Item.diamond, AchievementList.acquireIron)
    .registerAchievement();

  /** 'We Need to Go Deeper' */
  static portal = new Achievement(18, 'portal', -1, 7, Block.obsidian, AchievementList.diamonds)
    .registerAchievement();

  /** 'Return to Sender' */
  static ghast = new Achievement(19, 'ghast', -4, 8, Item.ghastTear, AchievementList.portal)
    .setSpecial().registerAchievement();

  /** 'Into Fire' */
  static blazeRod = new Achievement(20, 'blazeRod', 0, 9, Item.blazeRod, AchievementList.portal)
    .registerAchievement();

  /** 'Local Brewery' */
  static potion = new Achievement(21, 'potion', 2, 8, Item.potion, AchievementList.blazeRod)
    .registerAchievement();

  /** 'The End?' */
  static theEnd = new Achievement(22, 'theEnd', 3, 10, Item.eyeOfEnder, AchievementList.blazeRod)
    .setSpecial().registerAchievement();

  /** 'The End.' */
  static theEnd2 = new Achievement(23, 'theEnd2', 4, 13, Block.dragonEgg, AchievementList.theEnd)
    .setSpecial().registerAchievement();

  /** 'Enchanter' */
  static enchantments = new Achievement(24, 'enchantments', -4, 4, Block.enchantmentTable, AchievementList.diamonds)
    .registerAchievement();

  /** 'Overkill' */
  static overkill = new Achievement(25, 'overkill', -4, 1, Item.swordDiamond, AchievementList.enchantments)
    .setSpecial().registerAchievement();

  /** 'Librarian' */
  static bookcase = new Achievement(26, 'bookcase', -3, 6, Block.bookShelf, AchievementList.enchantments)
    .registerAchievement();

  /**
   * Called to trigger this module's static initialization.
   * In JS this happens automatically on first import, so this is a no-op stub.
   */
  static init() {}
}

console.log(`${AchievementList.achievementList.length} achievements`);