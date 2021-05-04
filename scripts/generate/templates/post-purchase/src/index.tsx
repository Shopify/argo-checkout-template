/**
 * Extend Shopify Checkout with a custom Post Purchase user experience.
 * This template provides two extension points:
 * 
 *  1. ShouldRender - Called first, during the checkout process, when the 
 *     payment page loads.
 *  2. Render - If requested by `ShouldRender`, will be rendered after checkout
 *     completes
 */

import {
  extend,
  render,
  useExtensionInput,
  BlockStack,
  Button,
  CalloutBanner,
  Heading,
  Image,
  Layout,
  Link,
  TextBlock,
  TextContainer,
} from '@shopify/argo-post-purchase-react';


/** Define any shape or type of data */
interface InitialState {
  couldBe: 'anything' | 'everything';
}


/**
 * Entry point for the `ShouldRender` Extension Point.
 *
 * Returns a value indicating whether or not to render a PostPurchase step, and
 * optionally allows data to be stored on the client for use in the `Render`
 * extension point.
 */
 extend('Checkout::PostPurchase::ShouldRender', async ({storage}) => {
  const render = true;
  const initialState = await getRenderData();

  if (render) {
    // Saves initial state, provided to `Render` via `storage.initialData`
    await storage.update(initialState);
  }

  return {
    render,
  };
});

// Simulate results of network call, etc.
async function getRenderData() : Promise<InitialState> {
  return {
    couldBe: 'anything',
  };
}


/**
 * Entry point for the `Render` Extension Point
 *
 * Returns markup composed of Argo components.  The Render extension can
 * optionally make use of data stored during `ShouldRender` extension point to
 * expedite time-to-first-meaningful-paint.
 */
render('Checkout::PostPurchase::Render', () => <App />);

// Top-level React component
export function App() {
  const {extensionPoint, storage} = useExtensionInput<
    'Checkout::PostPurchase::Render'
  >();
  const initialState = storage.initialData as InitialState;
  return (
    <BlockStack>
      <CalloutBanner
        title="TEMPLATE"
      >
        Use this template as a starting point to build a great post-purchase extension.
      </CalloutBanner>
      {/* <Layout />
       * `500` represents `500px`
       * `0.5` represents `50%`
       * `1` represents `100%` */}
      <Layout
        media={[
          {viewportSize: 'small', sizes: [1, 1], maxInlineSize: 0.95},
          {viewportSize: 'medium', sizes: [300, 0.5], maxInlineSize: 0.95},
          {viewportSize: 'large', sizes: [300, 0.3], maxInlineSize: 0.95},
        ]}
      >
        <BlockStack>
          <Image source="https://cdn.shopify.com/s/files/1/0506/0709/6002/t/5/assets/placeholder_600x.png" />
        </BlockStack>
        <BlockStack alignment="leading" spacing="xloose">
          <TextContainer>
            <Heading>Post-Purchase Extension</Heading>
            <TextBlock>
              Here you can cross-sell other products, request a product review based on a previous purchase, and much more.
            </TextBlock>
            <TextBlock>
              Learn more about <Link to="https://shopify.dev"> creating great user experiences for post-purchase offers</Link>.
            </TextBlock>
          </TextContainer>
          <Button
            onPress={() => {
              // eslint-disable-next-line no-console
              console.log(`Extension point ${extensionPoint}`, initialState);
            }}
          >
            Primary button
          </Button>
        </BlockStack>
      </Layout>
    </BlockStack>
  );
}
