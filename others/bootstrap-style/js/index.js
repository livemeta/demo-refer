$(function () {
    var isScript = false
    var typeValue, queryType, queryScope = getQueryVal('sc');
    $('[name=query-type]').change(function (evt) {
        setType(this);
        setFocus()
    }).filter(':checked').trigger('change')
    $('[name=query-scope]').change(function (evt) {
        setScope(this)
        setFocus()
    }).filter(':checked').trigger('change')

    function setType(elem) {
        var text = elem.nextSibling.nodeValue.replace(/^\s+|\s+$/g, '')
        $('#query-type').text(text + ':')

        queryType = text.toLowerCase()
        isScript = queryType === 'script'
        $('#input-group')[isScript ? 'addClass' : 'removeClass']('multi-line')
    }
    function setScope(elem) {
        queryScope = elem.value
    }
    function setFocus() {
        queryType === 'script' ? $('#script-box').focus() : $('#input').focus()
    }

    $('#search').click(function () {
        var val = isScript ? $('#script-box').val() : $('#input').val()
        if (!val) {
            return
        }
        $('#content').html('waiting...')

        $.ajax({
            url: 'http://192.168.10.174:8001/?plain=1&' + queryType + '=' + val + '&sc=' + queryScope,
            // url: 'http://192.168.10.161:8001/?plain=1&' + queryType + '=' + val + '&sc=' + queryScope,
            method: 'GET',
            dataType: 'text',
            cache: false
        }).done(function (res) {
            console.log(res)
            $('#content').html(res)
        }).fail(function (err, ext) {
            console.log(err)
            // alert(err)
        })
    })

    // set query value
    $('[name=query-type]').each(function () {
        var type = this.value;
        var val = getQueryVal(type)
        if (val) {
            typeValue = val
            queryType = type
            $(this).click()
            $('#input').val(typeValue)
        }
    })
    if (!typeValue) {
        typeValue = queryType === 'script' ? $('#script-box').val() : $('#input').val()
    }
    queryScope && $('[name=query-scope]').filter('[value=' + queryScope + ']').click()
    typeValue && $('#search').click()

    function getQueryVal(key) {
        var hash = {}
        var query = location.search.substr(1)
        query.split('&').map(function (val, index) {
            var arr = val.split('=')
            arr[1] && (hash[arr[0]] = arr[1])
        })
        return hash[key]
    }

    // input enter event
    $('#input').keydown(function (evt) {
        var code = evt.keyCode
        if (code === 13) {
            $('#search').click();
        }
    })
    $('#script-box').keydown(function (evt) {
        var code = evt.keyCode
        if (code === 13 && evt.altKey) {
            $('#search').click();
        }
    })
});