import fs from 'fs';
import path from 'path';
import {exec} from 'child_process';

export function cleanUp(type: string) {
  const packagePath = path.resolve(__dirname, '../../package.json');
  const file = fs.readFileSync(packagePath);
  const json = JSON.parse(file.toString());

  delete json.scripts.generate;
  delete json.scripts['clean-up'];
  delete json.devDependencies['@types/yargs'];
  delete json.devDependencies['fs-extra'];
  delete json.devDependencies['inquirer'];
  delete json.devDependencies['ts-node'];
  delete json.devDependencies['yargs'];

  if (type === 'CHECKOUT_ARGO_EXTENSION') {
    delete json.dependencies['@shopify/argo-post-purchase'];
    delete json.dependencies['@shopify/argo-post-purchase-react'];
  } else {
    delete json.dependencies['@shopify/argo-checkout'];
    delete json.dependencies['@shopify/argo-checkout-react'];
  }

  const newPackage = JSON.stringify(json, null, 2);

  exec(`rm -rf ${path.resolve(__dirname, '../../scripts')}`);

  try {
    fs.writeFileSync(packagePath, newPackage);
  } catch (error) {
    console.error(
      'Could not update package.json. You can manually update it by deleting the scripts.generate command.',
      error
    );
  }
}
