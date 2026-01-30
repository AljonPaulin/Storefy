// ============================================================================
// MODULE 2: DECLARING VARIABLES
// ============================================================================
// 
let files = [];                    // Array to store lahat ng uploaded files
let currentFilter = 'All';         // Stores which filter is active like All, Document, Image, etc.
let currentView = 'grid';          // Stores current display mode grid or list ng mga files
let fileIdCounter = 0;             // Counter for generating unique file IDs like parang uniques ID ng mga files 1,2 3 basta sunod sunod na number yan
const MAX_STORAGE = 100;           // Maximum storage limit in MB 


// ============================================================================
// FUNCTION: getFileIcon
// PURPOSE: Returns yung appropriate na emoji icon based on file type
// MODULES USED: Module 3 (Logical Statements - switch), Module 5 (Functions)
// ============================================================================
function getFileIcon(type) {
    // Ginamit switch statement to check the file type tapos return molang yung mismong emoji
    switch (type) {
        case 'Document':
            return '📄';
        case 'Image':
            return '🖼️';
        case 'Video':
            return '🎥';
        case 'Audio':
            return '🎵';
        case 'Folder':
            return '📁';
        default:
            return '📋';
    }
}


// ============================================================================
// FUNCTION: getCurrentDate
// PURPOSE: Get the today's date and formats as MM/DD/YYYY
// MODULES USED: Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function getCurrentDate() {
    // Creates a new Date object basta gawa ng object para gumana yung mga built-in js method like getDate()
    const now = new Date();
    
    // Extracts month, day, and year from the date object
    const month = now.getMonth() + 1;  // getMonth() returns 0-11 tapos add 1 para 12 na kasi 12 months in a year
    const day = now.getDate();         // para makuha yung day of the month
    const year = now.getFullYear();    // get full year like 2024
    
    // Combine lahat into a formatted string then return
    return month + '/' + day + '/' + year;
}


// ============================================================================
// FUNCTION: uploadFile
// PURPOSE: Handles lahat ng uploading a new file to the system
// MODULES USED: Module 3 (Logical Statements), Module 4 (Loops and Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function uploadFile() {
    // Gets values from the input fields in the HTML form
    const name = document.getElementById('fileName').value.trim();  // File name with whitespace is removed
    const type = document.getElementById('fileType').value;         // File type Document, Image, etc.
    const sizeInput = document.getElementById('fileSize').value;    // File size as string
    const size = parseFloat(sizeInput);                             // Converts size to number

    // Checks if the name field is empty or blank
    if (name === '') {
        alert('Please enter a file name!');
        return;  // Stops the function if no name entered
    }

    // Calculates total storage currently used
    let currentStorage = 0;
    
    // Loops through all files to add up their sizes
    for (let i = 0; i < files.length; i++) {
        currentStorage += files[i].size;
    }

    // Checks if adding this file would exceed storage limit
    if (currentStorage + size > MAX_STORAGE) {
        alert('Not enough storage space! Delete some files first.');
        return;  // Stops the function if not enough space or storage
    }

    // Creates a new file object with all its properties
    const newFile = {
        id: fileIdCounter++,          // Assigns unique ID and increments counter like +1
        name: name,                   // File name
        type: type,                   // File type
        size: size,                   // File size in MB
        uploadDate: getCurrentDate()  // Current date
    };

    // Adds the new file to the files array
    files.push(newFile);

    // Clears the input fields after upload
    document.getElementById('fileName').value = '';
    document.getElementById('fileSize').value = '';

    // Updates the display to show the new file
    renderFiles();
    updateStats();
    updateStorageInfo();

    // Shows success message
    alert('✅ File uploaded successfully!');
}


// ============================================================================
// FUNCTION: filterFiles
// PURPOSE: Filters displayed files by type (All, Document, Image, etc.)
// MODULES USED: Module 3 (Logical Statements), Module 4 (Loops and Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function filterFiles(type, event) {
    // If clicking the same filter, do nothing
    if(type === currentFilter) return
   
    // Updates the current filter to the selected type
    currentFilter = type;
    
    // Gets all filter buttons on the page
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    // Removes 'active' class from all buttons
    filterButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Adds 'active' class to the clicked button
    event.target.classList.add('active');

    // Re-renders files with the new filter applied
    renderFiles();
}


// ============================================================================
// FUNCTION: toggleView
// PURPOSE: Switches between grid view and list view
// MODULES USED: Module 4 (Arrays), Module 5 (Functions),
//               Module 6 (Built-in JavaScript Methods)
// ============================================================================
function toggleView(view, event) {
    // Updates current view to either 'grid' or 'list'
    currentView = view;

    // Gets all view toggle buttons
    const viewButtons = document.querySelectorAll('.view-btn');
    
    // Removes 'active' class from all view buttons
    viewButtons.forEach(btn => {
        btn.classList.remove('active');
    });

    // Adds 'active' class to the clicked button
    event.target.classList.add('active');

    // Re-renders files in the new view format
    renderFiles();
}


// ============================================================================
// FUNCTION: deleteFile
// PURPOSE: Removes a specific file from the system
// MODULES USED: Module 3 (Logical Statements), Module 4 (Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function deleteFile(id) {
    // Shows confirmation dialog before deleting the file
    if (confirm('Are you sure you want to delete this file?')) {
        // Filters out the file with matching ID (removes it from array)
        files = files.filter(file => file.id !== id);
        
        // Updates the display after deletion
        renderFiles();
        updateStats();
        updateStorageInfo();
    }
}


// ============================================================================
// FUNCTION: renameFile
// PURPOSE: Changes the name of a specific file
// MODULES USED: Module 3 (Logical Statements), Module 4 (Loops and Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function renameFile(id) {
    // Variable to store the file we're looking for
    let foundFile = null;
    
    // Loops through all files to find the one with matching ID
    for (let i = 0; i < files.length; i++) {
        if (files[i].id === id) {
            foundFile = files[i];
            break;  // Stops loop once file is found
        }
    }

    // If file was found, prompt user for new name
    if (foundFile) {
        const newName = prompt('Enter new name:', foundFile.name);
        
        // If user entered a name and it's not empty
        if (newName && newName.trim() !== '') {
            foundFile.name = newName.trim();  // Updates file name
            renderFiles();                     // Re-renders to show new name
        }
    }
}


// ============================================================================
// FUNCTION: renderFiles
// PURPOSE: Main function that displays files on the page
// MODULES USED: Module 3 (Logical Statements), Module 4 (Loops and Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function renderFiles() {
    // Gets the HTML element where files will be displayed
    const display = document.getElementById('filesDisplay');

    // Clears any existing content
    display.innerHTML = '';

    // Array to hold files after filtering
    let filteredFiles = [];

    // Checks which filter is active and creates filtered list
    if (currentFilter === 'All') {
        filteredFiles = files;  // Shows all files
    } else {
        // Loops through files and only adds ones matching the filter
        for (let i = 0; i < files.length; i++) {
            if (files[i].type === currentFilter) {
                filteredFiles.push(files[i]);
            }
        }
    }

    // If no files to display then show empty message
    if (filteredFiles.length === 0) {
        display.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📂</div>
                <h3>No files yet</h3>
                <p>Upload your first file to get started!</p>
            </div>
        `;
        return;  // Stops function here
    }

    // Displays files in either grid or list view
    if (currentView === 'grid') {
        renderGridView(filteredFiles, display);
    } else {
        renderListView(filteredFiles, display);
    }
}


// ============================================================================
// FUNCTION: renderGridView
// PURPOSE: Displays files in a grid layout (cards)
// MODULES USED: Module 4 (Loops and Arrays), Module 5 (Functions),
//               Module 6 (Built-in JavaScript Methods)
// ============================================================================
function renderGridView(filteredFiles, display) {
    // Creates a container div for the grid
    const grid = document.createElement('div');
    grid.className = 'files-grid';

    // Loops through each file to create a card
    for (let i = 0; i < filteredFiles.length; i++) {
        const file = filteredFiles[i];
        const icon = getFileIcon(file.type);  // Gets appropriate icon

        // Creates a card element for this file
        const card = document.createElement('div');
        card.className = 'file-card';

        // Sets the HTML content of the card with file info and buttons
        card.innerHTML = `
            <div class="file-icon">${icon}</div>
            <div class="file-name">${file.name}</div>
            <div class="file-info">${file.size} MB • ${file.uploadDate}</div>
            <div class="file-actions">
                <button class="action-btn btn-rename" onclick="renameFile(${file.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteFile(${file.id})">Delete</button>
            </div>
        `;

        // Adds this card to the grid
        grid.appendChild(card);
    }

    // Adds the complete grid to the display area
    display.appendChild(grid);
}


// ============================================================================
// FUNCTION: renderListView
// PURPOSE: Displays files in a list/ layout
// MODULES USED: Module 4 (Loops and Arrays), Module 5 (Functions),
//               Module 6 (Built-in JavaScript Methods)
// ============================================================================
function renderListView(filteredFiles, display) {
    // Creates a container div for the list
    const list = document.createElement('div');
    list.className = 'files-list';

    // Creates header row with column titles
    const header = document.createElement('div');
    header.className = 'list-header';
    header.innerHTML = `
        <div>Type</div>
        <div>Name</div>
        <div>Size</div>
        <div>Type</div>
        <div>Date</div>
        <div>Actions</div>
    `;
    list.appendChild(header);

    // Loops through each file to create a list row
    for (let i = 0; i < filteredFiles.length; i++) {
        const file = filteredFiles[i];
        const icon = getFileIcon(file.type);  // Gets appropriate icon

        // Creates a row element for this file
        const row = document.createElement('div');
        row.className = 'file-list-item';

        // Sets the HTML content of the row with file info in columns
        row.innerHTML = `
            <div class="list-icon">${icon}</div>
            <div class="list-name">${file.name}</div>
            <div class="list-info">${file.size} MB</div>
            <div class="list-info">${file.type}</div>
            <div class="list-info">${file.uploadDate}</div>
            <div class="file-actions">
                <button class="action-btn btn-rename" onclick="renameFile(${file.id})">Edit</button>
                <button class="action-btn btn-delete" onclick="deleteFile(${file.id})">Delete</button>
            </div>
        `;

        // Adds this row to the list
        list.appendChild(row);
    }

    // Adds the complete list to the display area
    display.appendChild(list);
}


// ============================================================================
// FUNCTION: updateStats
// PURPOSE: Updates the statistics showing count of each file type
// MODULES USED: Module 2 (Variables), Module 3 (Logical Statements),
//               Module 4 (Loops and Arrays), Module 5 (Functions),
//               Module 6 (Built-in JavaScript Methods)
// ============================================================================
function updateStats() {
    // Gets total number of files
    const total = files.length;
    
    // Variables to count each type of file
    let docCount = 0; 
    let imageCount = 0; 
    let videoCount = 0; 
    let audioCount = 0; 

    // Loops through all files to count each type
    for (let i = 0; i < files.length; i++) {
        const type = files[i].type;
        
        // Checks file type and increments appropriate counter
        if (type === 'Document') {
            docCount++;
        } else if (type === 'Image') {
            imageCount++;
        } else if (type === 'Video') {
            videoCount++;
        } else if (type === 'Audio') {
            audioCount++;
       }
    }

    // Updates the HTML elements to display the counts
    document.getElementById('totalFiles').textContent = total;
    document.getElementById('totalDocs').textContent = docCount;
    document.getElementById('totalImages').textContent = imageCount;
    document.getElementById('totalVideos').textContent = videoCount;
    document.getElementById('totalAudios').textContent = audioCount;
}


// ============================================================================
// FUNCTION: updateStorageInfo
// PURPOSE: Calculates and displays storage usage information
// MODULES USED: Module 2 (Variables), Module 4 (Loops and Arrays),
//               Module 5 (Functions), Module 6 (Built-in JavaScript Methods)
// ============================================================================
function updateStorageInfo() {
    // Variable to track total storage used
    let totalUsed = 0; 

    // Loops through all files and adds up their sizes
    for (let i = 0; i < files.length; i++) {
        totalUsed += files[i].size;
    }

    // Rounds to 2 decimal places for cleaner display
    totalUsed = Math.round(totalUsed * 100) / 100;

    // Calculates what percentage of storage is used
    const percentage = Math.round((totalUsed / MAX_STORAGE) * 100);

    // Updates the HTML element to show storage info
    document.getElementById('storageInfo').textContent = 
        `${totalUsed} MB used of ${MAX_STORAGE} MB (${percentage}%)`;
}