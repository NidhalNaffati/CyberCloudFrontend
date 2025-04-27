import { Component, OnInit } from '@angular/core';
import { CommonModule, AsyncPipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Store } from '@ngrx/store';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { CreateBuzzRequest } from '../../core/models/buzz.model';
import { AppState } from '../../core/store/app.state';
import * as BuzzActions from '../../core/store/buzz/buzz.actions';
import { selectBuzzLoading, selectBuzzError } from '../../core/store/buzz/buzz.selectors';

@Component({
  selector: 'app-create-buzz',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    AsyncPipe
  ],
  templateUrl: './create-buzz.component.html',
  styleUrls: ['./create-buzz.component.scss']
})
export class CreateBuzzComponent implements OnInit {
  buzzForm!: FormGroup;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  profanityError: string | null = null;
  isCheckingProfanity = false;













  
  // Bad words list (multi-language)
  private bannedWords = [
    // English
    '4r5e','badword', '5h1t', '5hit', 'a55', 'anal', 'anus', 'ar5e', 'arrse', 'arse', 
    'ass', 'ass-fucker', 'asses', 'assfucker', 'assfukka', 'asshole', 'assholes',
    'asswhole', 'a_s_s', 'b!tch', 'b00bs', 'b17ch', 'b1tch', 'ballbag', 'balls', 
    'ballsack', 'bastard', 'beastial', 'beastiality', 'bellend', 'bestial', 
    'bestiality', 'bi+ch', 'biatch', 'bitch', 'bitcher', 'bitchers', 'bitches', 
    'bitchin', 'bitching', 'bloody', 'blow job', 'blowjob', 'blowjobs', 'boiolas',
    'bollock', 'bollok', 'boner', 'boob', 'boobs', 'booobs', 'boooobs', 'booooobs',
    'booooooobs', 'breasts', 'buceta', 'bugger', 'bum', 'bunny fucker', 'butt',
    'butthole', 'buttmunch', 'buttplug', 'c0ck', 'c0cksucker', 'carpet muncher',
    'cawk', 'chink', 'cipa', 'cl1t', 'clit', 'cnut', 'cock', 'cock-sucker',
    'cockface', 'cockhead', 'cockmunch', 'cockmuncher', 'cocks', 'cocksuck',
    'cocksucked', 'cocksucker', 'cocksucking', 'cocksucks', 'cocksuka', 'cocksukka',
    'cok', 'cokmuncher', 'coksucka', 'coon', 'cox', 'crap', 'cum', 'cummer',
    'cumming', 'cums', 'cumshot', 'cunilingus', 'cunillingus', 'cunnilingus',
    'cunt', 'cuntlick', 'cuntlicker', 'cuntlicking', 'cunts', 'cyalis', 'cyberfuc',
    'd1ck', 'damn', 'dick', 'dickhead', 'dildo', 'dildos', 'dink', 'dog-fucker',
    'doggin', 'dogging', 'donkeyribber', 'doosh', 'duche', 'dyke', 'ejaculate',
    'ejaculated', 'ejaculates', 'ejaculating', 'ejaculatings', 'ejaculation',
    'fag', 'fagging', 'faggitt', 'faggot', 'faggs', 'fagot', 'fagots', 'fags',
    'fanny', 'fannyflaps', 'fannyfucker', 'fanyy', 'fatass', 'fcuk', 'fcuker',
    'fcuking', 'feck', 'fecker', 'felching', 'fellate', 'fellatio', 'fingerfuck',
    'fingerfucked', 'fingerfucker', 'fingerfuckers', 'fingerfucking', 'fingerfucks',
    'fistfuck', 'fistfucked', 'fistfucker', 'fistfuckers', 'fistfucking', 'fistfuckings',
    'fistfucks', 'flange', 'fook', 'fooker', 'fuck', 'fucka', 'fucked', 'fucker',
    'fuckers', 'fuckhead', 'fuckheads', 'fuckin', 'fucking', 'fuckings', 'fuckingshitmotherfucker',
    'fuckme', 'fucks', 'fuckwhit', 'fuckwit', 'fudge packer', 'fudgepacker', 'fuk',
    'fuker', 'fukker', 'fukkin', 'fuks', 'fukwhit', 'fukwit', 'fux', 'fux0r',
    'gangbang', 'gangbanged', 'gangbangs', 'gaylord', 'gaysex', 'goatse', 'God',
    'god-dam', 'god-damned', 'goddamn', 'goddamned', 'hardcoresex', 'hell', 'heshe',
    'hoar', 'hoare', 'hoer', 'homo', 'hore', 'horniest', 'horny', 'hotsex', 'jack-off',
    'jackoff', 'jap', 'jerk-off', 'jism', 'jiz', 'jizm', 'jizz', 'kawk', 'knob',
    'knobead', 'knobed', 'knobend', 'knobhead', 'knobjocky', 'knobjokey', 'kock',
    'kondum', 'kondums', 'kum', 'kummer', 'kumming', 'kums', 'kunilingus', 'l3i+ch',
    'l3itch', 'labia', 'lust', 'lusting', 'm0f0', 'm0fo', 'm45terbate', 'ma5terb8',
    'ma5terbate', 'masochist', 'master-bate', 'masterb8', 'masterbat*', 'masterbat3',
    'masterbate', 'masterbation', 'masterbations', 'masturbate', 'mo-fo', 'mof0',
    'mofo', 'mothafuck', 'mothafucka', 'mothafuckas', 'mothafuckaz', 'mothafucked',
    'mothafucker', 'mothafuckers', 'mothafuckin', 'mothafucking', 'mothafuckings',
    'mothafucks', 'mother fucker', 'motherfuck', 'motherfucked', 'motherfucker',
    'motherfuckers', 'motherfuckin', 'motherfucking', 'motherfuckings', 'motherfuckka',
    'motherfucks', 'muff', 'mutha', 'muthafecker', 'muthafuckker', 'muther', 'mutherfucker',
    'n1gga', 'n1gger', 'nazi', 'nigg3r', 'nigg4h', 'nigga', 'niggah', 'niggas', 'niggaz',
    'nigger', 'niggers', 'nob', 'nob jokey', 'nobhead', 'nobjocky', 'nobjokey', 'numbnuts',
    'nutsack', 'orgasim', 'orgasims', 'orgasm', 'orgasms', 'p0rn', 'pawn', 'pecker',
    'penis', 'penisfucker', 'phonesex', 'phuck', 'phuk', 'phuked', 'phuking', 'phukked',
    'phukking', 'phuks', 'phuq', 'pigfucker', 'pimpis', 'piss', 'pissed', 'pisser',
    'pissers', 'pisses', 'pissflaps', 'pissin', 'pissing', 'pissoff', 'poop', 'porn',
    'porno', 'pornography', 'pornos', 'prick', 'pricks', 'pron', 'pube', 'pusse',
    'pussi', 'pussies', 'pussy', 'pussys', 'rectum', 'retard', 'rimjaw', 'rimming',
    's hit', 's.o.b.', 'sadist', 'schlong', 'screwing', 'scroat', 'scrote', 'scrotum',
    'semen', 'sex', 'sh!+', 'sh!t', 'sh1t', 'shag', 'shagger', 'shaggin', 'shagging',
    'shemale', 'shi+', 'shit', 'shitdick', 'shite', 'shited', 'shitey', 'shitfuck',
    'shitfull', 'shithead', 'shiting', 'shitings', 'shits', 'shitted', 'shitter',
    'shitting', 'shittings', 'shitty', 'skank', 'slut', 'sluts', 'smegma', 'smut',
    'snatch', 'son-of-a-bitch', 'spac', 'spunk', 's_h_i_t', 't1tt1e5', 't1tties',
    'teets', 'teez', 'testical', 'testicle', 'tit', 'titfuck', 'tits', 'titt',
    'tittie5', 'tittiefucker', 'titties', 'tittyfuck', 'tittywank', 'titwank',
    'tosser', 'turd', 'tw4t', 'twat', 'twathead', 'twatty', 'twunt', 'twunter',
    'v14gra', 'v1gra', 'vagina', 'viagra', 'vulva', 'w00se', 'wang', 'wank',
    'wanker', 'wanky', 'whoar', 'whore', 'willies', 'willy', 'xrated', 'xxx',
  
    // French
    'merde', 'putain', 'connard', 'con', 'enculé', 'salope', 'pute', 'nique',
    'niquer', 'ta mère', 'bite', 'couille', 'couilles', 'chier', 'chienne',
    'bouffon', 'trou du cul', 'pétasse', 'enculer', 'branler', 'fion', 'bougnoule',
    'pd', 'pédé', 'tapette', 'salaud', 'batard', 'putes', 'encule', 'vagin',
    'chatte', 'sein', 'seins', 'sodomie', 'sodomiser', 'sucer', 'teuch', 'teube',
    'troncher', 'zizi', 'branlette', 'partouze', 'pénis', 'cul', 'fesse', 'fesses',
    'godemiché', 'pornographie', 'viol', 'violer', 'zoophile', 'baiser', 'niquer',
  
    // Arabic
    'عاهر', 'قحبة', 'فاحشة', 'شرموطة', 'إبن الحرام', 'كلب', 'زانية', 'فحل',
    'كس', 'كحاب', 'كحبه', 'طيز', 'طيزي', 'خراء', 'خنيث', 'دعارة', 'زبي',
    'شرج', 'ممحونة', 'نيك', 'منيوك', 'متناك', 'مأجور', 'أمك', 'أختك', 'ابن الكلب',
    'ابن العاهرة', 'قواد', 'داعر', 'داعرة', 'ساقطة', 'عاهرات', 'لوطي', 'لواط',
    'مأبول', 'متبول', 'ختيار', 'خول', 'خنازير', 'خنزير', 'قوادة', 'مومس',
    'ناك', 'منيك', 'زب', 'زوبع', 'سكس', 'سحاق', 'سحاقية', 'شاذ', 'شاذة',
    'عرص', 'غائط', 'فاجر', 'فاسق', 'قضيب', 'لحس', 'لوطي', 'مؤخرة', 'مجرود',
    'مذيعة', 'مزني', 'مكسيكي', 'مني', 'ميت زني', 'نيك أمك', 'هرة', 'هنتاي',
    'وسخ', 'يا خول', 'يا كلب', 'يا عاهرة', 'يا ابن الكلب', 'يا خنيث'
  ];












  constructor(
    private fb: FormBuilder,
    private store: Store<AppState>,
    private router: Router
  ) {
    this.loading$ = this.store.select(selectBuzzLoading);
    this.error$ = this.store.select(selectBuzzError);
  }

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.buzzForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]],
      mediaUrl: ['']
    });
  }

  onSubmit(): void {
    this.profanityError = null;

    if (this.buzzForm.valid) {
      this.isCheckingProfanity = true;
      const combinedText = `${this.title?.value} ${this.content?.value}`.toLowerCase();

      // Simulate async profanity check with delay
      this.checkProfanity(combinedText).subscribe(hasProfanity => {
        this.isCheckingProfanity = false;
        if (hasProfanity) {
          this.profanityError = 'Content contains inappropriate language. Please revise your post.';
        } else {
          this.submitBuzz();
        }
      });
    } else {
      this.buzzForm.markAllAsTouched();
    }
  }

  private checkProfanity(text: string): Observable<boolean> {
    // Check against banned words list with whole word matching
    const hasProfanity = this.bannedWords.some(word => 
      new RegExp(`\\b${word}\\b`, 'i').test(text)
    );
    
    // Simulate API call delay
    return of(hasProfanity).pipe(delay(300));
  }

  private submitBuzz(): void {
    const buzzData: CreateBuzzRequest = this.buzzForm.value;
    
    // Remove mediaUrl if empty
    if (!buzzData.mediaUrl) {
      delete buzzData.mediaUrl;
    }
    
    this.store.dispatch(BuzzActions.createBuzz({ buzz: buzzData }));
    
    // Navigate after successful creation
    this.loading$.subscribe(loading => {
      if (!loading) {
        this.error$.subscribe(error => {
          if (!error) {
            this.router.navigate(['/']);
          }
        });
      }
    });
  }

  // Form control getters
  get title() {
    return this.buzzForm.get('title');
  }

  get content() {
    return this.buzzForm.get('content');
  }

  get mediaUrl() {
    return this.buzzForm.get('mediaUrl');
  }

  // Character count helpers
  getCharacterCount(control: string): number {
    return this.buzzForm.get(control)?.value?.length || 0;
  }

  getMaxLength(control: string): number {
    switch (control) {
      case 'title': return 100;
      case 'content': return 1000;
      default: return 0;
    }
  }
}