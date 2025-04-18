
import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
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
    const fabricCanvasRef = useRef(null);
    const uploadedITextsRef = useRef([]);
    const lastActiveText = useRef(null);
    const isApplyingEffect = useRef(false);
    const [selectedButton, setSelectedButton] = useState(null);
    const [bridgeParams, setBridgeParams] = useState({
        curve: 100,
        offsetY: 0,
        textHeight: 188,
        bottom: 188,
    });
    const [archParams, setArchParams] = useState({
        curve: 50,
        offsetY: 0,
        textHeight: 188,
        bottom: 0,
    });

    const [bridgeParamRanges] = useState({
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    });

    const [archParamRanges] = useState({
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    });


    useEffect(() => {
        const fabricCanvas = new fabric.Canvas(canvasRef.current, {
            height: 1000,
            backgroundColor: '#f3f3f3',
        });
        fabricCanvasRef.current = fabricCanvas;
        const resizeCanvas = () => {
            const containerWidth = canvasContainerRef.current.offsetWidth;
            fabricCanvas.setWidth(containerWidth);
            fabricCanvas.renderAll();
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        const handleSelectionCleared = () => {
            if (isApplyingEffect.current) return;
            const activeObject = fabricCanvas.getActiveObject();
            if (lastActiveText.current) {
                isApplyingEffect.current = true;

                console.log("handleSelectionCleared")
                applyBridgeEffect(lastActiveText.current);
                isApplyingEffect.current = false;
            }
        };
        fabricCanvas.on('selection:cleared', handleSelectionCleared);
        fabricCanvas.on('text:changed', () => {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject && activeObject.type === 'i-text') {
                lastActiveText.current = activeObject;
            }
        });

        fabricCanvas.on('mouse:dblclick', (e) => {
            const target = e.target;
            if (target && target.type === 'image') {
                let iTextObj = uploadedITextsRef.current.find((obj) => obj.texture === target.cacheKey);
                if (iTextObj) {
                    let selectedObjId = iTextObj.id;
                    fabricCanvas.add(iTextObj.obj);
                    fabricCanvas.setActiveObject(iTextObj.obj);
                    iTextObj.obj.enterEditing();
                    lastActiveText.current = iTextObj.obj.text;
                    fabricCanvas.remove(target);
                    fabricCanvas.discardActiveObject();
                    fabricCanvas.renderAll();
                    fabricCanvas.renderAll();
                }
            }
        });

        fabricCanvas.on('object:moving', () => {
            const activeObject = fabricCanvas.getActiveObject();
            if (activeObject.cacheKey) {
                let iTextObj = uploadedITextsRef.current.find((obj) => obj.texture === activeObject.cacheKey);
                if (iTextObj !== null) {
                    let tmpITextObj = iTextObj.obj;
                    console.log(tmpITextObj)
                    tmpITextObj.left = activeObject.left;
                    tmpITextObj.top = activeObject.top;
                    tmpITextObj.height = activeObject.height;
                    tmpITextObj.width = activeObject.width;

                    uploadedITextsRef.current[iTextObj.id] = {
                        ...uploadedITextsRef.current[iTextObj.id],
                        obj: tmpITextObj
                    };
                }
            }
        })

        return () => {
            fabricCanvas.off('selection:cleared', handleSelectionCleared);
            window.removeEventListener('resize', resizeCanvas);
            fabricCanvas.dispose();
        };
    }, []);

    useEffect(() => {
        handleResize();
    }, [bridgeParams]);

    const handleSvgUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type === 'image/svg+xml') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const svgContent = e.target.result;
                const canvas = fabricCanvasRef.current;
                fabric.loadSVGFromString(svgContent, (objects, options) => {
                    const newObjects = objects.map((obj) => {
                        if (obj.type === 'text') {
                            return new fabric.IText(obj.text, {
                                ...obj,
                                fontFamily: 'NBA Bobcats',
                                fill: obj.fill || 'black',
                                fontSize: obj.fontSize,
                            });
                        }
                        return obj;
                    });
                    newObjects.forEach((obj, key) => {
                        if (obj.text) {
                            uploadedITextsRef.current.push({ id: key, iTextId: obj.id, obj: obj, texture: "" });
                        }
                        canvas.add(obj);
                    });
                    canvas.renderAll();
                });
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid SVG file.');
        }
    };

    const handleResize = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);
        if (activeObject && activeObject.cacheKey) {
            let iTextObj = uploadedITextsRef.current.find((obj) => obj.texture === activeObject.cacheKey);
            console.log("handleResize");
            applyBridgeEffect(iTextObj.obj)
            canvas.remove(activeObject)
        }
    }

    const applyBridgeEffect = (bridgeObject) => {
        if (!bridgeObject || bridgeObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = bridgeObject;
        const w = bridgeObject.width * (scaleX || 1);
        const h = bridgeObject.height * (scaleY || 1);
        const canvasWidth = Math.ceil(w);
        const canvasHeight = Math.ceil(h);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const ctx = tempCanvas.getContext('2d');
        const angleSteps = 180 / w;

        let os = document.createElement('canvas');
        let octx = os.getContext('2d');
        os.width = w;
        os.height = h;
        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';

        const font = h + 'px NBA Bobcats';
        octx.font = font;
        const cText = text.toUpperCase();
        octx.clearRect(0, 0, w, h);
        octx.save();
        const measuredWidth = octx.measureText(cText).width;
        octx.scale(canvasWidth / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);
        octx.restore();

        for (let i = Math.floor(w); i--;) {
            let y = bridgeParams.bottom - bridgeParams.curve * Math.sin(i * angleSteps * Math.PI / 180);
            ctx.drawImage(os, i, 0, 1, bridgeParams.textHeight, i, bridgeParams.offsetY, 1, y);
        }

        const dataURL = tempCanvas.toDataURL();

        fabric.Image.fromURL(dataURL, (img) => {
            img.originalTextData = {
                text,
                left,
                top,
                fontSize,
                fontFamily,
                fill,
                angle
            };

            img.set({
                left,
                top,
                angle,
                originX: 'left',
                originY: 'top',
                selectable: true,
            });
            canvas.remove(bridgeObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(bridgeObject);
            if (iTextId !== -1) {
                uploadedITextsRef.current[iTextId] = {
                    ...uploadedITextsRef.current[iTextId],
                    texture: img.cacheKey
                };
            }

            console.log(img);
            console.log(uploadedITextsRef.current[iTextId]);

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        });

    };

    // const applyArchEffect = (archObject) => {
    //     if (!archObject || archObject.type !== 'i-text') return;
    //     const canvas = fabricCanvasRef.current;
    //     if (!canvas) return;

    //     const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = archObject;
    //     const w = archObject.width * (scaleX || 1);
    //     const h = archObject.height * (scaleY || 1);
    //     const canvasWidth = Math.ceil(w);
    //     const canvasHeight = Math.ceil(h);

    //     const tempCanvas = document.createElement('canvas');
    //     tempCanvas.width = canvasWidth;
    //     tempCanvas.height = canvasHeight;
    //     const ctx = tempCanvas.getContext('2d');
    //     const angleSteps = 180 / w;

    //     let os = document.createElement('canvas');
    //     let octx = os.getContext('2d');
    //     os.width = w;
    //     os.height = h;
    //     octx.fillStyle = fill;
    //     octx.textBaseline = 'top';
    //     octx.textAlign = 'center';

    //     const font = h + 'px NBA Bobcats';
    //     octx.font = font;
    //     const cText = text.toUpperCase();
    //     octx.clearRect(0, 0, w, h);
    //     octx.save();
    //     const measuredWidth = octx.measureText(cText).width;
    //     octx.scale(canvasWidth / measuredWidth, 1);
    //     octx.fillText(cText, measuredWidth / 2, 0);
    //     octx.restore();

    //     const defaultCurve = h / 2;         // Half the height — gentle arch
    //     const defaultBottom = h / 2;        // Baseline at vertical center
    //     const defaultOffsetY = 0;           // Adjust if needed, but start from 0
    //     const defaultTextHeight = h;        // Preserve full vertical space

    //     const computedArchParams = {
    //         curve: archParams.curve ?? defaultCurve,
    //         bottom: archParams.bottom ?? defaultBottom,
    //         offsetY: archParams.offsetY ?? defaultOffsetY,
    //         textHeight: archParams.textHeight ?? defaultTextHeight,
    //     };

    //     const { curve, bottom, offsetY, textHeight } = computedArchParams;

    //     const radius = w / 2;
    //     for (let i = Math.floor(w); i--;) {
    //         const normalizedX = (i - w / 2) / radius;
    //         const curveY = curve * Math.sqrt(1 - normalizedX * normalizedX);
    //         const y = offsetY + (bottom - curveY);

    //         ctx.drawImage(os, i, 0, 1, textHeight, i, y, 1, textHeight);
    //     }



    //     const dataURL = tempCanvas.toDataURL();

    //     fabric.Image.fromURL(dataURL, (img) => {
    //         img.originalTextData = {
    //             text,
    //             left,
    //             top,
    //             fontSize,
    //             fontFamily,
    //             fill,
    //             angle
    //         };

    //         img.set({
    //             left,
    //             top,
    //             angle,
    //             originX: 'left',
    //             originY: 'top',
    //             selectable: true,
    //         });
    //         canvas.remove(archObject);
    //         // const objects = canvas.getObjects();
    //         // objects.forEach(obj => {
    //         //     if (obj.originalTextData?.text === text) {
    //         //         canvas.remove(obj);
    //         //     }
    //         // });
    //         if (canvas.getObjects().includes(archObject)) {
    //             canvas.remove(archObject);
    //         }
    //         let iTextId = getiTextObjectArrId(archObject);
    //         if (iTextId !== -1) {
    //             uploadedITextsRef.current[iTextId] = {
    //                 ...uploadedITextsRef.current[iTextId],
    //                 texture: img.cacheKey
    //             };
    //         }

    //         console.log(img);
    //         console.log(uploadedITextsRef.current[iTextId]);

    //         canvas.add(img);
    //         canvas.setActiveObject(img);
    //         canvas.renderAll();
    //     });
    // }
    const applyArchEffect = (archObject) => {
        if (!archObject || archObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX = 1, scaleY = 1 } = archObject;

        // Original width and height of the text
        const originalWidth = archObject.width * scaleX;
        const originalHeight = archObject.height * scaleY;

        // === Curve Logic ===
        const curve = archParams.curve ?? 100; // You can tweak this default
        const offsetY = curve;                // Push image down by curve amount
        const textHeight = archParams.textHeight ?? originalHeight;
        const bottom = archParams.bottom ?? (originalHeight + curve) / 2;

        // === Final canvas size to avoid cropping ===
        const canvasWidth = Math.ceil(originalWidth);
        const canvasHeight = Math.ceil(textHeight + curve); // Extra height for the curve peak

        // === Create temp canvas ===
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const ctx = tempCanvas.getContext('2d');
        const angleSteps = 180 / canvasWidth;

        // === Create offscreen canvas (original text) ===
        const os = document.createElement('canvas');
        os.width = canvasWidth;
        os.height = canvasHeight;
        const octx = os.getContext('2d');
        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';

        const font = `${textHeight}px ${fontFamily}`;
        octx.font = font;
        const cText = text.toUpperCase();
        octx.clearRect(0, 0, canvasWidth, canvasHeight);
        octx.save();
        const measuredWidth = octx.measureText(cText).width;
        octx.scale(canvasWidth / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);
        octx.restore();

        // === Apply arch effect ===
        const radius = canvasWidth / 2;
        for (let i = 0; i < canvasWidth; i++) {
            const normalizedX = (i - radius) / radius; // [-1, 1]
            const curveY = curve * Math.sqrt(1 - normalizedX * normalizedX); // Arch profile
            const y = offsetY + (bottom - curveY); // Adjusted Y drawing

            ctx.drawImage(os, i, 0, 1, textHeight, i, y, 1, textHeight);
        }

        // === Create Image from temp canvas ===
        const dataURL = tempCanvas.toDataURL();
        fabric.Image.fromURL(dataURL, (img) => {
            img.originalTextData = { text, left, top, fontSize, fontFamily, fill, angle };

            img.set({
                left,
                top,
                angle,
                originX: 'left',
                originY: 'top',
                selectable: true,
            });

            if (canvas.getObjects().includes(archObject)) {
                canvas.remove(archObject);
            }

            let iTextId = getiTextObjectArrId(archObject);
            if (iTextId !== -1) {
                uploadedITextsRef.current[iTextId] = {
                    ...uploadedITextsRef.current[iTextId],
                    texture: img.cacheKey
                };
            }

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        });
    };
    const getiTextObjectArrId = (e) => {
        let id = null
        let iTextObj = uploadedITextsRef.current.find((obj) => obj.iTextId === e.id);
        if (iTextObj) {
            id = iTextObj.id;
        }
        return id;
    }

    const handleImageButtonClick = (index) => {
        const canvas = fabricCanvasRef.current;
        const activeObject = canvas.getActiveObject();
        setSelectedButton(index);
        if (!activeObject || activeObject.type !== 'i-text') return;
        switch (imgArr[index]) {
            case bridge:
                applyBridgeEffect(activeObject);
                break;
            case arch:
                applyArchEffect(activeObject);
                break;
            default:
                break;
        }
    };

    const handleDownloadPNG = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const objects = canvas.getObjects();
        if (objects.length === 0) return;

        const group = new fabric.Group(objects, { originX: 'left', originY: 'top' });
        const { left, top, width, height } = group.getBoundingRect();
        const tempCanvas = new fabric.StaticCanvas(null, {
            width: width,
            height: height,
        });
        objects.forEach(obj => {
            const cloned = fabric.util.object.clone(obj);
            cloned.left = obj.left - left;
            cloned.top = obj.top - top;
            tempCanvas.add(cloned);
        });

        tempCanvas.renderAll();
        const dataURL = tempCanvas.toDataURL({
            format: 'png',
            quality: 1.0,
        });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'cropped-canvas.png';
        link.click();
    };


    return (
        <div className='p-2 pt-10'>
            <div className='w-11/12 mx-auto'>
                <h2 className="text-4xl font-bold mb-10">Svg Warping Editor</h2>
                <div className="flex justify-between items-end mb-2">
                    <span>Choose Text Shape</span>
                    <input type="file" accept=".svg" onChange={handleSvgUpload} style={{ display: 'none' }} id="fileInput" />
                    <div>
                        <button className="bg-black border border-black text-white px-4 py-2 mx-4 rounded" onClick={() => document.getElementById('fileInput').click()}>
                            Upload SVG
                        </button>
                        <a className="text-black underline cursor-pointer px-4 py-2" onClick={() => handleDownloadPNG()}>
                            Download as PNG
                        </a>
                    </div>
                </div>
                <div className='w-full flex justify-between'>
                    <div className="w-4/12 max-w-[430px]">
                        <div className="w-full flex justify-between flex-wrap h-[300px]">
                            {imgArr.map((imgSrc, index) => (
                                <div
                                    key={index}
                                    onClick={() => handleImageButtonClick(index)}
                                    style={{ width: '140px', height: '70px', border: `1px solid ${selectedButton === index ? 'black' : '#d1d5db'}`, cursor: 'pointer' }}
                                >
                                    <img src={imgSrc} alt={`Shape ${index}`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            ))}
                        </div>
                        <div className="mb-4 p-4 bg-white border rounded shadow-md max-w-md">
                            <h3 className="text-lg font-bold mb-2">Bridge Text Controls</h3>
                            <div className="space-y-4">
                                {Object.keys(bridgeParams).map((param) => (
                                    <div key={param}>
                                        <label className="block mb-1 text-sm font-medium" htmlFor={param}>
                                            {param}: {bridgeParams[param]}&nbsp;
                                            <span className="text-xs text-gray-500">
                                                (min: {bridgeParamRanges[param].min}, max: {bridgeParamRanges[param].max})
                                            </span>
                                        </label>
                                        <input
                                            type="range"
                                            id={param}
                                            value={bridgeParams[param]}
                                            onChange={(e) =>
                                                setBridgeParams({
                                                    ...bridgeParams,
                                                    [param]: parseInt(e.target.value, 10),
                                                })
                                            }
                                            className="w-full"
                                            min={bridgeParamRanges[param].min}
                                            max={bridgeParamRanges[param].max}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div ref={canvasContainerRef} className="w-8/12">
                        <canvas ref={canvasRef} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Editor;
