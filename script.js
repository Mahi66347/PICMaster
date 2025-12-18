document.getElementById('drop-area').addEventListener('click', function() {
    // Inga thaan Google Login link pannanum
    alert("Redirecting to Google Login...");
    
    // Once login success, intha message kaatanum:
    document.getElementById('drop-area').classList.add('hidden');
    document.getElementById('status-msg').classList.remove('hidden');
});