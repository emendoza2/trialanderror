var transitioner = transitioner(function (v) {
    document
        .querySelector(".progressbar")
        .style.setProperty("--scrollAmount", v);
}, 700);

document.addEventListener(
    "scroll",
    debounce(function () {
        var $doc = document.documentElement,
            $body = document.body,
            scrollTop = $doc["scrollTop"] || $body["scrollTop"],
            scrollBottom =
                ($doc["scrollHeight"] || $body["scrollHeight"]) -
                window.innerHeight,
            scrollRatio = scrollTop / scrollBottom;
        transitioner.move(scrollRatio);
    }, 50)
);

function createAnimator(cb, start, end, duration, easing) {
    var requestId = undefined;

    var startTime, time;
    easing =
        easing ||
        function (t) {
            return t * t * (3 - 2 * t);
        };

    function run() {
        time = Date.now() - startTime;
        time = time / duration;
        if (time < 1) requestId = requestAnimationFrame(run);
        time = easing(time);
        cb(start + (end - start) * time);
    }

    var animator = { start: startAnimator, stop: stopAnimator };

    function startAnimator() {
        startTime = Date.now();
        run();
        return animator;
    }
    function stopAnimator() {
        cancelAnimationFrame(requestId);
        requestId = undefined;
    }
    return animator;
}

function transitioner(cb, duration, easing) {
    var v = 0;
    var animator;
    function move(to, d, e) {
        d = d || duration;
        e = e || easing;
        if (animator) animator.stop();
        function c(value) {
            v = value;
            cb(value);
        }
        animator = createAnimator(c, v, to, d, e).start();
    }
    return { move: move };
}

function debounce(fn, delay) {
    var timer = null;
    return function () {
        var context = this,
            args = arguments;
        clearTimeout(timer);
        timer = setTimeout(function () {
            fn.apply(context, args);
        }, delay);
    };
}
