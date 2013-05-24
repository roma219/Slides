function thumbSlider(rClass, params) {

    $(rClass).addClass('thumbSlider');

    var lastPicNum = 0;

    $(window).bind('load', stopResize);
    $(window).bind('resize', stopResize);


    //Определение последнее отображаемой картинки и прикрепление к ней функции слайдера
    //отображение на ней прогресс-бара
    function stopResize(event, ui) {
        $lastPic=$('.num'+ lastPicNum);

        $('.num'+ lastPicNum).unbind('mouseenter mousemove mouseleave');
        lastPicNum = ($(rClass).width() - $(rClass).width() % 190) / 190;
        if (lastPicNum === 0) var specPic = $(rClass).width() / 190;

        var defaultPic, pixelsPerPic;
        $('.num'+ lastPicNum).mouseenter(function() {
            defaultPic = $(this).attr('src');
            pixelsPerPic = $(this).width() / (imgs.length - lastPicNum);
            $progress.css({
                left: $(this).offset().left + 10
            });
            $progress.css('display', 'block');
        });

        $('.num'+ lastPicNum).mousemove(function(event) {
            picNum = parseInt((event.pageX - $(this).offset().left)/pixelsPerPic, 10) + lastPicNum;
            $(this).attr('src', imgs[picNum]);
            var perc = (event.pageX - $(this).offset().left) / $(this).width()*100;
            $progress.progressbar("option", "value", perc);
        });

        $('.num'+ lastPicNum).mouseleave(function() {
            $(this).attr('src', defaultPic);
            $progress.css('display', 'none');
        });

        $rounder.css({
            width: lastPicNum * 190 + 8 + 2 * lastPicNum
        });

        if (lastPicNum === 0) $rounder.css({
                width: specPic * 190 + 16
            });
    }

    //Возвращает ссылку на картинку с подстваленным номером вместо '%d'
    function createImgUrl(template, number) {
        return template.slice(0, template.indexOf('%d')) + number + template.slice(template.indexOf('%d') + 2);
    }

    //Возвращает переданную строку(ссылку на изображение) в тэг img в параметре src
    function createImgTag(link, number) {
        return '<img class="th-thumb num' + number + '" src="' + link + '">';
    }

    //Создание массива с адресами картинок по номерам
    var imgs = [];
    for (var i = 1; i <= params.count; i++) {
        imgs[i] = createImgUrl(params.url, i);
    }

    //Максимально возможное количество изображений на странице
    var numOfImgs = (screen.width - screen.width % 190) / 190;

    //Добавляем в html фоновый элемент, картинки, прогресс-бар
    $('<div class="th-round"></div>').appendTo(rClass);
    for (i = 1; i <= numOfImgs; i++) {
        $(createImgTag(imgs[i], i)).appendTo(rClass);
        }
    $('<div class="th-progress"></div>').appendTo(rClass);


    var $progress = $('.th-progress');
    var $rounder = $('.th-round');

    $progress.progressbar();

}
