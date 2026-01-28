 let files = []; // Array to store files
 let currentFilter = 'All'; 
 let currentView = 'grid';
 let fileIdCounter = 0;
 const MAX_STORAGE = 100;

 
 function getFileIcon(type) {
     if (type === 'Document') {
         return '📄';
     } else if (type === 'Image') {
         return '🖼️';
     } else if (type === 'Video') {
         return '🎥';
     } else if (type === 'Audio') {
         return '🎵';
     } else if (type === 'Folder') {
         return '📁';
     } else {
         return '📋';
     }
 }

 function getCurrentDate() {
     const now = new Date();
     const month = now.getMonth() + 1;
     const day = now.getDate();
     const year = now.getFullYear();
     
     return month + '/' + day + '/' + year;
 }

 function uploadFile() {
     const name = document.getElementById('fileName').value.trim(); 
     const type = document.getElementById('fileType').value; 
     const sizeInput = document.getElementById('fileSize').value;
     const size = parseFloat(sizeInput); 

     if (name === '') {
         alert('Please enter a file name!');
         return;
     }

     let currentStorage = 0;
     
     for (let i = 0; i < files.length; i++) {
         currentStorage += files[i].size;
     }

     if (currentStorage + size > MAX_STORAGE) {
         alert('Not enough storage space! Delete some files first.');
         return;
     }

     const newFile = {
         id: fileIdCounter++, 
         name: name,         
         type: type,         
         size: size,         
         uploadDate: getCurrentDate()
     };

     files.push(newFile);

     document.getElementById('fileName').value = '';
     document.getElementById('fileSize').value = '';

     renderFiles();
     updateStats();
     updateStorageInfo();

     alert('✅ File uploaded successfully!');
 }

 function filterFiles(type,event) {
     if(type === currentFilter) return
    
     currentFilter = type;
     const filterButtons = document.querySelectorAll('.filter-btn');
     filterButtons.forEach(btn => {
         btn.classList.remove('active');
     });

     event.target.classList.add('active');

     renderFiles();
 }

 function toggleView(view) {
     currentView = view;

     const viewButtons = document.querySelectorAll('.view-btn');
     viewButtons.forEach(btn => {
         btn.classList.remove('active');
     });

     event.target.classList.add('active');

     renderFiles();
 }

 function deleteFile(id) {
     if (confirm('Are you sure you want to delete this file?')) {
         files = files.filter(file => file.id !== id);
         
         renderFiles();
         updateStats();
         updateStorageInfo();
     }
 }

 function renameFile(id) {
     let foundFile = null;
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

 function updateStats() {
     const total = files.length;
     let docCount = 0; 
     let imageCount = 0; 
     let videoCount = 0; 

     for (let i = 0; i < files.length; i++) {
         const type = files[i].type;
         if (type === 'Document') {
             docCount++;
         } else if (type === 'Image') {
             imageCount++;
         } else if (type === 'Video') {
             videoCount++;
         }
     }

     document.getElementById('totalFiles').textContent = total;
     document.getElementById('totalDocs').textContent = docCount;
     document.getElementById('totalImages').textContent = imageCount;
     document.getElementById('totalVideos').textContent = videoCount;
 }

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