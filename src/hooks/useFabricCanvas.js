import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { arch, imgArr } from '../utils/imageConstants';


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

    const [bridgeParamRanges] = useState({
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    });

    const [archParams, setArchParams] = useState({
        curve: 50,
        offsetY: 0,
        textHeight: 180,
        bottom: 0,
    })

    const [archParamRanges] = useState({
        curve: { min: 0, max: 200 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    });

    const [valleyParams, setValleyParams] = useState({
        curve: 100,
        offsetY: 0,
        textHeight: 180,
        bottom: 0,
    })

    const [valleyParamRanges] = useState({
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    });

    const [curveParams, setCurveParams] = useState({
        curve: 40,
        offsetY: 100,
        textHeight: 180,
        bottom: 0
    });

    const curveParamRanges = {
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    };

    const [pinchParams, setPinchParams] = useState({
        curve: 60,
        offsetY: 5,
        textHeight: 180,
        bottom: 180,
    });

    const pinchParamRanges = {
        curve: { min: -200, max: 200 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 0, max: 400 },
        bottom: { min: 0, max: 400 },
    };

    const [bulgeParams, setBulgeParams] = useState({
        curve: 80,
        offsetY: 0,
        textHeight: 180,
        bottom: 180,
    });

    const bulgeParamRanges = {
        curve: { min: 0, max: 300 },
        offsetY: { min: 0, max: 200 },
        textHeight: { min: 50, max: 400 },
        bottom: { min: 0, max: 400 },
    };

    const [perspectiveParams, setPerspectiveParams] = useState({
        scaleStart: 1.5,
        scaleEnd: 0.5,
        offsetY: 20,
        textHeight: 200
    });

    const perspectiveParamRanges = {
        scaleStart: { min: 0.1, max: 3 },
        scaleEnd: { min: 0.1, max: 3 },
        offsetY: { min: -200, max: 200 },
        textHeight: { min: 50, max: 400 },
    };

    const [pointedParams, setPointedParams] = useState({
        maxHeight: 200,
        textHeight: 180,
        offsetY: 20,
    });

    const pointedParamRanges = {
        maxHeight: { min: 0, max: 300 },
        textHeight: { min: 50, max: 400 },
        offsetY: { min: 0, max: 100 },
    };

    const [downwardParams, setDownwardParams] = useState({
        maxHeight: 80,
        textHeight: 180,
        offsetY: 50,
    });

    const downwardParamRanges = {
        maxHeight: { min: 0, max: 300 },
        textHeight: { min: 50, max: 400 },
        offsetY: { min: 0, max: 100 },
    };

    const [upwardParams, setUpwardParams] = useState({
        maxHeight: 80,
        textHeight: 180,
        offsetY: 50,
    });

    const upwardParamRanges = {
        maxHeight: { min: 0, max: 300 },
        textHeight: { min: 50, max: 400 },
        offsetY: { min: 0, max: 100 },
    };

    const [coneParams, setConeParams] = useState({
        maxHeight: 200,
        textHeight: 180,
        offsetY: 20,
    });

    const coneParamRanges = {
        maxHeight: { min: 0, max: 300 },
        textHeight: { min: 50, max: 400 },
        offsetY: { min: 0, max: 100 },
    };


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

    useEffect(() => {
        handleResize("arch");
    }, [archParams])

    useEffect(() => {
        handleResize("bridge");
    }, [bridgeParams])


    const handleResize = (flag) => {
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;
        const activeObject = canvas.getActiveObject();
        console.log(activeObject);
        if (activeObject && activeObject.cacheKey) {
            let iTextObj = uploadedITextsRef.current.find((obj) => obj.texture === activeObject.cacheKey);
            console.log("handleResize");
            if(flag == "arch")
            {
                applyArchEffect(iTextObj.obj, activeObject)
                canvas.remove(activeObject)
            }
            // else if(flag == "bridge"){
            else{
                applyBridgeEffect(iTextObj.obj, activeObject)
                canvas.remove(activeObject)
            }
        }
    }
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

    const applyArchEffect = (archObject, selectedObject = null) => {
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
            if(selectedObject){
                console.log("object isn't null");
                canvas.remove(selectedObject);
            }

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

    const applyValleyEffect = (valleyObject, valleyParams) => {
        if (!valleyObject || valleyObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const {
            text,
            left,
            top,
            fill,
            fontSize,
            fontFamily,
            angle,
            scaleX = 1,
            scaleY = 1,
        } = valleyObject;

        const w = valleyObject.width * scaleX;
        const h = valleyObject.height * scaleY;

        const canvasWidth = Math.ceil(w);
        const canvasHeight = Math.ceil(valleyParams.textHeight + valleyParams.curve);

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const ctx = tempCanvas.getContext('2d');

        const os = document.createElement('canvas');
        os.width = canvasWidth;
        os.height = canvasHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';

        const font = `${valleyParams.textHeight}px ${fontFamily || 'NBA Bobcats'}`;
        octx.font = font;
        const cText = text.toUpperCase();

        octx.clearRect(0, 0, canvasWidth, canvasHeight);
        octx.save();
        const measuredWidth = octx.measureText(cText).width;
        octx.scale(canvasWidth / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);
        octx.restore();

        const radius = (canvasWidth - 20) / 2;

        for (let i = 0; i < canvasWidth; i++) {
            const normalizedX = ((i - radius) / radius);
            const clampedX = Math.max(-1, Math.min(1, normalizedX)); // clamp to avoid NaN
            const curveY = valleyParams.curve * Math.sqrt(1 - clampedX * clampedX);

            ctx.drawImage(
                os,
                i, 0, 1, valleyParams.textHeight,
                i, valleyParams.offsetY + curveY,
                1, valleyParams.textHeight - curveY
            );
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

            if (canvas.getObjects().includes(valleyObject)) {
                canvas.remove(valleyObject);
            }

            const iTextId = uploadedITextsRef.current.findIndex(obj => obj.iTextId === valleyObject.id);
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

    const applyCurveEffect = (textObject, curveParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const {
            text,
            left,
            top,
            fill,
            fontSize,
            fontFamily,
            angle,
            scaleX = 1,
            scaleY = 1,
        } = textObject;

        const {
            radius = textObject.width * scaleX,           // Bigger radius = smoother arc
            offsetY = 0,
            spacing = 0.85,         // Tighten spacing
            arcAngle = 60           // Spread text along this many degrees (in total)
        } = curveParams;

        const chars = text.split('');
        console.log(textObject.width * scaleX);
        const charCount = chars.length;
        const actualFontSize = textObject.height * scaleY;
        const arcRads = (arcAngle * Math.PI) / 180; // total arc in radians
        const angleStep = arcRads / (charCount - 1);

        const canvasSize = radius + actualFontSize;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasSize;
        tempCanvas.height = canvasSize;
        const ctx = tempCanvas.getContext('2d');

        ctx.imageSmoothingEnabled = true;
        ctx.translate(canvasSize / 2, radius + offsetY);

        let startAngle = -arcRads / 2;

        for (let i = 0; i < charCount; i++) {
            const char = chars[i];
            const angle = startAngle + i * angleStep;
            const x = radius * Math.sin(angle);
            const y = -radius * Math.cos(angle);

            ctx.save();
            ctx.translate(x, y);
            ctx.rotate(angle);
            ctx.font = `${actualFontSize}px ${fontFamily}`;
            ctx.fillStyle = fill;
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(char, 0, 0);
            ctx.restore();
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
                angle,
            };

            img.set({
                left,
                top,
                angle,
                originX: 'left',
                originY: 'top',
                selectable: true,
            });

            canvas.remove(textObject);

            const iTextId = getiTextObjectArrId(textObject);
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

    const applyPinchEffect = (textObject, pinchParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const {
            text,
            left,
            top,
            fill,
            fontSize,
            fontFamily,
            angle,
            scaleX = 1,
            scaleY = 1,
        } = textObject;

        const {
            amount = 0.5,       // How intense the pinch is (0 to 1)
            textHeight = 100,   // Base text height (affects scale)
            offsetY = 0,        // Vertical shift
        } = pinchParams;

        const w = textObject.width * scaleX;
        const h = textObject.height * scaleY;
        const canvasWidth = Math.ceil(w);
        const canvasHeight = Math.ceil(h);

        // Draw text onto an offscreen canvas
        const os = document.createElement('canvas');
        os.width = canvasWidth;
        os.height = canvasHeight;
        const octx = os.getContext('2d');
        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;
        octx.clearRect(0, 0, canvasWidth, canvasHeight);
        octx.save();

        const measuredWidth = octx.measureText(text.toUpperCase()).width;
        octx.scale(canvasWidth / measuredWidth, 1);
        octx.fillText(text.toUpperCase(), measuredWidth / 2, 0);
        octx.restore();

        // Now distort it
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvasWidth;
        tempCanvas.height = canvasHeight;
        const ctx = tempCanvas.getContext('2d');

        const mid = canvasWidth / 2;

        for (let i = 0; i < canvasWidth; i++) {
            const distFromCenter = Math.abs(i - mid) / mid;
            const scale = 1 - amount * (1 - distFromCenter ** 2); // quadratic falloff
            const scaledHeight = textHeight * scale;
            const y = offsetY + (canvasHeight - scaledHeight) / 2;

            ctx.drawImage(os, i, 0, 1, textHeight, i, y, 1, scaledHeight);
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
                angle,
            };

            img.set({
                left,
                top,
                angle,
                originX: 'left',
                originY: 'top',
                selectable: true,
            });

            canvas.remove(textObject);

            const iTextId = getiTextObjectArrId(textObject);
            if (iTextId !== -1) {
                uploadedITextsRef.current[iTextId] = {
                    ...uploadedITextsRef.current[iTextId],
                    texture: img.cacheKey,
                };
            }

            canvas.add(img);
            canvas.setActiveObject(img);
            canvas.renderAll();
        });
    };

    const applyBulgeEffect = (textObject, bulgeParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);

        const { intensity = 0.5, textHeight = h, offsetY = 0 } = bulgeParams;

        const centerX = w / 2;

        // Measure max vertical scale for canvas height
        let maxScaleY = 0;
        for (let i = 0; i < w; i++) {
            const dx = (i - centerX) / centerX;
            const scaleY = 1 + intensity * (1 - dx * dx);
            if (scaleY > maxScaleY) maxScaleY = scaleY;
        }

        const paddedHeight = Math.ceil(textHeight * maxScaleY) + Math.abs(offsetY) + 20; // add buffer
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = Math.ceil(w);
        tempCanvas.height = paddedHeight;
        const ctx = tempCanvas.getContext('2d');

        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');
        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h * 0.7}px ${fontFamily}`;
        const cText = text.toUpperCase();
        const measuredWidth = octx.measureText(cText).width;
        octx.scale(w / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);

        for (let i = 0; i < w; i++) {
            const dx = (i - centerX) / centerX;
            const scaleY = 1 + intensity * (1 - dx * dx);
            const sliceY = (paddedHeight - textHeight * scaleY) / 2 + offsetY;

            ctx.drawImage(os, i, 0, 1, textHeight, i, sliceY, 1, textHeight * scaleY);
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

    const applyPerspectiveEffect = (textObject, perspectiveParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);

        const {
            maxScaleY = 1.6,  // max vertical stretch at center
            minScaleY = 0.6,  // min vertical stretch at edges
            textHeight = h,
            offsetY = 20,
        } = perspectiveParams;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = textHeight * maxScaleY + offsetY * 2;

        const ctx = tempCanvas.getContext('2d');

        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;

        const cText = text.toUpperCase();
        const measuredWidth = octx.measureText(cText).width;
        octx.clearRect(0, 0, w, textHeight);
        octx.save();
        octx.scale(w / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);
        octx.restore();

        const centerX = w / 2;

        for (let x = 0; x < w; x++) {
            const dx = Math.abs(x - centerX);
            const t = dx / centerX; // 0 at center, 1 at edges
            const scaleY = maxScaleY - (maxScaleY - minScaleY) * t;
            const drawHeight = textHeight * scaleY;
            const dy = (tempCanvas.height - drawHeight) / 2;

            ctx.drawImage(
                os,
                x, 0, 1, textHeight,
                x, dy, 1, drawHeight
            );
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

    const applyPointedEffect = (textObject, pointedParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);
        const { maxHeight, textHeight, offsetY } = pointedParams;

        const canvasHeight = textHeight + maxHeight + (offsetY * 2);

        // Create temp canvas
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = canvasHeight;
        const ctx = tempCanvas.getContext('2d');

        // Offscreen text canvas
        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;

        const upperText = text.toUpperCase();
        const measuredWidth = octx.measureText(upperText).width;

        octx.save();
        octx.scale(w / measuredWidth, 1);
        octx.clearRect(0, 0, w, textHeight);
        octx.fillText(upperText, measuredWidth / 2, 0);
        octx.restore();

        const centerX = w / 2;

        for (let x = 0; x < w; x++) {
            const dx = Math.abs(x - centerX);
            const ratio = dx / centerX; // 0 at center, 1 at edges
            const verticalScale = 1 + ((maxHeight / textHeight) * (1 - ratio));

            const sliceHeight = textHeight;
            const scaledHeight = sliceHeight * verticalScale;
            const offsetYAdjusted = offsetY + (maxHeight - (scaledHeight - textHeight));

            ctx.drawImage(os, x, 0, 1, sliceHeight, x, offsetYAdjusted, 1, scaledHeight);
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

    const applyDownwardEffect = (textObject, upwardParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);
        const { maxHeight, textHeight, offsetY } = upwardParams;

        const totalHeight = offsetY + textHeight + maxHeight;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = totalHeight;
        const ctx = tempCanvas.getContext('2d');

        // Create offscreen canvas for original text
        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;

        const upperText = text.toUpperCase();
        const measuredWidth = octx.measureText(upperText).width;

        octx.save();
        octx.scale(w / measuredWidth, 1);
        octx.clearRect(0, 0, w, textHeight);
        octx.fillText(upperText, measuredWidth / 2, 0);
        octx.restore();

        for (let x = 0; x < w; x++) {
            const ratio = x / w;
            const stretch = ratio * maxHeight;
            const finalHeight = textHeight + stretch;

            // Shift the text upward by the added stretch, so top edge stays flat
            const destY = offsetY - stretch;

            ctx.drawImage(os, x, 0, 1, textHeight, x, offsetY, 1, finalHeight);
            console.log(os, x, 0, 1, textHeight, x, 0, 1, finalHeight);
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

    const applyUpwardEffect = (textObject, upwardParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);
        const { maxHeight, textHeight, offsetY } = upwardParams;

        const totalHeight = offsetY + textHeight + maxHeight;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = totalHeight;
        const ctx = tempCanvas.getContext('2d');

        // Create offscreen canvas for original text
        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;

        const upperText = text.toUpperCase();
        const measuredWidth = octx.measureText(upperText).width;

        octx.save();
        octx.scale(w / measuredWidth, 1);
        octx.clearRect(0, 0, w, textHeight);
        octx.fillText(upperText, measuredWidth / 2, 0);
        octx.restore();

        for (let x = 0; x < w; x++) {
            const ratio = x / w;
            const stretch = ratio * maxHeight;
            const finalHeight = textHeight + stretch;

            // Shift the text upward by the added stretch, so top edge stays flat
            const destY = offsetY - stretch;

            ctx.drawImage(os, x, 0, 1, textHeight, x, destY, 1, finalHeight);
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

    const applyConeEffect = (textObject, coneParams) => {
        if (!textObject || textObject.type !== 'i-text') return;
        const canvas = fabricCanvasRef.current;
        if (!canvas) return;

        const { text, left, top, fill, fontSize, fontFamily, angle, scaleX, scaleY } = textObject;
        const w = textObject.width * (scaleX || 1);
        const h = textObject.height * (scaleY || 1);

        const {
            maxScaleY = 1.6,  // max vertical stretch at center
            minScaleY = 0.6,  // min vertical stretch at edges
            textHeight = h,
            offsetY = 20,
        } = coneParams;

        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = w;
        tempCanvas.height = textHeight * maxScaleY + offsetY * 2;

        const ctx = tempCanvas.getContext('2d');

        const os = document.createElement('canvas');
        os.width = w;
        os.height = textHeight;
        const octx = os.getContext('2d');

        octx.fillStyle = fill;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = `${h}px ${fontFamily}`;

        const cText = text.toUpperCase();
        const measuredWidth = octx.measureText(cText).width;
        octx.clearRect(0, 0, w, textHeight);
        octx.save();
        octx.scale(w / measuredWidth, 1);
        octx.fillText(cText, measuredWidth / 2, 0);
        octx.restore();

        const centerX = w;

        for (let x = 0; x < w; x++) {
            const dx = Math.abs(x - centerX);
            const t = dx / centerX; // 0 at center, 1 at edges
            const scaleY = maxScaleY - (maxScaleY - minScaleY) * t;
            const drawHeight = textHeight * scaleY;
            const dy = (tempCanvas.height - drawHeight) / 2;

            ctx.drawImage(
                os,
                x, 0, 1, textHeight,
                x, dy, 1, drawHeight
            );
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

            canvas.remove(textObject);
            const objects = canvas.getObjects();
            objects.forEach(obj => {
                if (obj.originalTextData?.text === text) {
                    canvas.remove(obj);
                }
            });

            let iTextId = getiTextObjectArrId(textObject);
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

        valleyParams,
        setValleyParams,
        valleyParamRanges,

        curveParams,
        setCurveParams,
        curveParamRanges,

        pinchParams,
        setPinchParams,
        pinchParamRanges,

        bulgeParams,
        setBulgeParams,
        bulgeParamRanges,

        perspectiveParams,
        setPerspectiveParams,
        perspectiveParamRanges,

        pointedParams,
        setPointedParams,
        pointedParamRanges,

        downwardParams,
        setDownwardParams,
        downwardParamRanges,


        upwardParams,
        setUpwardParams,
        upwardParamRanges,

        coneParams,
        setConeParams,
        coneParamRanges,

        applyBridgeEffect,
        applyArchEffect,
        applyValleyEffect,
        applyCurveEffect,
        applyPinchEffect,
        applyBulgeEffect,
        applyPerspectiveEffect,
        applyPointedEffect,
        applyDownwardEffect,
        applyUpwardEffect,
        applyConeEffect,

        fabricCanvasRef
    };
};
