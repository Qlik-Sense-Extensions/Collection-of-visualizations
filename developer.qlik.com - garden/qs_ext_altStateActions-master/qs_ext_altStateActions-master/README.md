# Alternate State Actions

(reworked for Qlik Sense September 2020)

This extension gets the user up to 4 buttons which he/she will need to work with Alternate States in Qlik Sense

 * A "Copy Main State > Alternate State" button
 * A "Copy Alternate State > Main State" button
 * A "Clear Main State" button
 * A "Clear Alternate State" button

What else?
 - Buttons are styled as LUI (Leonardo-UI) Buttons, but you can change an element style manually.
 - If you set an empty string as the label, the button doesn't get rendered (so you can pick which of the 4 buttons you like)
 - The target state first gets cleared from all existing selections before syncing them from the source state

I can think of a future version, that would copy selections only of specific fields between states, not always of all fields ...
