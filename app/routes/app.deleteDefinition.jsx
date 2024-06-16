import { useLoaderData, useSubmit } from '@remix-run/react';
import { Page, Text, Layout, Button, TextField, Card } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { useState } from 'react';


export const loader = async ({request}) => {
  const { admin } = await authenticate.admin(request)
  try {
    const response = await admin.graphql(`
      {
          metaobjectDefinitions(first:50) {
            nodes {
              id
              type
            }
          }
        }
    `)
    if (response.ok) {
      const data = await response.json()
      return data.data.metaobjectDefinitions.nodes
    }
    
  } catch (error) {
    console.log(error)
  }
  return null
}


export const action = async ({request}) => {
  const { admin } = await authenticate.admin(request)
  const body = await request.formData();
  const id =  body.get('id')
  try {
    const response = await admin.graphql(`
      mutation DeleteMetaobjectDefinition($id: ID!) {
        metaobjectDefinitionDelete(id: $id) {
          deletedId
      }
    }`,
    {
      variables : {
        id: id
      }
  })
  if (response.ok) {
    console.log("response was ok")
    const data = await response.json()
    console.log(data)
    }
  } catch (error) {
    console.log(error)
  }
  return null
}




const deleteDefinition = () => {
  const data = useLoaderData();
  const submit = useSubmit()
  const [id, SetId] = useState('')
  const hanldeSubmit = (id) => {
    submit({id}, {replace:true, method:"POST"})
    SetId("")
  }
  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Text variant='heading2xl' alignment='center'>deleteDefinition Component</Text>
          {data && data.map((item) => (
            <Card key={item.id}>
              <Text variant='headingMd'>{item.id}</Text>
              <Text variant='headingMd'>{item.type}</Text>
            </Card>
          ))}
        </Layout.Section>
        <Layout.Section>
          <TextField
            label="Definition ID"
            value={id}
            onChange={(e) => SetId(e)}
           />
           <Button variant='primary' tone="critical" onClick={() => hanldeSubmit(id)} >Delete Definition</Button>
        </Layout.Section>
      </Layout>     
    </Page>

  );
};

export default deleteDefinition;