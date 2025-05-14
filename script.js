class LaundryQueueSystem {
    constructor() {
        this.queue = [];
        this.elements = {
            addButton: document.getElementById('addButton'),
            addButtonText: document.getElementById('addButtonText'),
            spinner: document.getElementById('spinner'),
            nameInput: document.getElementById('customerName'),
            weightInput: document.getElementById('laundryWeight'),
            queueList: document.getElementById('queue'),
            clearQueueButton: document.getElementById('clearQueue'),
            totalWeightSpan: document.getElementById('totalWeight'),
            estimatedTimeSpan: document.getElementById('estimatedTime'),
            toast: document.getElementById('toast'),
            nameError: document.getElementById('nameError'),
            weightError: document.getElementById('weightError'),
            sidebar: document.getElementById('sidebar'),
            sidebarToggle: document.getElementById('sidebarToggle')
        };

        this.setEvents();
        this.validateInputs();
    }

    showToast(msg) {
        this.elements.toast.textContent = msg;
        this.elements.toast.classList.add('show');
        setTimeout(() => {
            this.elements.toast.classList.remove('show');
        }, 2000);
    }

    updateQueue() {
        this.elements.queueList.innerHTML = '';
        this.queue.sort((a, b) => a.weight - b.weight);

        this.queue.forEach((item, index) => {
            const li = document.createElement('li');
            li.className = 'queue-item flex justify-between items-center text-xs text-gray-300';
            li.innerHTML = `
                <span>${index + 1}. ${item.name} - ${item.weight} kg</span>
                <button class="px-2 py-1 bg-red-500 hover:bg-red-600 text-white rounded" onclick="laundrySystem.removeFromQueue(${index})">
                    <i class="fas fa-times"></i>
                </button>
            `;
            this.elements.queueList.appendChild(li);
        });

        this.updateStats();
        this.elements.clearQueueButton.disabled = this.queue.length === 0;
    }

    updateStats() {
        const totalWeight = this.queue.reduce((total, item) => total + item.weight, 0);
        const estimatedTime = totalWeight * 30;

        this.elements.totalWeightSpan.textContent = totalWeight.toFixed(1);
        this.elements.estimatedTimeSpan.textContent = estimatedTime.toFixed(0);
    }

    removeFromQueue(index) {
        const removed = this.queue.splice(index, 1)[0];
        this.updateQueue();
        this.showToast(`${removed.name} removed`);
    }

    validateInputs() {
        const name = this.elements.nameInput.value.trim();
        const weight = parseFloat(this.elements.weightInput.value);
        const isNameOk = name.length > 0;
        const isWeightOk = weight > 0 && !isNaN(weight);

        this.elements.nameError.classList.toggle('hidden', isNameOk);
        this.elements.weightError.classList.toggle('hidden', isWeightOk);
        this.elements.addButton.disabled = !(isNameOk && isWeightOk);
    }

    async addToQueue() {
        this.elements.addButton.disabled = true;
        this.elements.addButtonText.textContent = 'Adding...';
        this.elements.spinner.classList.remove('hidden');

        await new Promise(resolve => setTimeout(resolve, 500));

        this.queue.push({
            name: this.elements.nameInput.value.trim(),
            weight: parseFloat(this.elements.weightInput.value)
        });

        this.updateQueue();
        this.showToast(`Added ${this.elements.nameInput.value}`);

        this.elements.nameInput.value = '';
        this.elements.weightInput.value = '';
        this.elements.addButtonText.textContent = 'Add to Queue';
        this.elements.spinner.classList.add('hidden');
        this.validateInputs();
    }

    clearQueue() {
        this.queue = [];
        this.updateQueue();
        this.showToast('Queue cleared');
    }

    toggleSidebar() {
        this.elements.sidebar.classList.toggle('hidden');
    }

    setEvents() {
        this.elements.nameInput.addEventListener('input', () => this.validateInputs());
        this.elements.weightInput.addEventListener('input', () => this.validateInputs());
        this.elements.addButton.addEventListener('click', () => this.addToQueue());
        this.elements.clearQueueButton.addEventListener('click', () => this.clearQueue());
        this.elements.sidebarToggle.addEventListener('click', () => this.toggleSidebar());
    }
}

const laundrySystem = new LaundryQueueSystem();
window.laundrySystem = laundrySystem;
