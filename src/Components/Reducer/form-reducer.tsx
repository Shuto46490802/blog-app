type StateType = {
  value: string
  isValid: boolean
}

type ActionType =
  | { type: 'INPUT_BLUR' }
  | { type: 'USER_INPUT'; value: StateType['value'] }

const emailRegex =
  /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

export const emailReducer = (state: StateType, action: ActionType) => {
  if (action.type === 'USER_INPUT') {
    const isValid = emailRegex.test(action.value)
    return {
      value: action.value,
      isValid
    }
  } else if (action.type === 'INPUT_BLUR') {
    const isValid = emailRegex.test(state.value)
    return {
      value: state.value,
      isValid
    }
  } else {
    return {
      value: '',
      isValid: false
    }
  }
}

export const passwordReducer = (state: StateType, action: ActionType) => {
  if (action.type === 'USER_INPUT') {
    const isValid = action.value.length > 6
    return {
      value: action.value,
      isValid
    }
  } else if (action.type === 'INPUT_BLUR') {
    const isValid = state.value.length > 6
    return {
      value: state.value,
      isValid
    }
  } else {
    return {
      value: '',
      isValid: false
    }
  }
}
