enum controllerButtons 
{
    //% block="A"
    A = 1,
    //% block="B"
    B = 516,
    //% block="C"
    C = 686,
    //% block="D"
    D = 771,
    //% block="E"
    E = 855,
    //% block="F"
    F = 821
}

enum joysticAxis 
{
    //% block="X"
    X,
    //% block="Y"
    Y
}

enum joysticAnalogStates 
{
    //% block="Top"
    Top,
    //% block="Right"
    Right,
    //% block="Bottom"
    Bottom,
    //% block="Left"
    Left,
    //% block="Centre"
    Centre
}

enum joysticDigitalStates 
{
    //% block="Top"
    Top,
    //% block="TopRight"
    TopRight,
    //% block="Right"
    Right,
    //% block="BottomRight"
    BottomRight,
    //% block="Bottom"
    Bottom,
    //% block="BottomLeft"
    BottomLeft,
    //% block="Left"
    Left,
    //% block="TopLeft"
    TopLeft,
    //% block="Centre"
    Centre
}

/**
 * Custom blocks
 */
//% weight=100 color=#8A2BE2 icon=""
namespace pxt_Valley_EFJSB_Helpers
{
    let xCentre = 522;
    let yCentre = 522;

    let joystickThreshhold = 5

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
    * Returns the current 'threshhold' variable used for the Joystick
    * This is how far from centre the joystick needs to report    
    * before reporting not centred.
    * Handy for Joysticks that twitch or are loose
    */
    //% blockId=getCurrentJoystickThreshhold block="Get the the current 'threshhold' variable"
    export function getCurrentJoystickGive(): number 
    {
         return joystickThreshhold;        
    }

    /**
    * Sets the current 'threshhold' variable used for the Joystick
    * This is how far from centre the joystick needs to report    
    * before reporting not centred.
    * Handy for Joysticks that twitch or are loose
    */
    //% newThreshhold.min=0 newGive.max=1023 
    //% blockId=setCurrentJoystickThreshhold block="Set the the current 'threshhold' variable"
    export function setCurrentJoystickGive(newThreshhold : number): void 
    { 
        if (newThreshhold >= 0 &&
            newThreshhold <= 1023)
        {
            joystickThreshhold = newThreshhold;      
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
    export function isJoystickPointing(state : joysticAnalogStates): boolean 
    {
        let p0 = pins.analogReadPin(AnalogPin.P0);
        let p1 = pins.analogReadPin(AnalogPin.P1);

        switch (state) 
        {
            case joysticAnalogStates.Left: return p0 < xCentre - joystickThreshhold;
            case joysticAnalogStates.Right: return p0 > xCentre + joystickThreshhold;
            case joysticAnalogStates.Top: return p1 > yCentre + joystickThreshhold;
            case joysticAnalogStates.Bottom: return p1 < yCentre - joystickThreshhold;
            case joysticAnalogStates.Centre: return (p1 >= yCentre - joystickThreshhold && 
                                                     p1 <= yCentre + joystickThreshhold && 
                                                     p0 >= xCentre - joystickThreshhold && 
                                                     p0 <= xCentre + joystickThreshhold);
            default: return false;
        }
    }

    /**
    * What is the DPad (Digital) direction of the joystick
    */
    //% blockId=getDigitalJoystickPosition block="Get the current Digital DPad value of the Joystick"
    export function getDigitalJoystickPosition(): joysticDigitalStates 
    {
        let p0 = pins.analogReadPin(AnalogPin.P0);
        let p1 = pins.analogReadPin(AnalogPin.P1);

        let digitalThreshhold = 150;

        let left, right, up, down = false;

        left = p0 < xCentre - digitalThreshhold;
        right = p0 > xCentre + digitalThreshhold;
        up = p1 > yCentre + digitalThreshhold;
        down = p1 < yCentre - digitalThreshhold;
        
        if (left)
        {
            if (up)
            {
                return joysticDigitalStates.TopLeft;
            }
            else 
            {
                if (down)
                {
                    return joysticDigitalStates.BottomLeft;
                }
                else
                {
                    return joysticDigitalStates.Left;
                }
            }
        }
        else
        {
            if (right)
            {
                if (up)
                {
                    return joysticDigitalStates.TopRight;
                }
                else 
                {
                    if (down)
                    {
                        return joysticDigitalStates.BottomRight;
                    }
                    else
                    {
                        return joysticDigitalStates.Right;
                    }
                }
            }
            else
            {
                if (up)
                {
                    return joysticDigitalStates.Top;
                }
                else 
                {
                    if (down)
                    {
                        return joysticDigitalStates.Bottom;
                    }
                    else
                    {
                        return joysticDigitalStates.Centre;
                    }
                }
            }
        }  

        return joysticDigitalStates.Centre;      
    }

    /**
    * Convert the numeric points of digital joystick position to arrows
    * @joystickState (0-8 clockwise from top) to a standard Micro:Bit ArrowName.
    * @joystickState
    */
    //% blockId=joystickPositionAsArrow block="Convert digital joystick state %joystickState to ArrowName"
    export function joystickPositionAsArrow(joystickState: number): ArrowNames
    {
        switch (joystickState)
        {
            case joysticDigitalStates.Top: return ArrowNames.North; break;
            case joysticDigitalStates.TopRight: return ArrowNames.NorthEast; break;
            case joysticDigitalStates.Right: return ArrowNames.East; break;
            case joysticDigitalStates.BottomRight: return ArrowNames.SouthEast; break;
            case joysticDigitalStates.Bottom: return ArrowNames.South; break;
            case joysticDigitalStates.BottomLeft: return ArrowNames.SouthWest; break;
            case joysticDigitalStates.Left: return ArrowNames.West; break;
            case joysticDigitalStates.TopLeft: return ArrowNames.NorthWest; break;
            default: return null; break;
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
        let p = pins.analogReadPin(AnalogPin.P2);

        if (p >= button - 2 &&
            p <= button + 2)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
}
