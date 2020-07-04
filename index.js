const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const fs = require('fs');

const fileStream = fs.createReadStream('tabs.json');
const jsonStream = StreamArray.withParser();

const stream = fs.createWriteStream('tabs.html');

stream.write('<!DOCTYPE NETSCAPE-Bookmark-file-1>\n');
stream.write('<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">\n');
stream.write('<TITLE>Tabs</TITLE>\n');
stream.write('<H1>Tabs</H1>\n');
stream.write('<DL>\n');
stream.write('    <DT><H3>Tabs</H3></DT>\n');
stream.write('    <DL>\n');

const processingStream = new Writable({
    write({key, value}, encoding, callback) {
        const title = value['title'];
        const url = value['url'];

        if (url && title) {
            stream.write(`        <DT><A HREF="${url}">${title}</A></DT>\n`);
        }

        callback();
    },
    objectMode: true
});

fileStream.pipe(jsonStream.input);
jsonStream.pipe(processingStream);

processingStream.on('finish', () => {
    stream.write('    </DL>\n');
    stream.write('</DL>\n');
    stream.close();
});
