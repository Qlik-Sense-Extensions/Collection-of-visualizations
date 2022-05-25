# Qlik Sense Dev Suite extension

This extension is built to improve upon the development experience of Qlik Sense native applications. See below for feature list

> Note: Dev Suite is currently in its alpha phase. It has not been thoroughly tested and there is potential to see some wonky behavior while using it. It is also worth noting that the extension so fare has only been tested on Qlik Sense February 2020 and June 2020. If you experience any issues, please submit an issues https://github.com/jbellizzi/qlik-dev-suite/issues

<br/>

## Features

### Object Positioning

When moving objects around a sheet, Qlik Sense will highlight areas where the object is allowed to be moved. While this prevents object overlapping, these areas are rarely useful, and we often go through a process of moving and resizing an object back to its original size.

Dev Suite allows for adjusting the position of sheet objects by grid cells

<p align="center">
  <img src="https://github.com/jbellizzi/qlik-dev-suite/blob/master/wiki/grid-positioning.gif" alt="object grid positioning">
</p>

Alternatively, Dev Suite has a pixel mode setting so objects can be moved at the pixel level

<p align="center">
  <img src="https://github.com/jbellizzi/qlik-dev-suite/blob/master/wiki/pixel-positioning.gif" alt="object pixel positioning">
</p>

<br/>

### Positioning with arrow keys

Along with dragging and dropping objects around a sheet, you can also use the arrow keys to shift the object position.

In grid mode, the object will be moved by 1 grid cell during an arrow press, or 2 cells with the shift key held.

In pixel mode, pressing an arrow key will move the object 1 pixel in the pressed direction, or 10 pixels if holding down the shift key.

<br/>

### Object resize

Objects can also be resized without being constrained by neighboring objects, both in grid and pixel mode.

<p align="center">
  <img src="https://github.com/jbellizzi/qlik-dev-suite/blob/master/wiki/grid-resize.gif" alt="object grid resize">
</p>

<p align="center">
  <img src="https://github.com/jbellizzi/qlik-dev-suite/blob/master/wiki/pixel-resize.gif" alt="object pixel resize">
</p>

<br/>

### Multiselect

With Qlik Sense Dev Suite, it is possible to select multiple elements to control. After clicking multiple objects while holing the shift key, you can move those selected objects using the arrow keys.

Multiselect also allows you to select and delete multiple objects at once. You can also copy and paste multiple selected objects (CTRL + C, CTRL + V), either on the same sheet, or across different sheets.

<br/>

## Using Dev Suite

To use the dev suite extension in a Qlik Sense application, download the most recent build zip file (right now, dev-suite is in alpha mode, so the file will look like dev-suite_0.1.x-alpha.x.zip) and import this file to extensions.

In the application you want to use the extension, find the extension in the Custom Objects/Extensions side panel and drag it onto any sheet in the application. When the extension gets added to a sheet, it is placed above the page grid and also added to all other sheets of the application. Be aware that the extension is only visible while in edit mode of a sheet.

With the extension added, you can switch between grid and pixel mode and start editing your sheet objects.

<br/>

## Removing Dev Suite

Since the Dev Suite extension actively syncs with the Qlik application to ensure it is installed on all sheets, you won't be able to remove the extension by just deleting the extension object. To remove it across all sheets in the app, you will need to hit the `remove dev-suite` button in the extension.

After removing, you may need to refresh the page to regain the Qlik Sense default edit modes

<br/>

## Roadmap

The first version of Dev Suite is built to address some basic sheet editing features in Qlik, but there are more features planned for the future, including:

- Aligning multiple selected objects by left, right, top, bottom, center, and evenly spaced criteria
- Move multiple objects by dragging
- Cut multiple objects from a sheet (CTRL + X)
- Copy formatting from one object to another
- Improved editing control over object properties
- Hotkeys for creating new chart objects
- More/Customizable grid sizes
- Conditional hiding of sheets
- Improved variable edit panel to including searching and quick updates

<br/>

## Feedback

If you are using Qlik Sense Dev Suite and find any errors, bugs, unexpected behavior, or features you plainly just don't like, please add an issue on the github issue tracker https://github.com/jbellizzi/qlik-dev-suite/issues.

You can also add features here you would like to see in the future that may be considered to be added to the roadmap.
