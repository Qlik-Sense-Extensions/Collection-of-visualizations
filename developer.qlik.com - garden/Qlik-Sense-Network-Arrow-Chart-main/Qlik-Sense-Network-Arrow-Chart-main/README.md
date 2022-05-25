# Qlik-Sense-Network-Arrow-Chart

Qlik Sense Network Arrow Chart

![network](https://user-images.githubusercontent.com/7877793/113825861-72c39c00-97bc-11eb-8a39-3f9b36b55dc6.png)

Based on library vis.js (http://visjs.org)

https://github.com/miclae76/network-vis-chart


## Dimensions
1. Node identifier: This dimension controls which nodes are presented in the chart.
2. Node label: This dimension sets the label of each node.
3. Node parent: This dimension sets the parent of a node, and controls the relationships between nodes. It needs to contain the value of the node identifier of the parent to connect to.
4. Node group (Color): You can use this dimension to group nodes. All nodes in the same group will have the same color.

## Measures
1. Tooltip: You can set a measure value that is displayed in a tooltip when hovering over a node.
2. Node size: You can set the size of the node according to a measure.
3. Edge size: You can set the width of the lines between nodes according to a measure.

## Arrows (Added Option)
![ArrowLocation](https://user-images.githubusercontent.com/7877793/113826358-05fcd180-97bd-11eb-9538-16fb3a7c55e6.png)

![to](https://user-images.githubusercontent.com/7877793/113827023-ca163c00-97bd-11eb-8be5-e01d06cfedbf.png)

![from](https://user-images.githubusercontent.com/7877793/113827037-ce425980-97bd-11eb-910a-f38630785286.png)

![middle](https://user-images.githubusercontent.com/7877793/113827046-d13d4a00-97bd-11eb-828a-91fc93e9aab8.png)

## Node Identifier
The string field can work.

## Sample App
https://github.com/arumjin/Qlik-Sense-Network-Arrow-Chart/tree/main/qvf

 ```
NodeData:
Load Chr(rand()*26+65) as Node,
	 Chr(rand()*10+65) as ParentNode,
     Rand()*10 as NodeSize,
     Rand()*10 as EdgeSize
AutoGenerate 50;
 ```

## with Qlik Sense bundle
![with Qlik Extension](https://user-images.githubusercontent.com/7877793/113829925-072ffd80-97c1-11eb-9536-9bfb3bf25137.png)
