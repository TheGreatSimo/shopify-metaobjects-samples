import { Page, Text, Layout, TextField, Button } from '@shopify/polaris';
import { useState } from 'react';
import { authenticate } from '../shopify.server';
import { useSubmit } from '@remix-run/react';


export const action = async ({request}) => {
  const { admin } = await authenticate.admin(request)
  const body = await request.formData()
  const entity = body.get("entity")

  try {
    const response = await admin.graphql(`
      mutation CreateMetaobject($metaobject: MetaobjectCreateInput!) {
        metaobjectCreate(metaobject: $metaobject) {
          metaobject {
            handle
          }
        }
      }`, 
      {
        variables:{
          "metaobject": {
            "type": "youtubelearn",
            "fields": [
              {
                "key": "somekey",
                "value": entity
              }
            ]
          }
        }
      });
      if (response.ok) {
        console.log("we got resonse ")
        const data = await response.json()
        console.log(data)
      }
  } catch (error) {
    console.log("we have an erro")
    console.log(error)
  }

  return null
}

const createEntity = () => {
  const [entity, SetEntity] = useState('')
  const submit = useSubmit()
  const  hanldeSumit = (entity) => {
    submit({entity}, {replace:true, method:"POST"})
    SetEntity("")
  }
  return (
    <Page>
      <Text variant='heading2xl' alignment='center'>Create Entity</Text>
      <TextField
        lable="Entity"
        value={entity}
        onChange={(e) => SetEntity(e)}
       />
       <Button onClick={() => hanldeSumit(entity)} variant='primary' tone="success">Create Entity</Button>

    </Page>
  );
};

export default createEntity;