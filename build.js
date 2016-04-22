import 'babel-polyfill';

import Metalsmith from 'metalsmith';

import buildDate from 'metalsmith-build-date';
import define from 'metalsmith-define';
import markdown from 'metalsmith-markdown';
import jade from 'metalsmith-jade';
import less from 'metalsmith-less';
import assets from 'metalsmith-assets';
import layouts from 'metalsmith-layouts';

import sitemap from 'metalsmith-mapsite';
import autoprefixer from 'metalsmith-autoprefixer';

import serve from 'metalsmith-serve';
import watch from 'metalsmith-watch';

import htmlMinifier from 'metalsmith-html-minifier';
import cleanCss from 'metalsmith-clean-css';

import brokenLinkChecker from 'metalsmith-broken-link-checker';

import moment from 'moment';

const m = Metalsmith(__dirname)
.metadata({
    sitemap: "sitemap.xml",
    url: 'development' === process.env.NODE_ENV ? 'http://localhost:8080/' : 'http://saschagoebel.com/',
    name: "Sascha Goebel",
    owner: "Sascha Goebel",
    description: "Sascha Goebel, IT-Berater und Programmierer",
    development: 'development' === process.env.NODE_ENV,
    moment: moment
})
.use(buildDate())
.use(define({
    desc: 'test'
}))
.use(markdown({
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
}))
.use(jade({
    pretty: 'development' === process.env.NODE_ENV,
    locals: {
    }
}))
.use(less({
    useDynamicSourceMap: 'development' === process.env.NODE_ENV
}))
.use(assets())
.use(layouts({
    engine: 'jade',
    default: 'layout.jade',
    pattern: ['*.html'],
    pretty: 'development' === process.env.NODE_ENV
}))
.use(sitemap({
    hostname: 'http://saschagoebel.com'
}))
.use(autoprefixer());

if ('development' === process.env.NODE_ENV) {
    m.use(serve())
    .use(watch({
        paths: {
            "${source}/**/*": true, // every changed files will trigger a rebuild of themselves
            "layouts/**/*": "**/*", // every templates changed will trigger a rebuild of all files
            "public/**/*": "**/*", // every templates changed will trigger a rebuild of all files
        },
        livereload: true
    }));
}
else {
    m.use(htmlMinifier())
    .use(cleanCss())
    .use(brokenLinkChecker());
}

m.build(err => {
    if (err) throw err;
});
