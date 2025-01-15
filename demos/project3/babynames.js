class BabyNames {
    constructor() {
        this.console = document.getElementById('javaConsole');
        this.canvas = document.getElementById('graphCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.namesData = {};
        this.decades = ['1890', '1900', '1910', '1920', '1930', '1940', '1950', '1960', '1970', '1980', '1990', '2000', '2010'];
        
        // Set up canvas
        this.setupCanvas();
        
        // Load the names data
        fetch('names.txt')
            .then(response => response.text())
            .then(data => {
                this.parseNamesData(data);
                this.println("Welcome to Baby Names Popularity!");
                this.println("Enter a name to search:");
            })
            .catch(error => {
                console.error('Error loading names data:', error);
                this.println("Error loading names data. Please try again later.");
            });
    }

    setupCanvas() {
        // Set canvas size with proper scaling
        this.canvas.width = this.canvas.offsetWidth * window.devicePixelRatio;
        this.canvas.height = this.canvas.offsetHeight * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = this.canvas.offsetWidth + 'px';
        this.canvas.style.height = this.canvas.offsetHeight + 'px';
    }

    println(text) {
        this.console.value += text + "\n";
        this.console.scrollTop = this.console.scrollHeight;
    }

    parseNamesData(data) {
        const lines = data.split('\n');
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length >= 14) {
                const name = parts[0].toUpperCase();
                const gender = parts[1];
                const ranks = parts.slice(2).map(rank => parseInt(rank) || 0);
                
                if (!this.namesData[name]) {
                    this.namesData[name] = {};
                }
                this.namesData[name][gender] = ranks;
            }
        });
    }

    drawGraph(name, gender, ranks) {
        // Clear the canvas
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        const padding = 60;
        const graphWidth = width - (padding * 2);
        const graphHeight = height - (padding * 2);
        const barWidth = graphWidth / 13;

        // Draw axes
        this.ctx.beginPath();
        this.ctx.moveTo(padding, padding);
        this.ctx.lineTo(padding, height - padding);
        this.ctx.lineTo(width - padding, height - padding);
        this.ctx.stroke();

        // Draw bars and rank numbers
        ranks.forEach((rank, i) => {
            if (rank > 0) {
                const barHeight = ((1000 - rank) / 1000) * graphHeight;
                
                // Draw bar
                this.ctx.fillStyle = '#90EE90';
                const barX = padding + (i * barWidth);
                const barY = height - padding - barHeight;
                
                this.ctx.fillRect(
                    barX,
                    barY,
                    barWidth - 2,
                    barHeight
                );

                // Draw rank number above bar
                this.ctx.fillStyle = '#000';
                this.ctx.font = 'bold 14px Arial';
                this.ctx.textAlign = 'center';
                this.ctx.fillText(
                    rank.toString(),
                    barX + (barWidth - 2) / 2,
                    barY - 10
                );
            }
        });

        // Draw decade labels
        this.ctx.fillStyle = '#000';
        this.ctx.font = '12px Arial';
        this.decades.forEach((decade, i) => {
            this.ctx.save();
            this.ctx.translate(
                padding + (i * barWidth) + (barWidth / 2),
                height - padding + 20
            );
            this.ctx.rotate(Math.PI / 4);
            this.ctx.fillText(decade, 0, 0);
            this.ctx.restore();
        });

        // Draw title
        this.ctx.font = 'bold 18px Arial';
        this.ctx.textAlign = 'center';
        this.ctx.fillText(
            `${name} (${gender}) Popularity Ranking`,
            width / 2,
            padding - 30
        );

        // Add grid lines (optional)
        this.ctx.strokeStyle = '#eee';
        this.ctx.setLineDash([2, 2]);
        for (let i = 100; i <= 1000; i += 100) {
            const y = height - padding - ((i / 1000) * graphHeight);
            this.ctx.beginPath();
            this.ctx.moveTo(padding, y);
            this.ctx.lineTo(width - padding, y);
            this.ctx.stroke();
        }
        this.ctx.setLineDash([]);
    }

    displayNameData(input) {
        // Split input and convert name to proper case (first letter capital, rest lowercase)
        const [nameRaw, genderRaw] = input.split(/\s+/);
        const name = nameRaw.charAt(0).toUpperCase() + nameRaw.slice(1).toLowerCase();
        const gender = genderRaw.toUpperCase();
        const upperName = name.toUpperCase();
        
        if (!this.namesData[upperName] || !this.namesData[upperName][gender]) {
            this.println(`No data found for ${name} (${gender})`);
            this.println("Please try another name (format: NAME GENDER, e.g., 'John M' or 'Mary F')");
            return;
        }

        const ranks = this.namesData[upperName][gender];
        
        this.println(`\nRankings for ${name} (${gender}):`);
        this.println("Year   Rank");
        this.println("----   ----");
        
        ranks.forEach((rank, index) => {
            if (rank > 0) {
                this.println(`${this.decades[index]}   ${rank}`);
            }
        });
        
        // Draw the graph with properly cased name
        this.drawGraph(name, gender, ranks);
        
        this.println("\nEnter another name to search (or type 'quit' to exit):");
    }
}

let nameSearch = new BabyNames();

function handleInput(event) {
    if (event.key === 'Enter') {
        const input = event.target.value.trim();
        event.target.value = '';

        if (input.toLowerCase() === 'quit') {
            nameSearch.println("Thank you for using Baby Names Popularity!");
            return;
        }

        // Updated regex to be case insensitive
        if (!/^[A-Za-z]+\s+[MFmf]$/.test(input)) {
            nameSearch.println("Invalid format. Please enter a name and gender (M/F) separated by space.");
            nameSearch.println("Example: 'John M' or 'Mary F'");
            return;
        }

        nameSearch.displayNameData(input);
    }
}

// Handle window resize
window.addEventListener('resize', () => {
    nameSearch.setupCanvas();
    // Redraw the last search if there was one
    const input = document.getElementById('userInput').value.trim();
    if (input) {
        nameSearch.displayNameData(input);
    }
}); 