import {scriptSwitch} from './common';
import functionButtons from './button';
import {autoFullWindow, autoHighestImage, avoidSmallWindow, dbClick} from './core';

window.onload = async () => {
    const buttonGroup = functionButtons();
    if (!scriptSwitch.isOn()) return;
    import('./restyle.css');
    avoidSmallWindow();
    autoFullWindow()
        .then(() => autoHighestImage());
    dbClick(buttonGroup);
};