# [Qlik Sense](http://global.qlik.com/uk/explore/products/sense) Timeline Chart

- GitHub URL: https://github.com/SirGarnet/qlik-sense-timeline
- Qlik Sense Garden: https://developer.qlik.com/garden/5c7d3eedcd73a200176e3e5f

## ANNOUNCEMENT

Redesign finished version 1.8 is available. Happy for some testers and feedback.

## Screenshot

![image](https://raw.githubusercontent.com/SirGarnet/qlik-sense-timeline/master/googtimeline/googtimeline.png)

## Overview

The Qlik Sense Timeline Chart is a chart extension for the use in [Qlik Sense](http://global.qlik.com/uk/explore/products/sense) Desktop or Server. It is versatile chart that allows you to depict how multiple artifacts, be they projects or resources, are active/used over time in relation to each other.

Examples:

- You are managing a software project and want to illustrate who is doing what and when
- You are organising a conference and need to schedule meeting rooms
- You are running marketing campaigns and would like a scheduling overview

The Qlik Sense Timeline Chart leverages the [Google Chart API](https://developers.google.com/chart/interactive/docs/gallery/timeline).

## Usage

Dimensions:
- Dimension 1 _(required)_: Main dimension and row label
- Dimension 2 _(optional)_: Bar label

Measures:
- Measure 1 _(required)_: start date
- Measure 2 _(required)_: end date
- Measure 3 _(optional)_: Tooltip in plain text or HTML

## Custom settings:

I've added some extensions after the fork of https://github.com/kai/qlik-sense-timeline/

### Addons

#### Data

- Limited data load [500 rows] - _Initial: active_
- Load number of rows - _Shown if 'Limited data load' is off_

### NULL Value Handling

- Remove rows where start/end is NULL
- Make a Point if start/end is NULL - _Shown if 'Remove rows where start/end is NULL' is active_

### Labels

- Show/hide row labels (Dim 1)
- Show/hide bar labels (Dim 2) - _Shown if 2nd dimension exists_

### Tooltip

- Enable/disable tooltip
- Parse tooltip as HTML / plain text - _Shown if 3rd meassure exists_

### Grouping

- Group bars by 1st dimension

### Color

- Background color with Qlik-Color-Picker
- Set single color for all bars with Qlik-Color-Picker
- Color by row label - _Shown if SingleColor is set to off_
- Select between Google and Qlik palette - _Shown if SingleColor is set to off_

## Advantages

With this updated version it is possible to create colorful gantt charts in qlik sense. It is also possible to show the additional informations that you need in the HTML tooltip.

Since Ver. 1.4 the [Moment.js](https://momentjs.com/) library is included, so the timestamps from Qlik Sense are converted to the format YYYY-MM-DD (ISO). Therefore the extension gets the set timestamp format from the running Qlik Sense app.

### Datatable

Basically you can use this table to hold you data:

| ID            | SubID         | Start               | End                 | ... additional columns ... |
| --------------|---------------|---------------------|---------------------|-----------------------------
| AAA           | one           | 04.01.2026 09:14:58 | 04.01.2026 10:11:39 |                            |
| AAA           | two      	    | 04.01.2026 09:12:42 |	04.01.2026 10:06:35 |                            |
| AAA           | three         | 04.01.2026 09:06:42 |	04.01.2026 10:04:42 |                            |
| BBB           | one      	    | 04.01.2026 08:33:38 |	04.01.2026 09:58:48 |                            |
| BBB           | two      	    | 04.01.2026 08:32:11 |	04.01.2026 09:40:27 |                            |
| BBB           | three         | 04.01.2026 00:00:00 |	04.01.2026 09:08:58 |                            |
| CCC           | one      	    | 04.01.2026 09:49:43 |	04.01.2026 11:03:47 |                            |
| CCC           | two      	    | 04.01.2026 09:48:05 | 04.01.2026 11:01:05 |                            |
| CCC           | three         | 04.01.2026 09:42:56 | 04.01.2026 10:59:14 |                            |
| DDD           | one      	    | 04.01.2026 09:34:27 | 04.01.2026 10:52:51 |                            |
| DDD           | two           | 04.01.2026 09:33:11 | 04.01.2026 10:44:06 |                            |
| DDD           | three         | 04.01.2026 08:30:04 | 04.01.2026 10:12:59 |                            |

It is also possible to add additional columns, but these are the basic columns that are needed.

### HTML Tooltip

The HTML tooltip a powerful extension, that allows to show the information that is usefull for your dashbord. It s not possible to change the outer border design of the tooltip, only the content in the tooltip can be adapted.

![image](https://raw.githubusercontent.com/SirGarnet/qlik-sense-timeline/master/googtimeline/tooltip.png)

I personaly like to use the following design for the tootltip. Be patient there is a single quote at the beginning and end, because this is a string for qlik.

```html
'
<div style="padding:5px;"><h1>' & SubID & '</h1></div>
<hr style="margin:0px;">
<pre style="padding:5px;">
<b>' & GetObjectDimension(0) & ':	</b>' & $(=GetObjectDimension(0)) & '
<b>Start:		</b>' & if( Left(Timestamp(Min(Start)), 10) = Left(Timestamp(Max(End)), 10), Time(Min(Start)), Timestamp(Min(Start))) & '
<b>End:		</b>' & if( Left(Timestamp(Min(Start)), 10) = Left(Timestamp(Max(End)), 10), Time(Max(End)), Timestamp(Max(End))) & '

<b>Duration:	</b>' & Hour(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' h ' & Minute(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' m ' & Second(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' s
</pre>
'
```

First there is the title of the tooltip in a seperate ```<div>``` element. The used SubID is not in the string. So Qlik Sense gets the corresponding value from the field for the displayed bar.

```html
<div style="padding:5px;"><h1>' & SubID & '</h1></div>
```

Then there is just a horizontal line ```<hr>``` to make a seperation between the header and other data.

```html
<hr style="margin:0px;">
```
The ```<pre>``` element holds the data that is shown. This element represents preformatted text which is to be presented exactly as written in the HTML. For further informations take a look at [here](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/pre). This way, every line, single space and tabstopp persists in the resulting tooltip.

```html
<pre style="padding:5px;">
...
</pre>
```

This line gets the name of the first dimension and displays it in **bold**. This is followed by a colon and a single space. The value of the fist dimension is then shown after the colon with ```$(=GetObjectDimension(0))```.

```html
<b>' & GetObjectDimension(0) & ':	</b>' & $(=GetObjectDimension(0)) & '
```

The start and endtime of the bar are shown. For a better representation the date is removed when both timestamps share the same date.

```html
<b>Start:		</b>' & if( Left(Timestamp(Min(Start)), 10) = Left(Timestamp(Max(End)), 10), Time(Min(Start)), Timestamp(Min(Start))) & '
<b>End:		</b>' & if( Left(Timestamp(Min(Start)), 10) = Left(Timestamp(Max(End)), 10), Time(Max(End)), Timestamp(Max(End))) & '
```

The last line shows the resulting time for the bar in hours, minutes and seconds.

```html
<b>Duration:	</b>' & Hour(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' h ' & Minute(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' m ' & Second(Timestamp(Max(End)) - Timestamp(Min(Start))) & ' s
```

## SaaS Users

See #4 for detailed rules. The extension uses since version 1.8 only https://www.gstatic.com - Happy for some feedback on the correct rule definition.

## Sources

- GitHub URL: https://github.com/SirGarnet/qlik-sense-timeline
- Forked from: https://github.com/kai/qlik-sense-timeline/
- Qlik Sense Garden: https://developer.qlik.com/garden/5c7d3eedcd73a200176e3e5f

## Licenses

[MIT License](https://github.com/SirGarnet/qlik-sense-timeline/blob/master/LICENSE)

## Future roadmap

- Color by Dimension like Qlik Sense
- Include color and font for bar labels
- Include color and font for row labels
