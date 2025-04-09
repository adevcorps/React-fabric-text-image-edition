import React, { useState } from 'react';

const SvgEditor = ({ onSvgUpload }) => {
  const [svgContent, setSvgContent] = useState('');
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file && file.type === 'image/svg+xml') {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        setSvgContent(content);
        onSvgUpload(content);
      };
      reader.readAsText(file);
    } else {
      alert('Please upload a valid SVG file.');
    }
  };
  return (
    <div>
      <h1>SVG Editor</h1>
      <input type="file" accept=".svg" onChange={handleFileUpload} />
      <div style={{ border: '1px solid #ccc', marginTop: '20px', padding: '10px' }}>
        <h2>Canvas Area</h2>
        <div
          dangerouslySetInnerHTML={{ __html: svgContent }}
          style={{ width: '100%', height: 'auto' }}
        />
      </div>
    </div>
  );
};

export default SvgEditor;
