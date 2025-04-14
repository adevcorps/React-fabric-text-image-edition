import { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { imgArr, bridge, arch } from '../utils/imageConstants';

export const useFabricCanvas = () => {
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
    const [bridgeParamRanges] = useState({
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
                const canvas = fabricCanvasRef.current;
                fabric.loadSVGFromString(svgContent, (objects) => {
                    objects.forEach((obj) => canvas.add(obj));
                    canvas.renderAll();
                });
            };
            reader.readAsText(file);
        } else {
            alert('Please upload a valid SVG file.');
        }
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
    };
};
