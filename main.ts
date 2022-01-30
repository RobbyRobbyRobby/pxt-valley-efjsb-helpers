let LastDirectionSent: joysticDigitalStates = 8
radio.setGroup(1)
basic.forever(function () {
    if (pxt_Valley_EFJSB_Helpers.getDigitalJoystickPosition() != LastDirectionSent) {
        LastDirectionSent = pxt_Valley_EFJSB_Helpers.getDigitalJoystickPosition()
        radio.sendNumber(LastDirectionSent)
    }
})
