# High-Density Scatter Plot for Qlik Sense

With this Qlik Sense extension a high-density scatter plot with several tousands data points can be created. 


![High-Density-Scatter.gif](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/HighDensityScatter.gif)

The extension is based on https://plotly.com/javascript/.
The library supports WebGL for rendering.

<br /><br />	

**Tips for configuration:**

Add-Ons > "Max Records": Default 5000. Increase the number to see more points in the chart.

Add-Ons > "Reference lines": Add line here. The line geometry expects a set of coordinates.
	e.g. [x1, y1],[x2, y2] creates a straight line. Further  examples are in the attached Qlik Sense app.  

X Axis/Y Axis > "Tick Label Format-D3.js": Defines the date format for the acix. D3 formats are used.
	e.g. "YYYY-MM-DD hh:mm" > D3: "%Y-%d-%m %H:%M" 
	e.g. "#,##0.00" > ",.2f"
	Date Format: https://github.com/d3/d3-time-format
	Number Format: https://github.com/d3/d3-format/blob/master/README.md#locale_format
	
	
<br /><br />	

**Reference Lines / Rects:**
![Reference Line&Rect.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/Reference%20Line%26Rect.PNG)

<br /><br />

**Dimensional Lines:**
e.g. Regression, Median
<br />
![Dimensional Lines.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/Dimensional%20Lines.PNG)

<br /><br />

**Distribution Plot:**
![RefLines.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/distributionPlot.PNG)

<br /><br />

**Color Options:**
![ColorOptions.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/ColorOptions.PNG)


<br /><br />

**Tooltip:**

![Tooltip.png](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/Tooltip.png)

<br /><br />

**Experimental: Max Performance Mode**
- showcases how to create a scatter plot render with 100k+ points
![MaxPerformanceMode.PNG](https://raw.githubusercontent.com/mihael-dev/DemoData/main/HighDensityScatter/MaxPerformanceMode.PNG)

**Known Limitations:**
- The extension is tested with  ~100k data points.
- Number formats in the measures are ignored. Use Tick Format in the X Axis/Y Axis configuration instead. 
- No support for colors in Master measures and dimensions.
- No support for selections on axis and legend.
- Printing of the high-density scatter should work up to 50k points (only QSE Windows).
- Extension tested with Sep2020/Nov2020/Feb2021/May2021 release
- New versions of the extension may require that existing objects need to be replaced


**Release:**
- 2021-06-28
	* Upgrade Plotly 2.0
	* Bugfix: Handling null values in trace and tooltip
	* Bugfix: line chart increase qInitialDataFetch (Width): 20

- 2021-08-07: 
	* FiX Date conversion
	* Upgrade Plotly 2.2
	
- 2021-08-26: 
	* Custom color palette for color by dimension 

- 2021-12-23:
	* Upgrade Plotly 2.8.3