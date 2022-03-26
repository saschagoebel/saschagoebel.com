# www.saschagoebel.com

## Prerequisites
```shell
npm install -g html-minifier serve
```

## Build & Test
```shell
html-minifier \
  --input-dir ./src \
  --output-dir ./dist \
  --collapse-boolean-attributes \
  --collapse-whitespace \
  --collapse-inline-tag-whitespace \
  --decode-entities \
  --minify-css \
  --minify-js \
  --remove-attribute-quotes \
  --remove-comments \
  --remove-empty-attributes \
  --remove-empty-elements \
  --remove-redundant-attributes \
  --sort-attributes \
  --sort-class-name \
  --use-short-doctype \
&& serve ./dist
```
