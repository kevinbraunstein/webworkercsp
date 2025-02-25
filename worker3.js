self.onmessage = (event) => {
  if(event.data === "checkCSP") {
    if (document.securityPolicy) {
      postMessage({ type: 'error', message: 'worker3.js - document.securityPolicy should not be accessible in worker' });
    } else {
      postMessage({ type: 'success', message: 'worker3.js - document.securityPolicy is not accessible in worker' });
    }
  } else if (event.data === "checkGlobalCSP") {
    postMessage({ type: 'success', message: 'worker3.js - global CSP check done' });
  }
};
