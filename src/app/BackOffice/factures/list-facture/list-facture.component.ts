import { Component } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Sort } from '@angular/material/sort';
import { Facture } from 'src/app/models/facture';
import { pageSelection } from 'src/app/models/others';
import { FactureServiceService } from 'src/app/services/facture/facture-service.service';
 
@Component({
  selector: 'app-list-facture',
  standalone: false,
  templateUrl: './list-facture.component.html',
})
export class ListFactureComponent {
  public facturesList: Array<Facture> = [];
  dataSource!: MatTableDataSource<Facture>;

  public showFilter = false;
  public searchDataValue = '';
  public lastIndex = 0;
  public pageSize = 10;
  public totalData = 0;
  public skip = 0;
  public limit: number = this.pageSize;
  public pageIndex = 0;
  public serialNumberArray: Array<number> = [];
  public currentPage = 1;
  public pageNumberArray: Array<number> = [];
  public pageSelection: Array<pageSelection> = [];
  public totalPages = 0;

  constructor(private factureService: FactureServiceService) {}

  ngOnInit(): void {
    this.getTableData();
  }

  public getTableData(): void {
    this.facturesList = [];
    this.serialNumberArray = [];

    this.factureService.getAllFactures().subscribe((data: Facture[]) => {
      this.totalData = data.length;
      console.log(data);
      data.map((res: Facture, index: number) => {
        const serialNumber = index + 1;
        if (index >= this.skip && serialNumber <= this.limit) {
          this.facturesList.push(res);
          this.serialNumberArray.push(serialNumber);
        }
      });
      this.dataSource = new MatTableDataSource<Facture>(this.facturesList);
      this.calculateTotalPages(this.totalData, this.pageSize);
    });
  }

  public searchData(value: any): void {
    this.dataSource.filter = value.trim().toLowerCase();
    this.facturesList = this.dataSource.filteredData;
  }

  public sortData(sort: Sort): void {
    const data = this.facturesList.slice();

    if (!sort.active || sort.direction === '') {
      this.facturesList = data;
    } else {
      this.facturesList = data.sort((a, b) => {
        const aValue = (a as any)[sort.active];
        const bValue = (b as any)[sort.active];
        return (aValue < bValue ? -1 : 1) * (sort.direction === 'asc' ? 1 : -1);
      });
    }
  }

  public getMoreData(event: string): void {
    if (event === 'next') {
      this.currentPage++;
      this.pageIndex = this.currentPage - 1;
      this.limit += this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    } else if (event === 'previous') {
      this.currentPage--;
      this.pageIndex = this.currentPage - 1;
      this.limit -= this.pageSize;
      this.skip = this.pageSize * this.pageIndex;
      this.getTableData();
    }
  }

  public moveToPage(pageNumber: number): void {
    this.currentPage = pageNumber;
    this.skip = this.pageSelection[pageNumber - 1].skip;
    this.limit = this.pageSelection[pageNumber - 1].limit;
    this.getTableData();
  }

  public PageSize(): void {
    this.pageSelection = [];
    this.limit = this.pageSize;
    this.skip = 0;
    this.currentPage = 1;
    this.getTableData();
  }

  private calculateTotalPages(totalData: number, pageSize: number): void {
    this.pageNumberArray = [];
    this.totalPages = totalData / pageSize;
    if (this.totalPages % 1 !== 0) {
      this.totalPages = Math.trunc(this.totalPages + 1);
    }
    for (let i = 1; i <= this.totalPages; i++) {
      const limit = pageSize * i;
      const skip = limit - pageSize;
      this.pageNumberArray.push(i);
      this.pageSelection.push({ skip: skip, limit: limit });
    }
  }

  deleteFacture(id: any) {
    // Fixed typo from deteleFacture to deleteFacture
    this.factureService.deleteFacture(id).subscribe({
      next: (response) => {
        // Successfully deleted, now refresh the table
        this.getTableData();
      },
      error: (error) => {
        console.error('Error deleting facture:', error);
        // Optionally show an error message to the user
      },
    });
  }
  sortDirection: 'asc' | 'desc' = 'asc';
  sortField: string = '';

  sortBy(field: string) {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.facturesList.sort((a, b) => {
      const aValue = this.resolveField(a, field);
      const bValue = this.resolveField(b, field);

      if (aValue < bValue) return this.sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return this.sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  }

  resolveField(obj: any, path: string) {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }
}
