
import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Cell } from '../models/cell.model';
import { BoardService } from './board.service';
import { Subscription } from 'rxjs';
import { interval } from 'rxjs';
import { State } from '../models/state.enum';
import { Rule } from '../models/rules.model';
import { Speed } from '../models/speed.interface';
import { ColorMode } from '../models/color-mode.interface';
import { TemplateService } from '../template/template.service';
import { TemplateBoard } from '../models/template-board.model';
import { defineGrid, extendHex } from 'honeycomb-grid';
import * as PIXI from 'pixi.js';


@Component({
  selector: 'gol-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css']
})
export class BoardComponent implements OnInit, OnDestroy {
  @ViewChild('pixiContainer', null) pixiContainer;
  pApp: any;

  speeds: Speed[] = [
    {name: 'Rapide',
  value: 100},
    {name: 'Moyenne',
  value: 250},
    {name: 'Lente',
  value: 500},
  ];
  speed: Speed = {
    name: 'Rapide',
    value: 100};
  colorModes: ColorMode[] = [
    {name: 'Classique'},
    {name: 'Evolué'},
    {name: 'HeatMap'},
  ];
  colorMode: ColorMode = {name: 'Classique'};

  categories: string[] = [];
  running = false;
  counterSubscription: Subscription;
  grid: Array<Array<Cell>> = [];
  gridSubcription: Subscription;
  templates: TemplateBoard[];
  templatesFiltered: TemplateBoard[];
  templateSubcription: Subscription;
  population = 0;
  rules: Rule[];
  rulesStr = [];
  selectedRuleStr = 'Conway';
  selectedRule: Rule;
  generationNumber = 0;
  maxHistoryValue = 0;
  constructor(private boardService: BoardService,
              private templateService: TemplateService) { }
  ngOnInit() {
    /* PIXI
    this.pApp = new PIXI.Application({ width: 600, height: 600 });
    this.pixiContainer.nativeElement.appendChild(this.pApp.view);
    const graphics = new PIXI.Graphics();

    const Grid = defineGrid(extendHex({
      size:50,
      orientation: 'flat'
    }));

    document.body.appendChild(this.pApp.view);
    // set a line style of 1px wide and color #999
    graphics.lineStyle(1, 0x999999);

    // render 10,000 hexes
    Grid.rectangle({ width: 10, height: 10 }).forEach(hex => {
        const point = hex.toPoint();
        // add the hex's position to each of its corner points
        const corners = hex.corners().map(corner => corner.add(point));
        // separate the first from the other corners
        const [firstCorner, ...otherCorners] = corners;

        // move the "pen" to the first corner
        graphics.moveTo(firstCorner.x, firstCorner.y);
        // draw lines to the other corners
        otherCorners.forEach(({ x, y }) => graphics.lineTo(x, y));
        // finish at the first corner
        graphics.lineTo(firstCorner.x, firstCorner.y);

        this.pApp.stage.addChild(graphics);

    });


    */
    this.gridSubcription = this.boardService.boardSubject.subscribe(
      (data) => {this.grid = data;
                 this.generationNumber++;
                 // compute population
                 // tslint:disable-next-line: no-shadowed-variable
                 const pop = this.grid.reduce((pop, row) => {
                   return pop + row.filter(cell => cell.isAlive()).length;
                 }, 0);
                 this.population = pop;
                 // compute max hystory for heatmap
                 const max = Math.max.apply(Math, this.grid.map(row => {
                    return Math.max.apply(Math, row.map(cell => {
                      return cell.countALive;
                  }));
                }));
                 this.maxHistoryValue = max;
                 // console.log(data);
        },
      (error) => {console.log(error); }
    );

    this.templateSubcription = this.templateService.templateBoardsSubject.subscribe(
      (data) => {this.templates = data;
                 this.categories = [];
                 this.templates.forEach(t => {
          this.categories.push(t.category);
        });
                 this.categories = this.categories.reduce((a, b) => {if (a.indexOf(b) < 0) {a.push(b); }return a; }, []);
                 // console.log(this.categories);
       },
      (error) => {console.log(error); }
    );
    this.templateService.getAllTemplates();

    this.rulesStr = this.boardService.getRules().map(r => r.name);
    this.selectedRule = this.boardService.getRules().find(r => r.name === this.selectedRuleStr);
    this.boardService.generateRandomBoard(30, 30, this.selectedRule);
    this.generationNumber = 0;
  }
  ngOnDestroy() {
    this.gridSubcription.unsubscribe();
    if (this.counterSubscription != null) {
      this.counterSubscription.unsubscribe();
    }
    this.templateSubcription.unsubscribe();
  }
  onToggleMouseOver(r: number, c: number, event) {
    // console.log(event);
    if (event.buttons === 1) {
      this.boardService.toggle(r, c);
      this.generationNumber = 0;
    }

  }
  onToggleClick(r: number, c: number, event) {
    // console.log(event);
    this.boardService.toggle(r, c);
    this.generationNumber = 0;

  }


  onRunAnimation() {
    const counter = interval(this.speed.value);
    this.counterSubscription = counter.subscribe(
      (value) => {
        this.boardService.iterateGeneration();
      },
      (error) => {
        console.log('Uh-oh, an error occurred! : ' + error);
      },
      () => {
        console.log('Observable complete!');
      }
    );
    this.running = true;
  }
  onStopAnimation() {
    if (this.counterSubscription != null) {
      this.counterSubscription.unsubscribe();
    }
    this.running = false;
  }

  onChangeAnimationSpeed() {
    if (this.running) {
      this.onStopAnimation();
      this.onRunAnimation();
    }

  }
  onClearBoard() {
    if (this.running) {
      this.onStopAnimation();
  }
    this.boardService.generatedEmptyBoard(100, 100, this.selectedRule);
    this.generationNumber = 0;
  }

  onMenuTemplate(t: TemplateBoard) {
    this.onStopAnimation();
    // console.log(t);
    this.boardService.generateTemplateBoard(t, this.selectedRule);
  }

  getCellColor(cell: Cell): string {

    if (this.colorMode != null) {
      if (this.colorMode.name === 'Classique') {
        return this.getClassicColor(cell);
      }
      if (this.colorMode.name === 'Evolué') {
        return this.getEvolveColor(cell);
      }
      if (this.colorMode.name === 'HeatMap') {
        return this.getHeatMapColor(cell);
      }
    }
  }
  getHeatMapColor(cell: Cell): string {
    const v = (1.0 - cell.countALive / this.maxHistoryValue) * 240;
    // tslint:disable-next-line: prefer-const
    let hal = 'hsl(' + v + ', 100%, 50%)';
    return hal;

  }
  getEvolveColor(cell: Cell): string {
    if (cell.state === State.None) { // dead
      return 'white';
    } else { // alive
      if (cell.previousGenerationState === State.None && cell.nextGenerationState === State.ALive) { // borning
        return 'green';
      }
      if (cell.previousGenerationState === State.None && cell.nextGenerationState === State.None) { // live only 1 generation
        return 'yellow';
      }
      if (cell.previousGenerationState === State.ALive && cell.nextGenerationState === State.None) { // dying
        return 'red';
      }
      if (cell.previousGenerationState === State.ALive && cell.nextGenerationState === State.ALive) { // alive
        return 'blue';
      }

    }
  }
  getClassicColor(cell: Cell): string {
    if (cell.state === State.None) { // dead
      return 'white';
    } else { // alive
      return 'black';
    }
  }

  onRuleChange() {
    // console.log(this.selectedRule);
    this.onStopAnimation();
    this.boardService.changeRule(this.selectedRule);
  }
  onRuleChangeStr() {
    // console.log(this.selectedRuleStr);
    this.selectedRule = this.boardService.getRules().find(r => r.name === this.selectedRuleStr);
    this.onStopAnimation();
    this.boardService.changeRule(this.selectedRule);

  }

  onMouseOverCategory(cat: string) {
    this.templatesFiltered = this.templates.filter(t => t.category === cat);

  }

}
