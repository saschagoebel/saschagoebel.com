import 'babel-polyfill';

import metalsmith from 'metalsmith';

import multiLanguage from 'metalsmith-multi-language';
import buildDate from 'metalsmith-build-date';
import drafts from 'metalsmith-drafts';
import collections from 'metalsmith-collections';
import markdown from 'metalsmith-markdown';
import pug from 'metalsmith-pug';
import sass from 'metalsmith-sass';
import assets from 'metalsmith-assets';
import excerpts from 'metalsmith-excerpts';
import prism from 'metalsmith-prism';
import wordcount from 'metalsmith-word-count';
import layouts from 'metalsmith-layouts';

import googleAnalytics from 'metalsmith-google-analytics';
import sitemap from 'metalsmith-mapsite';
import feed from 'metalsmith-feed';
import autoprefixer from 'metalsmith-autoprefixer';

import serve from 'metalsmith-serve';
import watch from 'metalsmith-watch';

import htmlMinifier from 'metalsmith-html-minifier';
import cleanCss from 'metalsmith-clean-css';

import brokenLinkChecker from 'metalsmith-broken-link-checker';

import moment from 'moment';

const m = metalsmith(__dirname)
.metadata({
    sitemap: 'sitemap.xml',
    site: {
        title: 'Sascha Göbel',
        author: 'Sascha Göbel',
        description: 'Sascha Göbel, IT-Berater und Programmierer',
        url: 'development' === process.env.NODE_ENV ? 'http://localhost:8080/' : 'https://www.saschagoebel.com/'
    },
    development: 'development' === process.env.NODE_ENV,
    moment
})
.use(buildDate())
.use(drafts())
.use(markdown({
    gfm: true,
    tables: true,
    breaks: true,
    smartLists: true,
    smartypants: true
}))
.use(pug({
    pretty: 'development' === process.env.NODE_ENV,
    locals: {
    }
}))
.use(sass({
    outputStyle: 'development' === process.env.NODE_ENV ? 'expanded' : 'compressed'
}))
.use(multiLanguage(
    {
        default: 'en',
        locales: ['en', 'de']
    }
))
.use(collections({
    articles: {
        sortBy: 'date',
        reverse: true
    }
}))
.use(assets())
.use(excerpts())
.use(wordcount())
.use(prism())
//.use((files, metalsmith, done) => { console.log(files['index.html'], metalsmith.metadata()); done(); })
.use(layouts({
    engine: 'pug',
    default: 'layout.pug',
    pattern: ['**/*.html'],
    pretty: 'development' === process.env.NODE_ENV
}))
.use(googleAnalytics('UA-76786952-1'))
.use(sitemap({
    hostname: 'http://www.saschagoebel.com'
}))
.use(feed({collection: 'articles'}))
.use(autoprefixer());

if ('development' === process.env.NODE_ENV) {
    m.use(serve())
    .use(watch({
        paths: {
            '${source}/**/*': true, // every changed files will trigger a rebuild of themselves
            'layouts/**/*': '**/*', // every templates changed will trigger a rebuild of all files
            'public/**/*': '**/*' // every templates changed will trigger a rebuild of all files
        },
        livereload: true
    }));
}
else {
    m.use(htmlMinifier())
    .use(cleanCss())
    .use(brokenLinkChecker())
    .use(htmlMinifier());
}

m.build(err => {
    if (err) throw err;
});
