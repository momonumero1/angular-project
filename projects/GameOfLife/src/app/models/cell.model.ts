import { State } from './state.enum';
import { GameOfLifeRule, Rule } from './rules.model';

export class Cell {


  previousGenerationState: State;
  state: State;
  nextGenerationState: State;

  rule: Rule;
  countALive = 0;

  nextState() {
    this.state++;
    if (this.state >= State.Size) {
      this.state = State.None;
    }
  }
  constructor(previousGenerationState: State, state: State, rule: Rule) {
    this.previousGenerationState = previousGenerationState;
    this.state = state;
    this.rule = rule;
  }

  isAlive(): boolean {
    return this.state === State.ALive;
  }

  computeNextGenerationState(aliveNeighbors: number) {
    // console.log(aliveNeighbors);

    if (this.computeRule(this.rule, aliveNeighbors, this.isAlive())) {
      this.nextGenerationState = State.ALive;
    } else {
      this.nextGenerationState = State.None;
    }

    if (this.state === State.ALive) {
      this.countALive++;
    }
    // console.log(this);
  }
  shiftState(): void {
    this.previousGenerationState = this.state;
    this.state = this.nextGenerationState;
    this.nextGenerationState = State.None;

  }

  computeRule(rule: Rule, aliveNeighbors: number, isALive: boolean): boolean {
    const law = rule.law;
    const laws = law.split('/');
    const bornLaw = laws[0];
    const surviveLaw = laws[1];
    const bornLawB = !isALive && bornLaw.split('').filter(n => parseInt(n, 10) === aliveNeighbors).length !== 0;
    const bornLawS = isALive && surviveLaw.split('').filter(n => parseInt(n, 10) === aliveNeighbors).length !== 0;

    return bornLawB || bornLawS;
  }

  changeRules(selectedRule: Rule): void {
    this.rule = selectedRule;
  }
}
