function redirectToPage(page) {
    window.location.href = page;
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

function purhcaseModal() {
    var dispImg = document.getElementById('displayedImage');
    console.log(dispImg.src);
    const item = {shop: "Shop", imageName: dispImg.src}

    const transaction = db_Stuff.transaction(['stuff_db'], 'readwrite');
    const objectStore = transaction.objectStore("stuff_db");
    var request = objectStore.add(item);

    request.addEventListener("success", () => { 
        console.log("db updated");
    });

    request.onerror = function(event) {
        console.log("db not updated: error");
        console.log(request.result);
    }
}

function equipModal() {
}

// Close modals by clicking outside of the modal content
window.onclick = function (event) {
    const modal = document.getElementsByClassName('modal');
    for (let i = 0; i < modal.length; i++) {
        if (event.target === modal[i]) {
            modal[i].style.display = 'none';
        }
    }
};