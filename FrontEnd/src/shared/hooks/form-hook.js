import { useCallback, useReducer } from 'react';

const formReducer = (state, action) => {
    switch (action.type) {
      case 'INPUT_CHANGE':
        let formIsValid = true;
        
        // ✅ Loop through all inputs to check overall form validity
        for (const inputId in state.inputs) {

          if(!state.inputs[inputId])
          {
            continue;
          }
          if (inputId === action.inputId) {
            formIsValid = formIsValid && action.isValid;
          } else {
            formIsValid = formIsValid && state.inputs[inputId].isValid;
          }
        }
        
        return {
          ...state,
          inputs: {
            ...state.inputs,
            [action.inputId]: { value: action.value, isValid: action.isValid }
          },
          isValid: formIsValid
        };

        case 'SET_DATA':
          return{
            inputs:action.inputs,
            isValid:action.formIsValid
          }
      default:
        return state;
    }
  };
  

export const useForm = (initialInputs , initialFormValidity) =>
{
    const [formState, dispatch] = useReducer(formReducer, {
        inputs: initialInputs,
        isValid:initialFormValidity
      });
 
      const inputHandler = useCallback((id, value, isValid) => {
        // Function updates state when Input.js calls onInput
        dispatch({
          type: 'INPUT_CHANGE',
          value: value,
          isValid: isValid,
          inputId: id
        });
      }, []);

//  When we use useCallback, the function (inputHandler) is created only once when NewPlace.js first renders.

// After that, the same function reference is reused every time NewPlace.js re-renders.

// It does not create a new function on every re-render.

// The function still works as expected because it always has access to the latest state updates.



      const setFormData = useCallback((inputData , formVailidity)=>
      {
        dispatch(
          {
            type:'SET_DATA',
            inputs: inputData,
            formIsValid:formVailidity
          }
        )
      } , [])

      return [formState , inputHandler , setFormData];
}