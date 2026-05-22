// Block.js
import { StepSound } from './StepSound.js';
import { StepSoundStone } from './StepSoundStone.js';
import { StepSoundSand } from './StepSoundSand.js';
import { StepSoundAnvil } from './StepSoundAnvil.js';
import { Material } from './Material.js';
import { AxisAlignedBB } from './AxisAlignedBB.js';
import { ItemStack } from './ItemStack.js';
import { MovingObjectPosition } from './MovingObjectPosition.js';
import { StatCollector } from './StatCollector.js';
import { EnchantmentHelper } from './EnchantmentHelper.js';
import { CreativeTabs } from './CreativeTabs.js';
import { EnumMobType } from './EnumMobType.js';
import { NoiseGeneratorPerlin } from './NoiseGeneratorPerlin.js';
import { EaglercraftRandom } from './EaglercraftRandom.js';
import { TileEntitySign } from './TileEntitySign.js';
import { Item } from './Item.js';

// --- Block subclass imports ---
import { BlockStone } from './BlockStone.js';
import { BlockGrass } from './BlockGrass.js';
import { BlockDirt } from './BlockDirt.js';
import { BlockWood } from './BlockWood.js';
import { BlockSapling } from './BlockSapling.js';
import { BlockFlowing } from './BlockFlowing.js';
import { BlockStationary } from './BlockStationary.js';
import { BlockFluid } from './BlockFluid.js';
import { BlockSand } from './BlockSand.js';
import { BlockGravel } from './BlockGravel.js';
import { BlockOre } from './BlockOre.js';
import { BlockLog } from './BlockLog.js';
import { BlockLeaves } from './BlockLeaves.js';
import { BlockSponge } from './BlockSponge.js';
import { BlockGlass } from './BlockGlass.js';
import { BlockDispenser } from './BlockDispenser.js';
import { BlockSandStone } from './BlockSandStone.js';
import { BlockNote } from './BlockNote.js';
import { BlockBed } from './BlockBed.js';
import { BlockRailPowered } from './BlockRailPowered.js';
import { BlockDetectorRail } from './BlockDetectorRail.js';
import { BlockPistonBase } from './BlockPistonBase.js';
import { BlockWeb } from './BlockWeb.js';
import { BlockTallGrass } from './BlockTallGrass.js';
import { BlockDeadBush } from './BlockDeadBush.js';
import { BlockPistonExtension } from './BlockPistonExtension.js';
import { BlockCloth } from './BlockCloth.js';
import { BlockPistonMoving } from './BlockPistonMoving.js';
import { BlockFlower } from './BlockFlower.js';
import { BlockMushroom } from './BlockMushroom.js';
import { BlockOreStorage } from './BlockOreStorage.js';
import { BlockHalfSlab } from './BlockHalfSlab.js';
import { BlockStep } from './BlockStep.js';
import { BlockTNT } from './BlockTNT.js';
import { BlockBookshelf } from './BlockBookshelf.js';
import { BlockObsidian } from './BlockObsidian.js';
import { BlockTorch } from './BlockTorch.js';
import { BlockFire } from './BlockFire.js';
import { BlockMobSpawner } from './BlockMobSpawner.js';
import { BlockStairs } from './BlockStairs.js';
import { BlockChest } from './BlockChest.js';
import { BlockRedstoneWire } from './BlockRedstoneWire.js';
import { BlockWorkbench } from './BlockWorkbench.js';
import { BlockCrops } from './BlockCrops.js';
import { BlockFarmland } from './BlockFarmland.js';
import { BlockFurnace } from './BlockFurnace.js';
import { BlockSign } from './BlockSign.js';
import { BlockDoor } from './BlockDoor.js';
import { BlockLadder } from './BlockLadder.js';
import { BlockRail } from './BlockRail.js';
import { BlockLever } from './BlockLever.js';
import { BlockPressurePlate } from './BlockPressurePlate.js';
import { BlockRedstoneOre } from './BlockRedstoneOre.js';
import { BlockRedstoneTorch } from './BlockRedstoneTorch.js';
import { BlockButtonStone } from './BlockButtonStone.js';
import { BlockSnow } from './BlockSnow.js';
import { BlockIce } from './BlockIce.js';
import { BlockSnowBlock } from './BlockSnowBlock.js';
import { BlockCactus } from './BlockCactus.js';
import { BlockClay } from './BlockClay.js';
import { BlockReed } from './BlockReed.js';
import { BlockJukeBox } from './BlockJukeBox.js';
import { BlockFence } from './BlockFence.js';
import { BlockPumpkin } from './BlockPumpkin.js';
import { BlockNetherrack } from './BlockNetherrack.js';
import { BlockSoulSand } from './BlockSoulSand.js';
import { BlockGlowStone } from './BlockGlowStone.js';
import { BlockPortal } from './BlockPortal.js';
import { BlockCake } from './BlockCake.js';
import { BlockRedstoneRepeater } from './BlockRedstoneRepeater.js';
import { BlockLockedChest } from './BlockLockedChest.js';
import { BlockTrapDoor } from './BlockTrapDoor.js';
import { BlockSilverfish } from './BlockSilverfish.js';
import { BlockStoneBrick } from './BlockStoneBrick.js';
import { BlockMushroomCap } from './BlockMushroomCap.js';
import { BlockPane } from './BlockPane.js';
import { BlockMelon } from './BlockMelon.js';
import { BlockStem } from './BlockStem.js';
import { BlockVine } from './BlockVine.js';
import { BlockFenceGate } from './BlockFenceGate.js';
import { BlockMycelium } from './BlockMycelium.js';
import { BlockLilyPad } from './BlockLilyPad.js';
import { BlockNetherStalk } from './BlockNetherStalk.js';
import { BlockEnchantmentTable } from './BlockEnchantmentTable.js';
import { BlockBrewingStand } from './BlockBrewingStand.js';
import { BlockCauldron } from './BlockCauldron.js';
import { BlockEndPortal } from './BlockEndPortal.js';
import { BlockEndPortalFrame } from './BlockEndPortalFrame.js';
import { BlockDragonEgg } from './BlockDragonEgg.js';
import { BlockRedstoneLight } from './BlockRedstoneLight.js';
import { BlockWoodSlab } from './BlockWoodSlab.js';
import { BlockCocoa } from './BlockCocoa.js';
import { BlockEnderChest } from './BlockEnderChest.js';
import { BlockTripWireSource } from './BlockTripWireSource.js';
import { BlockTripWire } from './BlockTripWire.js';
import { BlockCommandBlock } from './BlockCommandBlock.js';
import { BlockBeacon } from './BlockBeacon.js';
import { BlockWall } from './BlockWall.js';
import { BlockFlowerPot } from './BlockFlowerPot.js';
import { BlockCarrot } from './BlockCarrot.js';
import { BlockPotato } from './BlockPotato.js';
import { BlockButtonWood } from './BlockButtonWood.js';
import { BlockSkull } from './BlockSkull.js';
import { BlockAnvil } from './BlockAnvil.js';
import { BlockPressurePlateWeighted } from './BlockPressurePlateWeighted.js';
import { BlockComparator } from './BlockComparator.js';
import { BlockDaylightDetector } from './BlockDaylightDetector.js';
import { BlockPoweredOre } from './BlockPoweredOre.js';
import { BlockHopper } from './BlockHopper.js';
import { BlockQuartz } from './BlockQuartz.js';
import { BlockDropper } from './BlockDropper.js';

// --- Item subclass imports (for static initializer) ---
import { ItemBlock } from './ItemBlock.js';
import { ItemCloth } from './ItemCloth.js';
import { ItemMultiTextureTile } from './ItemMultiTextureTile.js';
import { ItemLeaves } from './ItemLeaves.js';
import { ItemColored } from './ItemColored.js';
import { ItemSnow } from './ItemSnow.js';
import { ItemLilyPad } from './ItemLilyPad.js';
import { ItemPiston } from './ItemPiston.js';
import { ItemAnvilBlock } from './ItemAnvilBlock.js';
import { ItemSlab } from './ItemSlab.js';

export class Block {
  // -------------------------------------------------------------------------
  // Static lookup tables
  // -------------------------------------------------------------------------

  /** All registered blocks, indexed by block ID */
  static blocksList = new Array(4096).fill(null);
  /** Whether each block ID is an opaque cube */
  static opaqueCubeLookup = new Uint8Array(4096);
  /** How much light is subtracted passing through each block ID */
  static lightOpacity = new Int32Array(4096);
  /** Whether grass can spread to this block ID */
  static canBlockGrass = new Uint8Array(4096);
  /** Amount of light emitted by each block ID */
  static lightValue = new Int32Array(4096);
  /** Whether to use brightest neighbour light value */
  static useNeighborBrightness = new Uint8Array(4096);

  // -------------------------------------------------------------------------
  // Step sounds
  // -------------------------------------------------------------------------

  static soundPowderFootstep  = new StepSound('stone', 1.0, 1.0);
  static soundWoodFootstep    = new StepSound('wood',  1.0, 1.0);
  static soundGravelFootstep  = new StepSound('gravel',1.0, 1.0);
  static soundGrassFootstep   = new StepSound('grass', 1.0, 1.0);
  static soundStoneFootstep   = new StepSound('stone', 1.0, 1.0);
  static soundMetalFootstep   = new StepSound('stone', 1.0, 1.5);
  static soundGlassFootstep   = new StepSoundStone('stone', 1.0, 1.0);
  static soundClothFootstep   = new StepSound('cloth', 1.0, 1.0);
  static soundSandFootstep    = new StepSound('sand',  1.0, 1.0);
  static soundSnowFootstep    = new StepSound('snow',  1.0, 1.0);
  static soundLadderFootstep  = new StepSoundSand('ladder', 1.0, 1.0);
  static soundAnvilFootstep   = new StepSoundAnvil('anvil', 0.3, 1.0);

  // -------------------------------------------------------------------------
  // Grass noise
  // -------------------------------------------------------------------------

  static grassNoise      = new NoiseGeneratorPerlin(new EaglercraftRandom('methamphetamine'.split('').reduce((h, c) => Math.imul(31, h) + c.charCodeAt(0) | 0, 0)));
  static grassNoiseArray = new Float64Array(256);
  static #noiseChunkX    = -2147483648; // Integer.MIN_VALUE
  static #noiseChunkZ    = -2147483648;

  static initNoiseField(cx, cz) {
    if (Block.#noiseChunkX !== cx || Block.#noiseChunkZ !== cz) {
      Block.#noiseChunkX = cx;
      Block.#noiseChunkZ = cz;
      Block.initNoiseField0(cx, cz);
    }
  }

  static initNoiseField0(cx, cz) {
    const scale = 0.05;
    Block.grassNoiseArray.fill(0.0);
    Block.grassNoise.populateNoiseArray(
      Block.grassNoiseArray,
      cx * 16.0 * scale, 16.0 * scale, cz * 16.0 * scale,
      16, 1, 16, scale, 1.0, scale, 1.0
    );
  }

  // -------------------------------------------------------------------------
  // Block instances  (IDs 1–158)
  // -------------------------------------------------------------------------

  static stone              = new BlockStone(1).setHardness(1.5).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stone');
  static grass              = new BlockGrass(2).setHardness(0.6).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('grass');
  static dirt               = new BlockDirt(3).setHardness(0.5).setStepSound(Block.soundGravelFootstep).setUnlocalizedName('dirt');
  static cobblestone        = new Block(4, Material.rock).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stonebrick').setCreativeTab(CreativeTabs.tabBlock);
  static planks             = new BlockWood(5).setHardness(2.0).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('wood');
  static sapling            = new BlockSapling(6).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('sapling');
  static bedrock            = new Block(7, Material.rock).setBlockUnbreakable().setResistance(6000000.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('bedrock').disableStats().setCreativeTab(CreativeTabs.tabBlock);
  static waterMoving        = new BlockFlowing(8, Material.water).setHardness(100.0).setLightOpacity(3).setUnlocalizedName('water').disableStats();
  static waterStill         = new BlockStationary(9, Material.water).setHardness(100.0).setLightOpacity(3).setUnlocalizedName('water').disableStats();
  static lavaMoving         = new BlockFlowing(10, Material.lava).setHardness(0.0).setLightValue(1.0).setUnlocalizedName('lava').disableStats();
  /** Stationary lava source block */
  static lavaStill          = new BlockStationary(11, Material.lava).setHardness(100.0).setLightValue(1.0).setUnlocalizedName('lava').disableStats();
  static sand               = new BlockSand(12).setHardness(0.5).setStepSound(Block.soundSandFootstep).setUnlocalizedName('sand');
  static gravel             = new BlockGravel(13).setHardness(0.6).setStepSound(Block.soundGravelFootstep).setUnlocalizedName('gravel');
  static oreGold            = new BlockOre(14).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreGold');
  static oreIron            = new BlockOre(15).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreIron');
  static oreCoal            = new BlockOre(16).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreCoal');
  static wood               = new BlockLog(17).setHardness(2.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('log');
  static leaves             = new BlockLeaves(18).setHardness(0.2).setLightOpacity(1).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('leaves');
  static sponge             = new BlockSponge(19).setHardness(0.6).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('sponge');
  static glass              = new BlockGlass(20, Material.glass, false).setHardness(0.3).setStepSound(Block.soundGlassFootstep).setUnlocalizedName('glass');
  static oreLapis           = new BlockOre(21).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreLapis');
  static blockLapis         = new Block(22, Material.rock).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('blockLapis').setCreativeTab(CreativeTabs.tabBlock);
  static dispenser          = new BlockDispenser(23).setHardness(3.5).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('dispenser');
  static sandStone          = new BlockSandStone(24).setStepSound(Block.soundStoneFootstep).setHardness(0.8).setUnlocalizedName('sandStone');
  static music              = new BlockNote(25).setHardness(0.8).setUnlocalizedName('musicBlock');
  static bed                = new BlockBed(26).setHardness(0.2).setUnlocalizedName('bed').disableStats();
  static railPowered        = new BlockRailPowered(27).setHardness(0.7).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('goldenRail');
  static railDetector       = new BlockDetectorRail(28).setHardness(0.7).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('detectorRail');
  static pistonStickyBase   = new BlockPistonBase(29, true).setUnlocalizedName('pistonStickyBase');
  static web                = new BlockWeb(30).setLightOpacity(1).setHardness(4.0).setUnlocalizedName('web');
  static tallGrass          = new BlockTallGrass(31).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('tallgrass');
  static deadBush           = new BlockDeadBush(32).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('deadbush');
  static pistonBase         = new BlockPistonBase(33, false).setUnlocalizedName('pistonBase');
  static pistonExtension    = new BlockPistonExtension(34);
  static cloth              = new BlockCloth().setHardness(0.8).setStepSound(Block.soundClothFootstep).setUnlocalizedName('cloth');
  static pistonMoving       = new BlockPistonMoving(36);
  static plantYellow        = new BlockFlower(37).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('flower');
  static plantRed           = new BlockFlower(38).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('rose');
  static mushroomBrown      = new BlockMushroom(39, 'mushroom_brown').setHardness(0.0).setStepSound(Block.soundGrassFootstep).setLightValue(0.125).setUnlocalizedName('mushroom');
  static mushroomRed        = new BlockMushroom(40, 'mushroom_red').setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('mushroom');
  static blockGold          = new BlockOreStorage(41).setHardness(3.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('blockGold');
  static blockIron          = new BlockOreStorage(42).setHardness(5.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('blockIron');
  /** stoneDoubleSlab */
  static stoneDoubleSlab    = new BlockStep(43, true).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stoneSlab');
  /** stoneSingleSlab */
  static stoneSingleSlab    = new BlockStep(44, false).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stoneSlab');
  static brick              = new Block(45, Material.rock).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('brick').setCreativeTab(CreativeTabs.tabBlock);
  static tnt                = new BlockTNT(46).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('tnt');
  static bookShelf          = new BlockBookshelf(47).setHardness(1.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('bookshelf');
  static cobblestoneMossy   = new Block(48, Material.rock).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stoneMoss').setCreativeTab(CreativeTabs.tabBlock);
  static obsidian           = new BlockObsidian(49).setHardness(50.0).setResistance(2000.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('obsidian');
  static torchWood          = new BlockTorch(50).setHardness(0.0).setLightValue(0.9375).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('torch');
  static fire               = new BlockFire(51).setHardness(0.0).setLightValue(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('fire').disableStats();
  static mobSpawner         = new BlockMobSpawner(52).setHardness(5.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('mobSpawner').disableStats();
  static stairsWoodOak      = new BlockStairs(53, Block.planks, 0).setUnlocalizedName('stairsWood');
  static chest              = new BlockChest(54, 0).setHardness(2.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('chest');
  static redstoneWire       = new BlockRedstoneWire(55).setHardness(0.0).setStepSound(Block.soundPowderFootstep).setUnlocalizedName('redstoneDust').disableStats();
  static oreDiamond         = new BlockOre(56).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreDiamond');
  static blockDiamond       = new BlockOreStorage(57).setHardness(5.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('blockDiamond');
  static workbench          = new BlockWorkbench(58).setHardness(2.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('workbench');
  static crops              = new BlockCrops(59).setUnlocalizedName('crops');
  static tilledField        = new BlockFarmland(60).setHardness(0.6).setStepSound(Block.soundGravelFootstep).setUnlocalizedName('farmland');
  static furnaceIdle        = new BlockFurnace(61, false).setHardness(3.5).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('furnace').setCreativeTab(CreativeTabs.tabDecorations);
  static furnaceBurning     = new BlockFurnace(62, true).setHardness(3.5).setStepSound(Block.soundStoneFootstep).setLightValue(0.875).setUnlocalizedName('furnace');
  static signPost           = new BlockSign(63, TileEntitySign, true).setHardness(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('sign').disableStats();
  static doorWood           = new BlockDoor(64, Material.wood).setHardness(3.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('doorWood').disableStats();
  static ladder             = new BlockLadder(65).setHardness(0.4).setStepSound(Block.soundLadderFootstep).setUnlocalizedName('ladder');
  static rail               = new BlockRail(66).setHardness(0.7).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('rail');
  static stairsCobblestone  = new BlockStairs(67, Block.cobblestone, 0).setUnlocalizedName('stairsStone');
  static signWall           = new BlockSign(68, TileEntitySign, false).setHardness(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('sign').disableStats();
  static lever              = new BlockLever(69).setHardness(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('lever');
  static pressurePlateStone = new BlockPressurePlate(70, 'stone', Material.rock, EnumMobType.mobs).setHardness(0.5).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('pressurePlate');
  static doorIron           = new BlockDoor(71, Material.iron).setHardness(5.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('doorIron').disableStats();
  static pressurePlatePlanks= new BlockPressurePlate(72, 'wood', Material.wood, EnumMobType.everything).setHardness(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('pressurePlate');
  static oreRedstone        = new BlockRedstoneOre(73, false).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreRedstone').setCreativeTab(CreativeTabs.tabBlock);
  static oreRedstoneGlowing = new BlockRedstoneOre(74, true).setLightValue(0.625).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreRedstone');
  static torchRedstoneIdle  = new BlockRedstoneTorch(75, false).setHardness(0.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('notGate');
  static torchRedstoneActive= new BlockRedstoneTorch(76, true).setHardness(0.0).setLightValue(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('notGate').setCreativeTab(CreativeTabs.tabRedstone);
  static stoneButton        = new BlockButtonStone(77).setHardness(0.5).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('button');
  static snow               = new BlockSnow(78).setHardness(0.1).setStepSound(Block.soundSnowFootstep).setUnlocalizedName('snow').setLightOpacity(0);
  static ice                = new BlockIce(79).setHardness(0.5).setLightOpacity(3).setStepSound(Block.soundGlassFootstep).setUnlocalizedName('ice');
  static blockSnow          = new BlockSnowBlock(80).setHardness(0.2).setStepSound(Block.soundSnowFootstep).setUnlocalizedName('snow');
  static cactus             = new BlockCactus(81).setHardness(0.4).setStepSound(Block.soundClothFootstep).setUnlocalizedName('cactus');
  static blockClay          = new BlockClay(82).setHardness(0.6).setStepSound(Block.soundGravelFootstep).setUnlocalizedName('clay');
  static reed               = new BlockReed(83).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('reeds').disableStats();
  static jukebox            = new BlockJukeBox(84).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('jukebox');
  static fence              = new BlockFence(85, 'wood', Material.wood).setHardness(2.0).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('fence');
  static pumpkin            = new BlockPumpkin(86, false).setHardness(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('pumpkin');
  static netherrack         = new BlockNetherrack(87).setHardness(0.4).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('hellrock');
  static slowSand           = new BlockSoulSand(88).setHardness(0.5).setStepSound(Block.soundSandFootstep).setUnlocalizedName('hellsand');
  static glowStone          = new BlockGlowStone(89, Material.glass).setHardness(0.3).setStepSound(Block.soundGlassFootstep).setLightValue(1.0).setUnlocalizedName('lightgem');
  /** The purple teleport blocks inside the obsidian circle */
  static portal             = new BlockPortal(90).setHardness(-1.0).setStepSound(Block.soundGlassFootstep).setLightValue(0.75).setUnlocalizedName('portal');
  static pumpkinLantern     = new BlockPumpkin(91, true).setHardness(1.0).setStepSound(Block.soundWoodFootstep).setLightValue(1.0).setUnlocalizedName('litpumpkin');
  static cake               = new BlockCake(92).setHardness(0.5).setStepSound(Block.soundClothFootstep).setUnlocalizedName('cake').disableStats();
  static redstoneRepeaterIdle   = new BlockRedstoneRepeater(93, false).setHardness(0.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('diode').disableStats();
  static redstoneRepeaterActive = new BlockRedstoneRepeater(94, true).setHardness(0.0).setLightValue(0.625).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('diode').disableStats();
  /** April fools secret locked chest */
  static lockedChest        = new BlockLockedChest(95).setHardness(0.0).setLightValue(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('lockedchest').setTickRandomly(true);
  static trapdoor           = new BlockTrapDoor(96, Material.wood).setHardness(3.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('trapdoor').disableStats();
  static silverfish         = new BlockSilverfish(97).setHardness(0.75).setUnlocalizedName('monsterStoneEgg');
  static stoneBrick         = new BlockStoneBrick(98).setHardness(1.5).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('stonebricksmooth');
  static mushroomCapBrown   = new BlockMushroomCap(99, Material.wood, 0).setHardness(0.2).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('mushroom');
  static mushroomCapRed     = new BlockMushroomCap(100, Material.wood, 1).setHardness(0.2).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('mushroom');
  static fenceIron          = new BlockPane(101, 'fenceIron', 'fenceIron', Material.iron, true).setHardness(5.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('fenceIron');
  static thinGlass          = new BlockPane(102, 'glass', 'thinglass_top', Material.glass, false).setHardness(0.3).setStepSound(Block.soundGlassFootstep).setUnlocalizedName('thinGlass');
  static melon              = new BlockMelon(103).setHardness(1.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('melon');
  static pumpkinStem        = new BlockStem(104, Block.pumpkin).setHardness(0.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('pumpkinStem');
  static melonStem          = new BlockStem(105, Block.melon).setHardness(0.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('pumpkinStem');
  static vine               = new BlockVine(106).setHardness(0.2).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('vine');
  static fenceGate          = new BlockFenceGate(107).setHardness(2.0).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('fenceGate');
  static stairsBrick        = new BlockStairs(108, Block.brick, 0).setUnlocalizedName('stairsBrick');
  static stairsStoneBrick   = new BlockStairs(109, Block.stoneBrick, 0).setUnlocalizedName('stairsStoneBrickSmooth');
  static mycelium           = new BlockMycelium(110).setHardness(0.6).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('mycel');
  static waterlily          = new BlockLilyPad(111).setHardness(0.0).setStepSound(Block.soundGrassFootstep).setUnlocalizedName('waterlily');
  static netherBrick        = new Block(112, Material.rock).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('netherBrick').setCreativeTab(CreativeTabs.tabBlock);
  static netherFence        = new BlockFence(113, 'netherBrick', Material.rock).setHardness(2.0).setResistance(10.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('netherFence');
  static stairsNetherBrick  = new BlockStairs(114, Block.netherBrick, 0).setUnlocalizedName('stairsNetherBrick');
  static netherStalk        = new BlockNetherStalk(115).setUnlocalizedName('netherStalk');
  static enchantmentTable   = new BlockEnchantmentTable(116).setHardness(5.0).setResistance(2000.0).setUnlocalizedName('enchantmentTable');
  static brewingStand       = new BlockBrewingStand(117).setHardness(0.5).setLightValue(0.125).setUnlocalizedName('brewingStand');
  static cauldron           = new BlockCauldron(118).setHardness(2.0).setUnlocalizedName('cauldron');
  static endPortal          = new BlockEndPortal(119, Material.portal).setHardness(-1.0).setResistance(6000000.0);
  static endPortalFrame     = new BlockEndPortalFrame(120).setStepSound(Block.soundGlassFootstep).setLightValue(0.125).setHardness(-1.0).setUnlocalizedName('endPortalFrame').setResistance(6000000.0).setCreativeTab(CreativeTabs.tabDecorations);
  /** The rock found in The End */
  static whiteStone         = new Block(121, Material.rock).setHardness(3.0).setResistance(15.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('whiteStone').setCreativeTab(CreativeTabs.tabBlock);
  static dragonEgg          = new BlockDragonEgg(122).setHardness(3.0).setResistance(15.0).setStepSound(Block.soundStoneFootstep).setLightValue(0.125).setUnlocalizedName('dragonEgg');
  static redstoneLampIdle   = new BlockRedstoneLight(123, false).setHardness(0.3).setStepSound(Block.soundGlassFootstep).setUnlocalizedName('redstoneLight').setCreativeTab(CreativeTabs.tabRedstone);
  static redstoneLampActive = new BlockRedstoneLight(124, true).setHardness(0.3).setStepSound(Block.soundGlassFootstep).setUnlocalizedName('redstoneLight');
  static woodDoubleSlab     = new BlockWoodSlab(125, true).setHardness(2.0).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('woodSlab');
  static woodSingleSlab     = new BlockWoodSlab(126, false).setHardness(2.0).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('woodSlab');
  static cocoaPlant         = new BlockCocoa(127).setHardness(0.2).setResistance(5.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('cocoa');
  static stairsSandStone    = new BlockStairs(128, Block.sandStone, 0).setUnlocalizedName('stairsSandStone');
  static oreEmerald         = new BlockOre(129).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('oreEmerald');
  static enderChest         = new BlockEnderChest(130).setHardness(22.5).setResistance(1000.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('enderChest').setLightValue(0.5);
  static tripWireSource     = new BlockTripWireSource(131).setUnlocalizedName('tripWireSource');
  static tripWire           = new BlockTripWire(132).setUnlocalizedName('tripWire');
  static blockEmerald       = new BlockOreStorage(133).setHardness(5.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('blockEmerald');
  static stairsWoodSpruce   = new BlockStairs(134, Block.planks, 1).setUnlocalizedName('stairsWoodSpruce');
  static stairsWoodBirch    = new BlockStairs(135, Block.planks, 2).setUnlocalizedName('stairsWoodBirch');
  static stairsWoodJungle   = new BlockStairs(136, Block.planks, 3).setUnlocalizedName('stairsWoodJungle');
  static commandBlock       = new BlockCommandBlock(137).setUnlocalizedName('commandBlock');
  static beacon             = new BlockBeacon(138).setUnlocalizedName('beacon').setLightValue(1.0);
  static cobblestoneWall    = new BlockWall(139, Block.cobblestone).setUnlocalizedName('cobbleWall');
  static flowerPot          = new BlockFlowerPot(140).setHardness(0.0).setStepSound(Block.soundPowderFootstep).setUnlocalizedName('flowerPot');
  static carrot             = new BlockCarrot(141).setUnlocalizedName('carrots');
  static potato             = new BlockPotato(142).setUnlocalizedName('potatoes');
  static woodenButton       = new BlockButtonWood(143).setHardness(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('button');
  static skull              = new BlockSkull(144).setHardness(1.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('skull');
  static anvil              = new BlockAnvil(145).setHardness(5.0).setStepSound(Block.soundAnvilFootstep).setResistance(2000.0).setUnlocalizedName('anvil');
  static chestTrapped       = new BlockChest(146, 1).setHardness(2.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('chestTrap');
  static pressurePlateGold  = new BlockPressurePlateWeighted(147, 'blockGold', Material.iron, 64).setHardness(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('weightedPlate_light');
  static pressurePlateIron  = new BlockPressurePlateWeighted(148, 'blockIron', Material.iron, 640).setHardness(0.5).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('weightedPlate_heavy');
  static redstoneComparatorIdle   = new BlockComparator(149, false).setHardness(0.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('comparator').disableStats();
  static redstoneComparatorActive = new BlockComparator(150, true).setHardness(0.0).setLightValue(0.625).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('comparator').disableStats();
  static daylightSensor     = new BlockDaylightDetector(151).setHardness(0.2).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('daylightDetector');
  static blockRedstone      = new BlockPoweredOre(152).setHardness(5.0).setResistance(10.0).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('blockRedstone');
  static oreNetherQuartz    = new BlockOre(153).setHardness(3.0).setResistance(5.0).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('netherquartz');
  static hopperBlock        = new BlockHopper(154).setHardness(3.0).setResistance(8.0).setStepSound(Block.soundWoodFootstep).setUnlocalizedName('hopper');
  static blockNetherQuartz  = new BlockQuartz(155).setStepSound(Block.soundStoneFootstep).setHardness(0.8).setUnlocalizedName('quartzBlock');
  static stairsNetherQuartz = new BlockStairs(156, Block.blockNetherQuartz, 0).setUnlocalizedName('stairsQuartz');
  static railActivator      = new BlockRailPowered(157).setHardness(0.7).setStepSound(Block.soundMetalFootstep).setUnlocalizedName('activatorRail');
  static dropper            = new BlockDropper(158).setHardness(3.5).setStepSound(Block.soundStoneFootstep).setUnlocalizedName('dropper');

  // -------------------------------------------------------------------------
  // Instance fields
  // -------------------------------------------------------------------------

  /** ID of the block */
  blockID;
  /** Indicates how many hits it takes to break a block */
  blockHardness = 0;
  /** Indicates the block's resistance to explosions */
  blockResistance = 0;
  blockConstructorCalled = true;
  /** Whether this block counts for statistics */
  enableStats = true;
  /** Whether this block needs random ticking */
  needsRandomTick = false;
  /** True if the block contains a tile entity */
  isBlockContainer = false;

  minX = 0; minY = 0; minZ = 0;
  maxX = 1; maxY = 1; maxZ = 1;

  /** Sound of stepping on the block */
  stepSound;
  blockParticleGravity = 1.0;
  /** Block material */
  blockMaterial;
  /** Velocity maintained while moving on top of this block */
  slipperiness = 0.6;

  #unlocalizedName = '';
  #displayOnCreativeTab = null;
  blockIcon = null;

  constructor(id, material) {
    if (Block.blocksList[id] !== null) {
      throw new Error(`Slot ${id} is already occupied by ${Block.blocksList[id]} when adding ${this}`);
    }
    this.blockMaterial = material;
    Block.blocksList[id] = this;
    this.blockID = id;
    this.stepSound = Block.soundPowderFootstep;
    this.setBlockBounds(0.0, 0.0, 0.0, 1.0, 1.0, 1.0);
    Block.opaqueCubeLookup[id] = this.isOpaqueCube() ? 1 : 0;
    Block.lightOpacity[id]     = this.isOpaqueCube() ? 255 : 0;
    Block.canBlockGrass[id]    = material.getCanBlockGrass() ? 0 : 1;
  }

  // -------------------------------------------------------------------------
  // Builder / setter methods
  // -------------------------------------------------------------------------

  /** Called after all blocks are created; subclasses can reference other blocks here */
  initializeBlock() {}

  setStepSound(sound)    { this.stepSound = sound; return this; }
  setLightOpacity(v)     { Block.lightOpacity[this.blockID] = v; return this; }
  setLightValue(v)       { Block.lightValue[this.blockID] = Math.trunc(15.0 * v); return this; }
  setResistance(v)       { this.blockResistance = v * 3.0; return this; }

  setHardness(v) {
    this.blockHardness = v;
    if (this.blockResistance < v * 5.0) this.blockResistance = v * 5.0;
    return this;
  }

  setBlockUnbreakable() { return this.setHardness(-1.0); }
  setTickRandomly(v)    { this.needsRandomTick = v; return this; }
  disableStats()        { this.enableStats = false; return this; }

  setUnlocalizedName(name) { this.#unlocalizedName = name; return this; }

  setCreativeTab(tab) { this.#displayOnCreativeTab = tab; return this; }

  /** Sets the block bounds (minX, minY, minZ, maxX, maxY, maxZ) */
  setBlockBounds(x0, y0, z0, x1, y1, z1) {
    this.minX = x0; this.minY = y0; this.minZ = z0;
    this.maxX = x1; this.maxY = y1; this.maxZ = z1;
  }

  // -------------------------------------------------------------------------
  // Static helpers
  // -------------------------------------------------------------------------

  static isNormalCube(id) {
    const b = Block.blocksList[id];
    return b !== null && b.blockMaterial.isOpaque() && b.renderAsNormalBlock() && !b.canProvidePower();
  }

  static isAssociatedBlockID(a, b) {
    if (a === b) return true;
    if (a === 0 || b === 0) return false;
    const ba = Block.blocksList[a], bb = Block.blocksList[b];
    return ba !== null && bb !== null && ba.isAssociatedBlockID(b);
  }

  // -------------------------------------------------------------------------
  // Instance methods
  // -------------------------------------------------------------------------

  renderAsNormalBlock()    { return true; }
  getRenderType()          { return 0; }
  isOpaqueCube()           { return true; }
  isCollidable()           { return true; }
  canProvidePower()        { return false; }
  hasTileEntity()          { return this.isBlockContainer; }
  getTickRandomly()        { return this.needsRandomTick; }
  getEnableStats()         { return this.enableStats; }
  getMobilityFlag()        { return this.blockMaterial.getMaterialMobility(); }
  isFlowerPot()            { return false; }
  hasComparatorInputOverride() { return false; }
  canSilkHarvest()         { return this.renderAsNormalBlock() && !this.isBlockContainer; }
  canBlockStay()           { return true; }
  canDropFromExplosion()   { return true; }
  func_82506_l()           { return true; }

  getBlocksMovement(access, x, y, z) { return !this.blockMaterial.blocksMovement(); }

  getBlockHardness(world, x, y, z)   { return this.blockHardness; }
  getExplosionResistance(entity)      { return this.blockResistance / 5.0; }
  getBlockColor()                     { return 16777215; }
  getRenderColor(meta)                { return 16777215; }
  colorMultiplier(access, x, y, z)   { return 16777215; }
  isProvidingWeakPower(access, x, y, z, side) { return 0; }
  isProvidingStrongPower(access, x, y, z, side) { return 0; }
  getComparatorInputOverride(world, x, y, z, side) { return 0; }
  tickRate(world)                     { return 10; }
  quantityDropped(rng)                { return 1; }
  quantityDroppedWithBonus(bonus, rng){ return this.quantityDropped(rng); }
  idDropped(meta, rng, fortune)       { return this.blockID; }
  damageDropped(meta)                 { return 0; }
  getRenderBlockPass()                { return 0; }
  onBlockEventReceived(world, x, y, z, a, b) { return false; }
  onBlockActivated(world, x, y, z, player, side, hitX, hitY, hitZ) { return false; }
  onBlockPlaced(world, x, y, z, side, hitX, hitY, hitZ, meta) { return meta; }
  idPicked(world, x, y, z)           { return this.blockID; }
  getDamageValue(world, x, y, z)     { return this.damageDropped(world.getBlockMetadata(x, y, z)); }
  isAssociatedBlockID(id)             { return this.blockID === id; }
  canCollideCheck(meta, flag)         { return this.isCollidable(); }
  isBlockSolid(access, x, y, z, side){ return access.getBlockMaterial(x, y, z).isSolid(); }

  getLocalizedName()  { return StatCollector.translateToLocal(this.getUnlocalizedName() + '.name'); }
  getUnlocalizedName(){ return 'tile.' + this.#unlocalizedName; }
  getUnlocalizedName2(){ return this.#unlocalizedName; }
  getCreativeTabToDisplayOn() { return this.#displayOnCreativeTab; }
  getItemIconName()   { return null; }

  getBlockBoundsMinX() { return this.minX; }
  getBlockBoundsMaxX() { return this.maxX; }
  getBlockBoundsMinY() { return this.minY; }
  getBlockBoundsMaxY() { return this.maxY; }
  getBlockBoundsMinZ() { return this.minZ; }
  getBlockBoundsMaxZ() { return this.maxZ; }

  getBlockBrightness(access, x, y, z) {
    return access.getBrightness(x, y, z, Block.lightValue[access.getBlockId(x, y, z)]);
  }

  getMixedBrightnessForBlock(access, x, y, z) {
    return access.getLightBrightnessForSkyBlocks(x, y, z, Block.lightValue[access.getBlockId(x, y, z)]);
  }

  shouldSideBeRendered(access, x, y, z, side) {
    if (side === 0 && this.minY > 0.0) return true;
    if (side === 1 && this.maxY < 1.0) return true;
    if (side === 2 && this.minZ > 0.0) return true;
    if (side === 3 && this.maxZ < 1.0) return true;
    if (side === 4 && this.minX > 0.0) return true;
    if (side === 5 && this.maxX < 1.0) return true;
    return !access.isBlockOpaqueCube(x, y, z);
  }

  getIcon(side, meta)     { return this.blockIcon; }
  getBlockTextureFromSide(side) { return this.getIcon(side, 0); }
  getBlockTexture(access, x, y, z, side) {
    return this.getIcon(side, access.getBlockMetadata(x, y, z));
  }

  getSelectedBoundingBoxFromPool(world, x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(x + this.minX, y + this.minY, z + this.minZ, x + this.maxX, y + this.maxY, z + this.maxZ);
  }

  getCollisionBoundingBoxFromPool(world, x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(x + this.minX, y + this.minY, z + this.minZ, x + this.maxX, y + this.maxY, z + this.maxZ);
  }

  addCollisionBoxesToList(world, x, y, z, mask, list, entity) {
    const bb = this.getCollisionBoundingBoxFromPool(world, x, y, z);
    if (bb !== null && mask.intersectsWith(bb)) list.push(bb);
  }

  getPlayerRelativeBlockHardness(player, world, x, y, z) {
    const h = this.getBlockHardness(world, x, y, z);
    if (h < 0.0) return 0.0;
    return player.canHarvestBlock(this)
      ? player.getCurrentPlayerStrVsBlock(this, true)  / h / 30.0
      : player.getCurrentPlayerStrVsBlock(this, false) / h / 100.0;
  }

  dropBlockAsItem(world, x, y, z, meta, fortune) {
    this.dropBlockAsItemWithChance(world, x, y, z, meta, 1.0, fortune);
  }

  harvestBlock(world, player, x, y, z, meta) {
    player.addExhaustion(0.025);
    if (this.canSilkHarvest() && EnchantmentHelper.getSilkTouchModifier(player)) {
      const stack = this.createStackedBlock(meta);
      if (stack !== null) this.dropBlockAsItem_do(world, x, y, z, stack);
    } else {
      const fortune = EnchantmentHelper.getFortuneModifier(player);
      this.dropBlockAsItem(world, x, y, z, meta, fortune);
    }
  }

  createStackedBlock(meta) {
    let damage = 0;
    if (this.blockID >= 0 && this.blockID < Item.itemsList.length && Item.itemsList[this.blockID].getHasSubtypes()) {
      damage = meta;
    }
    return new ItemStack(this.blockID, 1, damage);
  }

  canPlaceBlockAt(world, x, y, z) {
    const id = world.getBlockId(x, y, z);
    return id === 0 || Block.blocksList[id].blockMaterial.isReplaceable();
  }

  canPlaceBlockOnSide(world, x, y, z, side, stack) {
    if (arguments.length === 6) return this.canPlaceBlockOnSide(world, x, y, z, side);
    return this.canPlaceBlockAt(world, x, y, z);
  }

  getAmbientOcclusionLightValue(access, x, y, z) {
    return access.isBlockNormalCube(x, y, z) ? 0.2 : 1.0;
  }

  getSubBlocks(id, tab, list) { list.push(new ItemStack(id, 1, 0)); }

  registerIcons(reg) { this.blockIcon = reg.registerIcon(this.#unlocalizedName); }

  getCollisionBoundingBoxFromPool(world, x, y, z) {
    return AxisAlignedBB.getAABBPool().getAABB(
      x + this.minX, y + this.minY, z + this.minZ,
      x + this.maxX, y + this.maxY, z + this.maxZ,
    );
  }

  /**
   * Ray-traces through the block's collision bounds from start to end.
   * Same candidate-array refactor used in AxisAlignedBB.calculateIntercept.
   */
  collisionRayTrace(world, bx, by, bz, start, end) {
    this.setBlockBoundsBasedOnState(world, bx, by, bz);
    const s = start.addVector(-bx, -by, -bz);
    const e = end.addVector(-bx, -by, -bz);

    const candidates = [
      { vec: s.getIntermediateWithXValue(e, this.minX), check: v => this.#isVecInsideYZBounds(v), face: 4 },
      { vec: s.getIntermediateWithXValue(e, this.maxX), check: v => this.#isVecInsideYZBounds(v), face: 5 },
      { vec: s.getIntermediateWithYValue(e, this.minY), check: v => this.#isVecInsideXZBounds(v), face: 0 },
      { vec: s.getIntermediateWithYValue(e, this.maxY), check: v => this.#isVecInsideXZBounds(v), face: 1 },
      { vec: s.getIntermediateWithZValue(e, this.minZ), check: v => this.#isVecInsideXYBounds(v), face: 2 },
      { vec: s.getIntermediateWithZValue(e, this.maxZ), check: v => this.#isVecInsideXYBounds(v), face: 3 },
    ];

    let closest = null, closestFace = -1;
    for (const { vec, check, face } of candidates) {
      if (vec === null || !check(vec)) continue;
      if (closest === null || s.squareDistanceTo(vec) < s.squareDistanceTo(closest)) {
        closest = vec; closestFace = face;
      }
    }

    return closest === null
      ? null
      : new MovingObjectPosition(bx, by, bz, closestFace, closest.addVector(bx, by, bz));
  }

  #isVecInsideYZBounds(v) {
    return v !== null && v.yCoord >= this.minY && v.yCoord <= this.maxY && v.zCoord >= this.minZ && v.zCoord <= this.maxZ;
  }
  #isVecInsideXZBounds(v) {
    return v !== null && v.xCoord >= this.minX && v.xCoord <= this.maxX && v.zCoord >= this.minZ && v.zCoord <= this.maxZ;
  }
  #isVecInsideXYBounds(v) {
    return v !== null && v.xCoord >= this.minX && v.xCoord <= this.maxX && v.yCoord >= this.minY && v.yCoord <= this.maxY;
  }

  // Stubs (overridden by subclasses)
  updateTick(world, x, y, z, rng) {}
  randomDisplayTick(world, x, y, z, rng) {}
  onBlockDestroyedByPlayer(world, x, y, z, meta) {}
  onNeighborBlockChange(world, x, y, z, neighborId) {}
  onBlockAdded(world, x, y, z) {}
  breakBlock(world, x, y, z, id, meta) {}
  dropBlockAsItemWithChance(world, x, y, z, meta, chance, fortune) {}
  dropBlockAsItem_do(world, x, y, z, stack) {}
  dropXpOnBlockBreak(world, x, y, z, xp) {}
  onBlockDestroyedByExplosion(world, x, y, z, explosion) {}
  onEntityCollidedWithBlock(world, x, y, z, entity) {}
  onEntityWalking(world, x, y, z, entity) {}
  onBlockClicked(world, x, y, z, player) {}
  velocityToAddToEntity(world, x, y, z, entity, vec) {}
  setBlockBoundsBasedOnState(access, x, y, z) {}
  setBlockBoundsForItemRender() {}
  onBlockPlacedBy(world, x, y, z, entity, stack) {}
  onPostBlockPlaced(world, x, y, z, meta) {}
  onBlockHarvested(world, x, y, z, meta, player) {}
  onSetBlockIDWithMetaData(world, x, y, z, meta) {}
  fillWithRain(world, x, y, z) {}
  onFallenUpon(world, x, y, z, entity, fallDist) {}
  initializeBlock() {}
}

// -------------------------------------------------------------------------
// Static initializer (mirrors Java's static { } block)
// -------------------------------------------------------------------------

(function staticInit() {
  const B = Block;
  const il = Item.itemsList;

  il[B.cloth.blockID]           = new ItemCloth(B.cloth.blockID - 256).setUnlocalizedName('cloth');
  il[B.wood.blockID]            = new ItemMultiTextureTile(B.wood.blockID - 256, B.wood, BlockLog.woodType).setUnlocalizedName('log');
  il[B.planks.blockID]          = new ItemMultiTextureTile(B.planks.blockID - 256, B.planks, BlockWood.woodType).setUnlocalizedName('wood');
  il[B.silverfish.blockID]      = new ItemMultiTextureTile(B.silverfish.blockID - 256, B.silverfish, BlockSilverfish.silverfishStoneTypes).setUnlocalizedName('monsterStoneEgg');
  il[B.stoneBrick.blockID]      = new ItemMultiTextureTile(B.stoneBrick.blockID - 256, B.stoneBrick, BlockStoneBrick.STONE_BRICK_TYPES).setUnlocalizedName('stonebricksmooth');
  il[B.sandStone.blockID]       = new ItemMultiTextureTile(B.sandStone.blockID - 256, B.sandStone, BlockSandStone.SAND_STONE_TYPES).setUnlocalizedName('sandStone');
  il[B.blockNetherQuartz.blockID] = new ItemMultiTextureTile(B.blockNetherQuartz.blockID - 256, B.blockNetherQuartz, BlockQuartz.quartzBlockTypes).setUnlocalizedName('quartzBlock');
  il[B.stoneSingleSlab.blockID] = new ItemSlab(B.stoneSingleSlab.blockID - 256, B.stoneSingleSlab, B.stoneDoubleSlab, false).setUnlocalizedName('stoneSlab');
  il[B.stoneDoubleSlab.blockID] = new ItemSlab(B.stoneDoubleSlab.blockID - 256, B.stoneSingleSlab, B.stoneDoubleSlab, true).setUnlocalizedName('stoneSlab');
  il[B.woodSingleSlab.blockID]  = new ItemSlab(B.woodSingleSlab.blockID - 256, B.woodSingleSlab, B.woodDoubleSlab, false).setUnlocalizedName('woodSlab');
  il[B.woodDoubleSlab.blockID]  = new ItemSlab(B.woodDoubleSlab.blockID - 256, B.woodSingleSlab, B.woodDoubleSlab, true).setUnlocalizedName('woodSlab');
  il[B.sapling.blockID]         = new ItemMultiTextureTile(B.sapling.blockID - 256, B.sapling, BlockSapling.WOOD_TYPES).setUnlocalizedName('sapling');
  il[B.leaves.blockID]          = new ItemLeaves(B.leaves.blockID - 256).setUnlocalizedName('leaves');
  il[B.vine.blockID]            = new ItemColored(B.vine.blockID - 256, false);
  il[B.tallGrass.blockID]       = new ItemColored(B.tallGrass.blockID - 256, true).setBlockNames(['shrub', 'grass', 'fern']);
  il[B.snow.blockID]            = new ItemSnow(B.snow.blockID - 256, B.snow);
  il[B.waterlily.blockID]       = new ItemLilyPad(B.waterlily.blockID - 256);
  il[B.pistonBase.blockID]      = new ItemPiston(B.pistonBase.blockID - 256);
  il[B.pistonStickyBase.blockID]= new ItemPiston(B.pistonStickyBase.blockID - 256);
  il[B.cobblestoneWall.blockID] = new ItemMultiTextureTile(B.cobblestoneWall.blockID - 256, B.cobblestoneWall, BlockWall.types).setUnlocalizedName('cobbleWall');
  il[B.anvil.blockID]           = new ItemAnvilBlock(B.anvil).setUnlocalizedName('anvil');

  for (let id = 0; id < 256; ++id) {
    const block = B.blocksList[id];
    if (block === null) continue;

    if (il[id] === null) {
      il[id] = new ItemBlock(id - 256);
      block.initializeBlock();
    }

    let useNeighbour = false;
    if (id > 0 && block.getRenderType() === 10)          useNeighbour = true;
    if (id > 0 && block instanceof BlockHalfSlab)        useNeighbour = true;
    if (id === B.tilledField.blockID)                    useNeighbour = true;
    if (B.canBlockGrass[id])                             useNeighbour = true;
    if (B.lightOpacity[id] === 0)                        useNeighbour = true;
    B.useNeighborBrightness[id] = useNeighbour ? 1 : 0;
  }

  B.canBlockGrass[0] = 1;
})();