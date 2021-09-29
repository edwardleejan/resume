## My Resume

Read resume data from a JSON file and generate a static web page. GitHub Pages support included.

Written with Gulp, Less, and Jade.

## Build

1. Run `npm install` to install the dependencies.
2. Fill your resume data in `resume_en-US.json` or `resume_zh-CN.json`.
3. Run `npm run build` to generate the static web page(`dist/${locale}/index.html`), ${locale} would be `en`/`zh`.
4. Run `npm run dev` and visit `http://localhost:8000/zh` if you want to see it hosted locally(make sure the port 8000 is not taken).
5. Run `npm run watch` and visit `http://localhost:8000/zh` and auto build while you edited.
6. Available urls as following

    |URL|Comments|
    |---|--------|
    |http://localhost:8000/en| English Resume|
    |http://localhost:8000/zh| Chinese Resume|


## Deploy to GitHub Pages

1. Set up the SSH git remote `origin` for the project.
2. After building the web page, run `gulp deploy`.
3. Everything under `dist` will be pushed to the remote repo's `gh-pages` branch.

## Develop

1. Make sure port 35729(for livereload) and 8000(for the local server) are available.
2. Run `gulp`, then visit `http://localhost:8000`.
3. Start development!
