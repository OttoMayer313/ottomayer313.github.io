/*
Copyright 2016 Otto Mayer, All rights reserved.
Licensed under GNU GPL (https://www.gnu.org/licenses/licenses.html).
*/

(function () {
    "use strict";

    const ABOUTME       = "aboutMe.txt";
    const TERMINAL      = "#terminal1";
    const PROMPT_STRING  = "otto@github:~$ ";

    const DEBUG = false;

    // Testing script timing constants
    // const DELAY_EXECUTE = 2000;   // Delay (ms) before executing command
    // const DELAY_PROCESS = 500;    // Delay (ms) to show "processing" of command
    // const DELAY_COMMAND = 1000;   // Delay (ms) before typing commands
    // const DELAY_CLEAR   = 6000;   // Delay (ms) before clearing terminal

    // Normal script timing constants
    const DELAY_EXECUTE = 2000;   // Delay (ms) before executing command
    const DELAY_PROCESS = 500;    // Delay (ms) to show "processing" of command
    const DELAY_COMMAND = 3000;   // Delay (ms) before typing commands
    const DELAY_CLEAR   = 60000;  // Delay (ms) before clearing terminal

    var loop = true;

    var text;
    var outputedToConsole = false;
    var commands = ["whoami", "otto mayer", "cat " + ABOUTME];

    // var keySound1;

    // function preload() {
    //     keySound1 = loadSound('sound/keyboard_key1.mp3');

    // }

    // function setup() {

    // }
    
    // loads webpage functions
    window.onload = function () {

        // setup(); // ensures sounds are loaded!

        // used when testing/debugging on local machine
        if (DEBUG) {
            text = ["paragraph1", "paragraph2", "paragraph3"];
            loadTerminal(TERMINAL, commands);
        } else {
            $.get(ABOUTME, loadData_cb, "text"); // Asynch call!
        }

    };

    function keyHit_cb() {
        keySound1.play();
    }

    /*
    Callback parses retrieved data into array of text paragraphs and loads terminal.
    */
    function loadData_cb(data) {
        text = data.split('\n');
        loadTerminal(TERMINAL, commands);
    }

    /*
    Loads specified terminal with specified command and text.
    */
    function loadTerminal(terminal, command) {
        var $window = $(terminal).find(".terminal-window");
        clearText_cb($window, command);
    }
    
    /*
    Executes callback function after brief timeout.
    This is to make a pause before actually entering a terminal command.
    */
    function executeCommand_cb($window, callback) {
        // execute callback function after brief pause
        setTimeout(callback, DELAY_EXECUTE);
    }

    /*
    Process callback function after brief timeout.
    This is mostly for aesthetic purposes so it "appears" like the terminal actually had to "process" a command.
    */
    function processCommand_cb($window, callback) {
        // remove cursor from last command
        $window.find(".typed-cursor").remove();

        setTimeout(callback, DELAY_PROCESS);
    }

    /*
    Loads specified terminal with specified command global text.
    */
    function displayText_cb($window, command) {
        if (!outputedToConsole) {
            console.log(command[command.length - 1]);
        }

        text.forEach(function(p) {
            if (!outputedToConsole) {
                console.log(p);
            }
            $window.append(new paragraph(p));
        });
        outputedToConsole = true;
        
        if (loop) {
            var clearCom   = function() { clearText_cb( $window, command); }
            // var processCom = function() { processCommand_cb($window, clearCom); }
            var executeCom = function() { processCommand_cb( $window, clearCom); }

            displayCommand($window, ["clear"], DELAY_CLEAR, executeCom);
        } else {
            displayCommand($window, [""], DELAY_CLEAR, $.noop);
        }

    }

    /*
    Clears specified terminal with specified command and text.
    */
    function clearText_cb($window, command) {
        $window.empty();

        var displayCom = function() { displayText_cb($window, command); }
        var processCom = function() { processCommand_cb( $window, displayCom); }
        var executeCom = function() { executeCommand_cb( $window, processCom); }

        displayCommand($window, command, DELAY_COMMAND, executeCom);
    }

    /*
    Types commands to specified window and calls callback function.
    
    Uses Matt Boldt's "typed.js" script to do the heavy lifting of typing.
        source: http://www.mattboldt.com/demos/typed-js/

    */
    function displayCommand($window, command, delay, callback) {
        var $prompt = new prompt();
        $window.append($prompt);
        $(function(){
            $prompt.find(".bash-element").typed({
                // defaults
                cursorChar: "_",
                typeSpeed: 60,
                backSpeed: 30,
                backDelay: 2000,
                onKeyStroke: keyHit_cb,

                // user defined parameters
                strings: command,
                startDelay: delay,
                callback: callback,
            });
        });
    }

    // Returns BASH prompt for which typing script can attach commands to
    function prompt() {
        var $prompt = new paragraph();

        $prompt.text(PROMPT_STRING);
        $prompt.append($('<span class="bash-element"></span>'));
        
        return $prompt;
    }

    // Returns paragraph html element containing specified text
    function paragraph(text) {
        var $paragraph = $('<p></p>');
        $paragraph.text(text);
        return $paragraph;
    }

})();