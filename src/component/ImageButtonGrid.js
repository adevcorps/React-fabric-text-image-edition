import React from 'react';
import { imgArr } from '../utils/imageConstants';

const ImageButtonGrid = ({ selectedButton, onButtonClick }) => {
    return (
        <div className="w-full flex justify-between flex-wrap h-[300px]">
            {imgArr.map((imgSrc, index) => (
                <div
                    key={index}
                    onClick={() => onButtonClick(index)}
                    className={`w-[140px] h-[70px] border ${selectedButton === index ? 'border-black' : 'border-gray-300'} cursor-pointer`}
                >
                    <img
                        src={imgSrc}
                        alt={`Shape ${index}`}
                        className="w-full h-full object-cover"
                    />
                </div>
            ))}
        </div>
    );
};

export default ImageButtonGrid;
