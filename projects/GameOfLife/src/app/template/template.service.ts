import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { TemplateBoard } from '../models/template-board.model';
import { Subject } from 'rxjs/internal/Subject';
import { TemplateDTO } from './template-dto';

@Injectable({
  providedIn: 'root'
})
export class TemplateService {

  private url = 'http://localhost:8080/api/v1/templates';

  private templateBoards: TemplateBoard[] = [];
  templateBoardsSubject = new Subject<TemplateBoard[]>();

  constructor(private http: HttpClient) { }

  getAllTemplates() {
    this.http.get<TemplateDTO[]>(this.url).subscribe(
      (data) => {
        this.templateBoards = [];
        data.forEach((t) => {
          this.templateBoards.push(this.parseToTemplateBoard(t));
        });

        this.templateBoardsSubject.next(this.templateBoards.slice());

      },
      (error) => {
        console.log(error);
      }
    );

  }

  parseToTemplateBoard(templateDTO: TemplateDTO): TemplateBoard {
    const template: TemplateBoard = {
      name: templateDTO.name,
      category: templateDTO.category,
      height: templateDTO.height,
      width: templateDTO.width,
      grid: JSON.parse(templateDTO.grid)
    };

    return template;
  }
  parseToTemplateDTO(templateBoard: TemplateBoard): TemplateDTO {
    const template: TemplateDTO = {
      id: null,
      name: templateBoard.name,
      category: templateBoard.category,
      height: templateBoard.height,
      width: templateBoard.width,
      grid: templateBoard.grid.toString()
    };

    return template;
  }


}
