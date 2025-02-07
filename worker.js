// worker.js
onmessage = function(event) {
    if (event.data === 'start') {
      try {
        const f = new Function('console.log("Message from worker Function call.");');
        f();
      } catch (error) {
        console.error(error);
        postMessage({error: error.message});
      }
    }
  };
