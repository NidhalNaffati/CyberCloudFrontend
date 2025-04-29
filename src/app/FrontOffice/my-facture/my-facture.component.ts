import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FactureServiceService } from '../../services/facture/facture-service.service';
 import {
  loadStripe,
  Stripe,
  StripeCardElement,
  StripeElement,
  StripeElements,
} from '@stripe/stripe-js';
import { PaymentService } from '../../services/payment.service';
import { Facture } from 'src/app/models/facture';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-my-facture',
  standalone: false,
  templateUrl: './my-facture.component.html',
  styleUrls: ['./my-facture.component.css'],
})
export class MyFactureComponent implements OnInit {
  patientId: number = 3; //patientId=localStorage.get('user')?.id ou pass token to backend
  factures: Facture[] = [];
  selectedFacture: Facture | null = null;
  isStripeOpen: boolean = false;
  stripe!: Stripe | null;
  elements!: StripeElements;
  card!: StripeCardElement;
  clientSecret: string = '';
  @ViewChild('cardElement') cardElementRef!: ElementRef;

  constructor(
    private factureService: FactureServiceService,
    private paymentService: PaymentService,
    private cdr: ChangeDetectorRef,
    private authService:AuthService
  ) {
    this.patientId=this.authService.getUserId()||0
  }

  ngOnInit(): void {
    this.loadFactures();
  }
  loadFactures() {
    this.factureService.getMyFactures(this.patientId).subscribe((data) => {
      this.factures = data;
      this.isStripeOpen = false;
    });
  }
  openStripe(facture: Facture) {
    this.selectedFacture = facture;
    this.isStripeOpen = true;
    this.cdr.detectChanges();

    loadStripe(
      'pk_test_51RFup22YjJuq8v3GnkRXWWIlzHOwMa3lTOwc6J5OV8CdVLLSnpBeQ4piu692mcKwLNh2zmkUQmeYVI7FyaDuIerg00yo2WIV5T'
    ).then((data) => {
      if (data && this.selectedFacture) {
        this.stripe = data;
        this.elements = this.stripe?.elements();
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
        this.paymentService
          .createPayment(this?.selectedFacture?.montant || 0)
          .subscribe((data) => (this.clientSecret = data['clientSecret']));
      }
    });
  }
  pay() {
    console.log("iM @ pays")
    this.stripe
      ?.confirmCardPayment(this.clientSecret, {
        payment_method: {
          card: this.card,
          billing_details: { name: 'payment de facture ' },
        },
      })
      .then((data) => {
        if (data.paymentIntent?.status === 'succeeded') {
          if (this.selectedFacture)
            this.paymentService
              .confirm(this.selectedFacture.id || 0)
              .subscribe(() => this.loadFactures());
        }
      });
  }
}
