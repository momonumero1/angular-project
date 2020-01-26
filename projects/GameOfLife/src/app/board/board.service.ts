import { Injectable } from '@angular/core';
import { Cell } from '../models/cell.model';
import { Subject } from 'rxjs/internal/Subject';
import { State } from '../models/state.enum';
import { TemplateBoard } from '../models/template-board.model';
import { Template } from '@angular/compiler/src/render3/r3_ast';
import { GameOfLifeRule, Rule } from '../models/rules.model';


@Injectable({
  providedIn: 'root'
})
export class BoardService {


  boardSubject = new Subject<Array<Array<Cell>>>();
  board: Array<Array<Cell>> = [];

  constructor() {}


   emitBoard() {
    this.boardSubject.next(this.board.slice());
  }

  generateRandomBoard(height: number, width: number, rule: Rule) {
    const generatedBoard = new Array<Array<Cell>>();
    // tslint:disable-next-line: variable-name
    for (let _i = 0; _i < height; _i++) {
      const row = new Array<Cell>();
      // tslint:disable-next-line: variable-name
      for (let _j = 0; _j < width; _j++) {
        row.push(new Cell(this.getRandomInt(0, 2), this.getRandomInt(0, 2), rule));
      }
      generatedBoard.push(row);
    }
    this.board = generatedBoard;
    this.computeNextGeneration();
    this.emitBoard();
  }
  generatedEmptyBoard(height: number, width: number, rule: Rule) {
    const generatedBoard = new Array<Array<Cell>>();
    // tslint:disable-next-line: variable-name
    for (let _i = 0; _i < height; _i++) {
      const row = new Array<Cell>();
      // tslint:disable-next-line: variable-name
      for (let _j = 0; _j < width; _j++) {
        row.push(new Cell(State.None, State.None, rule));
      }
      generatedBoard.push(row);
    }
    this.board = generatedBoard;
    this.computeNextGeneration();
    // console.log(this.board);
    this.emitBoard();
  }


  generateTemplateBoard(template: TemplateBoard, rule: Rule) {
    // console.log(template);
    const generatedBoard = new Array<Array<Cell>>();
    // tslint:disable-next-line: variable-name
    for (let _i = 0; _i < template.height; _i++) {
      const row = new Array<Cell>();
      // tslint:disable-next-line: variable-name
      for (let _j = 0; _j < template.width; _j++) {
        row.push(new Cell(0, template.grid[_i][_j], rule));
      }
      generatedBoard.push(row);
    }
    this.board = generatedBoard;
    this.computeNextGeneration();
    // console.log(this.board);
    this.emitBoard();
  }


  getRandomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
  }
  toggle(r: number, c: number) {
    this.board[r][c].nextState();
    this.computeNextGeneration();
    this.emitBoard();
  }

  iterateGeneration() {
    const boardHeight = this.board.length;
    const boardWidth = this.board[0].length;
    // console.log(this.board);
    this.board.forEach(
      row => {
        row.forEach(
          cell => cell.shiftState()
        );
      }
    );
    // console.log(this.board);
    this.computeNextGeneration();
    // console.log(this.board);
    this.emitBoard();
  }

  computeNextGeneration() {
    const boardHeight = this.board.length;
    const boardWidth = this.board[0].length;
    // tslint:disable-next-line: prefer-for-of
    // tslint:disable-next-line: variable-name
    for (let _i = 0; _i < boardHeight; _i++) {
      // tslint:disable-next-line: prefer-for-of
      // tslint:disable-next-line: variable-name
      for (let _j = 0; _j < boardWidth; _j++) {
        const neighbors = new Array<Cell>();
        // console.log("i=" + _i +",j=" + _j);
        for (let u = -1; u <= 1; u++) {
            for (let v = -1; v <= 1; v++ ) {
              if (!(u === 0 && v === 0 ) &&
                  (_j + v >= 0 && _j + v < boardWidth && _i + u >= 0 && _i + u < boardHeight) ) {
                neighbors.push(this.board[_i + u][_j + v]);
              }
            }
          }
        this.board[_i][_j].computeNextGenerationState(neighbors.filter(cell => cell.isAlive()).length);

      }

    }

  }

  getRules(): Rule[] {
    return [
      this.getGameOfLifeRulesSpec(GameOfLifeRule.ConwayRule),
      this.getGameOfLifeRulesSpec(GameOfLifeRule.HighLifeRule)
    ];
  }
  getGameOfLifeRulesSpec(gameOfLifeRule: GameOfLifeRule): Rule {
    switch (gameOfLifeRule) {
        case GameOfLifeRule.ConwayRule:
            return {name: 'Conway', law: 'B3/S23'};
        case GameOfLifeRule.HighLifeRule:
            return {name: 'HighLife', law: 'B36/S23'};

    }
  }
  changeRule(selectedRule: Rule) {
    this.board.forEach(row => {
      row.forEach(cell =>
        cell.changeRules(selectedRule));
    });
    this.computeNextGeneration();
    this.emitBoard();
  }
}
