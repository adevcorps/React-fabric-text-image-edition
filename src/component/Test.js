import React, { useState, useRef, useEffect } from 'react';

const Test = () => {
    const demoRef = useRef(null);
    const [curve, setCurve] = useState(110);
    const [offsetY, setOffsetY] = useState(4);
    const [textHeight, setTextHeight] = useState(64);
    const [bottom, setBottom] = useState(200);
    const [isTri, setIsTri] = useState(false);
    const [text, setText] = useState('HARVERD');

    const renderTest = () => {
        const ctx = demoRef.current.getContext('2d');
        const os = document.createElement('canvas');
        const octx = os.getContext('2d');
        const font = '64px impact';
        const w = demoRef.current.width;
        const h = demoRef.current.height;
        const angleSteps = 180 / w;

        os.width = w;
        os.height = h;
        octx.font = font;
        octx.textBaseline = 'top';
        octx.textAlign = 'center';
        octx.font = '64px "NBA bobcats"';
        octx.fillStyle = 'red';
        octx.clearRect(0, 0, w, h);
        ctx.clearRect(0, 0, w, h);
        octx.fillText(text.toUpperCase(), w * 0.5, 0);
        const sliceWidth = 2;
        
        let i = 0;
        let dltY = curve / textHeight;
        let y = 0;
        while (i < w) {
            if (isTri) {
                y += dltY;
                if (i >= (w * 0.5)) dltY = -dltY;
            } else {
                y = bottom - curve * Math.sin(i * angleSteps * Math.PI / 180);
            }

            ctx.drawImage(
                os,
                i, 0, sliceWidth, textHeight,
                i, h * 0.5 - (offsetY / textHeight) * y, sliceWidth, y
            );
            i += sliceWidth;
        }
    };

    useEffect(() => {
        renderTest();
    }, [curve, offsetY, textHeight, bottom, isTri, text]);

    return (
        <div>
            <canvas ref={demoRef} width={150} height={75}></canvas>
            <br />
            <span>Curve:</span>
            <input
                type="range"
                min="0"
                max="200"
                value={curve}
                onChange={(e) => setCurve(parseInt(e.target.value, 10))}
            />
            <span>{curve}</span>
            <br />
            <span>OffsetY:</span>
            <input
                type="range"
                min="0"
                max="100"
                value={offsetY}
                onChange={(e) => setOffsetY(parseInt(e.target.value, 10))}
            />
            <span>{offsetY}</span>
            <br />
            <span>Text height:</span>
            <input
                type="range"
                min="0"
                max="200"
                value={textHeight}
                onChange={(e) => setTextHeight(parseInt(e.target.value, 10))}
            />
            <span>{textHeight}</span>
            <br />
            <span>Bottom:</span>
            <input
                type="range"
                min="0"
                max="200"
                value={bottom}
                onChange={(e) => setBottom(parseInt(e.target.value, 10))}
            />
            <span>{bottom}</span>
            <br />
            <span>Triangle:</span>
            <input
                type="checkbox"
                checked={isTri}
                onChange={(e) => setIsTri(e.target.checked)}
            />
            <br />
            <span>Text:</span>
            <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
            />
        </div>
    );
};

export default Test;
