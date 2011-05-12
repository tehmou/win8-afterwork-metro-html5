Slidor.svgUtil = {};

(function() {
    Slidor.svgUtil.loadSvg = function (options) {
        options = options || {};
        var el = options.el,
            filename = options.svgFilename,
            loadDone = function (svg, error) {
                if (error) {
                    if (options.error) {
                        options.error(error);
                    }
                    return;
                }

                if (options.success) {
                    options.success(svg);
                }
            };

        $(el).svg({
            loadURL: filename,
            onLoad: loadDone,
            settings: {addTo: true, changeSize: false}
        });
    };

    Slidor.svgUtil.readViewBox = function (svg) {
        var viewBoxArray = svg.root().getAttribute("viewBox").split(" ");
        return {
            x: parseFloat(viewBoxArray[0]),
            y: parseFloat(viewBoxArray[1]),
            width: parseFloat(viewBoxArray[2]),
            height: parseFloat(viewBoxArray[3])
        }
    };

    Slidor.svgUtil.readSlides = function (options) {
        var svg = options.svg,
            hideFrames = options.hideFrames,
            slides = [];

        $("rect", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideMatch = $value.attr("id").match(/^slide([0-9]*)(.*)/);
            if (slideMatch) {
                var slideIndex = parseInt(slideMatch[1]),
                    slideOptions = slideMatch[2] || "",
                    slide = Slidor.svgUtil.createSlide($value, slideOptions);
                if (hideFrames !== false) {
                    $value.remove();
                }
                slides[slideIndex-1] = slide;
            }
        });

        $("g", svg.root()).each(function (index, value) {
            var $value = $(value),
                slideGroupMatch = $value.attr("id").match(/slidegroup([0-9.]*)/);
            console.log($value.attr("id"));
            if (slideGroupMatch) {
                console.log("Found slide group " + slideGroupMatch[1]);
                $value.children().each(function (index, value) {
                    var slide = Slidor.svgUtil.createSlide(value, {});
                    console.log("Created group slide");
                    slides.push(slide);
                });
            }
        });

        return slides;
    };

    Slidor.svgUtil.createSlide = function ($slideEl, options) {
        return {
            x: parseFloat($slideEl.attr("x")),
            y: parseFloat($slideEl.attr("y")),
            width: parseFloat($slideEl.attr("width")),
            height: parseFloat($slideEl.attr("height")),
            options: options
        };
    };

    Slidor.svgUtil.animateWithTransformation = function (options) {
        var group = options.group,
            duration = options.duration,
            m = options.matrix,
            transformationString = "matrix("+m.a1+" "+m.a2+" "+m.b1+" "+m.b2+" "+m.c1+" "+m.c2+")";

        console.log(transformationString);
        console.log(group);
        group.animate({ svgTransform: transformationString }, duration);
    };

}());