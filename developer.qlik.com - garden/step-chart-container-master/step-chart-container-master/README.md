# Process Step Container
This is a Qlik Sense process step container extension. 

- Allows user to display 1 master item visualization per step.
- Option to display a Title, measure/subtitle per step. 
- Image/avatar per step can be defined.
- Option to show/hide the image/avatar
- Navigate between steps and display the assigned master item in the container. 
- Option to hide the container and use the extension as a process step chart on its own.
- Option to export data per step/master items. (v.1.0.0.1)
- Option to show and hide navigation buttons. (v.1.0.0.1)


_IMPORTANT! This extension is part of a bundle (Kab's Extension Bundle). Can be used on its own._

# Demo
<div align="center">
  <img width="80%" alt="step-chart-container" src="https://github.com/kabir-rab/step-chart-container/blob/master/lib/img/step-chart-container-3.gif">
</div>

## v.1.0.0.1
<div align="center">  
  <img width="90%" alt="step-chart-container" src="https://github.com/kabir-rab/step-chart-container/blob/master/lib/img/step-chart-1-preview.gif">
</div>

# How to Install
## Desktop
Download [release v-1.0.0.1](https://github.com/kabir-rab/step-chart-container/releases/download/v.1.0.0.1/step-chart-container.v.1.1.zip). Once downloaded unzip all it's content to the following folder 
> Documents\Qlik\Sense\Extensions\

## Enterprise Server
Download [release v-1.0.0.1](https://github.com/kabir-rab/step-chart-container/releases/download/v.1.0.0.1/step-chart-container.v.1.1.zip). Once downloaded, use the QMC to upload the zip file just like any other extensions.

# How to use
Go to "edit" mode of a Qlik sense app. Then Custom objects > "Kab-s Extension Bundle" > "Step Chart Container". Drag this to the work space and add and define your steps. You can add as many steps/process as you need. To display avatar for each step - you will have to upload the avatar/images in the content library and provide the address for them. Images can be displayed from other internet sources too (ex - twitter profile picture etc).

# Known bugs and limitations
 - Export data as csv or export charts as image file. This is the roadmap..
