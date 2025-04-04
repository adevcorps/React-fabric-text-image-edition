import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';

const Editor = () => {
  const canvasRef = useRef(null);
  const [canvas, setCanvas] = useState(null);

  useEffect(() => {
    const fabricCanvas = new fabric.Canvas(canvasRef.current, {
      width: 800,
      height: 500,
      backgroundColor: '#f3f3f3',
    });
    setCanvas(fabricCanvas);
  }, []);

  const handleSvgUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const svgContent = e.target.result;
        fabric.loadSVGFromString(svgContent, (objects, options) => {
          const group = fabric.util.groupSVGElements(objects, options);
          canvas.add(group);
          canvas.renderAll();
        });
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  };

  const addText = () => {
    const text = new fabric.IText('Warp Me!', {
      left: 100,
      top: 100,
      fontSize: 40,
      fill: 'black',
    });
    canvas.add(text);
    canvas.setActiveObject(text); // Make it active
    canvas.renderAll();
  };

  const applyArcText = () => {
    const text = canvas.getActiveObject();
    console.log(canvas); // Check if an object is selected
    if (text && text.type === "i-text") {
      text.set({
        angle: 20,
      });
      canvas.renderAll();
    }
  };

  const applyWaveText = () => {
    const text = canvas.getActiveObject();
    if (text && text.isType("i-text")) {
      let textValue = text.text;
      let waveText = textValue.split(" ").join("~");
      text.set({ text: waveText });
      canvas.renderAll();
    }
  };

  const applyPerspectiveText = () => {
    const text = canvas.getActiveObject();
    if (text && text.isType("i-text")) {
      text.set({
        skewX: 30,
      });
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    canvas.clear();
    canvas.backgroundColor = '#f3f3f3';
    canvas.renderAll();
  };

  const exportSVG = () => {
    const svgData = canvas.toSVG();
    const blob = new Blob([svgData], { type: 'image/svg+xml' });
    saveAs(blob, 'text-warp.svg');
  };

  return (
    <div>
      <h2>Text Warping Editor</h2>
      <input type="file" accept=".svg" onChange={handleSvgUpload} />
      <canvas ref={canvasRef} />
      <div className="controls space-y-2">
        <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={addText}>Add Text</button>
        <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={applyArcText}>Arc Warp</button>
        <button className="bg-yellow-500 text-white px-4 py-2 rounded" onClick={applyWaveText}>Wave Warp</button>
        <button className="bg-purple-500 text-white px-4 py-2 rounded" onClick={applyPerspectiveText}>Perspective Warp</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={clearCanvas}>Clear Canvas</button>
        <button className="bg-gray-500 text-white px-4 py-2 rounded" onClick={exportSVG}>Export SVG</button>
      </div>
    </div>
  );
};

export default Editor;