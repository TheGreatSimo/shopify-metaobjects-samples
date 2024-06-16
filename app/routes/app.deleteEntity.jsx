import { useSubmit } from '@remix-run/react';
import { Page, Text, Layout, TextField, Button } from '@shopify/polaris';
import { useState } from 'react';
import { authenticate } from '../shopify.server';


export const action = async ({request}) => {
  const { admin } = await authenticate.admin(request)
  const body = await request.formData()
  const id = body.get("id")

  try {
    const response = await admin.graphql(`
      mutation DeleteMetaobject($id: ID!) {
        metaobjectDelete(id: $id) {
          deletedId
        }
    }`, 
    {
      variables:{
        id : id,
      }
    })
    if (response.ok) {
      console.log('it was ok')
      const data = await response.json()
      console.log(data)
    }
    
  } catch (error) {
    console.log(error)
  }
  return null
}


const deleteEntity = () => {
  const [id, SetId] = useState("")
  const submit = useSubmit()
  const handleSubmit = (id) => {
    submit({id}, {replace:true, method:"POST"})
    SetId("")
  }

  return (
    <Page>
      <Text variant='heading2xl' alignment='center'>Delete Entity</Text>
      <TextField
        label="Entity ID"
        value={id}
        onChange={(e) => SetId(e)}
      />
      <Button onClick={() => handleSubmit(id)} variant='primary' tone="critical" >Delete Entity</Button>
    </Page>
  );
};

export default deleteEntity;