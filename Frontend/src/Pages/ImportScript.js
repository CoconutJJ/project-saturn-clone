import { useEffect } from 'react';
import React from 'react'

const importScript = resourceUrl=> {
  useEffect(() => {
    const script = document.createElement('script');
    script.src = resourceUrl;
    script.async = true;
    document.head.appendChild(script);
return () => {
      document.head.removeChild(script);
    }
  }, [resourceUrl]);
};
export default importScript;