(function ($) {
  'use strict';

  // Vérifier si jQuery est chargé avant d'exécuter
  if (typeof $ === 'undefined') {
    console.error("jQuery n'est pas chargé.");
    return;
  }

  // Attendre que le DOM soit complètement chargé
  $(document).ready(function () {

    // Vérification et création des graphiques si les éléments existent
    if ($("#visit-sale-chart").length) {
      const ctx = document.getElementById('visit-sale-chart');

      var graphGradient1 = ctx.getContext("2d");
      var graphGradient2 = ctx.getContext("2d");
      var graphGradient3 = ctx.getContext("2d");

      var gradientStrokeViolet = graphGradient1.createLinearGradient(0, 0, 0, 181);
      gradientStrokeViolet.addColorStop(0, 'rgba(218, 140, 255, 1)');
      gradientStrokeViolet.addColorStop(1, 'rgba(154, 85, 255, 1)');

      var gradientStrokeBlue = graphGradient2.createLinearGradient(0, 0, 0, 360);
      gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
      gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');

      var gradientStrokeRed = graphGradient3.createLinearGradient(0, 0, 0, 300);
      gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
      gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');

      const bgColor1 = ["rgba(218, 140, 255, 1)"];
      const bgColor2 = ["rgba(54, 215, 232, 1"];
      const bgColor3 = ["rgba(255, 191, 150, 1)"];

      new Chart(ctx, {
        type: 'bar',
        data: {
          labels: ['JAN', 'FEB', 'MAR', 'APR', 'MAY', 'JUN', 'JUL', 'AUG'],
          datasets: [{
            label: "CHN",
            borderColor: gradientStrokeViolet,
            backgroundColor: gradientStrokeViolet,
            fillColor: bgColor1,
            hoverBackgroundColor: gradientStrokeViolet,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [20, 40, 15, 35, 25, 50, 30, 20],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
          {
            label: "USA",
            borderColor: gradientStrokeRed,
            backgroundColor: gradientStrokeRed,
            hoverBackgroundColor: gradientStrokeRed,
            fillColor: bgColor2,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [40, 30, 20, 10, 50, 15, 35, 40],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          },
          {
            label: "UK",
            borderColor: gradientStrokeBlue,
            backgroundColor: gradientStrokeBlue,
            hoverBackgroundColor: gradientStrokeBlue,
            fillColor: bgColor3,
            pointRadius: 0,
            fill: false,
            borderWidth: 1,
            data: [70, 10, 30, 40, 25, 50, 15, 30],
            barPercentage: 0.5,
            categoryPercentage: 0.5,
          }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: true,
          scales: {
            y: {
              display: false,
            },
            x: {
              display: true,
            }
          },
          plugins: {
            legend: {
              display: false,
            }
          }
        },
        plugins: [{
          afterDatasetUpdate: function (chart) {
            const chartId = chart.canvas.id;
            const legendId = `${chartId}-legend`;
            const ul = document.createElement('ul');
            chart.data.datasets.forEach(dataset => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${dataset.backgroundColor}"></span>
                  ${dataset.label}
                </li>
              `;
            });
            document.getElementById(legendId).appendChild(ul);
          }
        }]
      });
    }

    // Création du graphique pour le trafic
    if ($("#traffic-chart").length) {
      const ctx = document.getElementById('traffic-chart');

      var graphGradient1 = ctx.getContext('2d');
      var graphGradient2 = ctx.getContext('2d');
      var graphGradient3 = ctx.getContext('2d');

      var gradientStrokeBlue = graphGradient1.createLinearGradient(0, 0, 0, 181);
      gradientStrokeBlue.addColorStop(0, 'rgba(54, 215, 232, 1)');
      gradientStrokeBlue.addColorStop(1, 'rgba(177, 148, 250, 1)');

      var gradientStrokeRed = graphGradient2.createLinearGradient(0, 0, 0, 50);
      gradientStrokeRed.addColorStop(0, 'rgba(255, 191, 150, 1)');
      gradientStrokeRed.addColorStop(1, 'rgba(254, 112, 150, 1)');

      var gradientStrokeGreen = graphGradient3.createLinearGradient(0, 0, 0, 300);
      gradientStrokeGreen.addColorStop(0, 'rgba(6, 185, 157, 1)');
      gradientStrokeGreen.addColorStop(1, 'rgba(132, 217, 210, 1)');

      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['Search Engines 30%', 'Direct Click 30%', 'Bookmarks Click 40%'],
          datasets: [{
            data: [30, 30, 40],
            backgroundColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
            hoverBackgroundColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
            borderColor: [gradientStrokeBlue, gradientStrokeGreen, gradientStrokeRed],
          }]
        },
        options: {
          cutout: 50,
          responsive: true,
          maintainAspectRatio: true,
          plugins: {
            legend: {
              display: false,
            }
          }
        },
        plugins: [{
          afterDatasetUpdate: function (chart) {
            const chartId = chart.canvas.id;
            const legendId = `${chartId}-legend`;
            const ul = document.createElement('ul');
            chart.data.datasets[0].data.forEach((data, i) => {
              ul.innerHTML += `
                <li>
                  <span style="background-color: ${chart.data.datasets[0].backgroundColor[i]}"></span>
                  ${chart.data.labels[i]}
                </li>
              `;
            });
            document.getElementById(legendId).appendChild(ul);
          }
        }]
      });
    }

    // Initialisation du datepicker
    if ($("#inline-datepicker").length) {
      $('#inline-datepicker').datepicker({
        enableOnReadonly: true,
        todayHighlight: true,
      });
    }

    // Vérification du cookie pour afficher ou masquer le pro-banner
    if ($.cookie('purple-pro-banner') != "true") {
      $('#proBanner').addClass('d-flex');
      $('.navbar').removeClass('fixed-top');
    } else {
      $('#proBanner').addClass('d-none');
      $('.navbar').addClass('fixed-top');
    }

    // Manipulation de la navbar selon la classe "fixed-top"
    if ($(".navbar").hasClass("fixed-top")) {
      $('.page-body-wrapper').removeClass('pt-0');
      $('.navbar').removeClass('pt-5');
    } else {
      $('.page-body-wrapper').addClass('pt-0');
      $('.navbar').addClass('pt-5 mt-3');
    }

    // Gestion de la fermeture du pro-banner
    $('#bannerClose').on('click', function () {
      $('#proBanner').addClass('d-none').removeClass('d-flex');
      $('.navbar').removeClass('pt-5').addClass('fixed-top');
      $('.page-body-wrapper').addClass('proBanner-padding-top');
      $('.navbar').removeClass('mt-3');

      var date = new Date();
      date.setTime(date.getTime() + 24 * 60 * 60 * 1000);
      $.cookie('purple-pro-banner', "true", { expires: date });
    });
  });

})(jQuery);
