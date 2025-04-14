import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { imgArr } from '../utils/imageConstants';


export const useFabricCanvas = () => {
    const canvasRef = useRef(null);
    const canvasContainerRef = useRef(null);
    const fabricCanvasRef = useRef(null);
    const uploadedITextsRef = useRef([]);
    const initialITextsRef = useRef([]);
    const lastActiveText = useRef(null);
    const isApplyingEffect = useRef(false);
    const selectedButtonRef = useRef(null);

    const [selectedButton, setSelectedButton] = useState(null);

    const [bridgeParams, setBridgeParams] = useState({
        curve: 100,
        offsetY: 0,
        textHeight: 188,
        bottom: 188,
    });

    const [archParams, setArchParams] = useState({
        curve: 100,
        offsetY: 0,
        textHeight: 180,
        bottom: 0,
    })

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

    // Initialize Fabric.js canvas and handle resizing
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
                const currentSelected = selectedButtonRef.current;
                switch (currentSelected) {
                    case 1:
                        applyBridgeEffect(lastActiveText.current);
                        break;
                    case 4:
                        applyArchEffect(lastActiveText.current);
                        break;
                    default:
                        console.log('No effect defined for this shape.');
                        break;
                }
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
        selectedButtonRef.current = selectedButton;
        const textObj = lastActiveText.current;
        console.log("last active obj: ", textObj)
        if (!textObj) return;

        if (selectedButton === 1) {
            applyBridgeEffect(textObj);
        } else if (selectedButton === 4) {
            applyArchEffect(textObj);
        }

    }, [selectedButton]);

    const handleSvgUpload = (event) => {
        const file = event.target.files[0];
        if (!file || file.type !== 'image/svg+xml') {
            alert('Please upload a valid SVG file.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            const svgContent = e.target.result;
            const canvas = fabricCanvasRef.current;

            fabric.loadSVGFromString(svgContent, (objects) => {
                const newObjects = objects.map((obj) =>
                    obj.type === 'text'
                        ? new fabric.IText(obj.text, {
                            ...obj,
                            fontFamily: 'NBA Bobcats',
                            fill: obj.fill || 'black',
                            fontSize: obj.fontSize,
                        })
                        : obj
                );

                newObjects.forEach((obj, key) => {
                    if (obj.text) {
                        uploadedITextsRef.current.push({
                            id: key,
                            iTextId: obj.id,
                            obj,
                            texture: '',
                        });
                    }
                    canvas.add(obj);
                });
                initialITextsRef.current = uploadedITextsRef.current;
                canvas.renderAll();
            });
        };
        reader.readAsText(file);
    };


    const handleDownloadPNG = () => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const dataURL = canvas.toDataURL({ format: 'png', quality: 1.0 });
        const link = document.createElement('a');
        link.href = dataURL;
        link.download = 'canvas.png';
        link.click();
    };

    const handleImageButtonClick = (index) => {
        setSelectedButton(index);
        // Add logic for applying effects based on `imgArr[index]`
    };

    // const createTextCanvas = ({ text, fontFamily, fill, width, height }) => {
    //     const canvas = document.createElement('canvas');
    //     canvas.width = width;
    //     canvas.height = height;
    //     const ctx = canvas.getContext('2d');

    //     ctx.fillStyle = fill;
    //     ctx.textBaseline = 'top';
    //     ctx.textAlign = 'center';
    //     ctx.font = `${height}px ${fontFamily}`;

    //     const measuredWidth = ctx.measureText(text.toUpperCase()).width;
    //     ctx.clearRect(0, 0, width, height);
    //     ctx.save();
    //     ctx.scale(width / measuredWidth, 1);
    //     ctx.fillText(text.toUpperCase(), measuredWidth / 2, 0);
    //     ctx.restore();
    //     return canvas;
    // };

    // const applyWarpedTextEffect = ({
    //     textObj,
    //     params,
    //     getYOffset,
    // }) => {
    //     if (!textObj || textObj.type !== 'i-text') return;

    //     const canvas = fabricCanvasRef.current;
    //     if (!canvas) return;

    //     const {
    //         text,
    //         left,
    //         top,
    //         fill,
    //         fontSize,
    //         fontFamily,
    //         angle,
    //         scaleX = 1,
    //         scaleY = 1,
    //     } = textObj;

    //     const width = textObj.width * scaleX;
    //     const height = textObj.height * scaleY;
    //     const canvasWidth = Math.ceil(width);
    //     const textHeight = params.textHeight ?? height;
    //     const canvasHeight = Math.ceil(textHeight + (params.curve ?? 100));

    //     const tempCanvas = document.createElement('canvas');
    //     tempCanvas.width = canvasWidth;
    //     tempCanvas.height = canvasHeight;
    //     const ctx = tempCanvas.getContext('2d');

    //     // Offscreen text canvas
    //     const os = createTextCanvas({
    //         text,
    //         fontFamily,
    //         fill,
    //         width: canvasWidth,
    //         height: canvasHeight,
    //     });

    //     // Draw warped text using 1px slices
    //     for (let i = 0; i < canvasWidth; i++) {
    //         const y = getYOffset(i, canvasWidth, params);
    //         ctx.drawImage(os, i, 0, 1, textHeight, i, y, 1, textHeight);
    //     }

    //     // Convert to image and add to canvas
    //     const dataURL = tempCanvas.toDataURL();
    //     fabric.Image.fromURL(dataURL, (img) => {
    //         img.originalTextData = { text, left, top, fontSize, fontFamily, fill, angle };
    //         img.set({
    //             left,
    //             top,
    //             angle,
    //             originX: 'left',
    //             originY: 'top',
    //             selectable: true,
    //         });

    //         if (canvas.getObjects().includes(textObj)) {
    //             canvas.remove(textObj);
    //         }

    //         const iTextId = uploadedITextsRef.current.findIndex(
    //             (obj) => obj.iTextId === textObj.id
    //         );
    //         if (iTextId !== -1) {
    //             uploadedITextsRef.current[iTextId].texture = img.cacheKey;
    //         }
    //         canvas.add(img);
    //         canvas.setActiveObject(img);
    //         canvas.renderAll();
    //     });
    // };


    // const applyArchEffect = (textObj, params) => {
    //     applyWarpedTextEffect({
    //         textObj,
    //         params,
    //         getYOffset: (i, width, { curve = 100, bottom = 0, offsetY = 0 }) => {
    //             const radius = width / 2;
    //             const normalizedX = (i - radius) / radius;
    //             const curveY = curve * Math.sqrt(1 - normalizedX * normalizedX);
    //             return offsetY + (bottom - curveY);
    //         },
    //     });
    // };

    // const applyBridgeEffect = (textObj, params) => {
    //     applyWarpedTextEffect({
    //         textObj,
    //         params,
    //         getYOffset: (i, width, { curve = 100, bottom = 0, offsetY = 0 }) => {
    //             const angleSteps = 180 / width;
    //             return offsetY + (bottom - curve * Math.sin(i * angleSteps * Math.PI / 180));
    //         },
    //     });
    // };

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

    const getiTextObjectArrId = (e) => {
        let id = null
        let iTextObj = uploadedITextsRef.current.find((obj) => obj.iTextId === e.id);
        if (iTextObj) {
            id = iTextObj.id;
        }
        return id;
    }

    return {
        canvasRef,
        canvasContainerRef,
        handleSvgUpload,
        handleDownloadPNG,
        handleImageButtonClick,
        selectedButton,
        bridgeParams,
        setBridgeParams,
        bridgeParamRanges,

        archParams,
        setArchParams,
        archParamRanges,

        applyBridgeEffect,
        applyArchEffect,
        fabricCanvasRef
    };
};
