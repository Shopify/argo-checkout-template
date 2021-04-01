import {extend, TextField, TextBlock, BlockStack} from '@shopify/argo-checkout';

extend('Checkout::Feature::Render', (root, {extensionPoint}) => {
  root.appendChild(
    root.createComponent(BlockStack, {}, [
      root.createComponent(
        TextBlock,
        {},
        `Welcome to the ${extensionPoint} extension!`
      ),
      root.createComponent(TextField, {
        label: 'Order note',
        onChange(value) {
          console.log(`Updated order note: ${value}`);
        },
      }),
    ])
  );
});
