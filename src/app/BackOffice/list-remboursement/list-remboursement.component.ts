import { Component, OnInit } from '@angular/core';
import { Remboursement } from 'src/app/models/remboursement';
import { RemboursementServiceService } from 'src/app/services/remboursement/remboursement-service.service';
 
@Component({
  selector: 'app-list-remboursement',
  templateUrl: './list-remboursement.component.html',
  styleUrls: ['./list-remboursement.component.css'],
})
export class ListRemboursementComponent implements OnInit {
  constructor(private rs: RemboursementServiceService) {}
  list: Remboursement[] = [];
  remboursementToRefuse: Remboursement | null = null;
  raisonOfRefuse: string = '';

  ngOnInit(): void {
    this.loadData();
  }
  loadData() {
    this.rs.getAllRemboursements().subscribe((data) => (this.list = data));
  }
  acceptRem(remboursement: Remboursement) {
    this.rs
      .acceptRemboursement(remboursement.id)
      .subscribe(() => this.loadData());
  }
  openRefuseDialog(remboursement: Remboursement) {
    this.remboursementToRefuse = remboursement;
    this.raisonOfRefuse = '';
   }
  confirmRefuse() {
    if (this.remboursementToRefuse && this.raisonOfRefuse.trim()) {
      this.rs
        .declineRemboursement(
          this.remboursementToRefuse.id,
          this.raisonOfRefuse
        )
        .subscribe(() => {
          this.loadData();
          this.remboursementToRefuse=null;
        });
    }
  }
}
