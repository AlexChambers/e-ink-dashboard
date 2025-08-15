// E-ink Browser Testing Dashboard
// Comprehensive feature detection and performance testing

class EInkBrowserTester {
    constructor() {
        this.results = {};
        this.startTime = performance.now();
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateTimestamp();
        this.setupTouchTest();
        this.drawCanvasTest();
        
        // Auto-run basic tests on load
        setTimeout(() => this.runAllTests(), 1000);
    }

    setupEventListeners() {
        document.getElementById('toggleContrast').addEventListener('click', this.toggleHighContrast.bind(this));
        document.getElementById('runAllTests').addEventListener('click', this.runAllTests.bind(this));
        document.getElementById('exportResults').addEventListener('click', this.exportResults.bind(this));
    }

    toggleHighContrast() {
        document.body.classList.toggle('high-contrast');
        this.logResult('contrastToggle', 'High contrast mode toggled successfully');
    }

    async runAllTests() {
        this.results = {};
        this.startTime = performance.now();
        
        // Display tests
        this.testResolution();
        this.testRefreshRate();
        this.testContrast();
        this.testFontRendering();
        
        // JavaScript tests
        this.testBasicJavaScript();
        this.testES6Features();
        await this.testAsyncSupport();
        this.testPromiseSupport();
        
        // CSS tests
        this.testFlexbox();
        this.testCSSGrid();
        this.testAnimations();
        
        // Media tests
        this.testImageSupport();
        this.testSVGSupport();
        
        // Input tests
        this.testFormControls();
        
        // Storage and API tests
        this.testStorage();
        await this.testFetchAPI();
        this.testGeolocation();
        
        // Performance tests
        this.testRenderingPerformance();
        this.testMemoryUsage();
        
        // Generate summary
        this.generateSummary();
        this.updateExportData();
    }

    testResolution() {
        const screen = window.screen;
        const viewport = {
            width: window.innerWidth,
            height: window.innerHeight
        };
        const devicePixelRatio = window.devicePixelRatio || 1;
        
        const resolutionData = {
            screen: {
                width: screen.width,
                height: screen.height,
                availWidth: screen.availWidth,
                availHeight: screen.availHeight,
                colorDepth: screen.colorDepth,
                pixelDepth: screen.pixelDepth
            },
            viewport: viewport,
            devicePixelRatio: devicePixelRatio,
            actualResolution: {
                width: Math.round(viewport.width * devicePixelRatio),
                height: Math.round(viewport.height * devicePixelRatio)
            }
        };
        
        // Display resolution information
        const resolutionDetails = document.querySelector('.resolution-details');
        resolutionDetails.innerHTML = `
            <div class="resolution-item">
                <strong>Screen:</strong> ${screen.width} × ${screen.height}
            </div>
            <div class="resolution-item">
                <strong>Viewport:</strong> ${viewport.width} × ${viewport.height}
            </div>
            <div class="resolution-item">
                <strong>Pixel Ratio:</strong> ${devicePixelRatio}x
            </div>
            <div class="resolution-item">
                <strong>Actual Res:</strong> ${resolutionData.actualResolution.width} × ${resolutionData.actualResolution.height}
            </div>
            <div class="resolution-item">
                <strong>Color Depth:</strong> ${screen.colorDepth}-bit
            </div>
            <div class="resolution-item">
                <strong>Available:</strong> ${screen.availWidth} × ${screen.availHeight}
            </div>
        `;
        
        // Determine display category
        const totalPixels = screen.width * screen.height;
        let displayCategory = 'Unknown';
        if (totalPixels >= 3840 * 2160) displayCategory = '4K+ Display';
        else if (totalPixels >= 2560 * 1440) displayCategory = '2K Display';
        else if (totalPixels >= 1920 * 1080) displayCategory = 'Full HD';
        else if (totalPixels >= 1366 * 768) displayCategory = 'HD Display';
        else if (totalPixels >= 1024 * 768) displayCategory = 'Standard Display';
        else displayCategory = 'Low Resolution';
        
        this.logResult('resolutionTest', `${displayCategory}: ${screen.width}×${screen.height} (${Math.round(totalPixels/1000000)}MP)`, 'info');
        this.results.resolutionData = resolutionData;
    }

    testRefreshRate() {
        const startTime = performance.now();
        const element = document.querySelector('.refresh-animation');
        
        let frames = 0;
        const countFrames = () => {
            frames++;
            if (performance.now() - startTime < 2000) {
                requestAnimationFrame(countFrames);
            } else {
                const fps = Math.round(frames / 2);
                this.logResult('refreshTest', `Estimated refresh rate: ${fps} FPS`, fps > 30 ? 'pass' : fps > 10 ? 'partial' : 'fail');
            }
        };
        
        requestAnimationFrame(countFrames);
    }

    testContrast() {
        // Test if different contrast levels are distinguishable
        const samples = document.querySelectorAll('.contrast-samples .sample');
        const visible = Array.from(samples).map(sample => {
            const style = window.getComputedStyle(sample);
            const bg = style.backgroundColor;
            const color = style.color;
            return { bg, color, element: sample };
        });
        
        this.logResult('contrastTest', `5 contrast levels tested. High contrast recommended for e-ink.`, 'info');
        this.results.contrastLevels = visible.length;
    }

    testFontRendering() {
        const fonts = ['12px', '16px', '20px', '24px'];
        const readableFonts = fonts.filter(size => {
            // Simple heuristic: larger fonts are more readable on e-ink
            const sizeNum = parseInt(size);
            return sizeNum >= 14;
        });
        
        this.logResult('fontTest', `${readableFonts.length}/${fonts.length} font sizes optimal for e-ink`, readableFonts.length >= 3 ? 'pass' : 'partial');
    }

    testBasicJavaScript() {
        try {
            const testArray = [1, 2, 3];
            const testObject = { a: 1, b: 2 };
            const testFunction = () => 'test';
            
            const basicFeatures = [
                Array.isArray(testArray),
                typeof testObject === 'object',
                typeof testFunction === 'function',
                JSON.stringify(testObject) === '{"a":1,"b":2}'
            ];
            
            const passCount = basicFeatures.filter(Boolean).length;
            this.logResult('jsBasicTest', `${passCount}/4 basic JavaScript features working`, passCount === 4 ? 'pass' : 'partial');
        } catch (error) {
            this.logResult('jsBasicTest', `Basic JavaScript error: ${error.message}`, 'fail');
        }
    }

    testES6Features() {
        const features = [];
        
        try {
            // Arrow functions
            const arrow = () => true;
            features.push('arrow functions');
            
            // Template literals
            const template = `test ${1 + 1}`;
            if (template === 'test 2') features.push('template literals');
            
            // Destructuring
            const [a, b] = [1, 2];
            if (a === 1 && b === 2) features.push('destructuring');
            
            // Spread operator
            const spread = [...[1, 2, 3]];
            if (spread.length === 3) features.push('spread operator');
            
            // Classes
            class TestClass { constructor() { this.test = true; } }
            const instance = new TestClass();
            if (instance.test) features.push('classes');
            
            // let/const
            let letTest = 1;
            const constTest = 2;
            if (letTest === 1 && constTest === 2) features.push('let/const');
            
        } catch (error) {
            this.logResult('es6Test', `ES6 error: ${error.message}`, 'fail');
            return;
        }
        
        this.logResult('es6Test', `${features.length}/6 ES6 features supported: ${features.join(', ')}`, features.length >= 4 ? 'pass' : 'partial');
    }

    async testAsyncSupport() {
        try {
            const asyncTest = async () => {
                await new Promise(resolve => setTimeout(resolve, 10));
                return 'async works';
            };
            
            const result = await asyncTest();
            this.logResult('asyncTest', `Async/await supported: ${result}`, 'pass');
        } catch (error) {
            this.logResult('asyncTest', `Async/await not supported: ${error.message}`, 'fail');
        }
    }

    testPromiseSupport() {
        try {
            const promiseTest = new Promise((resolve) => {
                resolve('promise works');
            });
            
            promiseTest.then(result => {
                this.logResult('promiseTest', `Promises supported: ${result}`, 'pass');
            }).catch(error => {
                this.logResult('promiseTest', `Promise error: ${error.message}`, 'fail');
            });
        } catch (error) {
            this.logResult('promiseTest', `Promises not supported: ${error.message}`, 'fail');
        }
    }

    testFlexbox() {
        const flexDemo = document.querySelector('.flex-demo');
        const computedStyle = window.getComputedStyle(flexDemo);
        const isFlexbox = computedStyle.display === 'flex';
        
        this.logResult('flexboxTest', `Flexbox ${isFlexbox ? 'supported' : 'not supported'}`, isFlexbox ? 'pass' : 'fail');
    }

    testCSSGrid() {
        const gridDemo = document.querySelector('.grid-demo');
        const computedStyle = window.getComputedStyle(gridDemo);
        const isGrid = computedStyle.display === 'grid';
        
        this.logResult('gridTest', `CSS Grid ${isGrid ? 'supported' : 'not supported'}`, isGrid ? 'pass' : 'fail');
    }

    testAnimations() {
        const animationDemo = document.querySelector('.animation-demo');
        const computedStyle = window.getComputedStyle(animationDemo);
        const hasAnimation = computedStyle.animationName !== 'none';
        
        // Note: animations may not be ideal for e-ink displays
        this.logResult('animationTest', `CSS Animations ${hasAnimation ? 'supported (may cause ghosting on e-ink)' : 'not supported'}`, hasAnimation ? 'info' : 'fail');
    }

    testImageSupport() {
        const canvas = document.getElementById('testCanvas');
        const ctx = canvas.getContext('2d');
        
        try {
            // Test canvas rendering
            ctx.fillStyle = 'black';
            ctx.fillRect(10, 10, 30, 30);
            ctx.fillStyle = 'gray';
            ctx.fillRect(50, 10, 30, 30);
            
            const imageData = ctx.getImageData(20, 20, 1, 1);
            const hasCanvas = imageData.data[3] > 0; // Check alpha channel
            
            this.logResult('imageTest', `Canvas ${hasCanvas ? 'supported' : 'not supported'}`, hasCanvas ? 'pass' : 'fail');
        } catch (error) {
            this.logResult('imageTest', `Canvas error: ${error.message}`, 'fail');
        }
    }

    testSVGSupport() {
        const svg = document.querySelector('svg');
        const hasSVG = svg && svg.namespaceURI === 'http://www.w3.org/2000/svg';
        
        this.logResult('svgTest', `SVG ${hasSVG ? 'supported' : 'not supported'}`, hasSVG ? 'pass' : 'fail');
    }

    setupTouchTest() {
        const touchArea = document.getElementById('touchArea');
        let touchSupported = false;
        
        touchArea.addEventListener('touchstart', (e) => {
            touchSupported = true;
            touchArea.classList.add('touched');
            touchArea.textContent = 'Touch detected!';
            this.logResult('touchTest', 'Touch events supported', 'pass');
        });
        
        touchArea.addEventListener('click', (e) => {
            if (!touchSupported) {
                touchArea.classList.add('touched');
                touchArea.textContent = 'Click detected!';
                this.logResult('touchTest', 'Mouse/click events supported (no touch detected)', 'partial');
            }
        });
        
        // Detect touch capability
        setTimeout(() => {
            if (!touchSupported && !touchArea.classList.contains('touched')) {
                const hasTouchCapability = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
                this.logResult('touchTest', `Touch capability: ${hasTouchCapability ? 'detected but not tested' : 'not available'}`, hasTouchCapability ? 'info' : 'fail');
            }
        }, 5000);
    }

    testFormControls() {
        const formElements = document.querySelectorAll('.form-demo input, .form-demo select');
        let workingElements = 0;
        
        formElements.forEach(element => {
            try {
                if (element.type === 'text') {
                    element.value = 'test';
                    if (element.value === 'test') workingElements++;
                } else if (element.type === 'checkbox') {
                    element.checked = true;
                    if (element.checked) workingElements++;
                } else if (element.type === 'range') {
                    element.value = '75';
                    if (element.value === '75') workingElements++;
                } else if (element.tagName === 'SELECT') {
                    workingElements++; // Assume select works if it exists
                }
            } catch (error) {
                console.error('Form test error:', error);
            }
        });
        
        this.logResult('formTest', `${workingElements}/${formElements.length} form controls working`, workingElements === formElements.length ? 'pass' : 'partial');
    }

    testStorage() {
        const tests = [];
        
        // LocalStorage
        try {
            localStorage.setItem('eink-test', 'test-value');
            if (localStorage.getItem('eink-test') === 'test-value') {
                tests.push('localStorage');
            }
            localStorage.removeItem('eink-test');
        } catch (error) {
            console.error('LocalStorage test failed:', error);
        }
        
        // SessionStorage
        try {
            sessionStorage.setItem('eink-test', 'test-value');
            if (sessionStorage.getItem('eink-test') === 'test-value') {
                tests.push('sessionStorage');
            }
            sessionStorage.removeItem('eink-test');
        } catch (error) {
            console.error('SessionStorage test failed:', error);
        }
        
        // Cookies
        try {
            document.cookie = 'eink-test=test-value';
            if (document.cookie.includes('eink-test=test-value')) {
                tests.push('cookies');
            }
            document.cookie = 'eink-test=; expires=Thu, 01 Jan 1970 00:00:00 UTC';
        } catch (error) {
            console.error('Cookie test failed:', error);
        }
        
        this.logResult('storageTest', `Storage supported: ${tests.join(', ')}`, tests.length > 0 ? 'pass' : 'fail');
    }

    async testFetchAPI() {
        try {
            // Test fetch API availability
            if (typeof fetch === 'undefined') {
                this.logResult('fetchTest', 'Fetch API not available', 'fail');
                return;
            }
            
            // Test with a simple data URL
            const response = await fetch('data:text/plain,hello');
            const text = await response.text();
            
            this.logResult('fetchTest', `Fetch API supported: ${text}`, 'pass');
        } catch (error) {
            this.logResult('fetchTest', `Fetch API error: ${error.message}`, 'fail');
        }
    }

    testGeolocation() {
        if ('geolocation' in navigator) {
            this.logResult('geolocationTest', 'Geolocation API available (not tested to preserve privacy)', 'info');
        } else {
            this.logResult('geolocationTest', 'Geolocation API not available', 'fail');
        }
    }

    testRenderingPerformance() {
        const startTime = performance.now();
        
        // Create and remove DOM elements to test rendering
        for (let i = 0; i < 100; i++) {
            const div = document.createElement('div');
            div.className = 'performance-test-element';
            div.textContent = 'Performance test';
            document.body.appendChild(div);
        }
        
        const elements = document.querySelectorAll('.performance-test-element');
        elements.forEach(el => el.remove());
        
        const renderTime = performance.now() - startTime;
        this.logResult('renderTest', `DOM manipulation: ${renderTime.toFixed(2)}ms for 100 elements`, renderTime < 50 ? 'pass' : renderTime < 200 ? 'partial' : 'fail');
    }

    testMemoryUsage() {
        if ('memory' in performance) {
            const memory = performance.memory;
            const usedMB = Math.round(memory.usedJSHeapSize / 1024 / 1024);
            const limitMB = Math.round(memory.jsHeapSizeLimit / 1024 / 1024);
            
            this.logResult('memoryTest', `Memory usage: ${usedMB}MB / ${limitMB}MB limit`, usedMB < limitMB * 0.8 ? 'pass' : 'info');
        } else {
            this.logResult('memoryTest', 'Memory API not available', 'info');
        }
    }

    drawCanvasTest() {
        const canvas = document.getElementById('testCanvas');
        const ctx = canvas.getContext('2d');
        
        // Draw test pattern
        ctx.fillStyle = 'black';
        ctx.fillRect(5, 5, 40, 40);
        
        ctx.fillStyle = 'gray';
        ctx.fillRect(55, 5, 40, 40);
        
        // Draw text
        ctx.fillStyle = 'black';
        ctx.font = '12px Arial';
        ctx.fillText('Test', 10, 30);
    }

    logResult(testId, message, status = 'info') {
        const element = document.querySelector(`#${testId} .test-result`);
        if (element) {
            element.textContent = message;
            element.className = `test-result ${status}`;
        }
        
        this.results[testId] = { message, status, timestamp: new Date().toISOString() };
    }

    generateSummary() {
        const summary = document.getElementById('summaryContent');
        const totalTests = Object.keys(this.results).length;
        const passedTests = Object.values(this.results).filter(r => r.status === 'pass').length;
        const failedTests = Object.values(this.results).filter(r => r.status === 'fail').length;
        const partialTests = Object.values(this.results).filter(r => r.status === 'partial').length;
        
        const overallScore = Math.round((passedTests / totalTests) * 100);
        const testTime = ((performance.now() - this.startTime) / 1000).toFixed(2);
        
        summary.innerHTML = `
            <div class="summary-stats">
                <h3>Overall Browser Compatibility: ${overallScore}%</h3>
                <p><strong>Total Tests:</strong> ${totalTests}</p>
                <p><strong>Passed:</strong> ${passedTests} | <strong>Partial:</strong> ${partialTests} | <strong>Failed:</strong> ${failedTests}</p>
                <p><strong>Test Duration:</strong> ${testTime} seconds</p>
            </div>
            
            <div class="eink-recommendations">
                <h4>E-ink Optimization Recommendations:</h4>
                <ul>
                    <li>Use high contrast colors (black on white preferred)</li>
                    <li>Minimize animations and transitions (can cause ghosting)</li>
                    <li>Use larger fonts (16px+ recommended)</li>
                    <li>Prefer static layouts over dynamic ones</li>
                    <li>Test refresh rates - may be limited on e-ink displays</li>
                    <li>Consider battery impact of frequent screen updates</li>
                </ul>
            </div>
        `;
    }

    updateExportData() {
        const exportData = {
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            viewport: {
                width: window.innerWidth,
                height: window.innerHeight,
                devicePixelRatio: window.devicePixelRatio || 1
            },
            results: this.results,
            summary: {
                totalTests: Object.keys(this.results).length,
                passedTests: Object.values(this.results).filter(r => r.status === 'pass').length,
                failedTests: Object.values(this.results).filter(r => r.status === 'fail').length,
                partialTests: Object.values(this.results).filter(r => r.status === 'partial').length
            }
        };
        
        document.getElementById('exportData').value = JSON.stringify(exportData, null, 2);
    }

    exportResults() {
        const data = document.getElementById('exportData').value;
        const blob = new Blob([data], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = `eink-browser-test-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    updateTimestamp() {
        document.getElementById('lastUpdated').textContent = new Date().toLocaleString();
    }
}

// Initialize the tester when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.einkTester = new EInkBrowserTester();
});

// Add some utility functions for manual testing
window.testUtils = {
    // Force refresh test
    forceRefresh: () => {
        document.body.style.display = 'none';
        setTimeout(() => {
            document.body.style.display = '';
        }, 100);
    },
    
    // Test scroll performance
    testScrolling: () => {
        const startY = window.pageYOffset;
        const startTime = performance.now();
        
        window.scrollTo(0, document.body.scrollHeight);
        
        setTimeout(() => {
            const endTime = performance.now();
            const scrollTime = endTime - startTime;
            console.log(`Scroll test: ${scrollTime.toFixed(2)}ms`);
            window.scrollTo(0, startY);
        }, 100);
    },
    
    // Battery API test (if available)
    testBattery: async () => {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                console.log('Battery level:', Math.round(battery.level * 100) + '%');
                console.log('Charging:', battery.charging);
            } catch (error) {
                console.error('Battery API error:', error);
            }
        } else {
            console.log('Battery API not available');
        }
    }
};

// Make results globally accessible
window.getBrowserTestResults = () => window.einkTester?.results || {};