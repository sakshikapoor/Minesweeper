import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	rows = 10;
	cols = 10;
	grid = [];
	noOfBombs = 5;
	message = "";
	revealedBlocks = 0;

	ngOnInit() {
		this.initialize();
	}

	initialize() {
		this.initializeGrid();
		this.initializeRandomBombs();
		this.setValue();
		this.message = "";
		this.revealedBlocks = 0;
	}

	setValue() {
		for (let i = 0; i < this.rows; i++) {
			for (let j = 0; j < this.cols; j++) {
				this.countDistance(i, j);
			}
		}
	}

	countDistance(x, y) {
		let count = 0;
		for (let i = -1; i <= 1; i++) {
			for (let j = -1; j <= 1; j++) {
				try {
					if (this.grid[x + i][y + j].hasBomb) {
						count = count + 1;
					}
				} catch (exception) { }
			}
		}
		this.grid[x][y].value = count;
	}

	showRelatedBlocks(x, y) {
		this.grid[x][y].revealed = true;
		this.revealedBlocks++;
		if (this.grid[x][y].value === 0) {
			for (let i = -1; i <= 1; i++) {
				for (let j = -1; j <= 1; j++) {
					try {
						if (!this.grid[x + i][y + j].hasBomb && !this.grid[x + i][y + j].revealed) {
							this.showRelatedBlocks(x + i, y + j);
						}
					}
					catch (message) { }
				}
			}
		}
	}

	initializeRandomBombs() {
		for (let i = 0; i < this.noOfBombs; i++) {
			const x = Math.floor(Math.random() * this.rows);
			const y = Math.floor(Math.random() * this.cols);
			if (!this.grid[x][y].hasBomb) {
				this.grid[x][y].hasBomb = true;
			} else {
				i--;
			}
		}
	}

	initializeGrid() {
		for (let i = 0; i < this.rows; i++) {
			this.grid[i] = new Array(this.rows);
			for (let j = 0; j < this.cols; j++) {
				this.grid[i][j] = {
					revealed: false,
					hasBomb: false,
					value: -1
				}
			}
		}
	}

	showGrid() {
		for (let x = 0; x < this.rows; x++) {
			for (let y = 0; y < this.cols; y++) {
				this.grid[x][y].revealed = true;

			}
		}
	}

	clickBlock(x, y) {
		if (this.grid[x][y].hasBomb) {
			this.message = 'You lose';
			this.showGrid();
			return;
		}
		this.grid[x][y].revealed = true;
		if (this.grid[x][y].value === 0) {
			this.showRelatedBlocks(x, y);
		} else {
			this.revealedBlocks++;
		}
		this.hasWon();
	}

	hasWon() {
		if ((this.rows * this.cols) - this.noOfBombs === (this.revealedBlocks)) {
			this.message = "You Won! :)";
			this.showGrid();
		}
	}
}
