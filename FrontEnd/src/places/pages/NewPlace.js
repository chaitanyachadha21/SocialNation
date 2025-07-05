import React, { useContext } from 'react';
import { useHistory } from 'react-router-dom';

import Input from '../../shared/FormElements/Input';
import Button from '../../shared/FormElements/Button';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useForm } from '../../shared/hooks/form-hook';
import {
  VALIDATOR_REQUIRE,
  VALIDATOR_MINLENGTH
} from '../../shared/util/validators';
import './PlaceForm.css';
import { AuthContext } from '../../shared/context/auth-context';

import { useHttpClient } from '../../shared/hooks/http-hook';
import ImageUpload from '../../shared/FormElements/ImageUpload';



const NewPlace = () => {

const auth = useContext(AuthContext);

const { isLoading, error, sendRequest, clearError } = useHttpClient();
const [formState , inputHandler] = useForm({
  title: {
    value: '',
    isValid: false
  },
  description: {
    value: '',
    isValid: false
  },
  address: {
    value: '',
    isValid: false
  },
    image:{
     value:null,
     isValid:false
    }}
  
  ,false
  );
  // ✅ useCallback prevents this function from being re-created on every re-render
  // ✅ Keeps the same function reference unless dependencies change
  
  const history = useHistory();

  const placeSubmitHandler = async (event) =>{
    event.preventDefault();
    // event.preventDefault() stops form reset & page refresh.
    try {
      const formData = new FormData();
      formData.append('title' , formState.inputs.title.value);
      formData.append('description' , formState.inputs.description.value);
      formData.append('address' , formState.inputs.address.value);
      formData.append('image' , formState.inputs.image.value);
      await sendRequest(process.env.REACT_APP_BACKEND_URL + '/places',
        'POST',
        formData , {Authorization: 'Bearer ' +auth.token});
      history.push('/');
    } catch (err) {}
  }

  return (
    <>
    <ErrorModal error={error} onClear={clearError} />
    <form className="place-form" onSubmit={placeSubmitHandler}>
      {/* ✅ onInput calls inputHandler whenever the input changes */}
      {isLoading && <LoadingSpinner asOverlay />}
      <Input
        id="title"
        element="input"
        type="text"
        label="Title"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid title."
        onInput={inputHandler}
        // this is nothing onInput is just a prop actually its inputHandler and whenever the user inputs something new it gives the inputHandler the latest details and then input handler inside form-hook uses use Reducer to update the form state which we get at last when we submit the form 
      />
      <Input
        id="description"
        element="textarea"
        label="Description"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <Input
        id="address"
        element="input"
        label="Address"
        validators={[VALIDATOR_REQUIRE()]}
        errorText="Please enter a valid description (at least 5 characters)."
        onInput={inputHandler}
      />
      <ImageUpload center id="image" onInput={inputHandler} errorText="image upload failed"/>
      <Button type="submit" disabled={!formState.isValid}>
        ADD PLACE
      </Button>
    </form>
    </>
  );
};

// ✅ Code flow in case of confusion
// 
// User types "H" in the Title input 
//       ↓
// Input.js (changeHandler updates inputState)
//       ↓
// useEffect calls onInput → inputHandler()
//       ↓
// NewPlace.js receives updated value and updates formState via useReducer
//       ↓
// NewPlace.js re-renders
//       ↓
// Input.js does NOT re-create inputHandler (Thanks to useCallback)

export default NewPlace;
