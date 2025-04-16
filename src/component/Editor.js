import React, { useEffect, useState } from 'react';
import { useFabricCanvas } from '../hooks/useFabricCanvas';
import ControlPanel from './ControlPanel';
import ImageButtonGrid from './ImageButtonGrid';

const Editor = () => {
    const {
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

        fabricCanvasRef,
    } = useFabricCanvas();

    const paramMap = {
        1: {
            params: bridgeParams,
            setParams: setBridgeParams,
            ranges: bridgeParamRanges,
            applyEffect: applyBridgeEffect,
        },
        2: {
            params: valleyParams,
            setParams: setValleyParams,
            ranges: valleyParamRanges,
            applyEffect: applyValleyEffect,
        },
        3: {
            params: curveParams,
            setParams: setCurveParams,
            ranges: curveParamRanges,
            applyEffect: applyCurveEffect,
        },
        4: {
            params: archParams,
            setParams: setArchParams,
            ranges: archParamRanges,
            applyEffect: applyArchEffect,
        },
        5: {
            params: pinchParams,
            setParams: setPinchParams,
            ranges: pinchParamRanges,
            applyEffect: applyPinchEffect,
        },
        6: {
            params: bulgeParams,
            setParams: setBulgeParams,
            ranges: bulgeParamRanges,
            applyEffect: applyBulgeEffect,
        },
        7: {
            params: perspectiveParams,
            setParams: setPerspectiveParams,
            ranges: perspectiveParamRanges,
            applyEffect: applyPerspectiveEffect,
        },
        8: {
            params: pointedParams,
            setParams: setPointedParams,
            ranges: pointedParamRanges,
            applyEffect: applyPointedEffect,
        },
        9: {
            params: downwardParams,
            setParams: setDownwardParams,
            ranges: downwardParamRanges,
            applyEffect: applyDownwardEffect,
        },
        10: {
            params: upwardParams,
            setParams: setUpwardParams,
            ranges: upwardParamRanges,
            applyEffect: applyUpwardEffect,
        },
        11: {
            params: coneParams,
            setParams: setConeParams,
            ranges: coneParamRanges,
            applyEffect: applyConeEffect,
        },
        // Add more as needed...
    };

    // useEffect(() => {
    //     if (selectedButton === null) return;

    //     const canvas = fabricCanvasRef?.current;
    //     const activeObj = canvas?.getActiveObject();

    //     if (!activeObj || activeObj.type !== 'i-text') {
    //         console.warn('No active i-text object found');
    //         return;
    //     }

    //     // Trigger the effect based on button
    //     switch (selectedButton) {
    //         case 1: // Bridge
    //             console.log('Applying Bridge effect...');
    //             applyBridgeEffect(activeObj, bridgeParams);
    //             break;
    //         case 4: // Arch
    //             console.log('Applying Arch effect...');
    //             applyArchEffect(activeObj, archParams);
    //             break;
    //         default:
    //             console.log('No effect defined for this shape.');
    //     }
    // }, [selectedButton]);
    useEffect(() => {
        if (selectedButton === null) return;

        const canvas = fabricCanvasRef?.current;
        const activeObj = canvas?.getActiveObject();

        if (!activeObj || activeObj.type !== 'i-text') {
            console.warn('No active i-text object found');
            return;
        }

        const config = paramMap[selectedButton];
        if (config && typeof config.applyEffect === 'function') {
            console.log(`Applying effect for button ${selectedButton}...`);
            config.applyEffect(activeObj, config.params);
        } else {
            console.log('No effect defined for this shape.');
        }
    }, [selectedButton]);
    return (
        <div className="p-2 pt-10">
            <div className="w-11/12 mx-auto">
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
                    <div>
                        <button
                            className="bg-black border border-black text-white px-4 py-2 mx-4 rounded"
                            onClick={() => document.getElementById('fileInput').click()}
                        >
                            Upload SVG
                        </button>
                        <a
                            className="text-black underline cursor-pointer px-4 py-2"
                            onClick={handleDownloadPNG}
                        >
                            Download as PNG
                        </a>
                    </div>
                </div>
                <div className="w-full flex justify-between">
                    <div className="w-4/12 max-w-[430px]">
                        <ImageButtonGrid
                            selectedButton={selectedButton}
                            onButtonClick={handleImageButtonClick}
                        />
                        {/* <ControlPanel
                            params={selectedButton === 4 ? archParams : bridgeParams}
                            setParams={selectedButton === 4 ? setArchParams : setBridgeParams}
                            paramRanges={selectedButton === 4 ? archParamRanges : bridgeParamRanges}
                        /> */}
                        {paramMap[selectedButton]?.params && (
                            <ControlPanel
                                params={paramMap[selectedButton].params}
                                setParams={paramMap[selectedButton].setParams}
                                paramRanges={paramMap[selectedButton].ranges}
                            />
                        )}

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
