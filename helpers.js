function loadVTP(objData) {
  const vtkRenderScreen = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
      container: document.querySelector('#vtk-renderer'),
      background: [0.,0.,0.]
  });
  
  // Create a VTP reader
  const reader = vtk.IO.XML.vtkXMLPolyDataReader.newInstance();
  reader.setUrl(objData);
  
  reader.loadData().then(() => {
      
      // Create mapper and actor
      const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
      mapper.setInputData(reader.getOutputData());
      
      const actor = vtk.Rendering.Core.vtkActor.newInstance();
      actor.setMapper(mapper);
      
      // create orientation widget
      const axes  = vtk.Rendering.Core.vtkAxesActor.newInstance();
      const orientationWidget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
              actor: axes,
              interactor: vtkRenderScreen.getRenderWindow().getInteractor(),
          });
          orientationWidget.setEnabled(true);
          orientationWidget.setViewportCorner(
          vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
      );

      orientationWidget.setViewportSize(0.15);
      orientationWidget.setMinPixelSize(100);
      orientationWidget.setMaxPixelSize(300);

      vtkRenderScreen.getRenderer().addActor(actor);
      vtkRenderScreen.getRenderer().resetCamera();

      //Start rendering
      vtkRenderScreen.getRenderWindow().render();
  });
}


function loadVTPTest(objData, label) {
    document.querySelector("#vtk-container").innerHTML = ""

    const vtkRenderScreen = vtk.Rendering.Misc.vtkFullScreenRenderWindow.newInstance({
        container: document.querySelector('#vtk-container'),
        background: [0.,0.,0.]
    });
  
    // Create a VTP reader
    const reader = vtk.IO.XML.vtkXMLPolyDataReader.newInstance();
    // reader.parseAsArrayBuffer(objData);
    reader.setUrl(objData);
    
    reader.loadData().then(() => {
        
        // Get the VTP output data
        const vtpOutput = reader.getOutputData();
        
        // Get the materialid array from the VTP data
        // const materialidArray = vtpOutput.getCellData().getArrayByName('MaterialIds');
        const materialidArray = vtpOutput.getCellData().getArrayByName(label);
        
        
        // console.log(vtpOutput.getCellData())
        // console.log(vtpOutput.getCellData().getArrayByName("MaterialIds").getData())
        // console.log(vtpOutput.getPointData().getNormals().getElementComponentSize())

        // Map scalar array through the lookup table
        materialidArray.setName("Scalars"); // Make sure the array has a name
        vtpOutput.getCellData().setScalars(materialidArray);

        console.log("materialidArray.getData(): ", materialidArray.getData())

        // Create a color transfer function
        const colorTransferFunction = vtk.Rendering.Core.vtkColorTransferFunction.newInstance();
        
        // Create colors for 15 different classes (you can adjust these)
        const classColors = [
            [0.839, 0.153, 0.157],  // Red
            [0.121, 0.466, 0.705],  // Blue
            [0.172, 0.627, 0.172],  // Green
            [0.580, 0.404, 0.741],  // Purple
            [1.000, 0.498, 0.054],  // Orange
            [0.890, 0.467, 0.761],  // Pink
            [0.498, 0.498, 0.498],  // Gray
            [0.737, 0.741, 0.133],  // Yellow
            [0.090, 0.745, 0.811],  // Teal
            [0.682, 0.780, 0.909],  // Light Blue
            [0.090, 0.745, 0.172],  // Bright Green
            [0.831, 0.607, 0.101],  // Gold
            [0.647, 0.380, 0.094],  // Brown
            [0.596, 0.306, 0.639],  // Dark Purple
            [0.180, 0.180, 0.180]   // Dark Gray
        ];

        // Assign colors to unique materialids
        // if(materialidArray.getData()){
        // }else{
        //     console.log("materialidArray is null")
        // }
        
        const uniqueMaterialIds = new Set(materialidArray.getData());
        const numColors = classColors.length;

        uniqueMaterialIds.forEach((materialid, index) => {
            // Normalize the index based on the unique material IDs
            const normalizedIndex = index / (uniqueMaterialIds.size - 1);

            // Calculate the color index and wrap around within the valid range
            const colorIndex = Math.floor(normalizedIndex * numColors) % numColors;

            const color = classColors[colorIndex];
            colorTransferFunction.addRGBPoint(materialid, color[0], color[1], color[2]);
        });
        
        // Apply symmetric colorization
        

        // Create mapper and actor
        const mapper = vtk.Rendering.Core.vtkMapper.newInstance();
        mapper.setInputData(reader.getOutputData());
        mapper.setLookupTable(colorTransferFunction);

        mapper.setUseLookupTableScalarRange(true); // Ensure correct scalar range

        // Map scalars through the lookup table
        mapper.setScalarModeToUseCellData();
        mapper.setScalarVisibility(true);

        mapper.setColorModeToMapScalars(); // Map colors based on the materialid values
        
        const actor = vtk.Rendering.Core.vtkActor.newInstance();
        actor.setMapper(mapper);
        
        // create orientation widget
        const axes  = vtk.Rendering.Core.vtkAxesActor.newInstance();
        const orientationWidget = vtk.Interaction.Widgets.vtkOrientationMarkerWidget.newInstance({
                actor: axes,
                interactor: vtkRenderScreen.getRenderWindow().getInteractor(),
            });
            orientationWidget.setEnabled(true);
            orientationWidget.setViewportCorner(
            vtk.Interaction.Widgets.vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT
        );

        orientationWidget.setViewportSize(0.15);
        orientationWidget.setMinPixelSize(100);
        orientationWidget.setMaxPixelSize(300);

        vtkRenderScreen.getRenderer().addActor(actor);
        vtkRenderScreen.getRenderer().resetCamera();
        
        //Start rendering
        vtkRenderScreen.getRenderWindow().render();
    });
}
