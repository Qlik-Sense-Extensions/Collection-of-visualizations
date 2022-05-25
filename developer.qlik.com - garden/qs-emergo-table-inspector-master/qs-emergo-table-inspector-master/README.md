---
Qlik Sense Visualization Extension
Name: E-mergo Table Inspector
Version: 1.3.20200918
QEXT: qs-emergo-table-inspector.qext
---

# E-mergo Table Inspector

**E-mergo Table Inspector** is a Qlik Sense visualization extension created by [E-mergo](https://www.e-mergo.nl). This extension enables the dashboard designer to quickly inspect the contents of virtual data tables that make up an app's datamodel.

This extension is part of the [E-mergo Tools bundle](https://www.e-mergo.nl/e-mergo-tools-bundle/?utm_medium=download&utm_source=tools_bundle&utm_campaign=E-mergo_Extension&utm_term=toolsbundle&utm_content=sitelink).

This extension is [hosted on GitHub](https://github.com/e-mergo/qs-emergo-table-inspector). You can report bugs and discuss features on the [issues page](https://github.com/e-mergo/qs-emergo-table-inspector/issues).

## Why is this extension needed?
A seasoned Qlik Sense app developer sees herself frequently inspecting the contents of an app's datamodel. Next to using the data model viewer this frequently happens by setting up a straight table and adding the fields of interest. When inspecting a multitude of data tables, or of data tables with many fields, this task quickly becomes time consuming.

Previously, the community's extension named 'xTableBox' provided a solution for this. However, it no longer supports newer versions of Qlik Sense. This extension also had its flaws, for example it did not stay synchronized with changes in the app's data model. A proper alternative was not seen until now.

This E-mergo extension provides a singular fast way for inspecting data tables, by automatically fetching all fields for the selected table. This includes keeping the visualization in sync with the app's data model by updating the visualization on addition and removal of fields applied in the reload. Also, switching between data tables can be done in two clicks, without the need for selecting or removing a single field in the visualization.

Additionally, the extension utilizes Qlik Sense's internal API's (for generating a generic straight table), without adding custom logic or markup, providing a seamless and familiar user experience within the Qlik Sense environment.

## Disclaimer
This extension is created free of charge for Qlik Sense app developers, personal or professional. E-mergo developers aim to maintain the functionality of this extension with each new release of Qlik Sense. However, this product does not ship with any warranty of support. If you require any updates to the extension or would like to request additional features, please inquire for E-mergo's commercial plans for supporting your extension needs at support@e-mergo.nl.

On server installations that do not already have it registered, the Markdown file mime type will be registered when opening the documentation page. This is required for Qlik Sense to be able to successfully return `.md` files when those are requested from the Qlik Sense web server. Note that registering the file mime type is only required once and is usually only allowed for accounts with RootAdmin level permissions.

## Features
Below is a detailed description of the available features of this extension.

### No Settings
This extension is plug-and-play as it works with zero property settings. Insert the extension on a sheet and start selecting your data table! All the extension's options are available in the visualization's context menu (right-click).

### Select table
When in Analysis mode, select a data table through the `Select Table` popup window. When a data table is already selected switch to a different data table by selecting `Switch table` in the extension's context menu (right-click).

### Reset inspector
Clear the selected data table by selecting `Reset inspector` in the extension's context menu (right-click).

### Adding and removing fields
Remove or re-add fields by selecting `Remove field` or `Add field` in the extension's context menu (right-click). The menus also provide options for removing all-fields-but-one as well as adding all removed fields back in again.

## FAQ

### Can I get support for this extension?
E-mergo provides paid support through standard support contracts. For other scenarios, you can post your bugs or questions in the extension's GitHub repository.

### Can you add feature X?
Requests for additional features can be posted in the extension's GitHub repository. Depending on your own code samples and the availability of E-mergo developers your request may be considered and included.

## Changelog

#### 1.3.20200918 - QS Sept 2020
- Fixed the layout for smaller extension object sizes.

#### 1.2.20200731
- Fixed a bug where the extension would result in an error when embedded.
- Fixed logic for the _Open Documentation_ button.

#### 1.1.20200706
- Fixed a bug where the export data dialog would not open in QS April 2020 and up.

#### 1.0.20200623
- Updated docs files.

#### 1.0.20200622
- Fixed internal naming and updated docs.

#### 0.2.20200227
- Added loading spinner for selections of large data tables.
- Added auto-sync for removed data tables.
- Fixed handling of synthetic tables and keys.
- Fixed incorrect context menu items for table cells outside of data columns.

#### 0.1.20200114
Initial release.
