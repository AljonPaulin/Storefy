 // ALL FUNCTIONS IS JAVASCIPT FUNCTIONS IN MODULE5 WHICH IS TO CREATE FUNCTIONS
 
 // MODULE 2 DECLARING VARIABLES
 let files = [];
 let currentFilter = 'All'; 
 let currentView = 'grid';
 let fileIdCounter = 0;
 const MAX_STORAGE = 100;

 

 // MODULE 3 : LOGICAL STATEMENT this is a switch statement
 // displaying the icon of each type of file like if the file is document type then document icon will display
 function getFileIcon(type) {
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


 // MODULE 6 BUILT-IN JAVASCRIPT METHOD
 // This is a method that is already javascipt method
 // Get the current date
 function getCurrentDate() {
     const now = new Date();   // get the date now
     const month = now.getMonth() + 1; // built-in javascipt method to get the month
     const day = now.getDate(); // built-in javascipt method to get the exact day
     const year = now.getFullYear(); // built-in javascipt method to get the year
     
     return month + '/' + day + '/' + year; // it will return the text of all exact date
 }


 // For uploading the type of file
 function uploadFile() {
     const name = document.getElementById('fileName').value.trim(); // get the name in the input box
     const type = document.getElementById('fileType').value; // get the type of file
     const sizeInput = document.getElementById('fileSize').value; // get the number of size of the example file
     const size = parseFloat(sizeInput); // change the whole number to decimal


     // checking if the name is not blank if you click the upload file
     if (name === '') {
         alert('Please enter a file name!');
         return;
     }

     // create temporary storage first
     let currentStorage = 0;

     // loop through all files to add all the file size
     for (let i = 0; i < files.length; i++) {
         currentStorage += files[i].size;
     }

     // checking if the storage if full
     if (currentStorage + size > MAX_STORAGE) {
         alert('Not enough storage space! Delete some files first.');
         return;
     }

     // create new file
     const newFile = {
         id: fileIdCounter++, 
         name: name,         
         type: type,         
         size: size,         
         uploadDate: getCurrentDate()
     };

     // push the file or adding the file in the array
     files.push(newFile);

     // reset the filename and size to become empty
     document.getElementById('fileName').value = '';
     document.getElementById('fileSize').value = '';

     renderFiles(); // render all display update list of files
     updateStats(); // update the status to count how many files are there
     updateStorageInfo(); // update the storage info

     alert('✅ File uploaded successfully!'); // display the status
 }


 // filtering the what files to display base on type of files
 // same function for all buttons
 function filterFiles(type, event) {

     // checking the type first to avoid duplication or running the function twice with the button click multiple times
     if(type === currentFilter) return
    
     currentFilter = type;
     const filterButtons = document.querySelectorAll('.filter-btn'); // select all filter buttons
     // remove the active class of all buttons which is the one responsible to color the button into  blue
     filterButtons.forEach(btn => {
         btn.classList.remove('active');
     });

     // add blue the specific button base on where the user click
     event.target.classList.add('active');

     // render again but filtered files only
     renderFiles();
 }


 // for changing between grid or list view of files
 function toggleView(view, event) {
     currentView = view;

     const viewButtons = document.querySelectorAll('.view-btn');
     viewButtons.forEach(btn => {
         btn.classList.remove('active');
     });

     event.target.classList.add('active');

     renderFiles();
 }


 //For deleting specific file
 function deleteFile(id) {
     if (confirm('Are you sure you want to delete this file?')) {
         files = files.filter(file => file.id !== id);
         
         renderFiles(); // display all files withtout the deleted files
         updateStats(); // update the status or the number files still exist in the system
         updateStorageInfo(); // update info like the storage
     }
 }


 //For renaming specific file
 function renameFile(id) {
     let foundFile = null;
     //MODULE 4 LOOPS
     for (let i = 0; i < files.length; i++) {
         if (files[i].id === id) {
             foundFile = files[i];
             break;
         }
     }

     if (foundFile) {
         const newName = prompt('Enter new name:', foundFile.name);
         
         if (newName && newName.trim() !== '') {
             foundFile.name = newName.trim();
             renderFiles();
         }
     }
 }


 // For just displaying like download but not really downloading
 function downloadFile(id) {
     for (let i = 0; i < files.length; i++) {
         if (files[i].id === id) {
             alert(`📥 Downloading: ${files[i].name} (${files[i].size} MB)`);
             break;
         }
     }
 }

 // displaying files in the system
 function renderFiles() {
     const display = document.getElementById('filesDisplay');

     display.innerHTML = '';

     let filteredFiles = [];

     if (currentFilter === 'All') {
         filteredFiles = files;
     } else {
         for (let i = 0; i < files.length; i++) {
             if (files[i].type === currentFilter) {
                 filteredFiles.push(files[i]);
             }
         }
     }

     // if there no file then display like empty icon to no files found
     if (filteredFiles.length === 0) {
         display.innerHTML = `
             <div class="empty-state">
                 <div class="empty-icon">📂</div>
                 <h3>No files yet</h3>
                 <p>Upload your first file to get started!</p>
             </div>
         `;
         return;
     }

     if (currentView === 'grid') {
         renderGridView(filteredFiles, display);
     } else {
         renderListView(filteredFiles, display);
     }
 }

 // DIsplaying in grid style of all files
 function renderGridView(filteredFiles, display) {
     const grid = document.createElement('div');
     grid.className = 'files-grid';

     for (let i = 0; i < filteredFiles.length; i++) {
         const file = filteredFiles[i];
         const icon = getFileIcon(file.type);

         const card = document.createElement('div');
         card.className = 'file-card';

         card.innerHTML = `
             <div class="file-icon">${icon}</div>
             <div class="file-name">${file.name}</div>
             <div class="file-info">${file.size} MB • ${file.uploadDate}</div>
             <div class="file-actions">
                 <button class="action-btn btn-download" onclick="downloadFile(${file.id})">📥</button>
                 <button class="action-btn btn-rename" onclick="renameFile(${file.id})">✏️</button>
                 <button class="action-btn btn-delete" onclick="deleteFile(${file.id})">🗑️</button>
             </div>
         `;

         grid.appendChild(card);
     }

     display.appendChild(grid);
 }

  // Displaying in list style of all files
 function renderListView(filteredFiles, display) {
     const list = document.createElement('div');
     list.className = 'files-list';

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

     for (let i = 0; i < filteredFiles.length; i++) {
         const file = filteredFiles[i];
         const icon = getFileIcon(file.type);

         const row = document.createElement('div');
         row.className = 'file-list-item';

         row.innerHTML = `
             <div class="list-icon">${icon}</div>
             <div class="list-name">${file.name}</div>
             <div class="list-info">${file.size} MB</div>
             <div class="list-info">${file.type}</div>
             <div class="list-info">${file.uploadDate}</div>
             <div class="file-actions">
                 <button class="action-btn btn-download" onclick="downloadFile(${file.id})">📥</button>
                 <button class="action-btn btn-rename" onclick="renameFile(${file.id})">✏️</button>
                 <button class="action-btn btn-delete" onclick="deleteFile(${file.id})">🗑️</button>
             </div>
         `;

         list.appendChild(row);
     }

     display.appendChild(list);
 }

 //Updating how many type of files in the system
 function updateStats() {
     const total = files.length;
     let docCount = 0; 
     let imageCount = 0; 
     let videoCount = 0; 
     let audioCount = 0; 

     for (let i = 0; i < files.length; i++) {
         const type = files[i].type;
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

     document.getElementById('totalFiles').textContent = total;
     document.getElementById('totalDocs').textContent = docCount;
     document.getElementById('totalImages').textContent = imageCount;
     document.getElementById('totalVideos').textContent = videoCount;
     document.getElementById('totalAudios').textContent = audioCount;
 }


 //Updating the storage for how many storage is still there
 function updateStorageInfo() {
     let totalUsed = 0; 

     for (let i = 0; i < files.length; i++) {
         totalUsed += files[i].size;
     }

     totalUsed = Math.round(totalUsed * 100) / 100;

     const percentage = Math.round((totalUsed / MAX_STORAGE) * 100);

     document.getElementById('storageInfo').textContent = 
         `${totalUsed} MB used of ${MAX_STORAGE} MB (${percentage}%)`;
 }

 // Starting Function
 function runStart() {
     renderFiles();
     updateStats();
     updateStorageInfo();
 }


 // start
 runStart();