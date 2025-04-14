import React from 'react';

const ControlPanel = ({ params, setParams, paramRanges }) => {
    return (
        <div className="mb-4 p-4 bg-white border rounded shadow-md max-w-md">
            <h3 className="text-lg font-bold mb-2">Bridge Text Controls</h3>
            <div className="space-y-4">
                {Object.keys(params).map((param) => (
                    <div key={param}>
                        <label className="block mb-1 text-sm font-medium" htmlFor={param}>
                            {param}: {params[param]}&nbsp;
                            <span className="text-xs text-gray-500">
                                (min: {paramRanges[param].min}, max: {paramRanges[param].max})
                            </span>
                        </label>
                        <input
                            type="range"
                            id={param}
                            value={params[param]}
                            onChange={(e) =>
                                setParams({
                                    ...params,
                                    [param]: parseInt(e.target.value, 10),
                                })
                            }
                            className="w-full"
                            min={paramRanges[param].min}
                            max={paramRanges[param].max}
                        />
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ControlPanel;
