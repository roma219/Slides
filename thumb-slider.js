function thumbSlider(rClass, params) {

    $rCont = $(rClass);
    var picWidth = params.width;
    var picHeight = params.height;
    var picBorder;
    var picMargin;
    var imgs = []; //Массив url-ов картинок
    var lastPicNum = 0; //Номер последней отображаемой картинки, в неё добавляется скролл и прогресс-бар

    init();

    function getLastPicNum() {
            result = (( $rCont.width()-picMargin-parseInt($('.th-round').css('border'), 10) -
         ($rCont.width()-picMargin-parseInt($('.th-round').css('border'), 10)) % (picWidth+2*picBorder+picMargin)) /
          (picWidth+2*picBorder+picMargin));
            return result;
        }

    //Инициализация виджета
    function init() {
        $('<img class="th-thumb">').appendTo(rClass);
        picWidth = params.width || parseInt($('.th-thumb').css('width'), 10);
        picBorder = parseInt($('.th-thumb').css('border'), 10);
        picMargin = parseInt($('.th-thumb').css('margin'), 10);
        $('.th-thumb').remove();
        if (params.height) initModeB();
        else initModeA();
    }
    //Берём картинки по ссылке в количестве params.count [Режим A]
    function initModeA() {
        $rCont.addClass('thumbSlider');
        $(window).bind('load', stopResize);
        $(window).bind('resize', stopResize);
         //Возвращает ссылку на картинку с подстваленным номером вместо '%d'
        function createImgUrl(template, number) {
            return template.slice(0, template.indexOf('%d')) + number + template.slice(template.indexOf('%d') + 2);
        }

        //Возвращает переданную строку(ссылку на изображение) в тэг img в параметре src
        function createImgTag(link, number) {
            return '<img class="th-thumb num' + number + '" src="' + link + '">';
        }

        //создаем массив с url-ами изображений
        for (var i = 1; i <= params.count; i++) {
            imgs[i] = createImgUrl(params.url, i);
        }


        //Максимально возможное количество изображений на странице
        var numOfImgs = (screen.width - screen.width % (picWidth+picMargin+2*picBorder))/
         (picWidth+picMargin+2*picBorder);

        //Добавляем в html фоновый элемент, картинки, прогресс-бар
        $('<span class="th-round"></span>').appendTo(rClass);
        for (i = 1; i <= numOfImgs; i++) {
            $(createImgTag(imgs[i], i)).appendTo('.th-round');
        }
        $('<div class="th-progress"><div></div></div>').appendTo('.th-round');
        //Задаем размеры картинок, прогресс-бара и всего контейнера 
         $('.th-round').css({
            height: picWidth + 2*picBorder + 2*picMargin
        });
        $('.th-thumb').css({
            width: picWidth,
            height: picWidth
        });
        $('.th-progress').css({
            width: picWidth - 20,
            bottom: picMargin+picBorder+20
        });
    }

    //Определение последней картинки при изменении ширины и 
    //прикрепление к ней функции слайдера [Для режима A]
    function stopResize(event, ui) {
        var $progress = $('.th-progress');
        $('.num' + lastPicNum).unbind('mouseenter mousemove mouseleave');
        lastPicNum = getLastPicNum();
        $lastPic = $('.num' + lastPicNum);
        var defaultPic, pixelsPerPic;
        $('.th-round').css({
            width: lastPicNum*(picWidth+2*picBorder+picMargin)+picMargin
        });

        $lastPic.mouseenter(function() {
            defaultPic = $(this).attr('src');
            pixelsPerPic = ($(this).width()+2*picBorder) / (imgs.length - lastPicNum);
            $progress.css({
                right: picMargin + picBorder + 10,
                display: 'block'
            });
            $(this).css({'box-shadow': '0 0 2px 2px rgb(210,114,5)'});
        });

        $lastPic.mousemove(function(event) {
            picNum = parseInt((event.pageX - $(this).offset().left) / pixelsPerPic, 10) + lastPicNum;
            $(this).attr('src', imgs[picNum]);
            var perc = (event.pageX - $(this).offset().left) / ($(this).width()+2*picBorder);
            $progress.find('div').css({
                width: perc * $progress.width()
            });
        });

        $lastPic.mouseleave(function() {
            $(this).attr('src', defaultPic);
            $progress.css('display', 'none');
            $(this).css({'box-shadow': 'none'});
        });
    }

    //Берём картинки по ссылке и разбиваем на картинки по params.height [Режим B]
    function initModeB() {
        var numOfImgs = ((screen.width - screen.width % (picWidth+2*picBorder+picMargin)) /
            (picWidth+2*picBorder+picMargin));
        $('<span class="th-round"></span>').appendTo(rClass);
        var imgAdress = params.url;
        for (var i = 1; i <= numOfImgs; i++) {
            $('<div class="th-thumb num' + i + '"></div>').appendTo('.th-round');
            var picPos = picHeight - picHeight * i;
            $('.num' + i).css({
                width: picWidth,
                height: picHeight,
                background: "url('" + imgAdress + "')",
                backgroundPosition: '0 ' + picPos + 'px'
            });
        }
        $('.th-round').css({
            height: picHeight + 2*picBorder+2*picMargin
        });
        $('<div class="th-progress"><div></div></div>').appendTo('.th-round');
        $('.th-progress').css({
            width: picWidth - 20,
            bottom: picMargin+picBorder+20
        });
        $(window).bind('load', lastPicActivate);
        $(window).bind('resize', lastPicActivate);
    }

    //Определение последней картинки при изменении ширины и 
    //прикрепление к ней функции слайдера [Для режима B]
    function lastPicActivate() {

        var $progress = $('.th-progress');
        $('.num' + lastPicNum).unbind('mouseenter mousemove mouseleave');
        lastPicNum = getLastPicNum();
        var $lastPic = $('.num' + lastPicNum);
        $('.th-round').css({
            width: lastPicNum*(picWidth+2*picBorder+picMargin)+picMargin
        });

        var defPos;
        $lastPic.mouseenter(function() {
            defPos = $(this).css('backgroundPositionY');
            $progress.css({
                right: picMargin+picBorder+10,
                display: 'block'
            });
            $(this).css({'box-shadow': '0 0 2px 2px rgb(210,114,5)'});
        });

        $lastPic.mousemove(function(event) {
            var pixelsPerPic = (picWidth+2*picBorder) / (params.count - lastPicNum + 1);
            var picNum = parseInt((event.pageX - $(this).offset().left) / pixelsPerPic, 10) + lastPicNum;
            var picPos = picHeight * (1 - picNum);
            $(this).css({
                'backgroundPositionY': picPos + 'px'
            });
            var perc = (event.pageX - $(this).offset().left) / ($(this).width()+2*picBorder);
            $progress.find('div').css({
                width: perc * $progress.width()
            });
        });

        $lastPic.mouseleave(function() {
            $(this).css({
                'backgroundPositionY': defPos
            });
            $progress.css('display', 'none');
            $(this).css('box-shadow', 'none');
        });
    }


}