import { Component, OnInit } from '@angular/core';
import { ActivityService } from '../../services/activity.service';
import { Activity } from '../../models/activity.model';
import { BlogpostService } from '../../services/blogpost.service';
import { BlogPost } from '../../interfaces/BlogPost';
import { ComplaintService } from '../../services/complaint.service';
import { Complaint } from '../../models/complaint';

@Component({
  selector: 'app-home-front',
  templateUrl: './home-front.component.html',
  styleUrls: ['./home-front.component.css']
})
export class HomeFrontComponent implements OnInit {
  activities: Activity[] = [];
  blogPosts: BlogPost[] = [];
  testimonials: Complaint[] = [];

  constructor(
    private activityService: ActivityService,
    private blogpostService: BlogpostService,
    private complaintService: ComplaintService
  ) {}

  ngOnInit() {
    // Charger les activités
    this.activityService.activities$.subscribe(activities => {
      this.activities = activities;
    });

    // Charger les blogs
    this.blogpostService.getAllPosts().subscribe(
      (posts) => {
        this.blogPosts = posts.slice(0, 3); // Limiter à 3 blogs maximum
      },
      (error) => {
        console.error('Erreur lors du chargement des blogs:', error);
        // Créer des blogs fictifs en cas d'erreur
        this.blogPosts = [
          {
            postId: 1,
            userId: 1,
            title: 'Activités pour enfants',
            content: 'Découvrez nos nouvelles activités pour les enfants de tous âges.',
            reaction: null,
            createdAt: new Date(),
            user: {
              firstName: 'Admin',
              lastName: 'User',
              id: 1
            },
            images: [
              {
                imageId: 1,
                url: 'assets/FrontOffice/daycare-website-template/img/blog-1.jpg',
                description: 'Activités pour enfants',
                orderIndex: 0
              }
            ],
            comments: [
              {
                commentId: 1,
                userId: 2,
                content: 'Super article !',
                createdAt: new Date()
              }
            ]
          },
          {
            postId: 2,
            userId: 1,
            title: 'Conseils pour parents',
            content: 'Les meilleurs conseils pour aider vos enfants à s\'\u00e9panouir.',
            reaction: null,
            createdAt: new Date(),
            user: {
              firstName: 'Expert',
              lastName: 'Parental',
              id: 2
            },
            images: [
              {
                imageId: 2,
                url: 'assets/FrontOffice/daycare-website-template/img/blog-2.jpg',
                description: 'Conseils pour parents',
                orderIndex: 0
              }
            ],
            comments: [
              {
                commentId: 2,
                userId: 3,
                content: 'Très utile !',
                createdAt: new Date()
              }
            ]
          },
          {
            postId: 3,
            userId: 1,
            title: 'Événements à venir',
            content: 'Ne manquez pas nos prochains événements pour toute la famille.',
            reaction: null,
            createdAt: new Date(),
            user: {
              firstName: 'Organisateur',
              lastName: 'Event',
              id: 3
            },
            images: [
              {
                imageId: 3,
                url: 'assets/FrontOffice/daycare-website-template/img/blog-3.jpg',
                description: 'Événements à venir',
                orderIndex: 0
              }
            ],
            comments: [
              {
                commentId: 3,
                userId: 4,
                content: 'J\'ai hâte !',
                createdAt: new Date()
              }
            ]
          }
        ];
      }
    );

    // Charger les témoignages (plaintes avec 4 ou 5 étoiles)
    this.complaintService.getComplaints().subscribe(
      (complaints) => {
        // Filtrer les plaintes avec un rating de 4 ou 5 étoiles
        this.testimonials = complaints
          .filter(complaint => complaint.starRatingConsultation >= 4)
          .slice(0, 3); // Limiter à 3 témoignages maximum
      },
      (error) => {
        console.error('Erreur lors du chargement des témoignages:', error);
        // Créer des témoignages fictifs en cas d'erreur
        this.testimonials = [
          {
            complaintId: 1,
            subject: 'Service exceptionnel',
            content: 'J\'ai été impressionné par la qualité du service et l\'attention portée à mes enfants. Le personnel est très professionnel et attentionné.',
            userId: 1,
            starRatingConsultation: 5,
            isUrgent: false,
            isRead: true,
            date: new Date().toISOString()
          },
          {
            complaintId: 2,
            subject: 'Activités enrichissantes',
            content: 'Les activités proposées sont très enrichissantes pour le développement de mon enfant. Je suis très satisfaite des résultats.',
            userId: 2,
            starRatingConsultation: 5,
            isUrgent: false,
            isRead: true,
            date: new Date().toISOString()
          },
          {
            complaintId: 3,
            subject: 'Personnel compétent',
            content: 'Le personnel est très compétent et à l\'\u00e9coute des besoins des enfants. Je recommande vivement ce service à tous les parents.',
            userId: 3,
            starRatingConsultation: 4,
            isUrgent: false,
            isRead: true,
            date: new Date().toISOString()
          }
        ];
      }
    );
  }
}