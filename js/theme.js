/* global Pace */

(function($){
    "use strict";
    
    var $document = $(document),
        $window = $(window),
        $htmlBody = $('html, body'),
        $body = $('body'),
        $navbarCollapse = $('.navbar-collapse'),
        $pageScrollLink = $('.page-scroll'),
        $timelineCarousel = $('.timeline-carousel'),
        $galleryGrid = $('.gallery-grid'),
        ww = Math.max($window.width(), window.innerWidth),
        scrollSpyTarget = '#navigation',
        scrollSpyOffsetBreakPoint = 1199,
        scrollSpyOffset = 85,
        timelineCarouselBreakPoint = 575,
        timelineCarouselOptions = {
            cellSelector: '.timeline-item',
            cellAlign: 'left',
            contain: true,
            draggable: false,
            pageDots: false,
            //prevNextButtons: false,
            rightToLeft: true
        };
        
    
    /*
    * Preloader
    */
   
    if (typeof Pace !== 'undefined'){
        Pace.on('done', function(){
            var $preloader = $('.preloader');
            $preloader.fadeOut();
        });
    }
    
    
    /*
    * Window load
    */
   
    $window.on('load', function(){
        
        // Bootstrap scrollspy
        var ww = Math.max($window.width(), window.innerWidth);
        $body.scrollspy({    
            target: scrollSpyTarget,
            offset: ww > scrollSpyOffsetBreakPoint ? 0 : scrollSpyOffset
        });
    });
    
    
    /*
    * Document ready
    */
   
    $document.ready(function(){
        
        /*
        * Window resize
        */
       
        $window.on('resize', function(){
            
            // Bootstrap scrollspy
            var dataScrollSpy = $body.data('bs.scrollspy'),
                ww = Math.max($window.width(), window.innerWidth),
                offset = ww > scrollSpyOffsetBreakPoint ? 0 : scrollSpyOffset;
        
            dataScrollSpy._config.offset = offset;
            $body.data('bs.scrollspy', dataScrollSpy);
            $body.scrollspy('refresh');
            
            
            // Timeline Carousel
            timelineCarouselOptions.groupCells = ww > timelineCarouselBreakPoint ? 2 : 1;
            $timelineCarousel.flickity(timelineCarouselOptions);
        });
        
        
        // Page scroll
        $pageScrollLink.on('click', function(e){
            var anchor = $(this),
                target = anchor.attr('href');
            pageScroll(target);
            e.preventDefault();
        });
        
        function pageScroll(target){
            var ww = Math.max($window.width(), window.innerWidth),
                    offset = ww > scrollSpyOffsetBreakPoint ? 0 : scrollSpyOffset;
            
            $htmlBody.stop().animate({
                scrollTop: $(target).offset().top - (offset - 1)
            }, 1000, 'easeInOutExpo');
            
            $navbarCollapse.collapse('hide');
        };
        
        
        // Gallery - Grid
        $galleryGrid.imagesLoaded(function(){
            $galleryGrid.isotope({
                itemSelector: '.gallery-item',
                layoutMode: 'masonry'
            });
        });
        
        
        // Gallery - Magnific Popup
        $galleryGrid.magnificPopup({
            delegate: 'a.zoom',
            type: 'image',
            mainClass: 'mfp-fade',
            gallery:{
                enabled: true,
                navigateByImgClick: true,
                preload: [0,2],
                tPrev: 'Previous',
                tNext: 'Next',
                tCounter: '<span class="mfp-counter-curr">%curr%</span> of <span class="mfp-counter-total">%total%</span>'
            }
        });
        
        
        // Gallery - Filter
        var $gridSelectors = $('.gallery-filter').find('a');
        $gridSelectors.on('click', function(e){
            var selector = $(this).attr('data-filter');
            $galleryGrid.isotope({
                filter: selector
            });            

            $gridSelectors.removeClass('active');
            $(this).addClass('active');
            
            e.preventDefault();
        });
        
        
        // Timeline Carousel
        timelineCarouselOptions.groupCells = ww > timelineCarouselBreakPoint ? 2 : 1;
        $timelineCarousel.flickity(timelineCarouselOptions);
        
        
        // Chart - Bar
        var $chartBar = $('.chart-bar'),
            $chartBarItem = $chartBar.find('.chart-item'),
            $chartBarProgress = $chartBarItem.find('.chart-progress');
        
        $chartBar.one('inview', function(isInView){
            if (isInView){
                $chartBarProgress.each(function(){
                    var percent = $(this).children().data('percent');
                    $(this).css('width', percent + '%');
                });
            }
        });
        
        
        // Chart - Pie
        var $chartPie = $('.chart-pie');
        $chartPie.easyPieChart({
            trackColor: '#dee2e6',
            scaleColor: false,
            lineCap: 'butt',
            lineWidth: '10',
            size: 170,
            onStep: function(from, to, percent) {
                $(this.el).find('.chart-percent').text(Math.round(percent) + '%');
            }
        });
        
        $chartPie.one('inview', function(isInView){
            if (isInView){
                var percent = $(this).data('percent-update');
                $(this).data('easyPieChart').update(percent);
            }
        });
        
        
        // Counter Number
        var $timer = $('.timer');
        $timer.one('inview', function(isInView){
            if(isInView){
                $(this).countTo();
            }
        });
        
        
        // Testimonial Carousel
        var $testimonialCarousel = $('.testimonial-carousel');
        $testimonialCarousel.flickity({
            cellSelector: '.testimonial-item',
            cellAlign: 'left',
            contain: true,
            draggable: false,
            prevNextButtons: false,
            autoPlay: 3000,
            imagesLoaded: true,
            pauseAutoPlayOnHover: false
        });
        
        
        // Form - Contact
        var $formContact = $('#form-contact'),
            $btnFormContact = $('#btn-form-contact');
        
        $btnFormContact.on('click', function(e){
            $formContact.validate();
            if ($formContact.valid()){
                send_mail($formContact, $btnFormContact);
            }
            e.preventDefault();
        });
        
        // Send mail
        function send_mail($form, $btnForm){
            var defaultMessage = $btnForm.html(),
                sendingMessage = 'Loading...',
                errorMessage = 'Error Sending!',
                okMessage = 'Email Sent!';
            
            $btnForm.html(sendingMessage);
            
            $.ajax({
                url: $form.attr('action'),
                type: 'post',
                dataType: 'json',
                data: $form.serialize(),
                success: function(data){
                    if (data === true){
                        $btnForm.html(okMessage);
                        $form.find('input[type="text"], input[type="email"], textarea').val('');
                    }
                    else{
                        $btnForm.html(errorMessage);
                    }

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                },
                error: function(xhr, err){
                    $btnForm.html(errorMessage);

                    setTimeout(function(){
                        $btnForm.html(defaultMessage);
                    }, 3000);
                }
            });
        }
    });
})(jQuery);