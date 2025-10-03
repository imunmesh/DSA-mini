// Priority Queue Implementation
class PriorityQueue {
    constructor() {
        this.items = [];
    }
    
    // Add an element to the queue based on priority
    enqueue(element, priority) {
        const queueElement = { element, priority };
        let added = false;
        
        // Add the element at the correct position based on priority
        for (let i = 0; i < this.items.length; i++) {
            if (queueElement.priority < this.items[i].priority) {
                this.items.splice(i, 0, queueElement);
                added = true;
                break;
            }
        }
        
        // If element wasn't added (lower priority than all), add it at the end
        if (!added) {
            this.items.push(queueElement);
        }
    }
    
    // Remove and return the highest priority element
    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items.shift();
    }
    
    // Check if queue is empty
    isEmpty() {
        return this.items.length === 0;
    }
    
    // Get the front element without removing it
    front() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[0];
    }
    
    // Get the size of the queue
    size() {
        return this.items.length;
    }
    
    // Get all elements in the queue
    getAll() {
        return this.items;
    }
    
    // Clear the queue
    clear() {
        this.items = [];
    }
}

// Job Scheduling System
class JobScheduler {
    constructor() {
        this.jobQueue = new PriorityQueue();
        this.processedJobs = [];
        this.jobIdCounter = 1;
    }
    
    // Add a new job to the queue
    addJob(name, priority) {
        const job = {
            id: this.jobIdCounter++,
            name: name,
            priority: priority,
            timestamp: new Date()
        };
        
        this.jobQueue.enqueue(job, priority);
        return job;
    }
    
    // Process the next job (highest priority)
    processNextJob() {
        if (this.jobQueue.isEmpty()) {
            return null;
        }
        
        const job = this.jobQueue.dequeue().element;
        job.processedAt = new Date();
        this.processedJobs.push(job);
        return job;
    }
    
    // Get all jobs in the queue
    getQueueJobs() {
        return this.jobQueue.getAll().map(item => item.element);
    }
    
    // Get all processed jobs
    getProcessedJobs() {
        return this.processedJobs;
    }
    
    // Clear the queue
    clearQueue() {
        this.jobQueue.clear();
    }
    
    // Clear processed jobs
    clearProcessedJobs() {
        this.processedJobs = [];
    }
}

// UI Controller
class UIController {
    constructor() {
        this.scheduler = new JobScheduler();
        this.initializeEventListeners();
        this.updateDisplay();
        this.addWelcomeAnimation();
    }
    
    addWelcomeAnimation() {
        const header = document.querySelector('header');
        header.style.opacity = '0';
        header.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            header.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
            header.style.opacity = '1';
            header.style.transform = 'translateY(0)';
        }, 300);
    }
    
    initializeEventListeners() {
        // Add job button
        document.getElementById('addJobBtn').addEventListener('click', () => {
            this.handleAddJob();
        });
        
        // Process job button
        document.getElementById('processJobBtn').addEventListener('click', () => {
            this.handleProcessJob();
        });
        
        // Clear queue button
        document.getElementById('clearQueueBtn').addEventListener('click', () => {
            this.handleClearQueue();
        });
        
        // Allow Enter key to add job
        document.getElementById('jobPriority').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.handleAddJob();
            }
        });
        
        // Add focus effects to inputs
        const inputs = document.querySelectorAll('input');
        inputs.forEach(input => {
            input.addEventListener('focus', function() {
                this.parentElement.classList.add('focused');
            });
            
            input.addEventListener('blur', function() {
                this.parentElement.classList.remove('focused');
            });
        });
    }
    
    handleAddJob() {
        const nameInput = document.getElementById('jobName');
        const priorityInput = document.getElementById('jobPriority');
        
        const name = nameInput.value.trim();
        const priority = parseInt(priorityInput.value);
        
        // Validate input
        if (!name) {
            this.showNotification('Please enter a job name', 'error');
            nameInput.focus();
            return;
        }
        
        if (isNaN(priority) || priority < 1 || priority > 10) {
            this.showNotification('Please enter a valid priority between 1 and 10', 'error');
            priorityInput.focus();
            return;
        }
        
        // Add job to scheduler
        const job = this.scheduler.addJob(name, priority);
        
        // Clear inputs
        nameInput.value = '';
        priorityInput.value = '';
        
        // Update display with animation
        this.updateDisplay();
        
        // Show success notification
        this.showNotification(`Added job: ${job.name} (Priority: ${job.priority})`, 'success');
        
        // Focus back to name input
        nameInput.focus();
    }
    
    handleProcessJob() {
        const job = this.scheduler.processNextJob();
        
        if (job) {
            // Show notification
            this.showNotification(`Processed job: ${job.name} (Priority: ${job.priority})`, 'success');
            
            // Add animation effect to processed job
            this.animateProcessedJob(job.id);
        } else {
            this.showNotification('No jobs to process', 'warning');
        }
        
        // Update display
        this.updateDisplay();
    }
    
    handleClearQueue() {
        if (confirm('Are you sure you want to clear the job queue?')) {
            this.scheduler.clearQueue();
            this.updateDisplay();
            this.showNotification('Job queue cleared', 'info');
        }
    }
    
    animateProcessedJob(jobId) {
        // This would be implemented if we had direct DOM references to the job items
        // For now, we'll just add a visual effect to the processed section
        const processedSection = document.querySelector('.processed-section');
        processedSection.style.boxShadow = '0 0 20px rgba(39, 174, 96, 0.5)';
        setTimeout(() => {
            processedSection.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
        }, 1000);
    }
    
    updateDisplay() {
        this.updateQueueDisplay();
        this.updateProcessedDisplay();
    }
    
    updateQueueDisplay() {
        const queueJobs = this.scheduler.getQueueJobs();
        const jobList = document.getElementById('jobList');
        const emptyMessage = document.getElementById('emptyQueueMessage');
        
        // Add fade out effect
        jobList.style.opacity = '0';
        emptyMessage.style.opacity = '0';
        
        setTimeout(() => {
            // Clear current list
            jobList.innerHTML = '';
            
            if (queueJobs.length === 0) {
                emptyMessage.style.display = 'block';
                emptyMessage.style.opacity = '1';
            } else {
                emptyMessage.style.display = 'none';
                
                // Add jobs to list
                queueJobs.forEach(job => {
                    const jobItem = this.createJobElement(job, false);
                    jobList.appendChild(jobItem);
                });
                
                jobList.style.opacity = '1';
            }
        }, 150);
    }
    
    updateProcessedDisplay() {
        const processedJobs = this.scheduler.getProcessedJobs();
        const processedList = document.getElementById('processedList');
        const noProcessedMessage = document.getElementById('noProcessedMessage');
        
        // Add fade out effect
        processedList.style.opacity = '0';
        noProcessedMessage.style.opacity = '0';
        
        setTimeout(() => {
            // Clear current list
            processedList.innerHTML = '';
            
            if (processedJobs.length === 0) {
                noProcessedMessage.style.display = 'block';
                noProcessedMessage.style.opacity = '1';
            } else {
                noProcessedMessage.style.display = 'none';
                
                // Add processed jobs to list (in reverse order to show newest first)
                processedJobs.slice().reverse().forEach(job => {
                    const jobItem = this.createJobElement(job, true);
                    processedList.appendChild(jobItem);
                });
                
                processedList.style.opacity = '1';
            }
        }, 150);
    }
    
    createJobElement(job, isProcessed) {
        const jobItem = document.createElement('li');
        jobItem.className = 'job-item';
        
        // Add priority class for styling
        if (job.priority <= 3) {
            jobItem.classList.add('high-priority');
        } else if (job.priority <= 7) {
            jobItem.classList.add('medium-priority');
        } else {
            jobItem.classList.add('low-priority');
        }
        
        // Add processed class if needed
        if (isProcessed) {
            jobItem.classList.add('processed-item');
        }
        
        // Format time
        const timeString = isProcessed ? 
            `Processed at: ${job.processedAt.toLocaleTimeString()}` : 
            `Added at: ${job.timestamp.toLocaleTimeString()}`;
        
        jobItem.innerHTML = `
            <div class="job-info">
                <div class="job-name">${job.name}</div>
                <div class="job-time">${timeString}</div>
            </div>
            <div class="job-priority">P${job.priority}</div>
        `;
        
        return jobItem;
    }
    
    showNotification(message, type = 'info') {
        // Remove any existing notifications
        const existingNotification = document.querySelector('.notification');
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Add icon based on type
        let icon = 'ℹ️';
        switch(type) {
            case 'success':
                icon = '✅';
                break;
            case 'error':
                icon = '❌';
                break;
            case 'warning':
                icon = '⚠️';
                break;
            case 'info':
                icon = 'ℹ️';
                break;
        }
        
        notification.innerHTML = `${icon} ${message}`;
        
        // Add to document
        document.body.appendChild(notification);
        
        // Trigger animation
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);
        
        // Remove after 3 seconds
        setTimeout(() => {
            notification.classList.remove('show');
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Initialize the application when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new UIController();
});