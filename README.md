# fontificate.js

fontificate.js is an MIT-licensed HMTL5 Javascript library that is used for processing font files in the client.  It currently only handles TrueType Font files and only displays name info.

## Usage

fontificate.js uses [Calabash.js](https://github.com/samlecuyer/calabash) promises because of the asynchronous nature of the [FileReader API](http://www.w3.org/TR/FileAPI/).  Once you have a File, you can pass it to fontificate with a couple of callbacks.

    fontificate(file)
        .then(function(thefont) {
            var names = thefont.getNamesForLanguage(0);
            $('#output').empty();
            names.forEach(function(record) {
                if (record.nameID <= 13) {
                    var label = nameLabels[record.nameID] + ': ' + record.text;
                    $('#output').append($('<li/>').text(label));
                }
            });
        }, function(reason) {
            alert(reason);
    });

Assuming that `file` is an HTML5 File, fontificate returns a promise that will either call the success callback with
the font object, or it will call the error callback with a reason for failure.  The Font object API is currently being developed
and will be published soon.
