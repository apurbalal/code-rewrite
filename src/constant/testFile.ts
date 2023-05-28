export const testCode1 = `const enhance = compose(
  withState('value', 'updateValue', ''),
  withProps({ 'loadingDataFromApi': true, 'posts': [] }),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      submitForm(props.value)
    }
  }),
  withCustomEnhance,
  lifecycle({
    shouldComponentUpdate(nextProps) {
      console.log("shouldComponentUpdate")
      return true;
    },
    componentDidMount() {
      console.log("componentDidMount")
    },
    componentDidUpdate() {
      console.log("componentDidUpdate")
    },
  }),
)`;

export const testCode2 = `const EnhancedComponent = compose(
  withState('value', 'updateValue', ''),
  withProps({ 'loadingDataFromApi': true, 'posts': [] }),
  withHandlers({
    onChange: props => event => {
      props.updateValue(event.target.value)
    },
    onSubmit: props => event => {
      event.preventDefault()
      submitForm(props.value)
    }
  }),
  withCustomEnhance,
  lifecycle({
    shouldComponentUpdate(nextProps) {
      console.log("shouldComponentUpdate")
      return true;
    },
    componentDidMount() {
      console.log("componentDidMount")
    },
    componentDidUpdate() {
      console.log("componentDidUpdate")
    },
  }),
)(Component);
`;