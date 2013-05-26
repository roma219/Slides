function thumbSlider(rClass, params) {

    var picWidth;
    var imgs = []; //Массив url-ов картинок
    var lastPicNum = 0; //Номер последней отображаемой картинки, в неё добавляется скролл и прогресс-бар
    init();
    stopResize();

    //Инициализация виджета
    function init() {
        //Возвращает ссылку на картинку с подстваленным номером вместо '%d'
        function createImgUrl(template, number) {
            return template.slice(0, template.indexOf('%d')) + number + template.slice(template.indexOf('%d') + 2);
        }

        //Возвращает переданную строку(ссылку на изображение) в тэг img в параметре src
        function createImgTag(link, number) {
            return '<img class="th-thumb num' + number + '" src="' + link + '">';
        }

        $(rClass).addClass('thumbSlider');
        $(window).bind('load', stopResize);
        $(window).bind('resize', stopResize);

        //создаем массив с url-ами изображений
        for (var i = 1; i <= params.count; i++) {
            imgs[i] = createImgUrl(params.url, i);
        }

        //Получаем ширину картинки как параметр, либо либо если параметр не был передан
        // - то дефллтную=180
        $('<img class="th-thumb">').appendTo(rClass); // Добавляем, чтобы узнать дефолтную ширину из css
        picWidth = params.width || parseInt($('.th-thumb').css('width'), 10);
        $('.th-thumb').remove();

        //Максимально возможное количество изображений на странице
        var numOfImgs = (screen.width - screen.width % (picWidth+12))/ (picWidth+12);

        //Добавляем в html фоновый элемент, картинки, прогресс-бар
        $('<span class="th-round"></span>').appendTo(rClass);
        for (i = 1; i <= numOfImgs; i++) {
            $(createImgTag(imgs[i], i)).appendTo('.th-round');
        }
        $('<div class="th-progress"><div></div></div>').appendTo('.th-round');

        //Задаем размеры картинок, прогресс-бара и всего контейнера 
         $('.th-round').css({
            height: picWidth+22
        });
        $('.th-thumb').css({
            width: picWidth,
            height: picWidth
        });
        $('.th-progress').css({
            width: picWidth - 20,
            top: picWidth
        });
    }

    //Определение последнее отображаемой картинки и прикрепление к ней функции слайдера
    //отображение на ней прогресс-бара
    function stopResize(event, ui) {
        var $lastPic = $('.num' + lastPicNum);
        var $progress = $('.th-progress');
        $lastPic.unbind('mouseenter mousemove mouseleave');
        lastPicNum = (($(rClass).width()-12) - ($(rClass).width()-12) % (picWidth+12)) / (picWidth+12);
        $lastPic = $('.num' + lastPicNum);
        var defaultPic, pixelsPerPic;

        $('.th-round').css({
            width: lastPicNum*(picWidth+12)+10
        });

        $lastPic.mouseenter(function() {
            defaultPic = $(this).attr('src');
            pixelsPerPic = $(this).width() / (imgs.length - lastPicNum);
            $progress.css({
                left: $(this).offset().left + 10
            });
            $progress.css('display', 'block');

        });

        $lastPic.mousemove(function(event) {
            picNum = parseInt((event.pageX - $(this).offset().left) / pixelsPerPic, 10) + lastPicNum;
            $(this).attr('src', imgs[picNum]);
            var perc = (event.pageX - $(this).offset().left) / $(this).width();
            $progress.find('div').css({
                width: perc * $progress.width()
            });
        });

        $lastPic.mouseleave(function() {
            $(this).attr('src', defaultPic);
            $progress.css('display', 'none');
        });
    }
}