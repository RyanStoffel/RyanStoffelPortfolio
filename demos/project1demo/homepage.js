document.addEventListener('DOMContentLoaded', () => {
    const testButton = document.getElementById('testButton');
    const resultArea = document.getElementById('resultArea');

    let loading = false;

    const testDatabase = async () => {
        if (loading) return;

        loading = true;
        resultArea.className = 'loading';
        resultArea.textContent = 'Testing connection...';

        try {
            const response = await fetch('http://localhost:3001/api/test/database', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            const result = await response.json();
            resultArea.className = 'success';
            resultArea.textContent = result.message;
        } catch (err) {
            resultArea.className = 'error';
            resultArea.textContent = 'Error testing database: ' + err.message;
        } finally {
            loading = false;
        }
    };

    testButton.addEventListener('click', testDatabase);
}); 