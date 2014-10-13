var animated_favicon_img = new Image();   
animated_favicon_img.src = 'data:image/png;base64,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';
var ctx;  
var wave_x = 0;
var wave_y = 0;
var	icon;
var logo;

$(function() {	
	var bpy = 0;
	
	logo = $('#logo');
	
	$('#logo h1').text('');
	logo[0].bpy = -80; 
	$('#nav li.wave').each(function(){this.bpy = -113});
	
	ctx = document.getElementById('favicon_canvas').getContext('2d'); 
	icon = document.getElementById('favicon');
	
	var wave = $('.wave');

	fillLogo();
	
	setInterval(function() {
		bpy = (bpy+1) % 100;
		wave.each(function() {
			this.style.backgroundPosition = bpy + 'px '+this.bpy+'px';
		});
	}, 10); 
	startFavicon();

	$('#nav li.wave').hover(buttonHover, buttonLeave); 
	
	var viewportHeight = window.innerHeight ? window.innerHeight : $(window).height();

	$('#nav, #footer').css('opacity', 0).css('top', viewportHeight-30);
	$('.info').css('opacity', 0).css('top', '120px');

	
	
});

function startLogo() {
	$('#donotclick').animate({opacity: 0},600);
	fillLogo();
}

function fillLogo() {
	logo.css('backgroundColor', '#116ca9');
	logo.animate({bpy: -100},1000, function() {wave_y = -2;})
		.animate({bpy: -125},1000, function() {wave_y = -4;})
		.animate({bpy: -150},1000, function() {wave_y = -6;})
		.animate({bpy: -175},1000, showRest);
}

function showRest() {
	wave_y = -8;
	changeColor($('#logo'));
	$('#nav, #footer').animate({opacity: 1},1000);
}

function changeColor(e){  
    var hue = 'rgb(' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ',' + (Math.floor(Math.random() * 256)) + ')';  
    e.animate( { backgroundColor: hue }, 6000, function() {changeColor(e);});   
}  

function buttonHover() {
	var info_id = $(this).attr('id').substr(4);
	$(this).stop().animate({bpy: -170},300);
	$('#'+info_id+'_info').stop().animate({opacity: 1, top: 80}, 300).css('zIndex', 10);
	
}

function buttonLeave() {
	var info_id = $(this).attr('id').substr(4);
	$(this).stop().animate({bpy: -113},300);
	$('#'+info_id+'_info').stop().animate({opacity: 0, top: 120},300).css('zIndex', 0);	
}

function startFavicon() {
	if ($.browser.webkit || $.browser.opera) {
		setInterval(faviconFrame, 150);
		$('#favicon2 #favicon3').remove();
	}
	else
	{	
		$('#favicon').remove();
	}
}

function faviconFrame() {
	ctx.fillStyle = logo.css('backgroundColor');  
    ctx.fillRect (0, 0, 16, 16);
	ctx.drawImage(animated_favicon_img, -wave_x, wave_y);
	ctx.drawImage(animated_favicon_img, -32, -4);
	ctx.clearRect(0,0,1,1);
	ctx.clearRect(15,0,1,1);
	ctx.clearRect(0,15,1,1);
	ctx.clearRect(15,15,1,1);	
	setFavicon();
	wave_x = (wave_x + 1)%16;
}

function setFavicon() {
	icon = document.getElementById('favicon');
	(newIcon = icon.cloneNode(true)).setAttribute('href',ctx.canvas.toDataURL());
	icon.parentNode.replaceChild(newIcon,icon);
}
