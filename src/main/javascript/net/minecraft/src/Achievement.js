// Achievement.js
import { StatBase } from './StatBase.js';
import { ItemStack } from './ItemStack.js';
import { AchievementList } from './AchievementList.js';
import { StatCollector } from './StatCollector.js';

export class Achievement extends StatBase {
  /** Column (relative to center of achievement GUI, in 24px units) */
  displayColumn;
  /** Row (relative to center of achievement GUI, in 24px units) */
  displayRow;
  /** Parent achievement that must be completed before this one is available */
  parentAchievement;
  /** ItemStack used to draw the achievement in the GUI */
  theItemStack;

  /** Description translation key */
  #achievementDescription;
  /** Optional formatter for dynamic description text (e.g. keybind inserts) */
  #statStringFormatter = null;
  /** Special achievements have a spiked frame — they're the hardest to achieve */
  #isSpecial = false;

  /**
   * Accepts an Item, Block, or ItemStack as the icon source.
   * Mirrors Java's three constructor overloads via duck-typing.
   */
  constructor(id, name, column, row, itemOrStack, parentAchievement) {
    const stack = itemOrStack instanceof ItemStack
      ? itemOrStack
      : new ItemStack(itemOrStack); // works for both Item and Block

    super(5242880 + id, 'achievement.' + name);

    this.theItemStack          = stack;
    this.#achievementDescription = 'achievement.' + name + '.desc';
    this.displayColumn         = column;
    this.displayRow            = row;
    this.parentAchievement     = parentAchievement;

    if (column < AchievementList.minDisplayColumn) AchievementList.minDisplayColumn = column;
    if (row    < AchievementList.minDisplayRow)    AchievementList.minDisplayRow    = row;
    if (column > AchievementList.maxDisplayColumn) AchievementList.maxDisplayColumn = column;
    if (row    > AchievementList.maxDisplayRow)    AchievementList.maxDisplayRow    = row;
  }

  /** Marks this achievement as independent (no prerequisites required) */
  setIndependent() {
    this.isIndependent = true;
    return this;
  }

  /** Marks this achievement as special (spiked frame in default texture pack) */
  setSpecial() {
    this.#isSpecial = true;
    return this;
  }

  /** Registers this achievement, checking for duplicate IDs */
  registerAchievement() {
    super.registerStat();
    AchievementList.achievementList.push(this);
    return this;
  }

  /** @returns {true} — distinguishes achievements from running-counter stats */
  isAchievement() {
    return true;
  }

  /** Returns the localised, fully formatted description string */
  getDescription() {
    const raw = StatCollector.translateToLocal(this.#achievementDescription);
    return this.#statStringFormatter
      ? this.#statStringFormatter.formatString(raw)
      : raw;
  }

  /** Attaches a dynamic string formatter (e.g. to inject a keybind) */
  setStatStringFormatter(formatter) {
    this.#statStringFormatter = formatter;
    return this;
  }

  /** @returns {boolean} Whether this is a special (spiked-frame) achievement */
  getSpecial() {
    return this.#isSpecial;
  }

  // --- StatBase overrides ---

  registerStat() {
    return this.registerAchievement();
  }

  initIndependentStat() {
    return this.setIndependent();
  }
}