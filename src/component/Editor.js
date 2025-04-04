import React, { useEffect, useRef, useState } from 'react';
import { Canvas, Group, loadSVGFromString } from "fabric";
import { fabric } from "fabric";
import { saveAs } from 'file-saver';

const Eidtor = () => {
    const canvasRef = useRef(null);
    const [canvas, setCanvas] = useState(null);

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            width: 800,
            height: 500,
            backgroundColor: "#f3f3f3",
        });
        setCanvas(fabricCanvas);
    }, []);

    const addText = () => {
        const text = new fabric.IText("Warp Me!", {
            left: 100,
            top: 100,
            fontSize: 40,
            fill: "black",
        });
        canvas.add(text);
        canvas.setActiveObject(text); // Make it active
        canvas.renderAll();
    };

    const applyArcText = () => {
        // if (!canvas.getActiveObject()) return; // Ensure canvas exists
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

    const exportSVG = () => {
        const svgData = canvas.toSVG();
        const blob = new Blob([svgData], { type: "image/svg+xml" });
        saveAs(blob, "text-warp.svg");
    };

    return (
        <div>
            <h2>Text Warping Editor</h2>
            <canvas ref={canvasRef} />
            <div className="controls">
                <button onClick={addText}>Add Text</button>
                <button onClick={applyArcText}>Arc Warp</button>
                <button onClick={applyWaveText}>Wave Warp</button>
                <button onClick={applyPerspectiveText}>Perspective Warp</button>
                <button onClick={exportSVG}>Export SVG</button>
            </div>
        </div>
    );
};

export default Eidtor;