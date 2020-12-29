enum controllerButtons 
{
    //% block="A"
    A = 1,
    //% block="B"
    B = 517,
    //% block="C"
    C = 686,
    //% block="D"
    D = 771,
    //% block="E"
    E = 855,
    //% block="F"
    F = 822
}

enum joysticAxis 
{
    //% block="X"
    X,
    //% block="Y"
    Y
}

enum joysticStates 
{
    //% block="Top"
    Top,
    //% block="Bottom"
    Bottom,
    //% block="Left"
    Left,
    //% block="Right"
    Right,
    //% block="Centre"
    Centre
}

/**
 * Custom blocks
 */
//% weight=100 color=#8A2BE2 icon="U+E7FC"
namespace pxt_Valley_EFJSB_Helpers
{
    let xCentre = 522;
    let yCentre = 522;

    let joystickGive = 5

    /**
    * returns the current centre variable used for the Joystick
    * on the specified Axis, offset from the centre     
    * Return of -1 (zero) indicates either an error
    * @param axis x for left/right, y for top/bottom
    */
    //% blockId=getCurrentCentreValue block="Get the the current centre variable of %axis axis"
    export function getCurrentCentreValue(axis: joysticAxis): number 
    {
        switch (axis) {
            case joysticAxis.X: return xCentre;
            case joysticAxis.Y: return yCentre;
            default: return -1;
        }
    }

    /**
    * Returns the current 'give' variable used for the Joystick
    * This is how far from centre the joystick needs to report    
    * before reporting not centred.
    * Handy for Joysticks that twitch or are loose
    */
    //% blockId=getCurrentJoystickGive block="Get the the current 'give' variable"
    export function getCurrentJoystickGive(): number 
    {
         return joystickGive;        
    }

    /**
    * Sets the current 'give' variable used for the Joystick
    * This is how far from centre the joystick needs to report    
    * before reporting not centred.
    * Handy for Joysticks that twitch or are loose
    //% newGive.min=0 newGive.max= 1023 
    //% blockId=setCurrentJoystickGive block="Set the the current 'give' variable"
    export function setCurrentJoystickGive(newGive : number): void 
    { 
        if (newGive >= 0 &&
            newGive <= 1023)
        {
            joystickGive = newGive;      
        }
    }

    /**
    * Calibrates the Joystick  
    * using the current positions on x and y axis.
    * Joystick should be free of input when this is called.
    */
    //% blockId=calibrateJoystick block="Calibrate the Joystick with current position as centre"
    export function calibrateJoystick(): void 
    {
        xCentre = pins.analogReadPin(AnalogPin.P0);
        yCentre = pins.analogReadPin(AnalogPin.P1);    
    }

    /**
    * Get the current position of the Joystick, 
    * on the specified Axis from 0 -> 1023
    * Reads left to right, bottom to top.
    * (ie; bottom left is 0,0)
    * @param axis x for left/right, y for top/bottom
    */
    //% blockId=getRawJoystickValue block="Get raw value of Joystick on %axis axis"
    export function getRawJoystickValue(axis: joysticAxis): number 
    {
        switch (axis) 
        {
            case joysticAxis.X: return pins.analogReadPin(AnalogPin.P0);
            case joysticAxis.Y: return pins.analogReadPin(AnalogPin.P1);
            default: return 0;
        }
    }

    /**
    * Get the current position of the Joystick,
    * on the specified Axis, offset from the centre
    * Left and Bottom values are negative,
    * Right and Top values are positive,
    * @param axis x for left/right, y for top/bottom
    */
    //% blockId=getOffsetJoystickValue block="Get the Delta value of Joystick on %axis axis"
    export function getOffsetJoystickValue(axis: joysticAxis): number 
    {
        switch (axis) 
        {
            case joysticAxis.X: return pins.analogReadPin(AnalogPin.P0) - xCentre;
            case joysticAxis.Y: return pins.analogReadPin(AnalogPin.P1) - yCentre;
            default: return 0;
        }
    }

    /**
    * Is the joystick registering the requested direction 
    * This is tested against the Centre position, set in Calibration
    * Note, these are not exclusive.  If joystick is at 0,0 then
    * both Left and Bottom will return true
    * @param state requested direction to check
    */
    //% blockId=isJoystickPointing block="Is the joystick pointing %state of centre"
    export function isJoystickPointing(state : joysticStates): boolean 
    {
        switch (state) 
        {
            case joysticStates.Left: return pins.analogReadPin(AnalogPin.P0) < xCentre - joystickGive;
            case joysticStates.Right: return pins.analogReadPin(AnalogPin.P0) > (xCentre + joystickGive);
            case joysticStates.Top: return pins.analogReadPin(AnalogPin.P1) > (yCentre + joystickGive);
            case joysticStates.Bottom: return pins.analogReadPin(AnalogPin.P1) < (yCentre - joystickGive);
            case joysticStates.Centre: return (pins.analogReadPin(AnalogPin.P1) >= (yCentre - joystickGive) && 
                                               pins.analogReadPin(AnalogPin.P1) <= (yCentre + joystickGive) && 
                                               pins.analogReadPin(AnalogPin.P0) >= (xCentre - joystickGive) && 
                                               pins.analogReadPin(AnalogPin.P0) <= (xCentre + joystickGive));
            default: return false;
        }
    }

    /**
     * Check if a specific button is currently pressed.
     * This uses the current analog value on Pin 2 of the Microbit.
     * This is how the ElecFreaks Joystick:Bit V2.0 (the white one with 6 buttons) works.
     * For the 4 button version, there is already a package.  That one maps to pins which is 
     * simpler and probably better in most situations
     * @param button the button, a-f, which map to the analog values.
     */
    //% blockId=IsButtonPressed block="is button %button active" 
    export function IsButtonPressed(button: controllerButtons): boolean 
    {
        if (pins.analogReadPin(AnalogPin.P2) == button)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
