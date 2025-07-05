import React , {useReducer , useEffect} from 'react';

import './Input.css';

import { validate } from '../util/validators';

const inputReducer = (state , action)=>
{
  switch(action.type)
  {
    case 'CHANGE':
      return{
        ...state,
        value : action.val,
        isValid : validate(action.val , action.validators)
      }
    case 'TOUCH':
      return{
        ...state , isTouched : true
      }
    default:
      return state;
  }

//   inputReducer: This function updates the input state based on the dispatched actions.

// inputState: Holds the current state of the input (its value and validity).

// dispatch: Function to send actions to update the state.

// { value: '', isValid: false }: Initial state where the input field starts empty and invalid.

};

const Input = props => {

  const[inputState , dispatch ] = useReducer(inputReducer , {value:props.initialValue||'' , isValid:props.initialValid||false , isTouched:false});

  const { id, onInput } = props;
    const { value, isValid } = inputState;
  
    // ✅ useEffect ensures that the latest value & validity is sent to NewPlace.js
  // ✅ onInput() calls InputHandler in NewPlace.js when input changes
    useEffect(() => {
      onInput(id, value, isValid)
    }, [id, value, isValid, onInput]);

  const changeHandler = event=>{
    dispatch({type:'CHANGE' , val:event.target.value , validators:props.validators})
  }

  const touchHandler = ()=>
  {
    dispatch({
      type:'TOUCH'
    })
  }

  const element =
    props.element === 'input' ? (
      <input id={props.id} type={props.type} placeholder={props.placeholder} onChange={changeHandler}
      onBlur={touchHandler}
      value={inputState.value}/>
    ) : (
      <textarea id={props.id} rows={props.rows || 3} onChange={changeHandler}
      value={inputState.value}
      onBlur={touchHandler}/>
      // onblur - when user click in or click out of the input
    );

  return (
    <div className={`form-control ${!inputState.isValid && inputState.isTouched && 'form-control--invalid'}`}>
      <label htmlFor={props.id}>{props.label}</label>
      {element}
      {!inputState.isValid && inputState.isTouched && <p>{props.errorText}</p>}
    </div>
  );
};

export default Input;
