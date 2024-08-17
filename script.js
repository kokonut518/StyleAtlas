document.addEventListener('DOMContentLoaded', function() {
    const photoScrollRows = [
        document.getElementById('photo-scroll-row1'),
        document.getElementById('photo-scroll-row2'),
        document.getElementById('photo-scroll-row3')
    ];
    const photoCount = 10; // number of unique photos to display
    const uploadForm = document.getElementById('upload-form');
    const searchButton = document.getElementById('search-button');
    const photoGrid = document.getElementById('photo-grid');

    function getRandomPhotoUrl() {
        const photos = ['images/london.jpg', 'images/barcelona.jpeg', 'images/seoul.jpeg', 'images/sydney.jpg', 'images/copenhagen.jpg',
                        'images/vancouver.jpg', 'images/losangeles.jpg', 'images/shanghai.jpg', 'images/florida.jpg', 'images/rome.jpg', 'images/madrid.jpg'];
        return photos[Math.floor(Math.random() * photos.length)];
    }

    function loadScrollPhotos() {
        photoScrollRows.forEach(row => {
            const photoUrls = [];
            for (let i = 0; i < photoCount; i++) {
                photoUrls.push(getRandomPhotoUrl());
            }

            // Create initial set of photos
            photoUrls.forEach(url => createPhotoElement(url, row));

            // Duplicate the photos to create a seamless loop
            photoUrls.forEach(url => createPhotoElement(url, row));
        });
    }

    function createPhotoElement(url, row) {
        const photoElement = document.createElement('div');
        photoElement.className = 'scroll-photo-item';
        
        const img = document.createElement('img');
        img.src = url;
        img.alt = 'Travel photo';
        
        photoElement.appendChild(img);
        row.appendChild(photoElement);
    }

    loadScrollPhotos();

    uploadForm.addEventListener('submit', function(e) {
        e.preventDefault();
        uploadPhoto();
    });

    searchButton.addEventListener('click', searchPhotos);

    // In your script.js file

    function uploadPhoto() {
        const photoFile = document.getElementById('photo-file').files[0];
        const country = document.getElementById('country').value;

        if (!photoFile) {
            alert('Please select a file to upload');
            return;
        }

        const formData = new FormData();
        formData.append('photo', photoFile);
        formData.append('country', country);

        fetch('http://localhost:3000/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(result => {
            alert('Photo uploaded successfully!');
            uploadForm.reset();
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error uploading photo');
        });
    }

    function searchPhotos() {
        const searchCountry = document.getElementById('search-country').value;

        fetch(`http://localhost:3000/photos?country=${searchCountry}`)
        .then(response => response.json())
        .then(photos => {
            displayResults(photos);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error fetching photos');
        });
    }

    function displayResults(photos) {
        photoGrid.innerHTML = '';
        photos.forEach(photo => {
            const photoElement = document.createElement('div');
            photoElement.className = 'photo-item';
            photoElement.innerHTML = `
                <img src="http://localhost:3000/uploads/${photo.filename}" alt="Photo from ${photo.country}">
                <p>${photo.country}</p>
            `;
            photoGrid.appendChild(photoElement);
        });
    }
});