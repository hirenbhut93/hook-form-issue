import React from 'react';
import {
  Field,
  Form,
  SubmitButton,
} from "./form";
import * as yup from "yup";

function App() {
  const onSubmit = async (data) => {
    alert(JSON.stringify(data));
  };

  const schema = yup.object().shape({
    name: yup.string().required().label("Name"),
    summary: yup.string().label("Summary"),
  });

  return (
    <div className="container-fluid">
      <div className="jumbotron m-5">
        <Form schema={schema} onSubmit={onSubmit}>
          <Field type="text" name="name" />
          <Field type="textarea" name="summary" />
          <SubmitButton label="Save" className="btn btn-block btn-success" />
        </Form>
      </div>
    </div>
  );
}

export default App;
