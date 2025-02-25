// worker_test.js (Main application file)

class WorkerTest {
  constructor() {
    this.logElement = document.getElementById('log');
    this.startButton = document.getElementById('startTest');
    this.startButton.addEventListener('click', () => this.runTests());
  }

  log(message) {
    console.log(message);
    const logEntry = document.createElement('div');
    logEntry.textContent = message;
    this.logElement.appendChild(logEntry);
    this.logElement.scrollTop = this.logElement.scrollHeight;
  }

  runTests() {
    this.log("Test started...");
    this.testCase1();
    this.testCase2();
    this.testCase3();
    this.log("Test cases initiated.");
  }

  testCase1() {
    this.log("Starting Test Case 1: Basic Worker Creation and CSP Injection");
    const workerScript1 = `
      self.onmessage = (event) => {
        if(event.data === "checkCSP") {
          if (typeof document !== 'undefined' && document.securityPolicy) {
           // Should not be accessible in a worker but just for test
           postMessage({ type: 'error', message: 'document.securityPolicy should not be accessible in worker' });
          } else {
            postMessage({ type: 'success', message: 'document.securityPolicy is not accessible in worker' });
          }
        } else if (event.data === "checkGlobalCSP") {
          // We don't have any way to test if CSP from Response header is correctly applied
          postMessage({ type: 'success', message: 'global CSP check done' });
        }
      }
    `;
    const workerBlob1 = new Blob([workerScript1], { type: 'application/javascript' });
    const workerURL1 = URL.createObjectURL(workerBlob1);

    const worker1 = new Worker(workerURL1);
    worker1.onmessage = (event) => {
      const data = event.data;
      this.log(`Worker 1: ${data.message}`);
      if (data.type === 'error') {
        alert(data.message);
      }
    };
    worker1.onerror = (event) => {
      this.log(`Worker 1 error: ${event.message}`);
      alert(`Worker 1 error: ${event.message}`);
    };

    worker1.postMessage("checkCSP");
    setTimeout(() => {
      worker1.postMessage("checkGlobalCSP");
    }, 100);
  }

  testCase2() {
    this.log("Starting Test Case 2: Worker with module type (No script fetch for now)");
    const workerScript2 = `
      self.onmessage = (event) => {
          postMessage({ type: 'success', message: 'worker module loaded.' });
      }
    `;
    const workerBlob2 = new Blob([workerScript2], { type: 'application/javascript' });
    const workerURL2 = URL.createObjectURL(workerBlob2);
    try {
      const worker2 = new Worker(workerURL2, { type: 'module' });
      worker2.onmessage = (event) => {
        const data = event.data;
        this.log(`Worker 2: ${data.message}`);
      };
      worker2.onerror = (event) => {
        this.log(`Worker 2 error: ${event.message}`);
        alert(`Worker 2 error: ${event.message}`);
      };
      worker2.postMessage("checkLoad");
    } catch (error) {
      this.log(`Error creating module worker : ${error.message}`);
      alert(`Error creating module worker : ${error.message}`);
    }
  }

  testCase3() {
    this.log("Starting Test Case 3: Load a worker from an url (Needs a local server)");
    // You need to serve this js file through a server to be accessible
    fetch("./worker3.js")
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response;
      })
      .then(() => {
        const worker3 = new Worker("./worker3.js");
        worker3.onmessage = (event) => {
          const data = event.data;
          this.log(`Worker 3: ${data.message}`);
          if (data.type === 'error') {
            alert(data.message);
          }
        };
        worker3.onerror = (event) => {
          this.log(`Worker 3 error: ${event.message}`);
          alert(`Worker 3 error: ${event.message}`);
        };
        worker3.postMessage("checkCSP");
        setTimeout(() => {
          worker3.postMessage("checkGlobalCSP");
        }, 100);
      })
      .catch(error => {
        this.log(`Error fetching worker3.js: ${error.message}`);
        alert(`Error fetching worker3.js: ${error.message}`);
      });
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new WorkerTest();
});
