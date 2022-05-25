# Qlik sense extension multi series scatter plot
This extension lets users create a multi series scatter plot in their Qlik sense application
For demo and more info: [Demo] (http://www.codewander.com/qlik-sense-extension-multi-series-scatter-plot/)



Please find below the configuration.

# Measures and Dimensions
This extension requires only one dimension and an even number of measures to visualize data. 
The extension takes the odd measures as x-value and even measures as y-value. Each pair is a series. 
This design is to accommodate plotting data from different set of columns. If either your x or y value is from the same column, you can repeat the measures. 

# Settings
There are four sections under Appearances that helps us configure the appearance of the chart apart from the two common sections, 
namely General and Alternate States. They are
Series
X Axis
Y Axis
General Settings


## Series
Series section lets you add details related to each of the series that you want to plot. It does not validate the number of series that you have defined in the measures section. Instead it assigns the series details in the order of appearance.


In the series section, you can enter the following for each of the series which means you can control each series independent of other series.

* Name of the series
* Color
* Series type
* Marker size
* Highlight first point

**Series Type:** There are three options in the series type: lines, lines+markers and markers. The markers is the usual scatter plot where as lines and lines+markers lets us draw the line to the plot connecting the data points in the order they appear in the series. The following picture shows the lines+markers and markers series in one single visualization.

**Highlight first point:** This will be useful when we use the either line or lines+markers series type to identify where the series starts and helps in following the change in data points. When this option is checked, the first data point will have a black border around it as shown in the picture below.

## X Axis and Y Axis
Both X-Axis and Y-Axis has the same set of parameters and are quite self-explanatory. This option lets you choose configure how the grid-lines, zero line, axis base line or the labels need to be plotted.

Show Line vs Show Zero Line
The Show Line is to show or hide the base line of the axis whereas Show Zero Line is to show or hide the line at the point zero. In the picture below, we can see that for the Y-Axis, we hide the axis line but show the zero line


## General Settings

General Setting has two options. They are

* Display options for mode bar
* 	Show Legend
The mode bar is the list of buttons that appear on top. You can choose to have it or hide it using this option. Currently legends are shown on the right side vertically. I will add more options for the same eventually. Currently you can either show or hide the legend.

