class Minecraft {
    constructor() {

        this.fullScreen = false;
        this.hasCrashed = false;

        /* Joke tooken from the official 1.5.2 source code */
        this.takingADamnScreenShot = false;

        this.displayWidth = window.innerWidth;
        this.displayHeight = window.innerHeight;
        

        /* ticking */ 
        this.timer = 20.0;




        this.hideQuitButton = false;
        this.isGamePaused = false;

    }
}