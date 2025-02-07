// worker.js
onmessage = function(event) {
    if (event.data === 'start') {
      try {
        const f = new Function('console.log("This will cause an EvalError");');
        f();
      } catch (error) {
        console.error(error);
        postMessage({error: error.message});
      }
    }
  };
