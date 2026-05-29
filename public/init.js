/**
 * Eaglercraft TeaVM Initialization Helper
 * 
 * This script helps properly initialize and run the TeaVM-compiled Eaglercraft client.
 * Include this AFTER loading classes.js
 */

(function() {
    'use strict';
    
    console.log("=== Eaglercraft Initialization Helper ===");
    
    // Check if we're in a browser environment
    if (typeof window === 'undefined') {
        console.error("Not in browser environment");
        return;
    }
    
    // Get or create the global java namespace if it was created by TeaVM
    var javaNamespace = window.$java || window.java || window;
    
    console.log("Available globals:", Object.keys(window).filter(k => !k.startsWith('webkit') && !k.startsWith('chrome')).slice(0, 20).join(', '));
    
    // Find the main entry point - it could be in several places
    var mainFunc = null;
    
    // Method 1: Direct global
    if (typeof window.main === 'function') {
        console.log("✓ Found main() as window.main");
        mainFunc = window.main;
    }
    // Method 2: In java namespace
    else if (javaNamespace && typeof javaNamespace.main === 'function') {
        console.log("✓ Found main() in java namespace");
        mainFunc = javaNamespace.main;
    }
    // Method 3: Look for Client class
    else if (javaNamespace && typeof javaNamespace.Client === 'function') {
        console.log("✓ Found Client class, attempting to create instance...");
        try {
            mainFunc = function() {
                var client = new javaNamespace.Client();
                if (typeof client.main === 'function') {
                    client.main([]);
                }
            };
        } catch (e) {
            console.log("Could not create Client instance:", e);
        }
    }
    // Method 4: Look for main function in all exposed functions
    else {
        console.log("Searching for main function in exported functions...");
        for (var key in window) {
            if (typeof window[key] === 'function' && key.toLowerCase().includes('main')) {
                console.log("  Found potential main function:", key);
                mainFunc = window[key];
                break;
            }
        }
    }
    
    if (!mainFunc) {
        console.warn("Could not find main() function");
        console.warn("Available functions starting with common names:");
        var foundFuncs = [];
        for (var key in window) {
            if (typeof window[key] === 'function') {
                if (key.startsWith('main') || key.startsWith('Main') || key.startsWith('Client') || key.includes('lient')) {
                    foundFuncs.push(key);
                }
            }
        }
        console.warn("  ", foundFuncs.join(', ') || "(none found)");
        
        // Print everything that's a function
        console.log("All functions in window (sample):");
        var count = 0;
        for (var key in window) {
            if (typeof window[key] === 'function' && !key.startsWith('webkit') && count < 30) {
                console.log("  - " + key);
                count++;
            }
        }
    }
    
    // Export the initialization function
    window.EaglerInit = {
        /**
         * Initialize and start the Eaglercraft client
         */
        start: function(options) {
            options = options || {};
            
            console.log("Starting Eaglercraft...");
            
            // Verify canvas exists
            var canvas = options.canvas || document.getElementById('canvas');
            if (!canvas) {
                throw new Error("Canvas element not found. Make sure element with id='canvas' exists.");
            }
            
            console.log("✓ Canvas found");
            
            if (!mainFunc) {
                throw new Error("main() function not found. TeaVM compilation may have failed.");
            }
            
            console.log("✓ main() function found, executing...");
            
            try {
                // Call the main function
                mainFunc.call(window);
                console.log("✓ Eaglercraft started successfully!");
                return true;
            } catch (error) {
                console.error("Error running main():", error);
                console.error("Error stack:", error.stack);
                throw error;
            }
        },
        
        /**
         * Get information about the current setup
         */
        getInfo: function() {
            return {
                hasMain: !!mainFunc,
                mainFunction: mainFunc ? mainFunc.toString().substring(0, 100) : 'NOT FOUND',
                canvasExists: !!document.getElementById('canvas'),
                teaVMLoaded: typeof $rt_createClass === 'function'
            };
        }
    };
    
    console.log("✓ Initialization helper ready");
    console.log("  Call: EaglerInit.start() to start the game");
    console.log("  Info: EaglerInit.getInfo() to get debug info");
    
    // If auto-start is enabled, start immediately
    if (window.EAGLER_AUTO_START !== false) {
        // Wait a bit for DOM to be ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                setTimeout(function() {
                    try {
                        window.EaglerInit.start();
                    } catch (e) {
                        console.error("Auto-start failed:", e);
                    }
                }, 100);
            });
        } else {
            setTimeout(function() {
                try {
                    window.EaglerInit.start();
                } catch (e) {
                    console.error("Auto-start failed:", e);
                }
            }, 100);
        }
    }
})();
