import {FlatTreeControl} from '@angular/cdk/tree';
import {Component, Injectable} from '@angular/core';
import {MatTreeFlatDataSource, MatTreeFlattener} from '@angular/material/tree';
import {BehaviorSubject, Observable, of as observableOf} from 'rxjs';
export class FileNode {
   children?: FileNode[];
   filename: string;
   data: any;
}
export class FileFlatNode {
   constructor(
      public expandable: boolean, public filename: string, public level: number, public type: any) {}
}

interface Equipement {
  name: string;
  chassis: Chassis[];
}
interface Chassis {
  nameC: string;
  cards: Card[];
}
interface Card {
  nom: string;
}
const TREE_DATA: Equipement[] = [
  {
  name: 'E1',
  chassis: [
    {
    nameC: 'ch1',
    cards: [
      {
      nom: 'cd1'
      },
      {
      nom: 'cd2'
      }
    ]
    }
  ]
},
{
name: 'E2',
chassis: [{
  nameC: 'ch2',
  cards: [{
    nom: 'cd3'
  },
  {nom: 'cd4'}
]
},
{
  nameC: 'ch3',
  cards: [{
    nom: 'cd5'
  },
  {nom: 'cd6'}
]
}
]
}
];




@Injectable()
export class FileDatabase {
   dataChange = new BehaviorSubject<FileNode[]>([]);
   equipements: FileNode[] = [];
   get data(): FileNode[] { return this.dataChange.value; }
   constructor() {
      this.initialize();
   }
   initialize() {
      const dataObject = TREE_DATA;
      const data = this.equipementToTreeNodes(dataObject);
      this.dataChange.next(this.equipements);
   }
    private equipementToTreeNodes(equipements: Equipement[]) {
      for (const equ of equipements) {
          this.equipements.push(this.equipementToTreeNode(equ));
      }
    }

    private equipementToTreeNode(equi: Equipement): FileNode {
      const chassisTreeNodes: FileNode[] = [];

      if (equi.chassis !== undefined) {
          for (const c of equi.chassis) {
              chassisTreeNodes.push(this.chassisToTreeNode(c));
          }
      }
      return {
          filename: equi.name,
          data: equi,
          children: chassisTreeNodes
      };
    }
    private chassisToTreeNode(chassis: Chassis): FileNode {
      const cardTreeNodes: FileNode[] = [];

      if (chassis.cards !== undefined) {
          for (const c of chassis.cards) {
            cardTreeNodes.push(this.cardToTreeNode(c));
          }
      }
      return {
          filename: chassis.nameC,
          data: chassis,
          children: cardTreeNodes
      };
    }
    private cardToTreeNode(card: Card): FileNode {
      return {
        filename: card.nom,
        data: null,
        children: null
      };
  }
}
@Component({
   selector: 'mtt-root',
   templateUrl: 'app.component.html',
   styleUrls: ['app.component.css'],
   providers: [FileDatabase]
})
export class AppComponent {
   treeControl: FlatTreeControl<FileFlatNode>;
   treeFlattener: MatTreeFlattener<FileNode, FileFlatNode>;
   dataSource: MatTreeFlatDataSource<FileNode, FileFlatNode>;
   constructor(database: FileDatabase) {
      this.treeFlattener = new MatTreeFlattener(this.transformer, this._getLevel,
      this._isExpandable, this._getChildren);
      this.treeControl = new FlatTreeControl<FileFlatNode>(this._getLevel, this._isExpandable);
      this.dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);
      database.dataChange.subscribe(data => this.dataSource.data = data);
   }
   transformer = (node: FileNode, level: number) => {
      return new FileFlatNode(!!node.children, node.filename, level, node.data);
   }
   private _getLevel = (node: FileFlatNode) => node.level;
   private _isExpandable = (node: FileFlatNode) => node.expandable;
   private _getChildren = (node: FileNode): Observable<FileNode[]> => observableOf(node.children);
   hasChild = (_: number, _nodeData: FileFlatNode) => _nodeData.expandable;
}
