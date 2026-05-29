// Minecraft.js
import { EaglerAdapter } from './EaglerAdapter.js';
import { EaglerProfile } from './EaglerProfile.js';
import { GuiScreenEditProfile } from './GuiScreenEditProfile.js';
import { GuiScreenLicense } from './GuiScreenLicense.js';
import { GuiScreenSingleplayerConnecting } from './GuiScreenSingleplayerConnecting.js';
import { GuiScreenSingleplayerLoading } from './GuiScreenSingleplayerLoading.js';
import { GuiVoiceOverlay } from './GuiVoiceOverlay.js';
import { IntegratedServer } from './IntegratedServer.js';
import { IntegratedServerLAN } from './IntegratedServerLAN.js';
import { LocalStorageManager } from './LocalStorageManager.js';
import { Voice } from './Voice.js';
import { WorkerNetworkManager } from './WorkerNetworkManager.js';
import { DefaultSkinRenderer } from './DefaultSkinRenderer.js';
import { Tessellator } from './Tessellator.js';
import { FixedFunctionShader } from './FixedFunctionShader.js';
import { AchievementList } from '../src/AchievementList.js';
import { AxisAlignedBB } from '../src/AxisAlignedBB.js';
import { Block } from '../src/Block.js';
import { ChatAllowedCharacters } from '../src/ChatAllowedCharacters.js';
import { ColorizerFoliage } from '../src/ColorizerFoliage.js';
import { ColorizerGrass } from '../src/ColorizerGrass.js';
import { EffectRenderer } from '../src/EffectRenderer.js';
import { EntityBoat } from '../src/EntityBoat.js';
import { EntityClientPlayerMP } from '../src/EntityClientPlayerMP.js';
import { EntityItemFrame } from '../src/EntityItemFrame.js';
import { EntityList } from '../src/EntityList.js';
import { EntityMinecart } from '../src/EntityMinecart.js';
import { EntityPainting } from '../src/EntityPainting.js';
import { EntityPlayer } from '../src/EntityPlayer.js';
import { EntityRenderer } from '../src/EntityRenderer.js';
import { EnumChatFormatting } from '../src/EnumChatFormatting.js';
import { EnumMovingObjectType } from '../src/EnumMovingObjectType.js';
import { EnumOS } from '../src/EnumOS.js';
import { EnumOptions } from '../src/EnumOptions.js';
import { FontRenderer } from '../src/FontRenderer.js';
import { GLAllocation } from '../src/GLAllocation.js';
import { GameSettings } from '../src/GameSettings.js';
import { GuiAchievement } from '../src/GuiAchievement.js';
import { GuiChat } from '../src/GuiChat.js';
import { GuiConnecting } from '../src/GuiConnecting.js';
import { GuiGameOver } from '../src/GuiGameOver.js';
import { GuiIngame } from '../src/GuiIngame.js';
import { GuiIngameMenu } from '../src/GuiIngameMenu.js';
import { GuiInventory } from '../src/GuiInventory.js';
import { GuiMainMenu } from '../src/GuiMainMenu.js';
import { GuiMultiplayer } from '../src/GuiMultiplayer.js';
import { GuiScreen } from '../src/GuiScreen.js';
import { GuiSleepMP } from '../src/GuiSleepMP.js';
import { Item } from '../src/Item.js';
import { ItemRenderer } from '../src/ItemRenderer.js';
import { ItemStack } from '../src/ItemStack.js';
import { KeyBinding } from '../src/KeyBinding.js';
import { LoadingScreenRenderer } from '../src/LoadingScreenRenderer.js';
import { MathHelper } from '../src/MathHelper.js';
import { MouseHelper } from '../src/MouseHelper.js';
import { MovementInputFromOptions } from '../src/MovementInputFromOptions.js';
import { MovingObjectPosition } from '../src/MovingObjectPosition.js';
import { NetClientHandler } from '../src/NetClientHandler.js';
import { OpenGlHelper } from '../src/OpenGlHelper.js';
import { Packet3Chat } from '../src/Packet3Chat.js';
import { PlayerControllerMP } from '../src/PlayerControllerMP.js';
import { Profiler } from '../src/Profiler.js';
import { ProfilerResult } from '../src/ProfilerResult.js';
import { RenderBlocks } from '../src/RenderBlocks.js';
import { RenderEngine } from '../src/RenderEngine.js';
import { RenderGlobal } from '../src/RenderGlobal.js';
import { RenderManager } from '../src/RenderManager.js';
import { ScaledResolution } from '../src/ScaledResolution.js';
import { ServerData } from '../src/ServerData.js';
import { SoundManager } from '../src/SoundManager.js';
import { StatCollector } from '../src/StatCollector.js';
import { StatStringFormatKeyInv } from '../src/StatStringFormatKeyInv.js';
import { StringTranslate } from '../src/StringTranslate.js';
import { TextureManager } from '../src/TextureManager.js';
import { TexturePackList } from '../src/TexturePackList.js';
import { Timer } from '../src/Timer.js';
import { WorldClient } from '../src/WorldClient.js';
import { WorldSettings } from '../src/WorldSettings.js';

export class Minecraft {
	#currentServerData    = null;
	#fullscreen           = false;
	#hasCrashed           = false;
	#isGonnaTakeDatScreenShot = false;
	#leftClickCounter     = 0;
	#tempDisplayWidth     = 0;
	#tempDisplayHeight    = 0;
	#rightClickDelayTimer = 0;
	#refreshTexturePacksScheduled = false;
	#serverName           = null;
	#serverPort           = 0;
	#joinPlayerCounter    = 0;
	#isDemo               = false;
	#myNetworkManager     = null;
	#integratedServerIsRunning = false;
	#field_83002_am       = -1n; // crash-key timer (BigInt for long precision)
	#debugProfilerName    = 'root';
	#titleMusicObj        = -1;
	#wasPaused            = false;

	/** Singleton instance */
	static #theMinecraft  = null;

	playerController      = null;
	displayWidth          = 854;
	displayHeight         = 480;
	timer                 = new Timer(20.0);
	theWorld              = null;
	renderGlobal          = null;
	thePlayer             = null;
	renderViewEntity      = null;
	pointedEntityLiving   = null;
	effectRenderer        = null;
	minecraftUri          = null;
	hideQuitButton        = false;
	isGamePaused          = false;
	renderEngine          = null;
	fontRenderer          = null;
	standardGalacticFontRenderer = null;
	currentScreen         = null;
	loadingScreen         = null;
	entityRenderer        = null;
	guiAchievement        = null;
	ingameGUI             = null;
	skipRenderWorld       = false;
	objectMouseOver       = null;
	gameSettings          = null;
	sndManager            = new SoundManager();
	mouseHelper           = null;
	texturePackList       = null;
	isTakingScreenshot    = false;
	inGameHasFocus        = false;
	systemTime            = Minecraft.getSystemTime();
	mcProfiler            = new Profiler();
	chunkUpdates          = 0;
	chunkGeometryUpdates  = 0;
	running               = true;
	debug                 = '';
	debugUpdateTime       = Minecraft.getSystemTime();
	fpsCounter            = 0;
	prevFrameTime         = -1n;
	secondTimer           = 0n;
	voiceOverlay          = null;
	lanState              = false;
	yeeState              = false;
	reconnectAddress      = null;
	messageOnLoginCounter = 0;

	/** Shown once per session per message string */
	#shownPlayerMessages  = new Set();

	static debugFPS                   = 0;
	static debugChunkUpdates          = 0;
	static debugChunkGeometryUpdates  = 0;

	constructor() {
		this.#tempDisplayHeight = 480;
		this.#fullscreen        = false;
		Packet3Chat.maxChatLength = 32767;
		this.#startTimerHackThread();
		this.displayWidth  = 854;
		this.displayHeight = 480;
		Minecraft.#theMinecraft = this;
	}

	#startTimerHackThread() {
		// no-op in Eaglercraft
	}

	isSingleplayerOrLAN() {
		return IntegratedServer.isWorldRunning();
	}

	setServer(name, port) {
		this.#serverName = name;
		this.#serverPort = port;
	}

	// -------------------------------------------------------------------------
	// Startup
	// -------------------------------------------------------------------------

	startGame() {
		OpenGlHelper.initializeTextures();
		TextureManager.init();
		this.gameSettings   = new GameSettings(this);
		this.texturePackList = new TexturePackList(this);
		this.renderEngine    = new RenderEngine(this.texturePackList, this.gameSettings);

		this.#loadScreen();

		ChatAllowedCharacters.getAllowedCharacters();
		this.fontRenderer                = new FontRenderer(this.gameSettings, '/font/default.png',   this.renderEngine, false);
		this.standardGalacticFontRenderer = new FontRenderer(this.gameSettings, '/font/alternate.png', this.renderEngine, false);

		if (this.gameSettings.language !== null) {
			StringTranslate.getInstance().setLanguage(this.gameSettings.language, false);
		}

		this.#loadScreen();

		ColorizerGrass.setGrassBiomeColorizer(this.renderEngine.getTextureContents('/misc/grasscolor.png'));
		ColorizerFoliage.setFoliageBiomeColorizer(this.renderEngine.getTextureContents('/misc/foliagecolor.png'));
		this.entityRenderer = new EntityRenderer(this);
		RenderManager.instance = new RenderManager();
		RenderManager.instance.itemRenderer = new ItemRenderer(this);
		AchievementList.openInventory.setStatStringFormatter(new StatStringFormatKeyInv(this));
		this.mouseHelper = new MouseHelper(this.gameSettings);
		this.checkGLError('Pre startup');

		EaglerAdapter.glEnable(EaglerAdapter.GL_TEXTURE_2D);
		EaglerAdapter.glShadeModel(EaglerAdapter.GL_SMOOTH);
		EaglerAdapter.glClearDepth(1.0);
		EaglerAdapter.glEnable(EaglerAdapter.GL_DEPTH_TEST);
		EaglerAdapter.glDepthFunc(EaglerAdapter.GL_LEQUAL);
		EaglerAdapter.glEnable(EaglerAdapter.GL_ALPHA_TEST);
		EaglerAdapter.glAlphaFunc(EaglerAdapter.GL_GREATER, 0.1);
		EaglerAdapter.glCullFace(EaglerAdapter.GL_BACK);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_PROJECTION);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);
		this.checkGLError('Startup');

		this.sndManager.loadSoundSettings(this.gameSettings);
		this.renderGlobal = new RenderGlobal(this, this.renderEngine);
		this.renderEngine.refreshTextureMaps();
		EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
		this.effectRenderer = new EffectRenderer(this.theWorld, this.renderEngine);
		this.checkGLError('Post startup');

		this.guiAchievement = new GuiAchievement(this);
		this.ingameGUI      = new GuiIngame(this);
		this.voiceOverlay   = new GuiVoiceOverlay(this);

		const res  = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);
		this.voiceOverlay.setResolution(res.getScaledWidth(), res.getScaledHeight());

		EaglerAdapter.anisotropicPatch(EaglerAdapter.glNeedsAnisotropicFix());
		EaglerProfile.loadFromStorage();
		this.sndManager.playTheTitleMusic();
		this.#showIntroAnimation();

		const serverToJoin = EaglerAdapter.getServerToJoinOnLaunch();
		let scr;
		if (serverToJoin !== null) {
			scr = new GuiScreenEditProfile(new GuiConnecting(new GuiMainMenu(), this, new ServerData('Eaglercraft Server', serverToJoin, false)));
		} else {
			scr = new GuiScreenEditProfile(new GuiMainMenu());
		}

		if (!LocalStorageManager.profileSettingsStorage.getBoolean('acceptLicense')) {
			scr = new GuiScreenLicense(scr);
		}

		this.displayGuiScreen(scr);
		this.loadingScreen = new LoadingScreenRenderer(this);

		if (this.gameSettings.fullScreen && !this.#fullscreen) {
			this.toggleFullscreen();
		}

		const adderallBytes = EaglerAdapter.loadResourceBytes('adderall');
		if (adderallBytes !== null) {
			const text = new TextDecoder().decode(adderallBytes);
			// Java hashCode equivalent for the string
			let hash = 0;
			for (let i = 0; i < text.length; i++) {
				hash = (Math.imul(31, hash) + text.charCodeAt(i)) | 0;
			}
			this.yeeState = hash === 508925104;
		}
	}

	// -------------------------------------------------------------------------
	// Intro animation
	// -------------------------------------------------------------------------

	#showIntroAnimation() {
		let res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);

		EaglerAdapter.glClearColor(1.0, 1.0, 1.0, 1.0);
		EaglerAdapter.glDisable(EaglerAdapter.GL_ALPHA_TEST);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glTranslatef(0.0, 0.0, -2000.0);
		EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
		EaglerAdapter.glDisable(EaglerAdapter.GL_LIGHTING);
		EaglerAdapter.glEnable(EaglerAdapter.GL_TEXTURE_2D);
		EaglerAdapter.glEnable(EaglerAdapter.GL_BLEND);
		EaglerAdapter.glBlendFunc(EaglerAdapter.GL_SRC_ALPHA, EaglerAdapter.GL_ONE_MINUS_SRC_ALPHA);
		EaglerAdapter.glDisable(EaglerAdapter.GL_FOG);
		EaglerAdapter.glColor4f(1.0, 1.0, 1.0, 1.0);

		// Phase 1: EaglerCraft logo fade-out
		let t1 = Date.now();
		for (let i = 0; i < 20; ++i) {
			this.displayWidth  = EaglerAdapter.getCanvasWidth();
			this.displayHeight = EaglerAdapter.getCanvasHeight();
			EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
			res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);
			EaglerAdapter.glMatrixMode(EaglerAdapter.GL_PROJECTION);
			EaglerAdapter.glLoadIdentity();
			EaglerAdapter.glOrtho(0.0, res.getScaledWidth(), res.getScaledHeight(), 0.0, 1000.0, 3000.0);
			EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);

			const f  = (Date.now() - t1) / 333.0;
			EaglerAdapter.glClear(EaglerAdapter.GL_COLOR_BUFFER_BIT | EaglerAdapter.GL_DEPTH_BUFFER_BIT);
			EaglerAdapter.glColor4f(1.0, 1.0, 1.0, MathHelper.clamp_float(1.0 - f, 0.0, 1.0));
			this.renderEngine.bindTexture('%clamp%/title/eagtek.png');
			EaglerAdapter.glPushMatrix();
			const f1 = 1.0 + 0.025 * f * f;
			EaglerAdapter.glTranslatef((res.getScaledWidth() - 256) / 2, (res.getScaledHeight() - 256) / 2, 0.0);
			EaglerAdapter.glTranslatef(-128.0 * (f1 - 1.0), -128.0 * (f1 - 1.0), 0.0);
			EaglerAdapter.glScalef(f1, f1, 1.0);
			this.scaledTessellator(0, 0, 0, 0, 256, 256);
			EaglerAdapter.glPopMatrix();
			EaglerAdapter.glFlush();
			EaglerAdapter.updateDisplay();

			// ~60 fps pacing
			// (Thread.sleep equivalents are not directly available in JS;
			//  this loop runs synchronously as Eaglercraft uses a JS event loop)
		}

		// Phase 2: Mojang logo fade-in
		t1 = Date.now();
		for (let i = 0; i < 20; ++i) {
			this.displayWidth  = EaglerAdapter.getCanvasWidth();
			this.displayHeight = EaglerAdapter.getCanvasHeight();
			EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
			res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);
			EaglerAdapter.glMatrixMode(EaglerAdapter.GL_PROJECTION);
			EaglerAdapter.glLoadIdentity();
			EaglerAdapter.glOrtho(0.0, res.getScaledWidth(), res.getScaledHeight(), 0.0, 1000.0, 3000.0);
			EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);

			const f  = (Date.now() - t1) / 333.0;
			EaglerAdapter.glClear(EaglerAdapter.GL_COLOR_BUFFER_BIT | EaglerAdapter.GL_DEPTH_BUFFER_BIT);
			EaglerAdapter.glColor4f(1.0, 1.0, 1.0, MathHelper.clamp_float(f, 0.0, 1.0));
			this.renderEngine.bindTexture('%blur%/title/mojang.png');
			EaglerAdapter.glPushMatrix();
			const f1 = 0.875 + 0.025 * Math.sqrt(f);
			EaglerAdapter.glTranslatef((res.getScaledWidth() - 256) / 2, (res.getScaledHeight() - 256) / 2, 0.0);
			EaglerAdapter.glTranslatef(-128.0 * (f1 - 1.0), -128.0 * (f1 - 1.0), 0.0);
			EaglerAdapter.glScalef(f1, f1, 1.0);
			this.scaledTessellator(0, 0, 0, 0, 256, 256);
			EaglerAdapter.glPopMatrix();
			EaglerAdapter.glFlush();
			EaglerAdapter.updateDisplay();
		}

		// Hold Mojang logo for ~1.6s (handled by Eaglercraft's async loop)

		// Phase 3: Mojang logo fade-out
		t1 = Date.now();
		for (let i = 0; i < 21; ++i) {
			this.displayWidth  = EaglerAdapter.getCanvasWidth();
			this.displayHeight = EaglerAdapter.getCanvasHeight();
			EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
			res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);

			const f  = (Date.now() - t1) / 340.0;
			EaglerAdapter.glClear(EaglerAdapter.GL_COLOR_BUFFER_BIT | EaglerAdapter.GL_DEPTH_BUFFER_BIT);
			EaglerAdapter.glColor4f(1.0, 1.0, 1.0, MathHelper.clamp_float(1.0 - f, 0.0, 1.0));
			this.renderEngine.bindTexture('%blur%/title/mojang.png');
			EaglerAdapter.glPushMatrix();
			const f1 = 0.9 + 0.025 * f * f;
			EaglerAdapter.glTranslatef((res.getScaledWidth() - 256) / 2, (res.getScaledHeight() - 256) / 2, 0.0);
			EaglerAdapter.glTranslatef(-128.0 * (f1 - 1.0), -128.0 * (f1 - 1.0), 0.0);
			EaglerAdapter.glScalef(f1, f1, 1.0);
			this.scaledTessellator(0, 0, 0, 0, 256, 256);
			EaglerAdapter.glPopMatrix();
			EaglerAdapter.glFlush();
			EaglerAdapter.updateDisplay();
		}

		EaglerAdapter.glClear(EaglerAdapter.GL_COLOR_BUFFER_BIT | EaglerAdapter.GL_DEPTH_BUFFER_BIT);
		EaglerAdapter.glFlush();
		EaglerAdapter.updateDisplay();

		EaglerAdapter.glDisable(EaglerAdapter.GL_BLEND);
		EaglerAdapter.glEnable(EaglerAdapter.GL_ALPHA_TEST);
		EaglerAdapter.glAlphaFunc(EaglerAdapter.GL_GREATER, 0.1);

		while (EaglerAdapter.keysNext());
		while (EaglerAdapter.mouseNext());
	}

	/** Renders the EaglerCraft loading screen logo */
	#loadScreen() {
		this.displayWidth  = EaglerAdapter.getCanvasWidth();
		this.displayHeight = EaglerAdapter.getCanvasHeight();
		const res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);

		EaglerAdapter.glColorMask(true, true, true, true);
		EaglerAdapter.glClearColor(1.0, 1.0, 1.0, 1.0);
		EaglerAdapter.glDisable(EaglerAdapter.GL_ALPHA_TEST);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_PROJECTION);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glOrtho(0.0, res.getScaledWidth(), res.getScaledHeight(), 0.0, 1000.0, 3000.0);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glTranslatef(0.0, 0.0, -2000.0);
		EaglerAdapter.glViewport(0, 0, this.displayWidth, this.displayHeight);
		EaglerAdapter.glClear(EaglerAdapter.GL_COLOR_BUFFER_BIT | EaglerAdapter.GL_DEPTH_BUFFER_BIT);
		EaglerAdapter.glDisable(EaglerAdapter.GL_LIGHTING);
		EaglerAdapter.glEnable(EaglerAdapter.GL_TEXTURE_2D);
		EaglerAdapter.glDisable(EaglerAdapter.GL_FOG);
		EaglerAdapter.glColor4f(1.0, 1.0, 1.0, 1.0);
		this.renderEngine.bindTexture('%clamp%/title/eagtek.png');
		this.scaledTessellator((res.getScaledWidth() - 256) / 2, (res.getScaledHeight() - 256) / 2, 0, 0, 256, 256);
		EaglerAdapter.glDisable(EaglerAdapter.GL_LIGHTING);
		EaglerAdapter.glDisable(EaglerAdapter.GL_FOG);
		EaglerAdapter.glEnable(EaglerAdapter.GL_ALPHA_TEST);
		EaglerAdapter.glAlphaFunc(EaglerAdapter.GL_GREATER, 0.1);
		EaglerAdapter.glFlush();
		EaglerAdapter.updateDisplay();
	}

	/**
	 * Draws a UV-mapped quad using the Tessellator.
	 * Args: destX, destY, srcX, srcY, width, height
	 */
	scaledTessellator(dx, dy, sx, sy, w, h) {
		const scale = 0.00390625; // 1/256
		const tess  = Tessellator.instance;
		tess.startDrawingQuads();
		tess.setColorOpaque(255, 255, 255);
		tess.addVertexWithUV(dx,     dy + h, 0.0,  sx       * scale, (sy + h) * scale);
		tess.addVertexWithUV(dx + w, dy + h, 0.0, (sx + w)  * scale, (sy + h) * scale);
		tess.addVertexWithUV(dx + w, dy,     0.0, (sx + w)  * scale,  sy      * scale);
		tess.addVertexWithUV(dx,     dy,     0.0,  sx       * scale,  sy      * scale);
		tess.draw();
	}

	// -------------------------------------------------------------------------
	// Main game loop
	// -------------------------------------------------------------------------

	run() {
		this.running = true;
		this.startGame();
		while (this.running) {
			this.runGameLoop();
		}
		EaglerAdapter.destroyContext();
		EaglerAdapter.exit();
	}

	/** Called repeatedly from run() */
	runGameLoop() {
		if (this.#refreshTexturePacksScheduled) {
			this.#refreshTexturePacksScheduled = false;
			this.renderEngine.refreshTextures();
		}

		AxisAlignedBB.getAABBPool().cleanPool();

		if (this.theWorld !== null) {
			this.theWorld.getWorldVec3Pool().clear();
		}

		this.mcProfiler.startSection('root');

		if (EaglerAdapter.shouldShutdown()) {
			this.shutdown();
		}

		if (this.isGamePaused && this.theWorld !== null) {
			const partial = this.timer.renderPartialTicks;
			this.timer.updateTimer();
			this.timer.renderPartialTicks = partial;
		} else {
			this.timer.updateTimer();
		}

		const tickStart = Date.now() * 1e6; // nanosecond approximation
		this.mcProfiler.startSection('tick');

		for (let i = 0; i < this.timer.elapsedTicks; ++i) {
			this.runTick();
		}

		IntegratedServer.processICP();

		this.mcProfiler.endStartSection('preRenderErrors');
		const tickTime = Date.now() * 1e6 - tickStart;
		this.checkGLError('Pre render');
		RenderBlocks.fancyGrass = this.gameSettings.fancyGraphics;
		this.mcProfiler.endStartSection('sound');
		this.sndManager.setListener(this.thePlayer, this.timer.renderPartialTicks);

		if (!this.isGamePaused) {
			this.sndManager.func_92071_g();
		}

		this.mcProfiler.endSection();
		this.mcProfiler.startSection('render');
		this.mcProfiler.startSection('display');
		EaglerAdapter.glEnable(EaglerAdapter.GL_TEXTURE_2D);

		if (!EaglerAdapter.isKeyDown(65)) {
			EaglerAdapter.updateDisplay();
		}

		if (this.thePlayer !== null && this.thePlayer.isEntityInsideOpaqueBlock()) {
			this.gameSettings.thirdPersonView = 0;
		}

		this.mcProfiler.endSection();
		EaglerAdapter.glClearStack();

		if (!this.skipRenderWorld) {
			this.mcProfiler.endStartSection('gameRenderer');
			this.entityRenderer.updateCameraAndRender(this.timer.renderPartialTicks);
			this.mcProfiler.endSection();
		}

		EaglerAdapter.glFlush();
		this.mcProfiler.endSection();

		if (this.gameSettings.showDebugInfo && this.gameSettings.showDebugProfilerChart) {
			if (!this.mcProfiler.profilingEnabled) {
				this.mcProfiler.clearProfiling();
			}
			this.mcProfiler.profilingEnabled = true;
			this.#displayDebugInfo(tickTime);
		} else {
			this.mcProfiler.profilingEnabled = false;
			this.prevFrameTime = BigInt(Math.floor(performance.now() * 1e6));
		}

		this.guiAchievement.updateAchievementWindow();
		this.mcProfiler.startSection('root');

		if (!this.#fullscreen
				&& (EaglerAdapter.getCanvasWidth()  !== this.displayWidth
				||  EaglerAdapter.getCanvasHeight() !== this.displayHeight)) {
			this.displayWidth  = Math.max(1, EaglerAdapter.getCanvasWidth());
			this.displayHeight = Math.max(1, EaglerAdapter.getCanvasHeight());
			this.#resize(this.displayWidth, this.displayHeight);
		}

		this.checkGLError('Post render');
		++this.fpsCounter;

		if (Date.now() - Number(this.secondTimer) > 1000) {
			Minecraft.debugFPS                  = this.fpsCounter;
			this.fpsCounter                     = 0;
			Minecraft.debugChunkUpdates         = this.chunkUpdates;
			this.chunkUpdates                   = 0;
			Minecraft.debugChunkGeometryUpdates = this.chunkGeometryUpdates;
			this.chunkGeometryUpdates           = 0;
			this.secondTimer                    = BigInt(Date.now());
		}

		this.mcProfiler.startSection('syncDisplay');

		const fpsLimit = this.#getFpsLimit();
		if (fpsLimit > 0) {
			EaglerAdapter.syncDisplay(EntityRenderer.performanceToFps(fpsLimit));
		}

		if (this.#isGonnaTakeDatScreenShot) {
			this.#isGonnaTakeDatScreenShot = false;
			EaglerAdapter.saveScreenshot();
		}

		EaglerAdapter.doJavascriptCoroutines();
		this.mcProfiler.endSection();
		this.mcProfiler.endSection();
	}

	/** Returns the frame-rate cap for the current screen */
	#getFpsLimit() {
		return this.currentScreen instanceof GuiMainMenu ? 2 : this.gameSettings.limitFramerate;
	}

	// -------------------------------------------------------------------------
	// Debug profiler pie chart
	// -------------------------------------------------------------------------

	#updateDebugProfilerName(key) {
		const data = this.mcProfiler.getProfilingData(this.#debugProfilerName);
		if (data === null || data.length === 0) return;

		const root = data.splice(0, 1)[0];

		if (key === 0) {
			if (root.field_76331_c.length > 0) {
				const dot = this.#debugProfilerName.lastIndexOf('.');
				if (dot >= 0) this.#debugProfilerName = this.#debugProfilerName.substring(0, dot);
			}
		} else {
			const idx = key - 1;
			if (idx < data.length && data[idx].field_76331_c !== 'unspecified') {
				if (this.#debugProfilerName.length > 0) this.#debugProfilerName += '.';
				this.#debugProfilerName += data[idx].field_76331_c;
			}
		}
	}

	#displayDebugInfo(tickNanos) {
		if (!this.mcProfiler.profilingEnabled) return;

		const data = this.mcProfiler.getProfilingData(this.#debugProfilerName);
		const root = data.splice(0, 1)[0];

		EaglerAdapter.glClear(EaglerAdapter.GL_DEPTH_BUFFER_BIT);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_PROJECTION);
		EaglerAdapter.glEnable(EaglerAdapter.GL_COLOR_MATERIAL);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glOrtho(0.0, this.displayWidth, this.displayHeight, 0.0, 1000.0, 3000.0);
		EaglerAdapter.glMatrixMode(EaglerAdapter.GL_MODELVIEW);
		EaglerAdapter.glLoadIdentity();
		EaglerAdapter.glTranslatef(0.0, 0.0, -2000.0);
		EaglerAdapter.glLineWidth(1.0);
		EaglerAdapter.glDisable(EaglerAdapter.GL_TEXTURE_2D);
		EaglerAdapter.glEnable(EaglerAdapter.GL_DEPTH_TEST);
		EaglerAdapter.glColor4f(1, 1, 1, 1);

		const tess   = Tessellator.instance;
		const radius = 160;
		const cx     = this.displayWidth  - radius - 10;
		const cy     = this.displayHeight - radius * 2;

		EaglerAdapter.glEnable(EaglerAdapter.GL_BLEND);
		tess.startDrawingQuads();
		tess.setColorRGBA_I(0, 200);
		tess.addVertex(cx - radius * 1.1, cy - radius * 0.6 - 16, 0);
		tess.addVertex(cx - radius * 1.1, cy + radius * 2,         0);
		tess.addVertex(cx + radius * 1.1, cy + radius * 2,         0);
		tess.addVertex(cx + radius * 1.1, cy - radius * 0.6 - 16,  0);
		tess.draw();
		EaglerAdapter.glDisable(EaglerAdapter.GL_BLEND);

		EaglerAdapter.glDepthMask(true);
		let angle = 0.0;

		for (let i = 0; i < data.length; ++i) {
			const entry   = data[i];
			const steps   = Math.floor(entry.field_76332_a / 4.0) + 1;

			tess.startDrawing(EaglerAdapter.GL_TRIANGLE_FAN);
			tess.setColorOpaque_I(entry.func_76329_a());
			tess.addVertex(cx, cy, 0);

			for (let s = steps; s >= 0; --s) {
				const a  = (angle + entry.field_76332_a * s / steps) * Math.PI * 2.0 / 100.0;
				tess.addVertex(cx + MathHelper.sin(a) * radius, cy - MathHelper.cos(a) * radius * 0.5, 0);
			}
			tess.draw();

			tess.startDrawing(EaglerAdapter.GL_TRIANGLE_STRIP);
			tess.setColorOpaque_I((entry.func_76329_a() & 16711422) >> 1);
			for (let s = steps; s >= 0; --s) {
				const a  = (angle + entry.field_76332_a * s / steps) * Math.PI * 2.0 / 100.0;
				const vx = cx + MathHelper.sin(a) * radius;
				const vy = cy - MathHelper.cos(a) * radius * 0.5;
				tess.addVertex(vx, vy,        0);
				tess.addVertex(vx, vy + 10.0, 0);
			}
			tess.draw();

			angle += entry.field_76332_a;
		}

		const fmt = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
		EaglerAdapter.glEnable(EaglerAdapter.GL_TEXTURE_2D);

		let label = '';
		if (root.field_76331_c !== 'unspecified') label += '[0] ';
		label += root.field_76331_c.length === 0 ? 'ROOT ' : root.field_76331_c + ' ';

		this.fontRenderer.drawStringWithShadow(label, cx - radius, cy - radius / 2 - 16, 0xFFFFFF);
		const pctStr = fmt.format(root.field_76330_b) + '%';
		this.fontRenderer.drawStringWithShadow(pctStr, cx + radius - this.fontRenderer.getStringWidth(pctStr), cy - radius / 2 - 16, 0xFFFFFF);

		for (let i = 0; i < data.length; ++i) {
			const entry = data[i];
			let   name  = entry.field_76331_c === 'unspecified' ? '[?] ' : `[${i + 1}] `;
			name += entry.field_76331_c;
			const row   = cy + radius / 2 + i * 8 + 20;
			const color = entry.func_76329_a();
			this.fontRenderer.drawStringWithShadow(name, cx - radius, row, color);
			const p1 = fmt.format(entry.field_76332_a) + '%';
			this.fontRenderer.drawStringWithShadow(p1, cx + radius - 50 - this.fontRenderer.getStringWidth(p1), row, color);
			const p2 = fmt.format(entry.field_76330_b) + '%';
			this.fontRenderer.drawStringWithShadow(p2, cx + radius - this.fontRenderer.getStringWidth(p2), row, color);
		}
	}

	// -------------------------------------------------------------------------
	// Focus / screen management
	// -------------------------------------------------------------------------

	shutdown() { this.running = false; }

	setIngameFocus() {
		this.inGameHasFocus = true;
		this.mouseHelper.grabMouseCursor();
		this.displayGuiScreen(null);
		this.#leftClickCounter = 10000;
	}

	setIngameNotInFocus() {
		KeyBinding.unPressAllKeys();
		this.inGameHasFocus = false;
		this.mouseHelper.ungrabMouseCursor();
	}

	displayInGameMenu() {
		if (this.currentScreen === null) {
			this.displayGuiScreen(new GuiIngameMenu());
			if (IntegratedServer.isWorldRunning() && !this.isSingleplayer()) {
				IntegratedServer.autoSave();
			}
		}
	}

	displayGuiScreen(screen) {
		if (this.currentScreen !== null) {
			this.currentScreen.onGuiClosed();
		}

		if (screen === null && this.theWorld === null) {
			screen = new GuiMainMenu();
		} else if (screen === null && this.thePlayer.getHealth() <= 0) {
			screen = new GuiGameOver();
		}

		if (screen instanceof GuiMainMenu) {
			this.gameSettings.showDebugInfo = false;
			this.ingameGUI.getChatGUI().clearChatMessages();
		}

		this.currentScreen = screen;

		if (screen !== null) {
			this.setIngameNotInFocus();
			const res = new ScaledResolution(this.gameSettings, this.displayWidth, this.displayHeight);
			screen.setWorldAndResolution(this, res.getScaledWidth(), res.getScaledHeight());
			this.skipRenderWorld = false;
		} else {
			if (!this.inGameHasFocus) this.setIngameFocus();
		}
	}

	stopServerAndDisplayGuiScreen(screen) {
		if (!IntegratedServer.isWorldNotLoaded()) {
			IntegratedServer.unloadWorld();
			this.displayGuiScreen(new GuiScreenSingleplayerLoading(screen, 'saving world', () => IntegratedServer.isReady()));
		} else {
			this.displayGuiScreen(screen);
		}
	}

	isChatOpen() {
		return this.currentScreen !== null && this.currentScreen instanceof GuiChat;
	}

	getServerURI() {
		return this.getNetHandler() !== null ? this.getNetHandler().getNetManager().getServerURI() : '[not connected]';
	}

	// -------------------------------------------------------------------------
	// Tick
	// -------------------------------------------------------------------------

	runTick() {
		if (this.#rightClickDelayTimer > 0) --this.#rightClickDelayTimer;

		this.mcProfiler.startSection('stats');
		this.mcProfiler.endStartSection('gui');

		this.isGamePaused = this.isSingleplayer()
			&& this.theWorld  !== null
			&& this.thePlayer !== null
			&& this.currentScreen !== null
			&& this.currentScreen.doesGuiPauseGame()
			&& !IntegratedServerLAN.isHostingLAN();

		if (this.#wasPaused !== this.isGamePaused) {
			IntegratedServer.setPaused(this.isGamePaused);
			this.#wasPaused = this.isGamePaused;
		}

		if (this.lanState && !IntegratedServerLAN.isLANOpen()) {
			this.lanState = false;
			if (this.thePlayer !== null) {
				this.thePlayer.sendChatToPlayer(EnumChatFormatting.RED + StatCollector.translateToLocal('lanServer.relayDisconnected'));
			}
		}

		if (!this.isGamePaused) {
			this.ingameGUI.updateTick();
		}

		this.mcProfiler.endStartSection('pick');
		this.entityRenderer.getMouseOver(1.0);
		this.mcProfiler.endStartSection('gameMode');

		if (!this.isGamePaused && this.theWorld !== null) {
			this.playerController.updateController();
		}

		this.mcProfiler.endStartSection('textures');

		if (!this.isGamePaused) {
			this.renderEngine.updateDynamicTextures();
		}

		DefaultSkinRenderer.deleteOldSkins();

		// Screen state transitions
		if (this.currentScreen === null && this.thePlayer !== null) {
			if (this.thePlayer.getHealth() <= 0) {
				this.displayGuiScreen(null);
			} else if (this.thePlayer.isPlayerSleeping() && this.theWorld !== null) {
				this.displayGuiScreen(new GuiSleepMP());
			}
		} else if (this.currentScreen instanceof GuiSleepMP && !this.thePlayer.isPlayerSleeping()) {
			this.displayGuiScreen(null);
		}

		if (this.currentScreen !== null) {
			this.#leftClickCounter = 10000;
		}

		if (this.currentScreen !== null) {
			this.currentScreen.handleInput();
			if (this.currentScreen !== null) {
				this.currentScreen.guiParticles.update();
				this.currentScreen.updateScreen();
			}
		}

		GuiMultiplayer.tickRefreshCooldown();
		EaglerAdapter.tickVoice();

		const voiceStatus = EaglerAdapter.getVoiceStatus();
		if (voiceStatus === Voice.VoiceStatus.CONNECTING || voiceStatus === Voice.VoiceStatus.CONNECTED) {
			EaglerAdapter.activateVoice(
				(this.currentScreen === null || !this.currentScreen.blockHotKeys())
				&& EaglerAdapter.isKeyDown(this.gameSettings.voicePTTKey)
			);

			if (this.theWorld !== null && this.thePlayer !== null) {
				const seenPlayers = new Set();
				for (const playerObj of this.theWorld.playerEntities) {
					const player = playerObj;
					if (player === this.thePlayer) continue;
					if (EaglerAdapter.getVoiceChannel() === Voice.VoiceChannel.PROXIMITY) {
						EaglerAdapter.updateVoicePosition(player.username, player.posX, player.posY + player.getEyeHeight(), player.posZ);
					}
					const prox = 22;
					if (Math.abs(this.thePlayer.posX - player.posX) <= prox
						&& Math.abs(this.thePlayer.posY - player.posY) <= prox
						&& Math.abs(this.thePlayer.posZ - player.posZ) <= prox) {
						EaglerAdapter.addNearbyPlayer(player.username);
						seenPlayers.add(player.username);
					}
				}
				EaglerAdapter.cleanupNearbyPlayers(seenPlayers);
			}
		}

		// Input processing
		if (this.currentScreen === null || this.currentScreen.allowUserInput) {
			this.mcProfiler.endStartSection('mouse');

			while (EaglerAdapter.mouseNext()) {
				KeyBinding.setKeyBindState(EaglerAdapter.mouseGetEventButton() - 100, EaglerAdapter.mouseGetEventButtonState());
				if (EaglerAdapter.mouseGetEventButtonState()) {
					KeyBinding.onTick(EaglerAdapter.mouseGetEventButton() - 100);
				}

				if (Minecraft.getSystemTime() - this.systemTime <= 200) {
					let wheel = EaglerAdapter.mouseGetEventDWheel();
					if (wheel !== 0) {
						this.thePlayer.inventory.changeCurrentItem(wheel);
						if (this.gameSettings.noclip) {
							wheel = wheel > 0 ? 1 : -1;
							this.gameSettings.noclipRate += wheel * 0.25;
						}
					}

					if (this.currentScreen === null) {
						if ((!this.inGameHasFocus || !EaglerAdapter.isPointerLocked()) && EaglerAdapter.mouseGetEventButtonState()) {
							this.setIngameFocus();
						}
					} else {
						this.currentScreen.handleMouseInput();
					}
				}
			}

			if (this.#leftClickCounter > 0) --this.#leftClickCounter;

			this.mcProfiler.endStartSection('keyboard');
			let chatEnabled;

			while (EaglerAdapter.keysNext()) {
				KeyBinding.setKeyBindState(EaglerAdapter.getEventKey(), EaglerAdapter.getEventKeyState());
				if (EaglerAdapter.getEventKeyState()) {
					KeyBinding.onTick(EaglerAdapter.getEventKey());
				}

				const F3down = this.gameSettings.keyBindFunction.pressed && EaglerAdapter.isKeyDown(4);

				// Crash key combo (F3+C held for 6s)
				if (this.#field_83002_am > 0n) {
					if (Minecraft.getSystemTime() - Number(this.#field_83002_am) >= 6000) {
						throw new Error('manual crash');
					}
					if (!EaglerAdapter.isKeyDown(46) || !F3down) {
						this.#field_83002_am = -1n;
					}
				} else if (F3down && EaglerAdapter.isKeyDown(46)) {
					this.#field_83002_am = BigInt(Minecraft.getSystemTime());
				}

				if (EaglerAdapter.getEventKeyState()) {
					this.#isGonnaTakeDatScreenShot |= this.gameSettings.keyBindFunction.pressed && EaglerAdapter.getEventKey() === 3;

					if (EaglerAdapter.getEventKey() === 87) {
						this.toggleFullscreen();
					} else if (this.currentScreen !== null) {
						this.currentScreen.handleKeyboardInput();
					} else {
						if (EaglerAdapter.getEventKey() === 1)                                     this.displayInGameMenu();
						if (F3down && EaglerAdapter.getEventKey() === 31)                          this.#forceReload();
						if (F3down && EaglerAdapter.getEventKey() === 20) {
							this.renderEngine.refreshTextures();
							this.renderGlobal.loadRenderers();
							FixedFunctionShader.refreshCoreGL();
						}
						if (F3down && EaglerAdapter.getEventKey() === 33) {
							const shift = EaglerAdapter.isKeyDown(42) || EaglerAdapter.isKeyDown(54);
							this.gameSettings.setOptionValue(EnumOptions.RENDER_DISTANCE, shift ? -1 : 1);
						}
						if (F3down && EaglerAdapter.getEventKey() === 30)                          this.renderGlobal.loadRenderers();
						if (F3down && EaglerAdapter.getEventKey() === 35) {
							this.gameSettings.advancedItemTooltips = !this.gameSettings.advancedItemTooltips;
							this.gameSettings.saveOptions();
						}
						if (F3down && EaglerAdapter.getEventKey() === 48)                          RenderManager.field_85095_o = !RenderManager.field_85095_o;
						if (F3down && EaglerAdapter.getEventKey() === 25) {
							this.gameSettings.pauseOnLostFocus = !this.gameSettings.pauseOnLostFocus;
							this.gameSettings.saveOptions();
						}
						if (this.gameSettings.keyBindFunction.pressed && EaglerAdapter.getEventKey() === 2)  this.gameSettings.hideGUI = !this.gameSettings.hideGUI;
						if (EaglerAdapter.getEventKey() === 4 && this.gameSettings.keyBindFunction.pressed) {
							this.gameSettings.showDebugInfo = !this.gameSettings.showDebugInfo;
							this.gameSettings.showDebugProfilerChart = true;
						}
						if (EaglerAdapter.getEventKey() === 6 && this.gameSettings.keyBindFunction.pressed) {
							this.gameSettings.thirdPersonView = (this.gameSettings.thirdPersonView + 1) % 3;
						}
						if (EaglerAdapter.getEventKey() === 7 && this.gameSettings.keyBindFunction.pressed) {
							this.gameSettings.showCoordinates = !this.gameSettings.showCoordinates;
							this.gameSettings.saveOptions();
						}
						if (EaglerAdapter.getEventKey() === 9 && this.gameSettings.keyBindFunction.pressed)  this.gameSettings.smoothCamera = !this.gameSettings.smoothCamera;
					}

					if (!this.gameSettings.keyBindFunction.pressed) {
						for (let slot = 0; slot < 9; ++slot) {
							if (EaglerAdapter.getEventKey() === 2 + slot) {
								this.thePlayer.inventory.currentItem = slot;
							}
						}
					}

					if (this.gameSettings.showDebugInfo && this.gameSettings.showDebugProfilerChart && !this.gameSettings.keyBindFunction.pressed) {
						if (EaglerAdapter.getEventKey() === 11) this.#updateDebugProfilerName(0);
						for (let slot = 0; slot < 9; ++slot) {
							if (EaglerAdapter.getEventKey() === 2 + slot) this.#updateDebugProfilerName(slot + 1);
						}
					}
				}
			}

			chatEnabled = this.gameSettings.chatVisibility !== 2;

			while (this.gameSettings.keyBindInventory.isPressed()) {
				this.displayGuiScreen(new GuiInventory(this.thePlayer));
			}

			while (this.gameSettings.keyBindDrop.isPressed()) {
				this.thePlayer.dropOneItem(GuiScreen.isCtrlKeyDown());
			}

			while (this.gameSettings.keyBindChat.isPressed() && chatEnabled) {
				this.displayGuiScreen(new GuiChat());
			}

			if (this.currentScreen === null && EaglerAdapter.isKeyDown(53) && chatEnabled) {
				this.displayGuiScreen(new GuiChat('/'));
			}

			if (this.gameSettings.keyBindSprint.pressed && !this.thePlayer.isSprinting()
					&& this.thePlayer.canSprint() && !this.thePlayer.isCollidedHorizontally) {
				this.thePlayer.setSprinting(true);
			}

			if (this.thePlayer.isUsingItem()) {
				if (!this.gameSettings.keyBindUseItem.pressed) {
					this.playerController.onStoppedUsingItem(this.thePlayer);
				}
				// Drain queued input presses without acting on them while using item
				while (this.gameSettings.keyBindAttack.isPressed());
				while (this.gameSettings.keyBindUseItem.isPressed());
				while (this.gameSettings.keyBindPickBlock.isPressed());
			} else {
				while (this.gameSettings.keyBindAttack.isPressed())    this.clickMouse(0);
				while (this.gameSettings.keyBindUseItem.isPressed())   this.clickMouse(1);
				while (this.gameSettings.keyBindPickBlock.isPressed()) this.#clickMiddleMouseButton();
			}

			if (this.gameSettings.keyBindUseItem.pressed && this.#rightClickDelayTimer === 0 && !this.thePlayer.isUsingItem()) {
				this.clickMouse(1);
			}

			this.#sendClickBlockToController(0, this.currentScreen === null && this.gameSettings.keyBindAttack.pressed && this.inGameHasFocus);
		}

		// World / player update
		if (this.theWorld !== null) {
			if (this.thePlayer !== null) {
				++this.#joinPlayerCounter;
				if (this.#joinPlayerCounter === 30) {
					this.#joinPlayerCounter = 0;
					this.theWorld.joinEntityInSurroundings(this.thePlayer);
				}

				++this.messageOnLoginCounter;
				if (this.messageOnLoginCounter === 100 && this.isSingleplayerOrLAN()) {
					this.displayEaglercraftText(EnumChatFormatting.GREEN + 'Notice: chunk loading may take a while in singleplayer.');
				}
				if (this.messageOnLoginCounter === 150 && this.isSingleplayerOrLAN()) {
					this.displayEaglercraftText(EnumChatFormatting.AQUA + 'Especially in new worlds, if no chunks show give the game up to 5 straight minutes before "giving up" on a new world');
				}
			}

			this.mcProfiler.endStartSection('gameRenderer');
			if (!this.isGamePaused) this.entityRenderer.updateRenderer();

			this.mcProfiler.endStartSection('levelRenderer');
			if (!this.isGamePaused) this.renderGlobal.updateClouds();

			this.mcProfiler.endStartSection('level');

			if (!this.isGamePaused) {
				if (this.theWorld.lastLightningBolt > 0) --this.theWorld.lastLightningBolt;
				this.theWorld.updateEntities();
			}

			if (!this.isGamePaused) {
				this.theWorld.setAllowedSpawnTypes(this.theWorld.difficultySetting > 0, true);
				this.theWorld.tick();
			}

			this.mcProfiler.endStartSection('animateTick');
			if (!this.isGamePaused && this.theWorld !== null) {
				this.theWorld.doVoidFogParticles(
					MathHelper.floor_double(this.thePlayer.posX),
					MathHelper.floor_double(this.thePlayer.posY),
					MathHelper.floor_double(this.thePlayer.posZ),
				);
			}

			this.mcProfiler.endStartSection('particles');
			if (!this.isGamePaused) this.effectRenderer.updateEffects();

		} else if (this.#myNetworkManager !== null) {
			this.mcProfiler.endStartSection('pendingConnection');
			this.#myNetworkManager.processReadPackets();
		} else {
			this.entityRenderer.startup    = 0;
			this.entityRenderer.preStartup = 0;
			this.entityRenderer.asdfghjkl  = false;
		}

		if (!(this.gameSettings.adderall || this.entityRenderer.asdfghjkl) || !this.yeeState) {
			this.entityRenderer.startup    = 0;
			this.entityRenderer.preStartup = 0;
			this.gameSettings.adderall     = false;
			this.entityRenderer.asdfghjkl  = false;
		}

		if (this.theWorld === null) {
			this.sndManager.playTheTitleMusic();
		} else {
			this.sndManager.stopTheTitleMusic();
		}

		if (this.reconnectAddress !== null) {
			if (this.theWorld !== null) {
				console.log('Redirecting to: ' + this.reconnectAddress);
				this.theWorld.sendQuittingDisconnectingPacket();
				this.loadWorld(null);
				this.stopServerAndDisplayGuiScreen(
					new GuiConnecting(new GuiMultiplayer(new GuiMainMenu()), this, new ServerData('reconnect', this.reconnectAddress, true))
				);
			}
			this.reconnectAddress = null;
		}

		this.mcProfiler.endSection();
		this.systemTime = Minecraft.getSystemTime();
	}

	// -------------------------------------------------------------------------
	// Input handlers
	// -------------------------------------------------------------------------

	#sendClickBlockToController(button, attacking) {
		if (!attacking) this.#leftClickCounter = 0;

		if (button !== 0 || this.#leftClickCounter <= 0) {
			if (attacking && this.objectMouseOver !== null
					&& this.objectMouseOver.typeOfHit === EnumMovingObjectType.TILE
					&& button === 0) {
				const { blockX: bx, blockY: by, blockZ: bz, sideHit } = this.objectMouseOver;
				this.playerController.onPlayerDamageBlock(bx, by, bz, sideHit);
				if (this.thePlayer.canCurrentToolHarvestBlock(bx, by, bz)) {
					this.effectRenderer.addBlockHitEffects(bx, by, bz, sideHit);
					this.thePlayer.swingItem();
				}
			} else {
				this.playerController.resetBlockRemoving();
			}
		}
	}

	clickMouse(button) {
		if (button !== 0 || this.#leftClickCounter <= 0) {
			if (button === 0) this.thePlayer.swingItem();
			if (button === 1) this.#rightClickDelayTimer = 4;

			let didNothing = true;
			const held = this.thePlayer.inventory.getCurrentItem();

			if (this.objectMouseOver === null) {
				if (button === 0 && this.playerController.isNotCreative()) {
					this.#leftClickCounter = 10;
				}
			} else if (this.objectMouseOver.typeOfHit === EnumMovingObjectType.ENTITY) {
				if (button === 0) {
					this.playerController.attackEntity(this.thePlayer, this.objectMouseOver.entityHit);
				}
				if (button === 1 && this.playerController.func_78768_b(this.thePlayer, this.objectMouseOver.entityHit)) {
					didNothing = false;
				}
			} else if (this.objectMouseOver.typeOfHit === EnumMovingObjectType.TILE) {
				const { blockX: bx, blockY: by, blockZ: bz, sideHit } = this.objectMouseOver;

				if (button === 0) {
					this.playerController.clickBlock(bx, by, bz, sideHit);
				} else {
					const prevSize = held !== null ? held.stackSize : 0;
					if (this.playerController.onPlayerRightClick(this.thePlayer, this.theWorld, held, bx, by, bz, sideHit, this.objectMouseOver.hitVec)) {
						didNothing = false;
						this.thePlayer.swingItem();
					}
					if (held === null) return;
					if (held.stackSize === 0) {
						this.thePlayer.inventory.mainInventory[this.thePlayer.inventory.currentItem] = null;
					} else if (held.stackSize !== prevSize || this.playerController.isInCreativeMode()) {
						this.entityRenderer.itemRenderer.resetEquippedProgress();
					}
				}
			}

			if (didNothing && button === 1) {
				const cur = this.thePlayer.inventory.getCurrentItem();
				if (cur !== null && this.playerController.sendUseItem(this.thePlayer, this.theWorld, cur)) {
					this.entityRenderer.itemRenderer.resetEquippedProgress2();
				}
			}
		}
	}

	#clickMiddleMouseButton() {
		if (this.objectMouseOver === null) return;

		const creative = this.thePlayer.capabilities.isCreativeMode;
		let itemId = 0, damage = 0, hasSubtypes = false;

		if (this.objectMouseOver.typeOfHit === EnumMovingObjectType.TILE) {
			const { blockX: bx, blockY: by, blockZ: bz } = this.objectMouseOver;
			const block = Block.blocksList[this.theWorld.getBlockId(bx, by, bz)];
			if (block === null) return;

			itemId = block.idPicked(this.theWorld, bx, by, bz);
			if (itemId === 0) return;

			hasSubtypes = Item.itemsList[itemId].getHasSubtypes();
			const damageBlockId = itemId < 256 && !Block.blocksList[block.blockID].isFlowerPot() ? itemId : block.blockID;
			damage = Block.blocksList[damageBlockId].getDamageValue(this.theWorld, bx, by, bz);

		} else if (this.objectMouseOver.typeOfHit === EnumMovingObjectType.ENTITY) {
			if (this.objectMouseOver.entityHit === null || !creative) return;
			const entity = this.objectMouseOver.entityHit;

			if (entity instanceof EntityPainting) {
				itemId = Item.painting.itemID;
			} else if (entity instanceof EntityItemFrame) {
				const displayed = entity.getDisplayedItem();
				if (displayed === null) {
					itemId = Item.itemFrame.itemID;
				} else {
					itemId = displayed.itemID;
					damage = displayed.getItemDamage();
					hasSubtypes = true;
				}
			} else if (entity instanceof EntityMinecart) {
				const type = entity.getMinecartType();
				if      (type === 2) itemId = Item.minecartPowered.itemID;
				else if (type === 1) itemId = Item.minecartCrate.itemID;
				else if (type === 3) itemId = Item.minecartTnt.itemID;
				else if (type === 5) itemId = Item.minecartHopper.itemID;
				else                 itemId = Item.minecartEmpty.itemID;
			} else if (entity instanceof EntityBoat) {
				itemId = Item.boat.itemID;
			} else {
				itemId = Item.monsterPlacer.itemID;
				damage = EntityList.getEntityID(entity);
				hasSubtypes = true;
				if (damage <= 0 || !EntityList.entityEggs.has(damage)) return;
			}
		}

		this.thePlayer.inventory.setCurrentItem(itemId, damage, hasSubtypes, creative);

		if (creative) {
			const slot = this.thePlayer.inventoryContainer.inventorySlots.length - 9 + this.thePlayer.inventory.currentItem;
			this.playerController.sendSlotPacket(this.thePlayer.inventory.getStackInSlot(this.thePlayer.inventory.currentItem), slot);
		}
	}

	// -------------------------------------------------------------------------
	// Miscellaneous
	// -------------------------------------------------------------------------

	checkGLError(label) {
		let err;
		while ((err = EaglerAdapter.glGetError()) !== 0) {
			console.error('########## GL ERROR ##########');
			console.error('@ ' + label);
			console.error(err + ': ' + EaglerAdapter.gluErrorString(err));
		}
	}

	shutdownMinecraftApplet() {
		try {
			console.error('Stopping!');
			try { this.loadWorld(null); } catch (e) {}
			try { GLAllocation.deleteTexturesAndDisplayLists(); } catch (e) {}
			this.sndManager.closeMinecraft();
		} finally {
			EaglerAdapter.destroyContext();
			if (!this.#hasCrashed) EaglerAdapter.exit();
		}
	}

	toggleFullscreen() {
		// no-op in Eaglercraft
	}

	#resize(w, h) {
		this.displayWidth  = w <= 0 ? 1 : w;
		this.displayHeight = h <= 0 ? 1 : h;
		const res = new ScaledResolution(this.gameSettings, w, h);
		if (this.currentScreen !== null) {
			this.currentScreen.setWorldAndResolution(this, res.getScaledWidth(), res.getScaledHeight());
		}
		this.voiceOverlay.setResolution(res.getScaledWidth(), res.getScaledHeight());
	}

	#forceReload() {
		console.error('FORCING RELOAD!');
		if (this.sndManager !== null) this.sndManager.stopAllSounds();
		this.sndManager = new SoundManager();
		this.sndManager.loadSoundSettings(this.gameSettings);
	}

	displayEaglercraftText(msg) {
		if (this.thePlayer !== null && this.#shownPlayerMessages.has(msg) === false) {
			this.#shownPlayerMessages.add(msg);
			this.thePlayer.sendChatToPlayer(msg);
		}
	}

	handleClientCommand(cmd) {
		return false; // no client-only commands implemented
	}

	scheduleTexturePackRefresh() {
		this.#refreshTexturePacksScheduled = true;
	}

	// -------------------------------------------------------------------------
	// World loading
	// -------------------------------------------------------------------------

	loadWorld(world) {
		this.loadWorld(world, '');
	}

	loadWorld(world, message) {
		if (world === null) {
			EaglerAdapter.enableVoice(Voice.VoiceChannel.NONE);
			const handler = this.getNetHandler();
			if (handler !== null) handler.cleanup();
			if (this.#myNetworkManager !== null) this.#myNetworkManager.closeConnections();
			this.#myNetworkManager = null;
		}

		this.renderViewEntity = null;

		if (this.loadingScreen !== null) {
			this.loadingScreen.resetProgressAndMessage(message);
			this.loadingScreen.resetProgresAndWorkingMessage('');
		}

		if (world === null && this.theWorld !== null) {
			if (this.texturePackList.getIsDownloading()) this.texturePackList.onDownloadFinished();
			this.lanState = false;
			IntegratedServer.unloadWorld();
			this.setServerData(null);
			this.#integratedServerIsRunning = false;
		}

		this.sndManager.playStreaming(null, 0.0, 0.0, 0.0);
		this.sndManager.stopAllSounds();
		if (EaglerAdapter.isVideoSupported()) EaglerAdapter.unloadVideo();
		this.theWorld = world;

		if (world !== null) {
			if (this.renderGlobal  !== null) this.renderGlobal.setWorldAndLoadRenderers(world);
			if (this.effectRenderer !== null) this.effectRenderer.clearEffects(world);

			if (this.thePlayer === null) {
				this.thePlayer = this.playerController.func_78754_a(world);
				this.playerController.flipPlayer(this.thePlayer);
			}

			const translate = StringTranslate.getInstance();

			if (!this.gameSettings.fancyGraphics || this.gameSettings.ambientOcclusion === 0) {
				this.displayEaglercraftText('Note: ' + translate.translateKey('fancyGraphicsNote'));
			}

			if (this.gameSettings.showCoordinates) {
				this.displayEaglercraftText(EnumChatFormatting.LIGHT_PURPLE + 'Note: use F+6 to hide the coordinates off of the screen (if you\'re in public)');
			} else {
				this.displayEaglercraftText(EnumChatFormatting.LIGHT_PURPLE + 'Note: use F+6 to show your coordinates on the screen');
			}

			this.messageOnLoginCounter = 0;
			this.thePlayer.preparePlayerToSpawn();
			world.spawnEntityInWorld(this.thePlayer);
			this.thePlayer.movementInput = new MovementInputFromOptions(this.gameSettings);
			this.playerController.setPlayerCapabilities(this.thePlayer);
			this.renderViewEntity = this.thePlayer;
		} else {
			this.thePlayer = null;
		}

		this.systemTime = 0;
	}

	launchIntegratedServer(folderName, trim, settings) {
		this.loadWorld(null);
		IntegratedServer.loadWorld(folderName, this.gameSettings.difficulty, settings);
		this.displayGuiScreen(new GuiScreenSingleplayerLoading(
			new GuiScreenSingleplayerConnecting(new GuiMainMenu(), 'Connecting to ' + folderName),
			'Loading world: ' + folderName,
			() => IntegratedServer.isWorldRunning(),
		));
	}

	setNetManager(nm) { this.#myNetworkManager = nm; }

	setServerData(data) { this.#currentServerData = data; }
	getServerData()     { return this.#currentServerData; }
	setDemo(demo)       { this.#isDemo = demo; }
	isDemo()            { return this.#isDemo; }
	isFullScreen()      { return this.#fullscreen; }
	isIntegratedServerRunning() { return IntegratedServer.isWorldRunning(); }
	isSingleplayer()    { return this.#myNetworkManager instanceof WorkerNetworkManager; }

	getNetHandler() {
		return this.thePlayer !== null ? this.thePlayer.sendQueue : null;
	}

	debugInfoRenders()    { return this.renderGlobal.getDebugInfoRenders(); }
	getEntityDebug()      { return this.renderGlobal.getDebugInfoEntities(); }
	getWorldProviderName(){ return this.theWorld.getProviderName(); }
	debugInfoEntities()   { return `P: ${this.effectRenderer.getStatistics()}. T: ${this.theWorld.getDebugLoadedEntities()}`; }

	setDimensionAndSpawnPlayer(dim) {
		this.theWorld.setSpawnLocation();
		this.theWorld.removeAllEntities();
		let entityId = 0;
		if (this.thePlayer !== null) {
			entityId = this.thePlayer.entityId;
			this.theWorld.removeEntity(this.thePlayer);
		}
		this.renderViewEntity = null;
		this.thePlayer = this.playerController.func_78754_a(this.theWorld);
		this.thePlayer.dimension = dim;
		this.renderViewEntity = this.thePlayer;
		this.thePlayer.preparePlayerToSpawn();
		this.theWorld.spawnEntityInWorld(this.thePlayer);
		this.playerController.flipPlayer(this.thePlayer);
		this.thePlayer.movementInput = new MovementInputFromOptions(this.gameSettings);
		this.thePlayer.entityId = entityId;
		this.playerController.setPlayerCapabilities(this.thePlayer);
		if (this.currentScreen instanceof GuiGameOver) {
			this.displayGuiScreen(null);
		}
	}

	// -------------------------------------------------------------------------
	// Static methods
	// -------------------------------------------------------------------------

	static getMinecraft()              { return Minecraft.#theMinecraft; }
	static getSystemTime()             { return Date.now(); }
	static getGLMaximumTextureSize()   { return 8192; }
	static isGuiEnabled()              { return Minecraft.#theMinecraft === null || !Minecraft.#theMinecraft.gameSettings.hideGUI; }
	static isFancyGraphicsEnabled()    { return Minecraft.#theMinecraft !== null && Minecraft.#theMinecraft.gameSettings.fancyGraphics; }
	static isAmbientOcclusionEnabled() { return Minecraft.#theMinecraft !== null && Minecraft.#theMinecraft.gameSettings.ambientOcclusion !== 0; }

	static getOs() {
		const ua = EaglerAdapter.getUserAgent().toLowerCase();
		if (ua.includes('win'))     return EnumOS.WINDOWS;
		if (ua.includes('mac'))     return EnumOS.MACOS;
		if (ua.includes('solaris')) return EnumOS.SOLARIS;
		if (ua.includes('sunos'))   return EnumOS.SOLARIS;
		if (ua.includes('linux'))   return EnumOS.LINUX;
		if (ua.includes('unix'))    return EnumOS.LINUX;
		return EnumOS.UNKNOWN;
	}
}
