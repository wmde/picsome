import { Form, FormProps } from "app/core/components/Form"
import { LabeledTextField } from "app/core/components/LabeledTextField"
import { z } from "zod"
export { FORM_ERROR } from "app/core/components/Form"

export function ResourceForm<S extends z.ZodType<any, any>>(props: FormProps<S>) {
  return (
    <Form<S> {...props}>
      <LabeledTextField name="title" label="Title" placeholder="Title" />
      <LabeledTextField name="resourceUrl" label="resourceUrl" placeholder="resourceUrl" />
      <LabeledTextField name="imgUrl" label="imgUrl" placeholder="imgUrl" />
      <LabeledTextField name="thumbUrl" label="thumbUrl" placeholder="thumbUrl" />
      <LabeledTextField name="authorName" label="authorName" placeholder="authorName" />
      <LabeledTextField name="authorUrl" label="authorUrl" placeholder="authorUrl" />
      <LabeledTextField
        name="resolutionX"
        label="resolutionX"
        placeholder="resolutionX"
        type="number"
      />
      <LabeledTextField
        name="resolutionY"
        label="resolutionY"
        placeholder="resolutionY"
        type="number"
      />
      <LabeledTextField name="sizeBytes" label="sizeBytes" placeholder="sizeBytes" type="number" />
    </Form>
  )
}
