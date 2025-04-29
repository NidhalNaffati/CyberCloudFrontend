import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  ElementRef
} from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { StatisticsService } from '../../../services/statistics.service';
import { forkJoin } from 'rxjs';
import { tap } from 'rxjs/operators';

Chart.register(...registerables);

type TimeRange = 'daily' | 'monthly' | 'yearly';

@Component({
  selector: 'app-blog-statistics',
  templateUrl: './blog-statistics.component.html',
  styleUrls: ['./blog-statistics.component.css']
})
export class BlogStatisticsComponent implements OnInit, AfterViewInit {
  @ViewChild('postsChart') postsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('commentsChart') commentsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('reactionsChart') reactionsChartRef!: ElementRef<HTMLCanvasElement>;

  currentView: TimeRange = 'monthly';
  currentViewLabel: string = '(par mois)';

  postsData: Map<string, number> = new Map();
  commentsData: Map<string, number> = new Map();
  reactionsData: Map<string, number> = new Map();

  postsChart: any;
  commentsChart: any;
  reactionsChart: any;

  isLoading = true;

  constructor(private statisticsService: StatisticsService) {}

  ngOnInit(): void {
    this.loadData();
  }

  ngAfterViewInit(): void {
    // On attend que les références aux éléments canvas soient disponibles
    setTimeout(() => {
      // Si les données sont déjà chargées, créer les graphiques
      if (!this.isLoading) {
        this.createCharts();
      }
      
      // Mettre à jour les styles des boutons
      this.updateButtonStyles();
    }, 100);
  }

  switchView(view: TimeRange): void {
    this.currentView = view;
    this.currentViewLabel =
      view === 'daily' ? '(par jour)' : view === 'monthly' ? '(par mois)' : '(par an)';
    this.loadData();
    
    // Mettre à jour visuellement les boutons
    this.updateButtonStyles();
  }

  loadData(): void {
    this.isLoading = true;

    // Utilisation de forkJoin pour charger toutes les données en parallèle
    forkJoin([
      this.loadPostsData(),
      this.loadCommentsData(),
      this.loadReactionsData()
    ]).subscribe({
      complete: () => {
        this.isLoading = false;
        // Vérifier si la vue est initialisée avant de créer les graphiques
        if (this.postsChartRef && this.commentsChartRef && this.reactionsChartRef) {
          setTimeout(() => {
            this.createCharts();
          }, 100);
        }
      },
      error: (error) => {
        console.error('Erreur lors du chargement des données:', error);
        this.isLoading = false;
        // Vous pouvez ajouter ici un message d'erreur à l'utilisateur
      }
    });
  }

  loadPostsData() {
    let observable;
    switch (this.currentView) {
      case 'daily':
        observable = this.statisticsService.getPostsCountByDay();
        break;
      case 'monthly':
        observable = this.statisticsService.getPostsCountByMonth();
        break;
      case 'yearly':
        observable = this.statisticsService.getPostsCountByYear();
        break;
    }

    return observable.pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.postsData = new Map(Object.entries(data));
      })
    );
  }

  loadCommentsData() {
    let observable;
    switch (this.currentView) {
      case 'daily':
        observable = this.statisticsService.getCommentsCountByDay();
        break;
      case 'monthly':
        observable = this.statisticsService.getCommentsCountByMonth();
        break;
      case 'yearly':
        observable = this.statisticsService.getCommentsCountByYear();
        break;
    }

    return observable.pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.commentsData = new Map(Object.entries(data));
      })
    );
  }

  loadReactionsData() {
    // Les réactions n'ont pas de vue temporelle, donc nous utilisons toujours la même méthode
    return this.statisticsService.getReactionsDistribution().pipe(
      tap((data) => {
        // Convertir l'objet en Map
        this.reactionsData = new Map(Object.entries(data));
      })
    );
  }

  createCharts(): void {
    // Détruire les anciens graphiques s'ils existent
    if (this.postsChart) this.postsChart.destroy();
    if (this.commentsChart) this.commentsChart.destroy();
    if (this.reactionsChart) this.reactionsChart.destroy();

    // Créer les nouveaux graphiques
    this.createPostsChart();
    this.createCommentsChart();
    this.createReactionsChart();
  }

  createPostsChart(): void {
    const postsCtx = this.postsChartRef.nativeElement.getContext('2d');
    if (!postsCtx) return;

    const labels = Array.from(this.postsData.keys()).map(key => {
      if (this.currentView === 'monthly') {
        const [year, month] = key.split('-');
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return monthNames[parseInt(month) - 1];
      }
      return key;
    });

    this.postsChart = new Chart(postsCtx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Articles',
          data: Array.from(this.postsData.values()),
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.3
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { 
              precision: 0,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return '';
              }
            } 
          }
        }
      }
    });
  }

  createCommentsChart(): void {
    const commentsCtx = this.commentsChartRef.nativeElement.getContext('2d');
    if (!commentsCtx) return;

    const labels = Array.from(this.commentsData.keys()).map(key => {
      if (this.currentView === 'monthly') {
        const [year, month] = key.split('-');
        const monthNames = ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 
                          'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'];
        return monthNames[parseInt(month) - 1];
      }
      return key;
    });

    this.commentsChart = new Chart(commentsCtx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: 'Commentaires',
          data: Array.from(this.commentsData.values()),
          backgroundColor: 'rgba(255, 99, 132, 0.7)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: { 
            beginAtZero: true, 
            ticks: { 
              precision: 0,
              callback: function(value) {
                if (Number.isInteger(value)) {
                  return value;
                }
                return '';
              }
            } 
          }
        }
      }
    });
  }

  createReactionsChart(): void {
    const reactionsCtx = this.reactionsChartRef.nativeElement.getContext('2d');
    if (!reactionsCtx) return;

    // Map de couleurs pour chaque type de réaction
    const reactionColors = {
      'LOVE': {
        bg: 'rgba(255, 99, 132, 0.7)',
        border: 'rgba(255, 99, 132, 1)'
      },
      'LIKE': {
        bg: 'rgba(54, 162, 235, 0.7)',
        border: 'rgba(54, 162, 235, 1)'
      },
      'SAD': {
        bg: 'rgba(255, 206, 86, 0.7)',
        border: 'rgba(255, 206, 86, 1)'
      },
      'ANGRY': {
        bg: 'rgba(255, 159, 64, 0.7)',
        border: 'rgba(255, 159, 64, 1)'
      },
      'DISLIKE': {
        bg: 'rgba(153, 102, 255, 0.7)',
        border: 'rgba(153, 102, 255, 1)'
      },
      'HAHA': {
        bg: 'rgba(75, 192, 192, 0.7)',
        border: 'rgba(75, 192, 192, 1)'
      },
      // Couleur par défaut pour toute autre réaction
      'DEFAULT': {
        bg: 'rgba(201, 203, 207, 0.7)',
        border: 'rgba(201, 203, 207, 1)'
      }
    };

    // Trier les réactions par nombre décroissant
    const sortedReactions = Array.from(this.reactionsData.entries())
      .sort((a, b) => b[1] - a[1]);

    // Préparer les couleurs en fonction des réactions
    const backgroundColors = sortedReactions.map(([label]) => {
      const color = reactionColors[label as keyof typeof reactionColors] || reactionColors.DEFAULT;
      return color.bg;
    });

    const borderColors = sortedReactions.map(([label]) => {
      const color = reactionColors[label as keyof typeof reactionColors] || reactionColors.DEFAULT;
      return color.border;
    });

    // Calculer les pourcentages
    const data = sortedReactions.map(([_, count]) => count);
    const total = data.reduce((a, b) => a + b, 0);
    
    // Créer des labels personnalisés avec pourcentages
    const labels = sortedReactions.map(([label, count]) => {
      const percentage = ((count / total) * 100).toFixed(1);
      return `${label} (${percentage}%)`;
    });

    this.reactionsChart = new Chart(reactionsCtx, {
      type: 'pie',
      data: {
        labels: labels,
        datasets: [{
          data: data,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 2,
          hoverBorderWidth: 3,
          hoverBorderColor: '#ffffff'
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        aspectRatio: 2,
        cutout: '50%',
        layout: {
          padding: 20
        },
        plugins: {
          legend: {
            position: 'right',
            labels: {
              padding: 15,
              usePointStyle: true,
              pointStyle: 'circle'
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            titleFont: {
              size: 14,
              weight: 'bold'
            },
            bodyFont: {
              size: 13
            },
            padding: 12,
            displayColors: true,
            callbacks: {
              label: function(context) {
                const dataIndex = context.dataIndex;
                const value = data[dataIndex];
                const percentage = ((value / total) * 100).toFixed(1);
                const label = labels[dataIndex].split(' (')[0]; // Récupérer juste le nom sans pourcentage
                return `${label}: ${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateRotate: true,
          animateScale: true
        }
      }
    });
  }

  // Mettre à jour les styles des boutons en fonction de la vue active
  private updateButtonStyles(): void {
    // Récupérer tous les boutons du groupe
    const buttons = document.querySelectorAll('.btn-group .btn');
    
    // Réinitialiser tous les boutons
    buttons.forEach(button => {
      button.classList.remove('btn-primary');
      button.classList.add('btn-outline-primary');
    });
    
    // Trouver le bouton actif et mettre à jour son style
    let activeButtonSelector = '';
    switch(this.currentView) {
      case 'daily':
        activeButtonSelector = '.btn-group .btn:nth-child(1)';
        break;
      case 'monthly':
        activeButtonSelector = '.btn-group .btn:nth-child(2)';
        break;
      case 'yearly':
        activeButtonSelector = '.btn-group .btn:nth-child(3)';
        break;
    }
    
    const activeButton = document.querySelector(activeButtonSelector);
    if (activeButton) {
      activeButton.classList.remove('btn-outline-primary');
      activeButton.classList.add('btn-primary');
    }
  }

  // Vérifie si un Map est vide
  isEmptyMap(map: Map<any, any>): boolean {
    return map.size === 0;
  }
}