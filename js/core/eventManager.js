
class EventManager {
    constructor() {
        this.handlers = new Map();
        this.initialized = false;
    }
    
    // Register a component with its event handlers
    registerComponent(componentId, config) {
        this.handlers.set(componentId, config);
    }
    
    // Initialize all registered components
    initAll() {
        if (this.initialized) return;
        
        for (const [componentId, config] of this.handlers) {
            this.initComponent(componentId, config);
        }
        this.initialized = true;
    }
    
    // Initialize a single component
    initComponent(componentId, config) {
        const { elements, events, onInit } = config;
        
        // Register all event listeners
        for (const [eventName, handler] of Object.entries(events)) {
            const elementIds = Array.isArray(elements[eventName]) 
                ? elements[eventName] 
                : [elements[eventName]];
            
            elementIds.forEach(elementId => {
                const element = document.getElementById(elementId);
                if (element) {
                    element.addEventListener(eventName, handler);
                }
            });
        }
        
        // Call initialization function if provided
        if (onInit) onInit();
    }
    
    // Get all registered component names
    getComponents() {
        return Array.from(this.handlers.keys());
    }
}

// Create global event manager instance
const eventManager = new EventManager();