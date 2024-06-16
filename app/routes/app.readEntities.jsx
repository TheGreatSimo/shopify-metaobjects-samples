import { Page, Text, Layout, Card } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { useLoaderData } from '@remix-run/react';

export const loader = async ({request}) => {
  const { admin } = await authenticate.admin(request)
  try {
    const response = await admin.graphql(`
      {
        metaobjects(type:"youtubelearn", first:50) {
          nodes {
            id
            type
            field(key:"somekey") {value}
     
          }

        }
      }
    `)
    if (response.ok) {
      console.log("response was hit")
      const data = await response.json()
      console.log(data.data.metaobjects.nodes)
      return data.data.metaobjects.nodes
    }
    
  } catch (error) {
    console.log("we got error here")
    console.log(error)
  }
  return null
}

const readEntities = () => {
  const data = useLoaderData()
  return (
    <Page>
      <Text variant='heading2xl' alignment='center'>readEntities Component</Text>
      {data && data.map((item) => (
        <Card key={item.id}>
          <Text variant='headingMd'>{item.field.value}</Text>
          <Text variant='headingSm'>{item.id}</Text>
        </Card>

      ))}
    </Page>
  );
};

export default readEntities;