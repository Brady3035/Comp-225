function redirectToPage(page) {
    window.location.href = page;
}

// Functions to handle modals
function openModal() {
    document.getElementById('imageModal').style.display = 'block';
}

function closeModal() {
    document.getElementById('imageModal').style.display = 'none';
}

function openImageModal(imageSrc) {
    const displayedImage = document.getElementById('displayedImage');
    displayedImage.src = imageSrc;
    document.getElementById('individualImageModal').style.display = 'block';
}

function closeIndividualModal() {
    document.getElementById('individualImageModal').style.display = 'none';
}

// Update the displayed points label
function updatePointsLabel() {
    const request = db_Points.transaction('points_db').objectStore('points_db').get('points');

    request.onsuccess = ()=> {
        labelPoints = request.result;
        console.log(labelPoints);
        const pointsLabel = document.getElementById('points-label');
        pointsLabel.textContent = `Points: ${Math.round(labelPoints)}`;
    }
}

function purhcaseModal() {
}

function equipModal() {
}

// Close modals on clicking outside the modal content
window.onclick = function (event) {
    const modal = document.getElementsByClassName('modal');
    for (let i = 0; i < modal.length; i++) {
        if (event.target === modal[i]) {
            modal[i].style.display = 'none';
        }
    }
};