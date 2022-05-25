# eCraft KPI Extension

eCraft KPI extension is configurable and clean looking KPI Extension for Qlik Sense.

Unlimited amount of custom actions can be added when clicking the extension. Actions include Select in field, Variable actions and move to sheet.

### Multiple Style choices: ###

![gif](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/kpi1.png)

Custom backgrounds and borders:

![gif](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/kpi2.png)

![gif](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/kpi3.png)

![gif](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/KPI.gif)


## Import Extension to Sense Server ##
1. Download newest version of ecraft-kpi.zip from the dist folder. 
2. Import extension in QMC Extension section

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/qmc.png)

## Features ##

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/settings1.png)

* Custom and conditional coloring of indicator and KPI Text
* Indicator depending on if measure 1 is larger or smaller than measure 2
* Custom text for second measure
* Compare measures by percentage
* Automatic formatting of large numbers

### KPI Colors ###

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/settings2.png)

You can customize following colors:
* Header text
* Header background
* KPI color
* KPI Background
* Second measure color
* Indicator color
* Border styles (Color and styles)

Color can be added from Qlik Expression or directly as CSS compatible color code (RGB, RGBA, HEX or color name).


### Actions ###

Multiple actions can be added in extension property panel. You can chain actions together, for example select value and move to analysis sheet.

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/settings3.png)

Custom actions when clicking KPI can be configured:

* Selection in field
Settings:
Field name: Name of the field
Value: Value to be selected
Append to field selection: Either replace current selections or add to selection. Multiple values can be selected if you first replace selections and then add other values. First add one selection with replace and then add further actions to select additional values with add option

* Set variable
Settings:
Variable name: Name of the variable to be setted
Value: Desired value of the variable

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/settings4.png)


* Move to sheet
Settings:
Sheet: Dropdown of all sheets in Qlik Sense application. Select desired sheet from dropdown

![qmc](https://raw.githubusercontent.com/ecraftextensions/ecraft-kpi/master/img/settings5.png)


Color can be added from Qlik Expression or directly as CSS compatible color code (RGB, RGBA, HEX or color name).

### Author ###

Markus Lehtola, eCraft Business Insight
firstname.lastname@ecraft.com


### Bugs etc. ###

To report bugs and feature request please open issue.
