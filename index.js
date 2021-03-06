const StreamArray = require('stream-json/streamers/StreamArray');
const { Writable } = require('stream');
const fs = require('fs');

const fileStream = fs.createReadStream('tabs.json');
const jsonStream = StreamArray.withParser();

const links = [];
const groups = new Map();

const words = ['Flutter', 'Dart', 'Firebase', 'Kotlin', 'Swift', 'Xamarin', 'React', 'JavaScript', 'UWP', '.NET', 'C#',
    'Blazor', 'WPF', 'XAML', 'Microsoft', 'Google', 'Apple', 'JetBrains', 'Figma', 'Sketch', 'Rive', 'Git', 'CSS',
    'GraphQL', 'Python', 'PHP', 'Docker', 'Kubernetes', 'Node', 'PWA'
];

const processingStream = new Writable({
    write({key, value}, encoding, callback) {
        const title = value['title'];
        const url = value['url'];

        if (url && title) {
            let list = links;

            const search = `${title} ${url}`.toLowerCase();
            const word = words.find(word => search.includes(word.toLowerCase()));
            if (word) {
                if (groups.has(word)) {
                    list = groups.get(word);
                } else {
                    list = [];
                    groups.set(word, list);
                }
            }

            list.push({
                type: 'dt',
                content: {
                    type: 'a',
                    attributes: { href: url },
                    content: title
                }
            });
        }

        callback();
    },
    objectMode: true
});

fileStream.pipe(jsonStream.input);
jsonStream.pipe(processingStream);

processingStream.on('finish', () => {
    const now = new Date();
    const date = `${now.getFullYear()}${now.getMonth() + 1}${now.getDate()}`;

    const groupedLinks = [];
    groups.forEach((links, name) => {
        groupedLinks.push({
            type: 'h3',
            content: name
        });
        groupedLinks.push({
            type: 'dl',
            content: links
        });
    });

    const elements = [
        { content: '<!DOCTYPE NETSCAPE-Bookmark-file-1>' },
        { content: '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">' },
        { type: 'title', content: 'Tabs' },
        { type: 'h1', content: 'Tabs' },
        {
            type: 'dl',
            content: [
                {
                    type: 'dt',
                    content: { type: 'h3', content: `Tabs_${date}` }
                },
                {
                    type: 'dl',
                    content: [...groupedLinks, ...links]
                }
            ]
        }
    ];

    const html = elements.map(element => createHtmlElement(element)).join('\n');

    fs.writeFile(`tabs_${date}.html`, html, fsErr => {});
});

const createHtmlElement = ({ type, attributes, content }, level = 0) => {
    if (type) {
        if (content.constructor === Object) {
            return createHtmlElement(content, level);
        }

        const pad = ''.padStart(level * 4);
        const tag = type.toUpperCase();

        if (content.constructor === Array) {
            const children = content.map(element => createHtmlElement(element, level + 1)).join('\n');

            return `${pad}<${tag}>\n${children}\n${pad}</${tag}>`;
        }

        return `${pad}<${tag}${createHtmlAttributes(attributes)}>${content}</${tag}>`;
    }

    return content;
}

const createHtmlAttributes = (attributes) => {
    if (attributes && attributes.constructor === Object) {
        return Object.keys(attributes).map(key => ` ${key.toUpperCase()}="${attributes[key]}"`).join('');
    }
    return '';
};
