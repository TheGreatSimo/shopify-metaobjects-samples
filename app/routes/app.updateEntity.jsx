import { useSubmit } from '@remix-run/react';
import { Page, Text, Layout, TextField, Button } from '@shopify/polaris';
import { useState } from 'react';
import { authenticate } from '../shopify.server';

export const action = async({request}) => {
  const { admin } = await authenticate.admin(request)
  const body = await request.formData();
  const id = body.get("id")
  const entity = body.get("entity")

  try {
    const response = await admin.graphql(`
      mutation UpdateMetaobject($id: ID!, $metaobject: MetaobjectUpdateInput!) {
        metaobjectUpdate(id: $id, metaobject: $metaobject) {
          metaobject {
            handle
          }
        }
      }`, {
        variables: {
          id:id,
          metaobject: {
            "fields": [
              {
                "key": "somekey",
                "value": entity
              }
            ]
          }
        }
      })
      if (response.ok) {
        console.log("response was ok")
        const data = await response.json()
        console.log(data)
      }
    
  } catch (error) {
    console.log("there was an erro")
    console.log(error)
  }

  return null
}


const updateEntity = () => {
  const [id, SetId] = useState('')
  const [entity, SetEntity] = useState('')
  const submit = useSubmit()
  const handleSubmit = (id, entity) => {
    submit({id, entity},{replace:true, method:"POST"})
    SetId("")
    SetEntity("")
  }

  return (
    <Page>
      <Layout>
        <Layout.Section>
          <Text variant='heading2xl' alignment='center'>Update Entity</Text>
        </Layout.Section>
        <Layout.Section>
          <TextField
            label="Entity ID"
            value={id}
            onChange={(e) => SetId(e)}
           />
          <TextField
            label="New Entity"
            value={entity}
            onChange={(e) => SetEntity(e)}
           />
        </Layout.Section>
        <Layout.Section>
          <Button variant='primary' tone="success" onClick={() => handleSubmit(id, entity)} >Update Entity</Button>
        </Layout.Section>
      </Layout>
    </Page>
  );
};

export default updateEntity;