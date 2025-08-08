// Web Worker for background processing
self.onmessage = function(e) {
    const { type, data } = e.data
  
    if (type === 'START_PROCESSING') {
      const { iterations } = data
      
      try {
        // Simulate heavy computation
        let result = 0
        const startTime = Date.now()
        
        for (let i = 0; i < iterations; i++) {
          // Perform some computation
          result += Math.sqrt(i) * Math.sin(i) * Math.cos(i)
          
          // Report progress every 10000 iterations
          if (i % 10000 === 0) {
            const progress = Math.round((i / iterations) * 100)
            self.postMessage({
              type: 'PROGRESS',
              progress: progress
            })
          }
        }
        
        const endTime = Date.now()
        const duration = endTime - startTime
        
        self.postMessage({
          type: 'COMPLETE',
          result: `Computed ${iterations} iterations in ${duration}ms. Final result: ${result.toFixed(2)}`
        })
        
      } catch (error) {
        self.postMessage({
          type: 'ERROR',
          error: error.message
        })
      }
    }
  }
  
  // Handle errors
  self.onerror = function(error) {
    self.postMessage({
      type: 'ERROR',
      error: error.message
    })
  }
  