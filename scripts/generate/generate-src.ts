import * as fs from 'fs-extra';
import * as path from 'path';
import ts from 'typescript';
import prettier from 'prettier';

export enum Template {
  Vanilla = 'vanilla',
  React = 'react',
  VanillaTypescript = 'vanilla-typescript',
  ReactTypescript = 'react-typescript',
}

const CUSTOM_EXTENSIONS = new Map([
  [Template.VanillaTypescript, '.ts'],
  [Template.ReactTypescript, '.tsx'],
]);

const TEMPLATES = new Map([
  [Template.Vanilla, 'vanilla.template.js'],
  [Template.React, 'react.template.jsx'],
  [Template.VanillaTypescript, 'vanilla.template.ts'],
  [Template.ReactTypescript, 'react.template.tsx'],
]);

export const EXTENSION_TEMPLATE_MAP = new Map([
  ['CHECKOUT_POST_PURCHASE', 'post-purchase'],
  ['CHECKOUT_ARGO_EXTENSION', 'checkout'],
]);

export function log(message: string) {
  console.log(`🔭 > ${message}`);
}

export function generateSrc(type: string, template: Template) {
  const extension = CUSTOM_EXTENSIONS.get(template) || '.js';

  const outputDirectory = path.resolve(getTargetRootDirectory(), 'src');
  if (!fs.existsSync(outputDirectory)) {
    fs.mkdirSync(outputDirectory);
  }

  const outPath = path.join(outputDirectory, `index${extension}`);
  const templateSource = getTemplateSrc(type, template);
  fs.writeFileSync(outPath, templateSource);

  copyAdditionalFiles();

  log(`your extension is ready to go!`);
  log(`start by opening src/index${extension} in your editor of choice`);
}

function getTemplateSrc(type: string, template: Template) {
  switch (template) {
    case Template.React:
      return transpile(type, Template.ReactTypescript);
    case Template.Vanilla:
      return transpile(type, Template.VanillaTypescript);
    default:
      return readTemplate(type, template);
  }
}

function transpile(type: string, template: Template) {
  const input = readTemplate(type, template);
  const output = ts.transpileModule(input, {
    compilerOptions: {
      target: ts.ScriptTarget.ES2017,
      module: ts.ModuleKind.ESNext,
      jsx: ts.JsxEmit.Preserve,
    },
  });
  const options = prettier.resolveConfig.sync('.');
  return prettier.format(output.outputText, {...options, parser: 'typescript'});
}

function copyAdditionalFiles() {
  const filesPath = path.join(getTemplateRootDirectory(), 'files');
  fs.copySync(filesPath, getTargetRootDirectory());
}

function getTargetRootDirectory() {
  return path.resolve(__dirname, '../../');
}

function getTemplateRootDirectory() {
  return path.join(__dirname, 'templates');
}

function readTemplate(type: string, template: Template) {
  return fs.readFileSync(
    path.join(
      getTemplateRootDirectory(),
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      EXTENSION_TEMPLATE_MAP.get(type)!,
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      TEMPLATES.get(template)!
    ),
    'utf8'
  );
}
