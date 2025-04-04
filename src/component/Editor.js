import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { saveAs } from 'file-saver';
// import '../assets/plugins/fabric.curvedText.js';
import arch from '../assets/imgs/arch.png';
import bridge from '../assets/imgs/bridge.png';
import bulge from '../assets/imgs/bulge.png';
import cone from '../assets/imgs/cone.png';
import curve from '../assets/imgs/curve.png';
import downward from '../assets/imgs/downward.png';
import normal from '../assets/imgs/normal.png';
import perspective from '../assets/imgs/perspective.png';
import pinch from '../assets/imgs/pinch.png';
import pointed from '../assets/imgs/pointed.png';
import upward from '../assets/imgs/upward.png';
import valley from '../assets/imgs/valley.png';

const imgArr = [normal, curve, arch, bridge, valley, pinch, bulge, perspective, pointed, downward, upward, cone];

const Editor = () => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const [svgCode, setSvgCode] = useState('');

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            height: 1500,
            backgroundColor: '#f3f3f3',
        });

        const resizeCanvas = () => {
            const containerWidth = canvasContainerRef.current.offsetWidth;
            fabricCanvas.setWidth(containerWidth);
            fabricCanvas.renderAll();
        };



        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        setCanvas(fabricCanvas);

        const loadFonts = async () => {
            const nbaFont = new FontFace('NBA Bobcats', 'url("/fonts/NBA Bobcats.ttf")');
            await nbaFont.load();
            document.fonts.add(nbaFont);
        };

        loadFonts();

        const loadCurvedTextPlugin = async () => {
            // Wait for fabric to be available
            if (fabric && fabric.util) {
                try {
                    const curvedTextModule = await import('../assets/plugins/fabric.curvedText.js');
                    console.log('CurvedText plugin loaded:', curvedTextModule);
                } catch (error) {
                    console.error('Error loading the fabric.curvedText.js plugin:', error);
                }
            }
        };

        // Load CurvedText plugin after fabric is initialized
        loadCurvedTextPlugin();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            fabricCanvas.dispose();
        };
    }, []);

    const handleSvgUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const svgContent = e.target.result;
                setSvgCode(svgContent);
                fabric.loadSVGFromString(svgContent, (objects, options) => {
                    const newObjects = objects.map((obj) => {
                        if (obj.type === 'text') {
                            return new fabric.IText(obj.text, {
                                ...obj,
                                fontFamily: 'NBA Bobcats',
                                fill: obj.fill || 'black',
                                left: obj.left,
                                top: obj.top,
                                fontSize: obj.fontSize,
                                angle: obj.angle,
                            });
                        }
                        return obj;
                    });
                    newObjects.forEach((obj) => {
                        canvas.add(obj);
                        console.log(obj);
                    });
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
        canvas.setActiveObject(text);
        canvas.renderAll();
    };

    const applyArcText = () => {
        const text = canvas.getActiveObject();
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

    const applyCurveEffect = () => {
        const activeObject = canvas.getActiveObject();

        if (activeObject && activeObject.type === 'i-text') {
            const { text, left, top, fill, fontSize, fontFamily, angle } = activeObject;

            const curvedText = new fabric.CurvedText(text, {
                left,
                top,
                fill,
                fontSize,
                fontFamily,
                radius: 100, // ← Adjust curve tightness here
                spacing: 10,
                reverse: false,
                flip: false,
                textAlign: 'center',
                angle,
                originX: 'center',
                originY: 'center',
            });

            canvas.remove(activeObject);
            canvas.add(curvedText);
            canvas.setActiveObject(curvedText);
            canvas.renderAll();
        } else {
            alert('Please select an editable text to curve.');
        }
    };

    const handleImageButtonClick = (index) => {
        setSelectedButton(index);

        if (imgArr[index] === curve) {
            const activeObject = canvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                applyCurveEffect(activeObject);
            } else {
                alert('Please select an editable text to apply curve effect.');
                return;
            }
        }
    };

    return (
        <div className='p-2 pt-10'>
            <div className='w-11/12 mx-auto'>
                <h2 className="text-4xl font-bold mb-10">Svg Warping Editor</h2>
                <div className="flex justify-between items-end mb-2">
                    <span>Choose Text Shape</span>
                    <input
                        type="file"
                        accept=".svg"
                        onChange={handleSvgUpload}
                        style={{ display: 'none' }}
                        id="fileInput"
                    />
                    <button
                        className="bg-black text-white px-4 py-2 rounded"
                        onClick={() => document.getElementById('fileInput').click()}
                    >
                        Upload SVG
                    </button>
                </div>
                <div className='w-full flex justify-between'>
                    <div className="w-4/12 max-w-[430px] flex justify-between flex-wrap h-[300px]">
                        {imgArr.map((imgSrc, index) => (
                            <div
                                key={index}
                                onClick={() => handleImageButtonClick(index)}
                                style={{
                                    width: '140px',
                                    height: '70px',
                                    border: `1px solid ${selectedButton === index ? 'black' : '#d1d5db'}`,
                                    cursor: 'pointer',
                                }}
                            >
                                <img
                                    src={imgSrc}
                                    alt={`Shape ${index}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                    }}
                                />
                            </div>
                        ))}
                    </div>
                    <div className='w-8/12 flex justify-end' ref={canvasContainerRef}>
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;