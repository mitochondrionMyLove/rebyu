import React, { useState, useCallback } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

function CodingArea() {
    const [value, setValue] = useState("console.log('hello world');");

    const onChange = useCallback((val, viewUpdate) => {
        setValue(val);
    }, []);

    return (
        <CodeMirror
            value={value}
            height="400px"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange}
        />
    );
}
export default CodingArea;
