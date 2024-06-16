import { Page, Text, Layout, Button } from '@shopify/polaris';
import { authenticate } from '../shopify.server';
import { useSubmit } from '@remix-run/react';


export const action = async({request}) => {
  const { admin } = await authenticate.admin(request)
  try {
    const response = await admin.graphql(`
      mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
        metaobjectDefinitionCreate(definition: $definition) {
          metaobjectDefinition {
            name
            type
            fieldDefinitions {
              name
              key
            }
          }
        }
      }`, 
      {
        variables : {
          "definition": {
            "type": "youtubelearn",
            "fieldDefinitions": [
              {
                "key": "somekey",
                "type": "single_line_text_field",
              }
            ]
          }
        }
      });
      if (response.ok) {
        console.log("response was hit")
        const data = await response.json()
        console.log(data)
      }
    
  } catch (error) {
    console.log("there was an error")
    console.log(error)
  }

  return null
}

const createDefinition = () => {
  const submit = useSubmit()
  const handleSubmit = () => submit({}, {replace:true, method:"POSt"})
  return (
    <Page>
      <Text variant='heading2xl' alignment='center'>createDefinition Component</Text>
      <Button onClick={handleSubmit} variant='primary' tone="success" >Create Definition</Button>
    </Page>
  );
};

export default createDefinition;