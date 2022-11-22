const Koa = require('koa');
const fs = require('fs');
const path = require('path');
const compilerSFC = require('@vue/compiler-sfc');
const complierDOM = require('@vue/compiler-dom');

const app = new Koa();

app.use(async (ctx) => {
  const { url, query } = ctx;
  if (url === '/') {
    ctx.type = 'text/html';
    ctx.body = fs.readFileSync('./index.html', 'utf-8');
  } else if (url.endsWith('.js')) {
    const p = path.join(__dirname, url);
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(fs.readFileSync(p, 'utf-8'));
  } else if (url.startsWith('/@modules/')) {
    const moduleName = url.replace('/@modules/', '');
    const p = path.join(__dirname, 'node_modules', moduleName);
    const modulePath = require(path.join(p, '/package.json')).module;
    const realPath = path.join(p, modulePath);
    ctx.type = 'application/javascript';
    ctx.body = rewriteImport(fs.readFileSync(realPath, 'utf-8'));
  }else if(url.includes('.vue')){
    const p = path.join(__dirname, url.split('?')[0]);
    const content = fs.readFileSync(p, 'utf-8');
    const compileContent = compilerSFC.parse(content);
    const { type } = query;
    if(!type){
      const {content: scriptContent} = compileContent.descriptor.script;
      const script = scriptContent.replace(
        "export default ",
        "const __script = "
      );
      ctx.type = 'application/javascript';
      ctx.body = `
        ${rewriteImport(script)}
        import { render as __render } from '${url}?type=template'
        __script.render = __render;
        export default __script;
      `
    }else if(type === 'template'){
      const {content: templateContent} = compileContent.descriptor.template;
      const render = complierDOM.compile(templateContent, {
        mode: 'module',
      }).code;
      ctx.type = "application/javascript";
      ctx.body = rewriteImport(render);
    }
  }
});

function rewriteImport(content) {
  return content.replace(/ from ['"](.*)['"]/g, (s1, s2) => {
    const startsWithResult = s2.startsWith('/') || s2.startsWith('./') || s2.startsWith('../');
    if (startsWithResult === true) {
      return s1;
    } else {
      return ` from '/@modules/${s2}'`;
    }
  })
}


app.listen(3000);