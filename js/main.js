$(document).ready(function(){
    
    // nav toggle
    $(".hamburger-btn").click(function(){
        $(".header .nav").slideToggle();
    })
    
    $(".header .nav a").click(function(){
        if($(window).width() < 770){
            $(".header .nav").slideToggle();
        }
    })

    // fixed header
    $(window).scroll(function(){
        if($(this).scrollTop() > 70){
            $(".header").addClass("fixed");
        }
        else{
            $(".header").removeClass("fixed");
        }
    })

    // scrollIT
    $.scrollIt({
        topOffset: -50
    });
})