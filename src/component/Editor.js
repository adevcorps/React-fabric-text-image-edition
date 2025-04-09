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

const imgArr = [normal, bridge, valley, curve, arch, pinch, bulge, perspective, pointed, downward, upward, cone];

const Editor = () => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const [canvas, setCanvas] = useState(null);
    const [selectedButton, setSelectedButton] = useState(null);
    const [svgCode, setSvgCode] = useState('');

    const [bridgeParams, setBridgeParams] = useState({
        curve: 110,
        offsetY: 4,
        textHeight: 64,
        bottom: 200,
    });

    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            height: 1000,
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
            if (fabric && fabric.util) {
                try {
                    const curvedTextModule = await import('../assets/plugins/fabric.curvedText.js');
                    console.log('CurvedText plugin loaded:', curvedTextModule);
                } catch (error) {
                    console.error('Error loading the fabric.curvedText.js plugin:', error);
                }
            }
        };
        // loadCurvedTextPlugin();
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

    const applyBridgeEffect = (bridgeObject) => {
        if (!bridgeObject || bridgeObject.type !== 'i-text') return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = bridgeObject;

        const textWidth = bridgeObject.width * (scaleX || 1);
        const textHeight = bridgeObject.height * (scaleY || 1);
        const canvasWidth = Math.ceil(textWidth + 100);
        const canvasHeight = Math.ceil(textHeight * 2);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        console.log(canvasWidth, canvasHeight, tempCanvas);
        const ctx = tempCanvas.getContext('2d');

        const os = document.createElement('canvas');
        os.width = textWidth;
        os.height = textHeight;
        const octx = os.getContext('2d');
        octx.font = `${fontSize}px "${fontFamily}"`;
        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.clearRect(0, 0, 400, 300);
        octx.fillText(text.toUpperCase(), canvasWidth / 2, 0);
        
        const { curve, offsetY, textHeight: sliceTextHeight, bottom } = bridgeParams;
        const w = canvasWidth;
        const h = canvasHeight;
        const angleSteps = 180 / w;

        let dltY = curve / sliceTextHeight;
        let y = 0;
        let i = w; // important: we start from right edge and go left
        const sliceWidth = 1;

        while (i--) {
            y = bottom - curve * Math.sin(i * angleSteps * Math.PI / 180);
            ctx.drawImage(
                os,
                i, 0, sliceWidth, sliceTextHeight, // source
                i, h / 2 - (offsetY / sliceTextHeight) * y, sliceWidth, y // destination
            );
        }
        const expectedHeight = curve + sliceTextHeight;

        const dataURL = tempCanvas.toDataURL();
        console.log(tempCanvas);

        fabric.Image.fromURL(dataURL, (img) => {
            img.set({
                left,
                top,
                angle,
                originX: 'left',
                originY: 'top',
                selectable: true,
                scaleX: textWidth / canvasWidth,
                scaleY: textHeight / canvasHeight,
            });

            canvas.remove(bridgeObject);
            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        });
    };



    const handleImageButtonClick = (index) => {
        const activeObject = canvas.getActiveObject();
        setSelectedButton(index);
        switch (imgArr[index]) {
            case bridge:
                if (activeObject && activeObject.type === 'i-text') {
                    applyBridgeEffect(activeObject);
                } else {
                    alert('Please select an editable text to apply curve effect.');
                    return;
                }
                break;
            case valley:
                break;
            case curve:
                if (activeObject && activeObject.type === 'i-text') {
                    applyCurveEffect(activeObject);
                } else {
                    alert('Please select an editable text to apply curve effect.');
                    return;
                }
                break;
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
                    <div className="w-4/12 max-w-[430px]">
                        <div className="w-full flex justify-between flex-wrap h-[300px]">
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
                        <div>
                            <div className="mb-4 p-4 bg-white border rounded shadow-md max-w-md">
                                <h3 className="text-lg font-bold mb-2">Bridge Text Controls</h3>
                                <div className="space-y-2">
                                    {['curve', 'offsetY', 'textHeight', 'bottom'].map((key) => (
                                        <div key={key} className="flex items-center justify-between gap-4">
                                            <label className="w-1/3 capitalize">{key}:</label>
                                            <input
                                                type="range"
                                                min="0"
                                                max={key === 'offsetY' ? 100 : 300}
                                                value={bridgeParams[key]}
                                                onChange={(e) =>
                                                    setBridgeParams({ ...bridgeParams, [key]: parseInt(e.target.value, 10) })
                                                }
                                                className="w-full"
                                            />
                                            <span className="w-12 text-right">{bridgeParams[key]}</span>
                                        </div>
                                    ))}
                                    <button
                                        className="bg-black text-white px-4 py-2 rounded mt-2"
                                        onClick={() => {
                                            const activeObject = canvas.getActiveObject();
                                            if (activeObject && activeObject.type === 'i-text') {
                                                applyBridgeEffect(activeObject);
                                            } else {
                                                alert('Select a text object first.');
                                            }
                                        }}
                                    >
                                        Apply Bridge Effect
                                    </button>
                                </div>
                            </div>
                        </div>
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