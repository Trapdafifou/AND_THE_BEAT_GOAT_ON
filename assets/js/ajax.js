$(document).ready(function () {
   // console.log('coucou');
   //var timer = 0;
   // $('.zone_jeu').text(0);
   // var essai = setInterval(function(){
   //  timer++;
   //     $('.zone_jeu').text(timer);
   // },400);
   // $(document).on('click','.recuperer_score',function(event) {
   //     event.preventDefault();
   //     clearInterval(essai);
   //     var url = $(this).attr('href');
   //     $.ajax({
   //         url: url, // La ressource ciblée
   //         type: 'POST', // Le type de la requête HTTP.
   //         data: 100,
   //         dataType: 'text',
   //         success: function (data) { // success est toujours en place, bien sûr !
   //             alert(data);
   //         },
   //         complete: function (resultat) {
   //             output = '';
   //             for (property in resultat) {
   //                 output += (property + ': ' + resultat[property] + '; ');
   //             }
   //             alert(output + 'probleme');
   //         }
   //     });
   // });
    $(document).on('click','.recuperer_score',function(event) {
            $.ajax({
                url: "./assets/js/main.js",
                dataType: "script",
                cache: true,
                success: function () {
                   $('.recuperer_score').remove();
                }
            });
    });
    // je fais une requête ajax vers le lien, en poussant BAWXMLHttpRequest dans les headers
});
